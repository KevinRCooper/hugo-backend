import { FastifyInstance } from "fastify";
import { newApplicationsRoutes } from "./newApplications";
import { searchApplicationsRoutes } from "./searchApplications";
import { updateApplicationsRoutes } from "./updateApplications";
import { deleteApplicationRoutes } from "./deleteApplications";
import { submitApplicationRoutes } from "./submitApplications";

export const registerRoutes = async (fastify: FastifyInstance) => {
  await fastify.register(newApplicationsRoutes);
  await fastify.register(searchApplicationsRoutes);
  await fastify.register(updateApplicationsRoutes);
  await fastify.register(deleteApplicationRoutes);
  await fastify.register(submitApplicationRoutes);
};
