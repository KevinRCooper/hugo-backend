import { z } from 'zod';
import {  AdditionalDriversSchema, DriverSchema, PartialAdditionalDriverSchema, PartialDriverSchema } from './driver';
import { AddressSchema, PartialAddressSchema } from './address';
import { PartialVehiclesSchema, VehiclesSchema } from './vehicle';

export const NewApplicationSchema = z.object({
  primaryDriver: PartialDriverSchema,
  mailingAddress: PartialAddressSchema,
  garagingAddress: PartialAddressSchema,
  vehicles: PartialVehiclesSchema,
  additionalDrivers: PartialAdditionalDriverSchema,
}).partial().strict();

export const UpdateApplicationErrorsSchema = z.array(z.object({
  field: z.string(),
  message: z.string(),
}));

export const UpdateApplicationSchema = z.object({
  data: NewApplicationSchema,
  errors: UpdateApplicationErrorsSchema.optional(),
}).strict();

export const ValidApplicationSchema = z.object({
  primaryDriver: DriverSchema,
  mailingAddress: AddressSchema,
  garagingAddress: AddressSchema,
  vehicles: VehiclesSchema,
  additionalDrivers: AdditionalDriversSchema,
  completed: z.literal(true),
  quote: z.number(),
}).strict();
