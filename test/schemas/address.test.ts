import { describe, test, expect } from "vitest";
import { AddressSchema } from "../../src/schemas/address";

describe("AddressSchema", () => {
  describe("Field Validations", () => {
    describe("Street", () => {
      test("Valid Street", () => {
        expect(
          AddressSchema.safeParse({
            street: "123 Main St",
            city: "New York",
            state: "NY",
            zip: "10001",
          }).success,
        ).toBe(true);
      });

      test("Invalid Street", () => {
        expect(
          AddressSchema.safeParse({
            street: "",
            city: "New York",
            state: "NY",
            zip: "10001",
          }).success,
        ).toBe(false); // Empty
        expect(
          AddressSchema.safeParse({
            street: "1",
            city: "New York",
            state: "NY",
            zip: "10001",
          }).success,
        ).toBe(false); // Too short
        expect(
          AddressSchema.safeParse({
            street: "A".repeat(256),
            city: "New York",
            state: "NY",
            zip: "10001",
          }).success,
        ).toBe(false); // Too long
      });
    });

    describe("Unit", () => {
      test("Valid Unit", () => {
        expect(
          AddressSchema.safeParse({
            street: "123 Main St",
            unit: "A",
            city: "New York",
            state: "NY",
            zip: "10001",
          }).success,
        ).toBe(true);
      });

      test("Invalid Unit", () => {
        expect(
          AddressSchema.safeParse({
            street: "123 Main St",
            unit: "",
            city: "New York",
            state: "NY",
            zip: "10001",
          }).success,
        ).toBe(false); // Empty
        expect(
          AddressSchema.safeParse({
            street: "123 Main St",
            unit: "A1234567890",
            city: "New York",
            state: "NY",
            zip: "10001",
          }).success,
        ).toBe(false); // Too long
      });
    });

    describe("City", () => {
      test("Valid City", () => {
        expect(
          AddressSchema.safeParse({
            street: "123 Main St",
            city: "New York",
            state: "NY",
            zip: "10001",
          }).success,
        ).toBe(true);
      });

      test("Invalid City", () => {
        expect(
          AddressSchema.safeParse({
            street: "123 Main St",
            city: "",
            state: "NY",
            zip: "10001",
          }).success,
        ).toBe(false); // Empty
        expect(
          AddressSchema.safeParse({
            street: "123 Main St",
            city: "A".repeat(256),
            state: "NY",
            zip: "10001",
          }).success,
        ).toBe(false); // Too long
      });
    });

    describe("State", () => {
      test("Valid State", () => {
        expect(
          AddressSchema.safeParse({
            street: "123 Main St",
            city: "New York",
            state: "NY",
            zip: "10001",
          }).success,
        ).toBe(true);
      });

      test("Invalid State", () => {
        expect(
          AddressSchema.safeParse({
            street: "123 Main St",
            city: "New York",
            state: "New York",
            zip: "10001",
          }).success,
        ).toBe(false); // Invalid State
        expect(
          AddressSchema.safeParse({
            street: "123 Main St",
            city: "New York",
            state: "NYC",
            zip: "10001",
          }).success,
        ).toBe(false); // Invalid State
      });
    });
  });

  describe("Address Validations", () => {
    test("Valid Address", () => {
      expect(
        AddressSchema.safeParse({
          street: "123 Main St",
          unit: "A",
          city: "New York",
          state: "NY",
          zip: "10001",
        }).success,
      ).toBe(true);
    });

    test("Invalid Address - Partial Not Allowed", () => {
      expect(
        AddressSchema.safeParse({
          street: "123 Main St",
          unit: "A",
          city: "New York",
        }).success,
      ).toBe(false);
    });

    test("Invalid Address - Incorrect Fields Not Allowed", () => {
      expect(
        AddressSchema.safeParse({
          street: "123 Main St",
          unit: "A",
          city: "New York",
          state: "NY",
          zip: "1000", // Invalid Zip
        }).success,
      ).toBe(false);
    });
  });
});
