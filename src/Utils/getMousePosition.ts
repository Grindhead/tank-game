import { Point } from 'pixi.js';
export let mousePosition: Point;
/**
 * when the user moves the mouse, store the position as a {@link Point}
 * @returns void
 */
export const initMouseTracking = (): void => {
  document.addEventListener('mousemove', handleMouseMove);
  mousePosition = new Point();
};

/**
 * stop tracking the mouse
 * @returns void
 */
export const stopMouseTracking = (): void => {
  document.removeEventListener('mousemove', handleMouseMove);
};

/**
 * Handles the mouse move event to obtain the global mouse position in a PIXI application.
 *
 * @param e - The MouseEvent containing client coordinates.
 * @returns void
 */
const handleMouseMove = (e: MouseEvent): void => {
  mousePosition.x = e.clientX;
  mousePosition.y = e.clientY;
};
