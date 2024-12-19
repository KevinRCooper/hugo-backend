import { z } from "zod";
import { AdditionalDriverSchema, DriverSchema } from "./driver";
import { AddressSchema } from "./address";
import { VehicleSchema, VehiclesSchema } from "./vehicle";

export const InProgressApplicationSchema = z
  .object({
    primaryDriver: DriverSchema.partial(),
    mailingAddress: AddressSchema.partial(),
    garagingAddress: AddressSchema.partial(),
    vehicles: z.record(z.string(), VehicleSchema.partial()),
    additionalDrivers: z
      .record(z.string(), AdditionalDriverSchema.partial())
      .optional(),
  })
  .partial();
export type InProgressApplication = z.infer<typeof InProgressApplicationSchema>;

export const ValidApplicationSchema = z.object({
  primaryDriver: DriverSchema,
  mailingAddress: AddressSchema,
  garagingAddress: AddressSchema,
  vehicles: VehiclesSchema,
  additionalDrivers: z.record(z.string(), AdditionalDriverSchema).optional(),
});

export const CompletedApplicationSchema = ValidApplicationSchema.merge(
  z.object({
    completed: z.boolean(),
    quote: z.number(),
  }),
);
export type CompletedApplication = z.infer<typeof CompletedApplicationSchema>;
