import { DisplayObject, Sprite } from 'pixi.js';

/**
 * destroy all sprites in a given array
 * @param arr - the array of {@link DisplayObject} to destroy
 * @returns void
 */

export const destroySprites = (arr: DisplayObject[]): void => {
  arr.forEach((sprite: Sprite) => {
    // destroy sprite
    sprite.destroy();
  });

  arr = [];
};
