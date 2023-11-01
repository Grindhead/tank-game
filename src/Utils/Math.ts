/**
 * generates a random integer within a range
 * @param min - the minimum value
 * @param max - the maximum value
 * @returns the calulated value
 */

export const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Helper function to clamp a value between a minimum and maximum
 * @param value - the number to clamp
 * @param min - the minimum value
 * @param max - the maximum value
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(value, max));
};
