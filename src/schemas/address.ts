import { z } from 'zod';
import { UsStateAbbreviationSchema } from "./utility";

export const AddressSchema = z.object({
    street: z.string().min(2).max(255),
    unit: z.string().min(1).max(10),
    city: z.string().min(2).max(255),
    state: UsStateAbbreviationSchema,
    zip: z.string().length(5).regex(/^\d{5}$/),
});
export type Address = z.infer<typeof AddressSchema>; 

export const PartialAddressSchema = AddressSchema.partial();
export type PartialAddress = z.infer<typeof PartialAddressSchema>; 