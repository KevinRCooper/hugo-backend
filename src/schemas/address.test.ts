import { describe, test, expect } from 'vitest';
import { AddressSchema, PartialAddressSchema } from './address';

describe('AddressSchema', () => {
    describe("Partial Address for Creation, Search, and Update", () => {
        describe("Street", () => {
            test("Valid Street", () => {
                expect(PartialAddressSchema.safeParse({ street: '123 Main St' }).success).toBe(true);
            });

            test("Invalid Street", () => {
                expect(PartialAddressSchema.safeParse({ street: '' }).success).toBe(false); // Empty
                expect(PartialAddressSchema.safeParse({ street: '1' }).success).toBe(false); // Too short
                expect(PartialAddressSchema.safeParse({ street: 'A'.repeat(256) }).success).toBe(false); // Too long
            });
        });

        describe("Unit", () => {
            test("Valid Unit", () => {
                expect(PartialAddressSchema.safeParse({ unit: 'A' }).success).toBe(true);
            });

            test("Invalid Unit", () => {
                expect(PartialAddressSchema.safeParse({ unit: '' }).success).toBe(false); // Empty
                expect(PartialAddressSchema.safeParse({ unit: 'A1234567890' }).success).toBe(false); // Too long
            });
        });

        describe("City", () => {
            test("Valid City", () => {
                expect(PartialAddressSchema.safeParse({ city: 'New York' }).success).toBe(true);
            });

            test("Invalid City", () => {
                expect(PartialAddressSchema.safeParse({ city: '' }).success).toBe(false); // Empty
                expect(PartialAddressSchema.safeParse({ city: 'A'.repeat(256) }).success).toBe(false); // Too long
            });
        });

        describe("State", () => {
            test("Valid State", () => {
                expect(PartialAddressSchema.safeParse({ state: 'NY' }).success).toBe(true);
            });

            test("Invalid State", () => {
                expect(PartialAddressSchema.safeParse({ state: 'New York' }).success).toBe(false); // Invalid State
                expect(PartialAddressSchema.safeParse({ state: 'NYC' }).success).toBe(false); // Invalid State
            });
        });
    });

    describe("Address for Submission", () => {
        test("Valid Address", () => {
            expect(AddressSchema.safeParse({
                street: '123 Main St',
                unit: 'A',
                city: 'New York',
                state: 'NY',
                zip: '10001',
            }).success).toBe(true);
        });

        test("Invalid Address - Partial Not Allowed", () => {
            expect(AddressSchema.safeParse({
                street: '123 Main St',
                unit: 'A',
                city: 'New York',
            }).success).toBe(false);
        });

        test("Invalid Address - Incorrect Fields Not Allowed", () => {
            expect(AddressSchema.safeParse({
                street: '123 Main St',
                unit: 'A',
                city: 'New York',
                state: 'NY',
                zip: '1000', // Invalid Zip
            }).success).toBe(false);
        });
    });
});
    