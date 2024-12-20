import { describe, test, expect } from "vitest";
import { deleteNestedProperty } from "../../src/utils/nestedProperties";

describe("deleteNestedProperty", () => {
  test("Deletes a root-level property", () => {
    const obj = { a: 1, b: 2 };
    const result = deleteNestedProperty(obj, "a");
    expect(result).toEqual({ b: 2 });
  });

  test("Deletes a nested property", () => {
    const obj = { a: { b: { c: 1, d: 2 } } };
    const result = deleteNestedProperty(obj, "a.b.c");
    expect(result).toEqual({ a: { b: { d: 2 } } });
  });

  test("Deletes a deeply nested property", () => {
    const obj = { a: { b: { c: { d: { e: 5 } } } } };
    const result = deleteNestedProperty(obj, "a.b.c.d.e");
    expect(result).toEqual({ a: { b: { c: { d: {} } } } });
  });

  test("Deletes a property that results in an empty object", () => {
    const obj = { a: { b: { c: 1 } } };
    const result = deleteNestedProperty(obj, "a.b.c");
    expect(result).toEqual({ a: { b: {} } });
  });

  test("Returns the original object if the path does not exist", () => {
    const obj = { a: { b: { c: 1 } } };
    const result = deleteNestedProperty(obj, "a.b.d");
    expect(result).toEqual({ a: { b: { c: 1 } } });
  });

  test("Returns the original object if the path is invalid", () => {
    const obj = { a: { b: { c: 1 } } };
    const result = deleteNestedProperty(obj, "x.y.z");
    expect(result).toEqual(obj);
  });

  test("Throws an error if the input is not an object", () => {
    expect(() => deleteNestedProperty(null, "a")).toThrow(TypeError);
    expect(() => deleteNestedProperty(undefined, "a")).toThrow(TypeError);
    expect(() => deleteNestedProperty(123 as unknown, "a")).toThrow(TypeError);
    expect(() => deleteNestedProperty("string" as unknown, "a")).toThrow(
      TypeError,
    );
  });

  test("Handles an empty path gracefully", () => {
    const obj = { a: { b: { c: 1 } } };
    const result = deleteNestedProperty(obj, "");
    expect(result).toEqual(obj);
  });

  test("Handles deleting a property with a non-object parent", () => {
    const obj = { a: { b: null } };
    const result = deleteNestedProperty(obj, "a.b.c");
    expect(result).toEqual(obj);
  });
});
