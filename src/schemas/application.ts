import { z } from 'zod';
import { AdditionalDriverSchema, DriverSchema, PartialAdditionalDriverSchema, PartialDriverSchema } from './driver';
import { AddressSchema, PartialAddressSchema } from './address';
import { PartialVehicleSchema, VehicleSchema } from './vehicle';

export const NewApplicationSchema = z.object({
    primaryDriver: PartialDriverSchema,
    mailingAddress: PartialAddressSchema,
    garagingAddress: PartialAddressSchema,
    vehicles: PartialVehicleSchema,
    additionalDrivers: PartialAdditionalDriverSchema,
  }).partial();
export type NewApplication = z.infer<typeof NewApplicationSchema>;

export const ValidApplicationSchema = z.object({
    primaryDriver: DriverSchema,
    mailingAddress: AddressSchema,
    garagingAddress: AddressSchema,
    vehicles: z
      .record(z.string(), VehicleSchema)
      .refine((vehicles) => Object.keys(vehicles).length >= 1, {
        message: "At least one vehicle is required.",
      })
      .refine((vehicles) => Object.keys(vehicles).length <= 3, {
        message: "No more than 3 vehicles are allowed.",
      }),
    additionalDrivers: z
      .record(z.string(), AdditionalDriverSchema)
      .optional()
      .refine(
        (drivers) => drivers === undefined || Object.keys(drivers).length <= 3,
        {
          message: "No more than 3 additional drivers are allowed.",
        }
      ),
  });
  
  export type ValidApplication = z.infer<typeof ValidApplicationSchema>;
