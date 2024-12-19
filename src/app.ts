import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastify from "fastify";
import {
  hasZodFastifySchemaValidationErrors,
  isResponseSerializationError,
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import prisma from "./database";
import { registerRoutes } from "./routes";

export const build = async (opts = {}) => {
  const app = fastify(opts);

  // Register Swagger & Swagger UI
  await app.register(fastifySwagger, {
    mode: "dynamic",
    openapi: {
      info: {
        title: "Hugo API",
        version: "1.0.0",
      },
    },
    transform: jsonSchemaTransform,
  });

  await app.register(fastifySwaggerUi, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "list",
      deepLinking: true,
    },
  });

  // Register Zod Type Provider
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  // Set Custom Error Handler
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
        summary: concatenatedMessages,
      });
    }

    if (isResponseSerializationError(err)) {
      return reply.code(500).send({
        error: "Internal Server Error",
        message: "Response doesn't match the schema",
        statusCode: 500,
        details: {
          issues: err.cause.issues,
          method: err.method,
          url: err.url,
        },
      });
    }
  });

  // Register Routes
  await app.register(registerRoutes);

  // Close Database Connection on Shutdown
  app.addHook("onClose", async () => {
    await prisma.$disconnect();
  });

  return app;
};
