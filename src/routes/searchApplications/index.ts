import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { searchApplicationsSchema } from "./schema";
import prisma from "../../database";
import {
  CompletedApplicationSchema,
  InProgressApplication,
  ValidApplicationSchema,
} from "../../schemas/application";

export const searchApplicationsRoutes = async (fastify: FastifyInstance) => {
  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/applications/:id",
    schema: searchApplicationsSchema,
    handler: async (request, reply) => {
      const { id } = request.params;
      const application = await prisma.application.findUnique({
        where: { id: parseInt(id) },
      });

      // If no application is found, return a 404
      if (!application) {
        return reply.status(404).send({ message: "Application not found" });
      }

      const formattedData: InProgressApplication = {
        primaryDriver: application.primaryDriver
          ? JSON.parse(application.primaryDriver)
          : {},
        mailingAddress: application.mailingAddress
          ? JSON.parse(application.mailingAddress)
          : {},
        garagingAddress: application.garagingAddress
          ? JSON.parse(application.garagingAddress)
          : {},
        vehicles: application.vehicles ? JSON.parse(application.vehicles) : {},
        additionalDrivers: application.additionalDrivers
          ? JSON.parse(application.additionalDrivers)
          : {},
      };

      const validatedData = ValidApplicationSchema.safeParse(formattedData);

      // Check if Application is completed
      const isCompleteApplication = CompletedApplicationSchema.safeParse({
        ...(validatedData.success ? validatedData.data : {}),
        quote: application.quote,
        completed: application.completed,
      });

      // If the application is completed, return the data
      if (
        isCompleteApplication.success &&
        isCompleteApplication.data.completed
      ) {
        return reply.status(200).send({ data: isCompleteApplication.data });
      }

      // Return partial data with errors only if validation fails
      if (!validatedData.success) {
        return reply.status(206).send({
          data: formattedData,
          errors: validatedData.error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        });
      }

      // If application is valid without errors (but not completed through the submit endpoint), return the data
      return reply.status(206).send({ data: formattedData });
    },
  });
};
