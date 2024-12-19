import { FastifySchema } from "fastify";
import { z } from 'zod';
import { NewApplicationSchema, UpdateApplicationSchema, ValidApplicationSchema } from "../../schemas/application";

export const newApplicationSchema = {
    summary: "Creates a new application",
    description: "Can be used to create a new application. Partial applications are allowed.",
    tags: ["New"],
    body: NewApplicationSchema,
    response: {
        200: z.object({
            id: z.number(),
        }),
    },
} as const satisfies FastifySchema;

export const searchApplicationSchema = {
    summary: "Searches for applications",
    description: "Can be used to search for applications.",
    tags: ["Search"],
    params: z.object({
        id: z.string(),
    }),
    response: {
        200: UpdateApplicationSchema.or(ValidApplicationSchema),
    },
} as const satisfies FastifySchema;

export const updateApplicationSchema = {
    summary: "Updates an in-progress application",
    description: "Can be used to update an in-progress application. Partial applications are allowed.",
    tags: ["Update"],
    response: {
        200: z.object({
            hello: z.string(),
        }),
    },
} as const satisfies FastifySchema;

export const deleteApplicationFieldsSchema = {
    summary: "Deletes fields from an in-progress application",
    description: "Can be used to delete fields from an in-progress application.",
    tags: ["Update"],
    response: {
        200: z.object({
            hello: z.string(),
        }),
    },
} as const satisfies FastifySchema;

export const submitApplicationSchema = {
    summary: "Submits an application",
    description: "Can be used to submit an application.",
    tags: ["Complete"],
    response: {
        200: z.object({
            hello: z.string(),
        }),
    },
} as const satisfies FastifySchema;
