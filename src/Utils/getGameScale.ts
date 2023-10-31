let scale: number = 0;
/**
 * set the scale game against the screen size
 *
 * @param gameWidth - the width of the canvas area
 * @param gameHeight - the height of the canvas area
 * @returns void
 */
export const setScale = (gameWidth: number, gameHeight: number): void => {
  scale = Math.min(
    window.innerWidth / gameWidth,
    window.innerHeight / gameHeight
  );
};

/**
 * get the scale of the game against the screen size
 * @returns the scale of the canvas
 */
export const getScale = (): number => {
  return scale;
};
