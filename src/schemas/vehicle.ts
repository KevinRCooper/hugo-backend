import { z } from 'zod';
import { calculateCheckDigit } from '../util/vinValidation';

const VinSchema = z
  .string()
  .length(17)
  .regex(/^[A-HJ-NPR-Z0-9]+$/, "VIN must exclude invalid characters like I, O, Q.")
  .refine((vin) => {
    const checkDigit = vin[8]; // Check digit at the 9th position
    return calculateCheckDigit(vin) === checkDigit;
  }, "Invalid VIN check digit");

export const VehicleSchema = z.object({
    make: z.string().min(2).max(255),
    model: z.string().min(2).max(255),
    year: z.number().int().min(1985).max(new Date().getFullYear() + 1),
    vin: VinSchema,
});
export type Vehicle = z.infer<typeof VehicleSchema>;

export const PartialVehicleSchema = VehicleSchema.partial();
export type PartialVehicle = z.infer<typeof VehicleSchema>;