import { describe, test, expect } from "vitest";
import { VehicleSchema, VehiclesSchema } from "../../src/schemas/vehicle";

describe("VehicleSchema", () => {
  describe("Field Validations", () => {
    describe("Make", () => {
      test("Valid Make", () => {
        expect(
          VehicleSchema.safeParse({
            make: "Toyota",
            model: "Corolla",
            year: 2010,
            vin: "WA1LMAFE2ED068921",
          }).success,
        ).toBe(true);
      });

      test("Invalid Make", () => {
        expect(
          VehicleSchema.safeParse({
            make: "",
            model: "Corolla",
            year: 2010,
            vin: "WA1LMAFE2ED068921",
          }).success,
        ).toBe(false); // Empty
        expect(
          VehicleSchema.safeParse({
            make: "T",
            model: "Corolla",
            year: 2010,
            vin: "WA1LMAFE2ED068921",
          }).success,
        ).toBe(false); // Too short
        expect(
          VehicleSchema.safeParse({
            make: "A".repeat(256),
            model: "Corolla",
            year: 2010,
            vin: "WA1LMAFE2ED068921",
          }).success,
        ).toBe(false); // Too long
      });
    });

    describe("Model", () => {
      test("Valid Model", () => {
        expect(
          VehicleSchema.safeParse({
            make: "Toyota",
            model: "Corolla",
            year: 2010,
            vin: "WA1LMAFE2ED068921",
          }).success,
        ).toBe(true);
      });

      test("Invalid Model", () => {
        expect(
          VehicleSchema.safeParse({
            make: "Toyota",
            model: "",
            year: 2010,
            vin: "WA1LMAFE2ED068921",
          }).success,
        ).toBe(false); // Empty
        expect(
          VehicleSchema.safeParse({
            make: "Toyota",
            model: "C",
            year: 2010,
            vin: "WA1LMAFE2ED068921",
          }).success,
        ).toBe(false); // Too short
        expect(
          VehicleSchema.safeParse({
            make: "Toyota",
            model: "A".repeat(256),
            year: 2010,
            vin: "WA1LMAFE2ED068921",
          }).success,
        ).toBe(false); // Too long
      });
    });

    describe("Year", () => {
      test("Valid Year", () => {
        expect(
          VehicleSchema.safeParse({
            make: "Toyota",
            model: "Corolla",
            year: 2010,
            vin: "WA1LMAFE2ED068921",
          }).success,
        ).toBe(true);
      });

      test("Invalid Year", () => {
        expect(
          VehicleSchema.safeParse({
            make: "Toyota",
            model: "Corolla",
            year: 1984,
            vin: "WA1LMAFE2ED068921",
          }).success,
        ).toBe(false); // Too old
        expect(
          VehicleSchema.safeParse({
            make: "Toyota",
            model: "Corolla",
            year: new Date().getFullYear() + 2,
            vin: "WA1LMAFE2ED068921",
          }).success,
        ).toBe(false); // Future year
      });
    });

    describe("VIN", () => {
      test("Valid VIN", () => {
        expect(
          VehicleSchema.safeParse({
            make: "Toyota",
            model: "Corolla",
            year: 2010,
            vin: "WA1LMAFE2ED068921",
          }).success,
        ).toBe(true);
      });

      test("Invalid VIN", () => {
        expect(
          VehicleSchema.safeParse({
            make: "Toyota",
            model: "Corolla",
            year: 2010,
            vin: "",
          }).success,
        ).toBe(false); // Empty
        expect(
          VehicleSchema.safeParse({
            make: "Toyota",
            model: "Corolla",
            year: 2010,
            vin: "WA1LMAFE2ED06892",
          }).success,
        ).toBe(false); // Too short
        expect(
          VehicleSchema.safeParse({
            make: "Toyota",
            model: "Corolla",
            year: 2010,
            vin: "WA1LMAFE2ED0689210",
          }).success,
        ).toBe(false); // Too long
        expect(
          VehicleSchema.safeParse({
            make: "Toyota",
            model: "Corolla",
            year: 2010,
            vin: "!A1LMAFE2ED06892O",
          }).success,
        ).toBe(false); // Invalid character
        expect(
          VehicleSchema.safeParse({
            make: "Toyota",
            model: "Corolla",
            year: 2010,
            vin: "WA1LMAFE2EDIOQ",
          }).success,
        ).toBe(false); // Invalid check digit
      });
    });
  });

  describe("Vehicle Validations", () => {
    test("Valid Vehicle", () => {
      expect(
        VehicleSchema.safeParse({
          make: "Toyota",
          model: "Corolla",
          year: 2010,
          vin: "WA1LMAFE2ED068921",
        }).success,
      ).toBe(true);
    });
  });
});

describe("Vehicles Schema", () => {
  test("Valid Vehicles", () => {
    expect(
      VehiclesSchema.safeParse({
        "1": {
          make: "Toyota",
          model: "Corolla",
          year: 2010,
          vin: "WA1LMAFE2ED068921",
        },
      }).success,
    ).toBe(true);
  });

  test("Invalid Vehicles - Can't have more than 3", () => {
    expect(
      VehiclesSchema.safeParse({
        "1": {
          make: "Toyota",
          model: "Corolla",
          year: 2010,
          vin: "WA1LMAFE2ED068921",
        },
        "2": {
          make: "Toyota",
          model: "Corolla",
          year: 2010,
          vin: "WA1LMAFE2ED068921",
        },
        "3": {
          make: "Toyota",
          model: "Corolla",
          year: 2010,
          vin: "WA1LMAFE2ED068921",
        },
        "4": {
          make: "Toyota",
          model: "Corolla",
          year: 2010,
          vin: "WA1LMAFE2ED068921",
        },
      }).success,
    ).toBe(false);
  });

  test("Invalid Vehicles - All Vehicles must be valid", () => {
    expect(
      VehiclesSchema.safeParse({
        "1": {
          make: "Toyota",
          model: "Corolla",
          year: 2010,
          vin: "WA1LMAFE2ED068921",
        },
        "2": {
          make: "Toyota",
          model: "Corolla",
        },
      }).success,
    ).toBe(false);
  });
});
