import { Point, Sprite } from 'pixi.js';

/**
 * a moving sprite
 */
export class GameSprite extends Sprite {
  /**
   * the movement velocity
   */
  velocity: Point = new Point();

  /**
   * the life of the moving sprite, default to 0
   */
  life: number = 0;
}
