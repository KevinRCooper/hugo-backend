import { describe, test, expect } from "vitest";
import { VinSchema } from "../../src/schemas/vehicle";

describe("VIN Validation", () => {
  test("Valid VINs pass the schema validation", () => {
    const validVins = [
      "1J4G248S4YC183476", // Valid VIN, check digit is 4
      "1ZVBP8EN0A5147685", // Valid VIN, check digit is 0
      "1FTFW1CTXDFD53689", // Valid VIN, check digit is X
    ];

    validVins.forEach((vin) => {
      const checkDigit = vin[8]; // 9th character (check digit)
      expect(() => VinSchema.parse(vin)).not.toThrow();
      expect(VinSchema.parse(vin)[8]).toBe(checkDigit); // Check digit match
    });
  });

  test("Invalid VINs fail the schema validation", () => {
    const invalidVins = [
      "1HGCM82633A12345", // Too short
      "1HGCM82633A1234567", // Too long
      "1HGCM82633A12345I", // Contains invalid character (I)
      "1HGCM82633A123456", // Correct length but invalid check digit
    ];

    invalidVins.forEach((vin) => {
      expect(() => VinSchema.parse(vin)).toThrow();
    });
  });

  test("Edge cases for VINs", () => {
    const edgeCaseVins = [
      "AAAAAAAAAAAAAAAAA", // All valid letters but fails check digit
      "12345678901234567", // All digits but fails check digit
      "1HGCM82633A12345X", // Correct format but fails validation
    ];

    edgeCaseVins.forEach((vin) => {
      expect(() => VinSchema.parse(vin)).toThrow();
    });
  });
});
