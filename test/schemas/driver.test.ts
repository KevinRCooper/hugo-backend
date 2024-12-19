import { describe, test, expect } from "vitest";
import { DriverSchema } from "../../src/schemas/driver";

describe("DriverSchema", () => {
  describe("Field Validations", () => {
    describe("First Name", () => {
      test("Valid First Name", () => {
        expect(
          DriverSchema.safeParse({
            firstName: "John",
            lastName: "Doe",
            dateOfBirth: "1990-01-01",
            gender: "male",
            maritalStatus: "single",
            driversLicense: { number: "A12345678", state: "CA" },
          }).success,
        ).toBe(true);
      });

      test("Invalid First Name", () => {
        expect(
          DriverSchema.safeParse({
            firstName: "",
            lastName: "Doe",
            dateOfBirth: "1990-01-01",
            gender: "male",
            maritalStatus: "single",
            driversLicense: { number: "A12345678", state: "CA" },
          }).success,
        ).toBe(false); // Empty
        expect(
          DriverSchema.safeParse({
            firstName: "J",
            lastName: "Doe",
            dateOfBirth: "1990-01-01",
            gender: "male",
            maritalStatus: "single",
            driversLicense: { number: "A12345678", state: "CA" },
          }).success,
        ).toBe(false); // Too short
        expect(
          DriverSchema.safeParse({
            firstName: "A".repeat(256),
            lastName: "Doe",
            dateOfBirth: "1990-01-01",
            gender: "male",
            maritalStatus: "single",
            driversLicense: { number: "A12345678", state: "CA" },
          }).success,
        ).toBe(false); // Too long
      });
    });

    describe("Last Name", () => {
      test("Valid Last Name", () => {
        expect(
          DriverSchema.safeParse({
            firstName: "John",
            lastName: "Doe",
            dateOfBirth: "1990-01-01",
            gender: "male",
            maritalStatus: "single",
            driversLicense: { number: "A12345678", state: "CA" },
          }).success,
        ).toBe(true);
      });

      test("Invalid Last Name", () => {
        expect(
          DriverSchema.safeParse({
            firstName: "John",
            lastName: "",
            dateOfBirth: "1990-01-01",
            gender: "male",
            maritalStatus: "single",
            driversLicense: { number: "A12345678", state: "CA" },
          }).success,
        ).toBe(false); // Empty
        expect(
          DriverSchema.safeParse({
            firstName: "John",
            lastName: "D",
            dateOfBirth: "1990-01-01",
            gender: "male",
            maritalStatus: "single",
            driversLicense: { number: "A12345678", state: "CA" },
          }).success,
        ).toBe(false); // Too short
        expect(
          DriverSchema.safeParse({
            firstName: "John",
            lastName: "A".repeat(256),
            dateOfBirth: "1990-01-01",
            gender: "male",
            maritalStatus: "single",
            driversLicense: { number: "A12345678", state: "CA" },
          }).success,
        ).toBe(false); // Too long
      });
    });

    describe("Date of Birth", () => {
      test("Valid Date of Birth", () => {
        expect(
          DriverSchema.safeParse({
            firstName: "John",
            lastName: "Doe",
            dateOfBirth: "1990-01-01",
            gender: "male",
            maritalStatus: "single",
            driversLicense: { number: "A12345678", state: "CA" },
          }).success,
        ).toBe(true);
      });

      test("Invalid Date of Birth", () => {
        expect(
          DriverSchema.safeParse({
            firstName: "John",
            lastName: "Doe",
            dateOfBirth: "1990-13-01",
            gender: "male",
            maritalStatus: "single",
            driversLicense: { number: "A12345678", state: "CA" },
          }).success,
        ).toBe(false); // Invalid month
        expect(
          DriverSchema.safeParse({
            firstName: "John",
            lastName: "Doe",
            dateOfBirth: "1990-01-32",
            gender: "male",
            maritalStatus: "single",
            driversLicense: { number: "A12345678", state: "CA" },
          }).success,
        ).toBe(false); // Invalid day
        expect(
          DriverSchema.safeParse({
            firstName: "John",
            lastName: "Doe",
            dateOfBirth: "2020-01-01",
            gender: "male",
            maritalStatus: "single",
            driversLicense: { number: "A12345678", state: "CA" },
          }).success,
        ).toBe(false); // Under 18
      });
    });

    describe("Gender", () => {
      test("Valid Gender", () => {
        expect(
          DriverSchema.safeParse({
            firstName: "John",
            lastName: "Doe",
            dateOfBirth: "1990-01-01",
            gender: "male",
            maritalStatus: "single",
            driversLicense: { number: "A12345678", state: "CA" },
          }).success,
        ).toBe(true);
        expect(
          DriverSchema.safeParse({
            firstName: "John",
            lastName: "Doe",
            dateOfBirth: "1990-01-01",
            gender: "female",
            maritalStatus: "single",
            driversLicense: { number: "A12345678", state: "CA" },
          }).success,
        ).toBe(true);
        expect(
          DriverSchema.safeParse({
            firstName: "John",
            lastName: "Doe",
            dateOfBirth: "1990-01-01",
            gender: "non-binary",
            maritalStatus: "single",
            driversLicense: { number: "A12345678", state: "CA" },
          }).success,
        ).toBe(true);
      });

      test("Invalid Gender", () => {
        expect(
          DriverSchema.safeParse({
            firstName: "John",
            lastName: "Doe",
            dateOfBirth: "1990-01-01",
            gender: "other",
            maritalStatus: "single",
            driversLicense: { number: "A12345678", state: "CA" },
          }).success,
        ).toBe(false); // Invalid
      });
    });

    describe("Marital Status", () => {
      test("Valid Marital Status", () => {
        expect(
          DriverSchema.safeParse({
            firstName: "John",
            lastName: "Doe",
            dateOfBirth: "1990-01-01",
            gender: "male",
            maritalStatus: "single",
            driversLicense: { number: "A12345678", state: "CA" },
          }).success,
        ).toBe(true);
        expect(
          DriverSchema.safeParse({
            firstName: "John",
            lastName: "Doe",
            dateOfBirth: "1990-01-01",
            gender: "male",
            maritalStatus: "married",
            driversLicense: { number: "A12345678", state: "CA" },
          }).success,
        ).toBe(true);
        expect(
          DriverSchema.safeParse({
            firstName: "John",
            lastName: "Doe",
            dateOfBirth: "1990-01-01",
            gender: "male",
            maritalStatus: "divorced",
            driversLicense: { number: "A12345678", state: "CA" },
          }).success,
        ).toBe(true);
        expect(
          DriverSchema.safeParse({
            firstName: "John",
            lastName: "Doe",
            dateOfBirth: "1990-01-01",
            gender: "male",
            maritalStatus: "widowed",
            driversLicense: { number: "A12345678", state: "CA" },
          }).success,
        ).toBe(true);
      });

      test("Invalid Marital Status", () => {
        expect(
          DriverSchema.safeParse({
            firstName: "John",
            lastName: "Doe",
            dateOfBirth: "1990-01-01",
            gender: "male",
            maritalStatus: "other",
            driversLicense: { number: "A12345678", state: "CA" },
          }).success,
        ).toBe(false); // Invalid
      });
    });

    describe("Drivers License", () => {
      test("Valid Drivers License Number", () => {
        expect(
          DriverSchema.safeParse({
            firstName: "John",
            lastName: "Doe",
            dateOfBirth: "1990-01-01",
            gender: "male",
            maritalStatus: "single",
            driversLicense: { number: "A12345678", state: "CA" },
          }).success,
        ).toBe(true);
      });

      test("Invalid Drivers License Number", () => {
        expect(
          DriverSchema.safeParse({
            firstName: "John",
            lastName: "Doe",
            dateOfBirth: "1990-01-01",
            gender: "male",
            maritalStatus: "single",
            driversLicense: { number: "A1234567", state: "CA" },
          }).success,
        ).toBe(false); // Too short
        expect(
          DriverSchema.safeParse({
            firstName: "John",
            lastName: "Doe",
            dateOfBirth: "1990-01-01",
            gender: "male",
            maritalStatus: "single",
            driversLicense: { number: "A123456789", state: "CA" },
          }).success,
        ).toBe(false); // Too long
        expect(
          DriverSchema.safeParse({
            firstName: "John",
            lastName: "Doe",
            dateOfBirth: "1990-01-01",
            gender: "male",
            maritalStatus: "single",
            driversLicense: { number: "A12345678", state: "XX" },
          }).success,
        ).toBe(false); // Invalid state
        expect(
          DriverSchema.safeParse({
            firstName: "John",
            lastName: "Doe",
            dateOfBirth: "1990-01-01",
            gender: "male",
            maritalStatus: "single",
            driversLicense: { number: "A123@567!", state: "CA" },
          }).success,
        ).toBe(false); // Invalid Characters
      });
    });
  });

  describe("Driver Validations", () => {
    test("Valid Driver", () => {
      expect(
        DriverSchema.safeParse({
          firstName: "John",
          lastName: "Doe",
          dateOfBirth: "1990-01-01",
          gender: "male",
          maritalStatus: "single",
          driversLicense: { number: "A12345678", state: "CA" },
        }).success,
      ).toBe(true);
    });

    test("Invalid Driver - Partial Not Allowed", () => {
      expect(
        DriverSchema.safeParse({
          firstName: "John",
          lastName: "Doe",
          dateOfBirth: "1990-01-01",
        }).success,
      ).toBe(false); // Missing required fields
    });
  });
});
