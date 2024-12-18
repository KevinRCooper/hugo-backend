import { z } from 'zod';
import { AdditionalDriverSchema, AdditionalDriversSchema, DriverSchema, PartialAdditionalDriverSchema, PartialDriverSchema } from './driver';
import { AddressSchema, PartialAddressSchema } from './address';
import { PartialVehiclesSchema, VehiclesSchema, VehicleSchema } from './vehicle';

export const NewApplicationSchema = z.object({
    primaryDriver: PartialDriverSchema,
    mailingAddress: PartialAddressSchema,
    garagingAddress: PartialAddressSchema,
    vehicles: PartialVehiclesSchema,
    additionalDrivers: PartialAdditionalDriverSchema,
  }).partial().strict();
export type NewApplication = z.infer<typeof NewApplicationSchema>;

export const ValidApplicationSchema = z.object({
    primaryDriver: DriverSchema,
    mailingAddress: AddressSchema,
    garagingAddress: AddressSchema,
    vehicles: VehiclesSchema,
    additionalDrivers: AdditionalDriversSchema,
  }).strict();
  
  export type ValidApplication = z.infer<typeof ValidApplicationSchema>;
