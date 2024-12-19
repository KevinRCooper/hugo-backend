import { FastifySchema } from "fastify";
import { z } from "zod";
import { AdditionalDriverSchema, DriverSchema } from "../../schemas/driver";
import { AddressSchema } from "../../schemas/address";
import { VehicleSchema } from "../../schemas/vehicle";

export const newApplicationSchema = {
  summary: "Creates a new application",
  description:
    "Can be used to create a new application. Partial applications are allowed.",
  tags: ["New"],
  body: z.object({
    primaryDriver: DriverSchema.partial().optional(),
    mailingAddress: AddressSchema.partial().optional(),
    garagingAddress: AddressSchema.partial().optional(),
    vehicles: z.record(z.string(), VehicleSchema.partial()).optional(),
    additionalDrivers: z
      .record(z.string(), AdditionalDriverSchema.partial())
      .optional(),
  }),
  response: {
    200: z.object({
      id: z.number(),
    }),
  },
} as const satisfies FastifySchema;
