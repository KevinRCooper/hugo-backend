import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastify from "fastify";
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from "fastify-type-provider-zod";
import { applicationRoutes } from "./routes/application/application";

export const build = async (opts={}) => {
    const app = fastify(opts);
    await app.register(fastifySwagger, {
        mode: "dynamic",
        openapi: {
            info: {
                title: "Hugo API",
                version: "1.0.0",
            },
        }
    })

    await app.register(fastifySwaggerUi, {
        routePrefix: "/docs",
        uiConfig: {
            docExpansion: "list",
            deepLinking: true,
        },
    });
    app.setValidatorCompiler(validatorCompiler);
    app.setSerializerCompiler(serializerCompiler);
    
    app.register(applicationRoutes);

    return app;
};

