import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { updateApplicationsSchema } from "./schema";
import prisma from "../../database";
import { InProgressApplication } from "../../schemas/application";
import { deleteNestedProperty } from "../../utils/nestedProperties";

export const deleteApplicationRoutes = async (fastify: FastifyInstance) => {
  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: "DELETE",
    url: "/applications/:id/data",
    schema: updateApplicationsSchema,
    handler: async (request, reply) => {
      const { id } = request.params;
      const { path } = request.body;

      const application = await prisma.application.findUnique({
        where: { id: parseInt(id) },
      });

      // If no application is found, return a 404
      if (!application) {
        return reply.status(404).send({ message: "Application not found" });
      }

      // If the application has already been submitted, return a 400
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

      // Prepare the data for updating the database
      const mergedData = deleteNestedProperty(formattedData, path);

      try {
        await prisma.application.update({
          where: { id: parseInt(id) },
          data: {
            primaryDriver: JSON.stringify(mergedData.primaryDriver),
            mailingAddress: JSON.stringify(mergedData.mailingAddress),
            garagingAddress: JSON.stringify(mergedData.garagingAddress),
            vehicles: JSON.stringify(mergedData.vehicles),
            additionalDrivers: JSON.stringify(mergedData.additionalDrivers),
          },
        });

        return reply.status(200).send({ data: mergedData });
      } catch (error) {
        console.error(error);
        return reply
          .status(400)
          .send({ message: "Unable to delete the specified field" });
      }
    },
  });
};
