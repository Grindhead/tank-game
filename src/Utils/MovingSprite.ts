import { Point, Sprite } from 'pixi.js';

/**
 * a moving sprite
 */
export class MovingSprite extends Sprite {
  /**
   * the movement velocity
   */
  velocity: Point = new Point();
}
