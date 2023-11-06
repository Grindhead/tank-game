import { Point, Sprite } from 'pixi.js';

/**
 * a moving sprite
 */
export class GameSprite extends Sprite {
  /**
   * the GameSprite movement velocity
   */
  velocity: Point = new Point();

  /**
   * the life of the GameSprite, default to 0
   */
  life: number = 0;

  /**
   * the damage dealt by the GameSprite. default is 0
   */
  damage: number = 0;
}
