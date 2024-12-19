import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { newApplicationSchema } from "./schema";
import prisma from "../../database";

export const newApplicationsRoutes = async (fastify: FastifyInstance) => {
  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/applications",
    schema: newApplicationSchema,
    handler: async (request) => {
      const {
        primaryDriver,
        mailingAddress,
        garagingAddress,
        vehicles,
        additionalDrivers,
      } = request.body;
      const newApplication = await prisma.application.create({
        data: {
          primaryDriver: JSON.stringify(primaryDriver),
          mailingAddress: JSON.stringify(mailingAddress),
          garagingAddress: JSON.stringify(garagingAddress),
          vehicles: JSON.stringify(vehicles),
          additionalDrivers: JSON.stringify(additionalDrivers),
        },
      });
      return { id: newApplication.id };
    },
  });
};
