import { z } from 'zod';

export const FormattedDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "Date must be in YYYY-MM-DD format"
});
export type FormattedDate = z.infer<typeof FormattedDateSchema>;

export const DateOfBirthSchema = FormattedDateSchema.refine((date) => {
    const dob = new Date(date);
    const now = new Date();
    const age = now.getFullYear() - dob.getFullYear();
    if (now.getMonth() < dob.getMonth() || (now.getMonth() === dob.getMonth() && now.getDate() < dob.getDate())) {
        return age - 1 >= 18;
    }
    return age >= 18;
}, {
    message: "Must be at least 18 years old"
});
export type DateOfBirth = z.infer<typeof DateOfBirthSchema>;

export const UsStateAbbreviationSchema = z.enum([
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
]);
export type UsStateAbbreviation = z.infer<typeof UsStateAbbreviationSchema>;

export const DriversLicenseNumberSchema = z.string().length(9).regex(/^[A-Z0-9]+$/, {
    message: "Drivers License number must be 9 uppercase alphanumeric characters"
});
export type DriversLicenseNumber = z.infer<typeof DriversLicenseNumberSchema>;