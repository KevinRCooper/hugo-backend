import { FastifySchema } from "fastify";
import { z } from "zod";
import {
  CompletedApplicationSchema,
  InProgressApplicationSchema,
} from "../../schemas/application";

export const searchApplicationsSchema = {
  summary: "Searches for applications",
  description: "Can be used to search for applications.",
  tags: ["Search"],
  params: z.object({
    id: z.string(),
  }),
  response: {
    200: z.object({
      data: CompletedApplicationSchema,
    }),
    206: z.object({
      data: InProgressApplicationSchema,
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
