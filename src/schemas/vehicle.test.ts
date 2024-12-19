import { describe, test, expect } from 'vitest';
import { VehicleSchema, PartialVehicleSchema, VehiclesSchema, PartialVehiclesSchema } from './vehicle';

describe('VehicleSchema', () => {
    describe("Partial Vehicle for Creation, Search, and Update", () => {
        describe("Make", () => {
            test("Valid Make", () => {
                expect(PartialVehicleSchema.safeParse({ make: 'Toyota' }).success).toBe(true);
            });

            test("Invalid Make", () => {
                expect(PartialVehicleSchema.safeParse({ make: '' }).success).toBe(false); // Empty
                expect(PartialVehicleSchema.safeParse({ make: 'T' }).success).toBe(false); // Too short
                expect(PartialVehicleSchema.safeParse({ make: 'A'.repeat(256) }).success).toBe(false); // Too long
            });
        });

        describe("Model", () => {
            test("Valid Model", () => {
                expect(PartialVehicleSchema.safeParse({ model: 'Corolla' }).success).toBe(true);
            });

            test("Invalid Model", () => {
                expect(PartialVehicleSchema.safeParse({ model: '' }).success).toBe(false); // Empty
                expect(PartialVehicleSchema.safeParse({ model: 'C' }).success).toBe(false); // Too short
                expect(PartialVehicleSchema.safeParse({ model: 'A'.repeat(256) }).success).toBe(false); // Too long
            });
        });

        describe("Year", () => {
            test("Valid Year", () => {
                expect(PartialVehicleSchema.safeParse({ year: 2010 }).success).toBe(true);
            });

            test("Invalid Year", () => {
                expect(PartialVehicleSchema.safeParse({ year: 1984 }).success).toBe(false); // Too old
                expect(PartialVehicleSchema.safeParse({ year: new Date().getFullYear() + 2 }).success).toBe(false); // Future year
            });
        });

        describe("VIN", () => {
            test("Valid VIN", () => {
                expect(PartialVehicleSchema.safeParse({ vin: 'WA1LMAFE2ED068921' }).success).toBe(true);
            });

            test("Invalid VIN", () => {
                expect(PartialVehicleSchema.safeParse({ vin: '' }).success).toBe(false); // Empty
                expect(PartialVehicleSchema.safeParse({ vin: 'WA1LMAFE2ED06892' }).success).toBe(false); // Too short
                expect(PartialVehicleSchema.safeParse({ vin: 'WA1LMAFE2ED0689210' }).success).toBe(false); // Too long
                expect(PartialVehicleSchema.safeParse({ vin: '!A1LMAFE2ED06892O' }).success).toBe(false); // Invalid character
                expect(PartialVehicleSchema.safeParse({ vin: 'WA1LMAFE2EDIOQ' }).success).toBe(false); // Invalid check digit
            });
        });
    });

    describe("Vehicle for Submission", () => {
        test("Valid Vehicle", () => {
            expect(VehicleSchema.safeParse({
                make: 'Toyota',
                model: 'Corolla',
                year: 2010,
                vin: 'WA1LMAFE2ED068921',
            }).success).toBe(true);
        });
    });
});

describe("Partial Vehicles Schema", () => {
    test("Valid Vehicles", () => {
        expect(PartialVehiclesSchema.safeParse({
            "1": {
            make: 'Toyota',
            model: 'Corolla',
            year: 2010,
            vin: 'WA1LMAFE2ED068921',
            },
        }).success).toBe(true);
        expect(PartialVehiclesSchema.safeParse({
            "1": {
            make: 'Toyota',
            model: 'Corolla',
            year: 2010,
            vin: 'WA1LMAFE2ED068921',
            },
            "2": {
            make: 'Toyota',
            model: 'Corolla',
            },
        }).success).toBe(true);
        expect(PartialVehiclesSchema.safeParse({ "1": { make: 'Toyota' }}).success).toBe(true);
    });

});

describe("Vehicles Schema", () => {
    test("Valid Vehicles", () => {
        expect(VehiclesSchema.safeParse({
            "1": {
            make: 'Toyota',
            model: 'Corolla',
            year: 2010,
            vin: 'WA1LMAFE2ED068921',
            },
        }).success).toBe(true);
    });

    test("Invalid Vehicles - Can't have more than 3", () => {
        expect(VehiclesSchema.safeParse({
            "1": {
            make: 'Toyota',
            model: 'Corolla',
            year: 2010,
            vin: 'WA1LMAFE2ED068921',
            },
            "2": {
            make: 'Toyota',
            model: 'Corolla',
            year: 2010,
            vin: 'WA1LMAFE2ED068921',
            },
            "3": {
            make: 'Toyota',
            model: 'Corolla',
            year: 2010,
            vin: 'WA1LMAFE2ED068921',
            },
            "4": {
            make: 'Toyota',
            model: 'Corolla',
            year: 2010,
            vin: 'WA1LMAFE2ED068921',
            },
        }).success).toBe(false);
    });

    test("Invalid Vehicles - All Vehicles must be valid", () => {
        expect(VehiclesSchema.safeParse({
            "1": {
            make: 'Toyota',
            model: 'Corolla',
            year: 2010,
            vin: 'WA1LMAFE2ED068921',
            },
            "2": {
            make: 'Toyota',
            model: 'Corolla',
            },
        }).success).toBe(false);
    });
});
