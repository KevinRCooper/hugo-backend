/**
 * Utility to delete a nested property using a path
 * Returns a new object with the specified property removed.
 * Example:
 * ```typescript
 * const obj = {
 *    a: {
 *       b: {
 *         c: 1,
 *      },
 *   },
 * };
 * const newObj = deleteNestedProperty(obj, "a.b.c");
 * console.log(newObj); // { a: { b: {} } }
 * ```
 */
export const deleteNestedProperty = <T>(obj: T, path: string): T => {
  if (!isObject(obj)) {
    throw new TypeError("Input must be a non-null object");
  }

  const keys = path.split(".");
  const [currentKey, ...remainingKeys] = keys;

  // If the key to delete is at the root level
  if (keys.length === 1) {
    const { [currentKey]: _, ...rest } = obj as Record<string, unknown>;
    return rest as T;
  }

  // If the key to delete is nested
  if (currentKey in obj && isObject(obj[currentKey])) {
    return {
      ...obj,
      [currentKey]: deleteNestedProperty(
        obj[currentKey],
        remainingKeys.join("."),
      ),
    };
  }

  // If the path is invalid or doesn't exist, return the original object
  return obj;
};

const isObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};
