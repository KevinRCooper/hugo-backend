/**
 * VIN Validation
 * This code uses the check digit calculation method defined in ISO 3779.
 * [See the Wikipedia article for more information](https://en.wikipedia.org/wiki/Vehicle_identification_number#Check_digit_calculation)
 */
type CheckDigitCalculator = (vin: string) => string;

/**
 * Weight Factors for VIN Check Digit Calculation
 *
 * | Position  | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8  | 9  | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 |
 * |-----------|---|---|---|---|---|---|---|----|----|----|----|----|----|----|----|----|----|
 * | Weight    | 8 | 7 | 6 | 5 | 4 | 3 | 2 | 10 | 0  | 9  | 8  | 7  | 6  | 5  | 4  | 3  | 2  |
 *
 */
const weights: Array<number> = [
  8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2,
];

/**
 * Transliteration Table for VIN Check Digit Calculation
 */
const transliteration: Record<string, number> = {
  A: 1,
  B: 2,
  C: 3,
  D: 4,
  E: 5,
  F: 6,
  G: 7,
  H: 8,
  J: 1,
  K: 2,
  L: 3,
  M: 4,
  N: 5,
  P: 7,
  R: 9,
  S: 2,
  T: 3,
  U: 4,
  V: 5,
  W: 6,
  X: 7,
  Y: 8,
  Z: 9,
  "0": 0,
  "1": 1,
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
};

/**
 * Calculate the Check Digit for a Vehicle Identification Number (VIN)
 */
export const calculateCheckDigit: CheckDigitCalculator = (vin) => {
  let sum = 0;

  for (let i = 0; i < vin.length; i++) {
    const char = vin[i].toUpperCase();
    const value = transliteration[char];
    sum += value * weights[i];
  }

  const remainder = sum % 11;
  return remainder === 10 ? "X" : remainder.toString();
};
