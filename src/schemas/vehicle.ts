import { z } from "zod";
import { calculateCheckDigit } from "../utils/vinValidation";

export const VinSchema = z
  .string()
  .length(17)
  .regex(
    /^[A-HJ-NPR-Z0-9]+$/,
    "VIN must exclude invalid characters like I, O, Q.",
  )
  .refine((vin) => {
    const checkDigit = vin[8]; // Check digit at the 9th position
    return calculateCheckDigit(vin) === checkDigit;
  }, "Invalid VIN check digit");

export const VehicleSchema = z.object({
  make: z.string().min(2).max(255),
  model: z.string().min(2).max(255),
  year: z
    .number()
    .int()
    .min(1985)
    .max(new Date().getFullYear() + 1),
  vin: VinSchema,
});

export const VehiclesSchema = z
  .record(z.string(), VehicleSchema)
  .refine((vehicles) => !vehicles || Object.keys(vehicles).length >= 1, {
    message: "At least one vehicle is required.",
  })
  .refine((vehicles) => !vehicles || Object.keys(vehicles).length <= 3, {
    message: "No more than 3 vehicles are allowed.",
  });
export type Vehicles = z.infer<typeof VehiclesSchema>;
