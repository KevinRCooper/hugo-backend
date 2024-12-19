import { z } from "zod";
import { UsStateAbbreviationSchema } from "./shared";

export const AddressSchema = z.object({
  street: z.string().min(2).max(255),
  unit: z.string().min(1).max(10).optional(),
  city: z.string().min(2).max(255),
  state: UsStateAbbreviationSchema,
  zip: z
    .string()
    .length(5)
    .regex(/^\d{5}$/),
});
