import { z, ZodIssueCode } from 'zod';
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

export const UpdateApplicationErrorsSchema = z.array(z.object({
    field: z.string(),
    message: z.string(),
  }));
export type UpdateApplicationErrors = z.infer<typeof UpdateApplicationErrorsSchema>;
export const UpdateApplicationSchema = z.object({
  data: NewApplicationSchema,
  errors: UpdateApplicationErrorsSchema.optional(),
}).strict();
export type UpdateApplication = z.infer<typeof UpdateApplicationSchema>;

export const ValidApplicationSchema = z.object({
    primaryDriver: DriverSchema,
    mailingAddress: AddressSchema,
    garagingAddress: AddressSchema,
    vehicles: VehiclesSchema,
    additionalDrivers: AdditionalDriversSchema,
    completed: z.literal(true),
    quote: z.number(),
  }).strict();
  
  export type ValidApplication = z.infer<typeof ValidApplicationSchema>;
