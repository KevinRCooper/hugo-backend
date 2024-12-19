import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { newApplicationSchema, searchApplicationSchema, updateApplicationSchema, deleteApplicationFieldsSchema, submitApplicationSchema } from "./schema";
import prisma from "../../database";
import { NewApplicationSchema, ValidApplicationSchema } from "../../schemas/application";
export const applicationRoutes = async (fastify: FastifyInstance) => {

    fastify.withTypeProvider<ZodTypeProvider>().route({
        method: "POST",
        url: "/applications",
        schema: newApplicationSchema,
        handler: async (request) => {
            const { primaryDriver, mailingAddress, garagingAddress, vehicles, additionalDrivers } = request.body;
            const newApplication = await prisma.application.create({
                data: {
                    primaryDriver: JSON.stringify(primaryDriver),
                    mailingAddress: JSON.stringify(mailingAddress),
                    garagingAddress: JSON.stringify(garagingAddress),
                    vehicles: JSON.stringify(vehicles),
                    additionalDrivers: JSON.stringify(additionalDrivers),
                }
            })
            return { id: newApplication.id };
        },
    });

    fastify.withTypeProvider<ZodTypeProvider>().route({
        method: "GET",
        url: "/applications/:id",
        schema: searchApplicationSchema,
        handler: async (request) => {
            const { id } = request.params;
            const application = await prisma.application.findUnique({
                where: { id: parseInt(id) },
            });

            const data = {
                primaryDriver: application?.primaryDriver ? JSON.parse(application.primaryDriver) : {},
                mailingAddress: application?.mailingAddress ? JSON.parse(application.mailingAddress) : {},
                garagingAddress: application?.garagingAddress ? JSON.parse(application.garagingAddress) : {},
                vehicles: application?.vehicles ? JSON.parse(application.vehicles) : {},
                additionalDrivers: application?.additionalDrivers ? JSON.parse(application.additionalDrivers) : {},
            };

            // Check against the ValidApplicationSchema
            const result = ValidApplicationSchema.safeParse(data);
            const partialResult = NewApplicationSchema.safeParse(data);

            if (result.success) {
                return { data: result.data };
            };

            const formattedErrors = result.error.errors
                .filter((err) => typeof err.path[0] === "string" && !["completed", "quote"].includes(err.path[0] as string))
                .map((err) => ({
                    field: err.path.join("."),
                    message: err.message,
                }));

            return { data: partialResult.success ? partialResult.data : {}, errors: formattedErrors };

        },
    });

    fastify.withTypeProvider<ZodTypeProvider>().route({
        method: "PATCH",
        url: "/applications/:id",
        schema: updateApplicationSchema,
        handler: async (request, reply) => {
            return { hello: "world" };
        },
    });

    fastify.withTypeProvider<ZodTypeProvider>().route({
        method: "DELETE",
        url: "/applications/:id/:data",
        schema: deleteApplicationFieldsSchema,
        handler: async (request, reply) => {
            return { hello: "world" };
        },
    });

    fastify.withTypeProvider<ZodTypeProvider>().route({
        method: "POST",
        url: "/applications/:id/submit",
        schema: submitApplicationSchema,
        handler: async (request, reply) => {
            return { hello: "world" };
        },
    });
};