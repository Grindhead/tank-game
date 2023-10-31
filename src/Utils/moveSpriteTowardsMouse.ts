import { Point, Sprite } from 'pixi.js';
import { mousePosition } from './getMousePosition';
/**
 * an array of all the sprites
 */
let spriteList: Sprite[] | null = [];

/**
 * moves an array of sprites towards the mouse position
 * @param sprite - the sprite to move towards the mouse
 * @returns void
 */
export const addMoveSpriteTowardsMouse = (sprite: Sprite): void => {
  spriteList?.push(sprite);
};

/**
 * moves all the sprites added towards the mouse
 * @param timeDelta - the current time delta
 * @param speed - the speed to move the sprite
 */
export const updateSpriteMovement = (
  timeDelta: number,
  speed: number
): void => {
  spriteList?.forEach((sprite: Sprite) => {
    // Calculate the direction vector to the mouse position
    const direction = new Point(
      mousePosition.x - sprite.x,
      mousePosition.y - sprite.y
    );

    // Calculate the length of the direction vector (distance to the mouse)
    const distance = Math.sqrt(
      direction.x * direction.x + direction.y * direction.y
    );

    if (distance > 5) {
      // Normalize the direction vector
      direction.x /= distance;
      direction.y /= distance;

      // Calculate the amount to move in this frame
      const moveAmount = speed * (timeDelta / 1000);

      // Update the player's position
      sprite.x += direction.x * moveAmount;
      sprite.y += direction.y * moveAmount;
      console.log(sprite.x, sprite.y);
    }
  });
};

/**
 * stops any moving sprites from updating
 * @returns void
 */
export const stopMovingSprites = (): void => {
  spriteList = [];
};
