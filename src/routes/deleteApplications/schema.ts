import { FastifySchema } from "fastify";
import { z } from "zod";
import { InProgressApplicationSchema } from "../../schemas/application";

export const updateApplicationsSchema = {
  summary: "Removes a field from an in-progress application",
  description: "Can be used to remove a field from an in-progress application.",
  tags: ["Delete"],
  params: z.object({
    id: z.string(),
  }),
  body: z.object({
    path: z.string(),
  }),
  response: {
    200: z.object({
      data: InProgressApplicationSchema,
    }),
    404: z.object({
      message: z.string(),
    }),
  },
} as const satisfies FastifySchema;
