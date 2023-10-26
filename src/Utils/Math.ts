/**
 * generates a random integer within a range
 * @param min - the minimum value
 * @param max - the maximum value
 * @returns the calulated value
 */

export const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
