import { FastifySchema } from "fastify";
import { z } from "zod";
import { CompletedApplicationSchema } from "../../schemas/application";

export const submitApplicationSchema = {
  summary: "Submits an application",
  description: "Can be used to submit an application.",
  tags: ["Complete"],
  params: z.object({
    id: z.string(),
  }),
  response: {
    200: z.object({
      data: CompletedApplicationSchema,
    }),
    400: z.object({
      message: z.string(),
      errors: z
        .array(
          z.object({
            field: z.string(),
            message: z.string(),
          }),
        )
        .optional(),
    }),
    404: z.object({
      message: z.string(),
    }),
  },
} as const satisfies FastifySchema;
