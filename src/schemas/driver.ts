import { z } from "zod";
import {
  DateOfBirthSchema,
  DriversLicenseNumberSchema,
  UsStateAbbreviationSchema,
} from "./shared";

export const DriverSchema = z.object({
  firstName: z.string().min(2).max(255),
  lastName: z.string().min(2).max(255),
  dateOfBirth: DateOfBirthSchema,
  gender: z.enum(["male", "female", "non-binary"]),
  maritalStatus: z.enum(["single", "married", "divorced", "widowed"]),
  driversLicense: z.object({
    number: DriversLicenseNumberSchema,
    state: UsStateAbbreviationSchema,
  }),
});

export const AdditionalDriverSchema = DriverSchema.omit({
  maritalStatus: true,
  driversLicense: true,
})
  .extend({
    relationship: z.enum(["spouse", "child", "parent", "sibling", "other"]),
  })
  .strict();
