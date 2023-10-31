import { DisplayObject } from 'pixi.js';

/**
 * destroy all displayObjects in a given array
 * @param arr - the array of {@link DisplayObject} to destroy
 * @returns void
 */

export const destroySprites = (arr: DisplayObject[]): void => {
  arr.forEach((dO: DisplayObject) => {
    // destroy display object
    dO.destroy();
  });

  arr = [];
};
