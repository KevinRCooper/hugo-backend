import { FastifySchema } from "fastify";
import { z } from "zod";
import { InProgressApplicationSchema } from "../../schemas/application";

export const updateApplicationsSchema = {
  summary: "Updates an in-progress application",
  description:
    "Can be used to update an in-progress application. Partial applications are allowed.",
  tags: ["Update"],
  params: z.object({
    id: z.string(),
  }),
  body: InProgressApplicationSchema,
  response: {
    200: z.object({
      data: InProgressApplicationSchema,
    }),
    400: z.object({
      message: z.string(),
    }),
    404: z.object({
      message: z.string(),
    }),
  },
} as const satisfies FastifySchema;
