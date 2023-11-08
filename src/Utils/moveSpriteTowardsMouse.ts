import { Point, Sprite } from 'pixi.js';
import {
  calculateDirectionVector,
  calculateDistanceBetweenPoints
} from './Math';
import { updateSpriteRotation } from './rotateSpriteTowardsMouse';
import { mousePosition } from './getMousePosition';
import { GameSprite } from './GameSprite';

/**
 * An array of all the sprites
 */
const spriteList: GameSprite[] = [];

/**
 * Moves an array of sprites towards the mouse position.
 * @param sprite - the sprite to move towards the mouse
 * @returns void
 */
export const addMoveSpriteTowardsMouse = (sprite) => {
  spriteList.push(sprite);
  sprite.velocity = new Point();
};

/**
 * Moves a group of PIXI sprites towards the mouse cursor while handling collisions with walls.
 * Also calls {@link updateSpriteRotation} so do not call that independently for performance reasons.
 * @param walls - An array of PIXI.Sprite objects representing walls for collision detection.
 * @param timeDelta - The time interval for sprite movement.
 * @returns void
 */
export const updateMoveSpriteTowardsMouse = (
  walls: Sprite[],
  timeDelta: number
): void => {
  // Update velocity with acceleration and easing
  const maxSpeed = 6;
  const acceleration = 1;
  const easing = 2;

  spriteList.forEach((sprite: GameSprite) => {
    const spritePosition = sprite.getGlobalPosition();
    // Calculate direction vector towards the mouse
    const direction = calculateDirectionVector(spritePosition, mousePosition); // Assuming mousePosition is imported
    const distance = calculateDistanceBetweenPoints(
      mousePosition,
      spritePosition
    );

    if (distance < maxSpeed * 2) {
      return;
    }

    // Calculate acceleration with easing
    const accelerationX = direction.x * acceleration * easing * timeDelta;
    const accelerationY = direction.y * acceleration * easing * timeDelta;

    // Update velocity with acceleration, clamped to the max speed
    sprite.velocity.x += accelerationX;
    sprite.velocity.y += accelerationY;

    const velocityMagnitude = Math.sqrt(
      sprite.velocity.x * sprite.velocity.x +
        sprite.velocity.y * sprite.velocity.y
    );

    if (velocityMagnitude > maxSpeed) {
      const scaleFactor = maxSpeed / velocityMagnitude;
      sprite.velocity.x *= scaleFactor;
      sprite.velocity.y *= scaleFactor;
    }

    // Calculate the movement for this frame
    const moveX = sprite.velocity.x * timeDelta;
    const moveY = sprite.velocity.y * timeDelta;

    sprite.position.x += moveX;
    sprite.position.y += moveY;

    updateSpriteRotation(timeDelta, 75);
  });
};

/**
 * Stops any moving sprites from updating.
 * @returns void
 */
export const stopMovingSprites = () => {
  spriteList.length = 0;
};
