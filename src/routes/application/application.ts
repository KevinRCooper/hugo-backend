import { FastifyInstance, FastifySchema } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { newApplicationSchema, searchApplicationSchema, updateApplicationSchema, deleteApplicationFieldsSchema, submitApplicationSchema } from "./schema";

export const applicationRoutes = async (app: FastifyInstance) => {

    app.withTypeProvider<ZodTypeProvider>().route({
        method: "POST",
        url: "/applications",
        schema: newApplicationSchema,
        handler: async (request) => {
            return { id: "123" };
        },
    });

    app.withTypeProvider<ZodTypeProvider>().route({
        method: "GET",
        url: "/applications/:id",
        schema: searchApplicationSchema,
        handler: async (request, reply) => {
            return { hello: "world" };
        },
    });

    app.withTypeProvider<ZodTypeProvider>().route({
        method: "PATCH",
        url: "/applications/:id",
        schema: updateApplicationSchema,
        handler: async (request, reply) => {
            return { hello: "world" };
        },
    });

    app.withTypeProvider<ZodTypeProvider>().route({
        method: "DELETE",
        url: "/applications/:id/:data",
        schema: deleteApplicationFieldsSchema,
        handler: async (request, reply) => {
            return { hello: "world" };
        },
    });

    app.withTypeProvider<ZodTypeProvider>().route({
        method: "POST",
        url: "/applications/:id/submit",
        schema: submitApplicationSchema,
        handler: async (request, reply) => {
            return { hello: "world" };
        },
    });
};