import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastify from "fastify";
import { hasZodFastifySchemaValidationErrors, isResponseSerializationError, serializerCompiler, validatorCompiler, ZodTypeProvider } from "fastify-type-provider-zod";
import { applicationRoutes } from "./routes/application/application";

export const build = async (opts = {}) => {
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

    app.setErrorHandler((err, req, reply) => {

        if (hasZodFastifySchemaValidationErrors(err)) {
            const concatenatedMessages = err.validation
                .map((issue) => {
                    const path = issue.params?.issue?.path?.join(".") || "root";
                    const message = issue.params?.issue?.message || issue.message;
                    return `${path}: ${message}`;
                })
                .join("; ");

            return reply.code(400).send({
                error: "Response Validation Error",
                message: "Request doesn't match the schema",
                statusCode: 400,
                details: {
                    summary: concatenatedMessages,
                    issues: err.validation,
                    method: req.method,
                    url: req.url,
                },
            });
        }

        if (isResponseSerializationError(err)) {
            return reply.code(500).send({
                error: 'Internal Server Error',
                message: "Response doesn't match the schema",
                statusCode: 500,
                details: {
                    issues: err.cause.issues,
                    method: err.method,
                    url: err.url,
                },
            })
        }
    })
    app.register(applicationRoutes);

    return app;
};

