import { z } from 'zod';
import { DateOfBirthSchema, DriversLicenseNumberSchema, UsStateAbbreviationSchema } from './utility';

export const DriverSchema = z.object({
    firstName: z.string().min(2).max(255),
    lastName: z.string().min(2).max(255),
    dateOfBirth: DateOfBirthSchema,
    gender: z.enum(['male', 'female', 'non-binary']),
    maritalStatus: z.enum(['single', 'married', 'divorced', 'widowed']),
    driversLicense: z.object({
        number: DriversLicenseNumberSchema,
        state: UsStateAbbreviationSchema,
    }),
});
export type Driver = z.infer<typeof DriverSchema>; 

export const PartialDriverSchema = DriverSchema.partial();
export type PartialDriver = z.infer<typeof PartialDriverSchema>;

export const AdditionalDriverSchema = DriverSchema.omit({
    maritalStatus: true,
    driversLicense: true,
}).extend({
    relationship: z.enum(['spouse', 'child', 'parent', 'sibling', 'other']),
});
export type AdditionalDriver = z.infer<typeof AdditionalDriverSchema>; 

export const PartialAdditionalDriverSchema = AdditionalDriverSchema.partial();
export type PartialAdditionalDriver = z.infer<typeof PartialAdditionalDriverSchema>;