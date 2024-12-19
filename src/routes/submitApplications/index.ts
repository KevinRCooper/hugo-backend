import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { submitApplicationSchema } from "./schema";
import prisma from "../../database";
import {
  CompletedApplicationSchema,
  InProgressApplication,
  ValidApplicationSchema,
} from "../../schemas/application";

export const submitApplicationRoutes = async (fastify: FastifyInstance) => {
  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/applications/:id/submit",
    schema: submitApplicationSchema,
    handler: async (request, reply) => {
      // Get the application by ID
      const { id } = request.params;
      const application = await prisma.application.findUnique({
        where: { id: parseInt(id) },
      });

      // If no application is found, return a 404
      if (!application) {
        return reply.status(404).send({ message: "Application not found" });
      }

      // Check if application has already been submitted
      if (application.completed) {
        return reply.status(400).send({
          message:
            "Unable to update application as it has already been submitted",
        });
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

      // Check if application is valid
      const validatedData = ValidApplicationSchema.safeParse(formattedData);

      // If application is not valid, return a 400
      if (!validatedData.success) {
        return reply.status(400).send({
          message: "Unable to submit application as it is not valid",
          errors: validatedData.error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        });
      }

      // If application is valid, update the application as completed and return the data with quote
      const quote = Math.floor(Math.random() * 1_000);
      const updatedApplication = await prisma.application.update({
        where: { id: parseInt(id) },
        data: {
          completed: true,
          quote,
        },
      });

      const data = CompletedApplicationSchema.safeParse({
        ...validatedData.data,
        quote: updatedApplication.quote,
        completed: updatedApplication.completed,
      });

      if (data.success) {
        return reply.status(200).send({ data: data.data });
      }

      return reply
        .status(400)
        .send({ message: "Unable to submit application" });
    },
  });
};
