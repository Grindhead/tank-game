import { Sprite } from 'pixi.js';
import { mousePosition } from './getMousePosition';

/**
 * an array of sprites to rotate
 */
let spriteList: Sprite[] = [];

/**
 * add a sprite to be rotated each frame
 * @param sprite - the sprite to rotate each frame
 * @returns void
 */
export const addRotateSpriteTowardsMouseSprite = (sprite: Sprite): void => {
  spriteList.push(sprite);
};

/**
 * removes the event listener for mouse movement
 * @returns void
 */
export const stopRotatingSprites = (): void => {
  spriteList = [];
};

/**
 * updates and rotates a sprite each frame towards the
 * current mouse position
 * @param delta - the time delta
 * @param easingFactor - a value between 0 and 1 (0 for no easing, 1 for full easing)
 * @returns void
 */
export const updateSpriteRotation = (
  delta: number,
  easingFactor: number
): void => {
  spriteList.forEach((sprite) => {
    if (mousePosition === null) {
      return;
    }
    const pos = sprite.getGlobalPosition();
    const targetAngle = Math.atan2(
      mousePosition.y - pos.y,
      mousePosition.x - pos.x
    );

    // Convert radians to degrees and add 90 degrees to adjust for sprite orientation
    const targetDegrees = (targetAngle * 180) / Math.PI + 90;

    // Calculate the angle difference between the current rotation and the target rotation
    const currentDegrees = (sprite.rotation * 180) / Math.PI;
    let angleDiff = targetDegrees - currentDegrees;

    // Normalize the angle difference to be within -180 to 180 degrees
    if (angleDiff > 180) {
      angleDiff -= 360;
    } else if (angleDiff < -180) {
      angleDiff += 360;
    }

    // Calculate the rotation change based on the easing factor and delta time
    const rotationChange = (angleDiff * easingFactor * delta) / 1000;

    // Update the sprite's rotation with the new value
    sprite.rotation += (rotationChange * Math.PI) / 180;
  });
};
