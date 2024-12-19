import { describe, test, expect } from 'vitest';
import { DriverSchema, PartialDriverSchema } from './driver';

describe('DriverSchema', () => {
    describe("Partial Driver for Creation, Search, and Update", () => {
        describe("First Name", () => {
            test("Valid First Name", () => {
                expect(PartialDriverSchema.safeParse({ firstName: 'John' }).success).toBe(true);
            });

            test("Invalid First Name", () => {
                expect(PartialDriverSchema.safeParse({ firstName: '' }).success).toBe(false); // Empty
                expect(PartialDriverSchema.safeParse({ firstName: 'J' }).success).toBe(false); // Too short
                expect(PartialDriverSchema.safeParse({ firstName: 'A'.repeat(256) }).success).toBe(false); // Too long
            });
        });

        describe("Last Name", () => {
            test("Valid Last Name", () => {
                expect(PartialDriverSchema.safeParse({ lastName: 'Doe' }).success).toBe(true);
            });

            test("Invalid Last Name", () => {
                expect(PartialDriverSchema.safeParse({ lastName: '' }).success).toBe(false); // Empty
                expect(PartialDriverSchema.safeParse({ lastName: 'D' }).success).toBe(false); // Too short
                expect(PartialDriverSchema.safeParse({ lastName: 'A'.repeat(256) }).success).toBe(false); // Too long
            });
        });

        describe("Date of Birth", () => {
            test("Valid Date of Birth", () => {
                expect(PartialDriverSchema.safeParse({ dateOfBirth: '1990-01-01' }).success).toBe(true);
            });

            test("Invalid Date of Birth", () => {
                expect(PartialDriverSchema.safeParse({ dateOfBirth: '1990-13-01' }).success).toBe(false); // Invalid month
                expect(PartialDriverSchema.safeParse({ dateOfBirth: '1990-01-32' }).success).toBe(false); // Invalid day
                expect(PartialDriverSchema.safeParse({ dateOfBirth: '2020-01-01' }).success).toBe(false); // Under 18
            });
        });

        describe("Gender", () => {
            test("Valid Gender", () => {
                expect(PartialDriverSchema.safeParse({ gender: "male" }).success).toBe(true);
                expect(PartialDriverSchema.safeParse({ gender: "female" }).success).toBe(true);
                expect(PartialDriverSchema.safeParse({ gender: "non-binary" }).success).toBe(true);
            });

            test("Invalid Gender", () => {
                expect(PartialDriverSchema.safeParse({ gender: "other" }).success).toBe(false); // Invalid
            });
        });

        describe("Marital Status", () => {
            test("Valid Marital Status", () => {
                expect(PartialDriverSchema.safeParse({ maritalStatus: "single" }).success).toBe(true);
                expect(PartialDriverSchema.safeParse({ maritalStatus: "married" }).success).toBe(true);
                expect(PartialDriverSchema.safeParse({ maritalStatus: "divorced" }).success).toBe(true);
                expect(PartialDriverSchema.safeParse({ maritalStatus: "widowed" }).success).toBe(true);
            });

            test("Invalid Marital Status", () => {
                expect(PartialDriverSchema.safeParse({ maritalStatus: "other" }).success).toBe(false); // Invalid
            });
        });

        describe("Drivers License", () => {
            test("Valid Drivers License Number", () => {
                expect(PartialDriverSchema.safeParse({ driversLicense: { number: 'A12345678', state: "CA" } }).success).toBe(true);
            });

            test("Invalid Drivers License Number", () => {
                expect(PartialDriverSchema.safeParse({ driversLicense: { number: 'A1234567', state: "CA" } }).success).toBe(false); // Too short
                expect(PartialDriverSchema.safeParse({ driversLicense: { number: 'A123456789', state: "CA" } }).success).toBe(false); // Too long
                expect(PartialDriverSchema.safeParse({ driversLicense: { number: 'A12345678', state: "XX" } }).success).toBe(false); // Invalid state
                expect(PartialDriverSchema.safeParse({ driversLicense: { number: 'A123@567!', state: "CA" } }).success).toBe(false); // Invalid Characters
            });
        });
    });

    describe("Driver for Submission", () => {
        test("Valid Driver", () => {
            expect(DriverSchema.safeParse({
                firstName: 'John',
                lastName: 'Doe',
                dateOfBirth: '1990-01-01',
                gender: "male",
                maritalStatus: "single",
                driversLicense: { number: 'A12345678', state: "CA" },
            }).success).toBe(true);
        });

        test("Invalid Driver - Partial Not Allowed", () => {
            expect(DriverSchema.safeParse({
                firstName: 'John',
                lastName: 'Doe',
                dateOfBirth: '1990-01-01',
            }).success).toBe(false); // Missing required fields
        });
    });
});