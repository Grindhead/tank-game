import { Point } from 'pixi.js';

/**
 * a Pixi.Point object of the current mouse position
 * @returns void
 */
export const mousePosition: Point = new Point();

const handleMouseMove = (e: MouseEvent): void => {
  mousePosition.x = e.clientX;
  mousePosition.y = e.clientY;
};

window.addEventListener('mousemove', handleMouseMove);
