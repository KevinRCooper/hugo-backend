import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { updateApplicationsSchema } from "./schema";
import prisma from "../../database";
import { InProgressApplication } from "../../schemas/application";

export const updateApplicationsRoutes = async (fastify: FastifyInstance) => {
  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: "PATCH",
    url: "/applications/:id",
    schema: updateApplicationsSchema,
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

      // If application has already been submitted, return a 400
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

      // Merge the existing data with the new data
      const mergedData: InProgressApplication = {
        primaryDriver: {
          ...formattedData.primaryDriver,
          ...request.body.primaryDriver,
        },
        mailingAddress: {
          ...formattedData.mailingAddress,
          ...request.body.mailingAddress,
        },
        garagingAddress: {
          ...formattedData.garagingAddress,
          ...request.body.garagingAddress,
        },
        vehicles: { ...formattedData.vehicles, ...request.body.vehicles },
        additionalDrivers: {
          ...formattedData.additionalDrivers,
          ...request.body.additionalDrivers,
        },
      };

      // Update the application with the new data
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
          .send({ message: "Unable to update application" });
      }
    },
  });
};
