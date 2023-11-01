import { Point, Sprite } from 'pixi.js';
import { mousePosition } from './getMousePosition';
import { getScale } from './getGameScale';

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

export const updateSpriteMovement = (
  timeDelta: number,
  speed: number,
  friction: number,
  collisionTargets: Sprite[][]
): void => {
  spriteList?.forEach((playerSprite: Sprite) => {
    // Calculate the direction vector to the mouse position
    const pos = playerSprite.getGlobalPosition();
    const direction = new Point(
      mousePosition.x - pos.x,
      mousePosition.y - pos.y
    );

    const scale = getScale();

    // Calculate the length of the direction vector (distance to the mouse)
    const distance = Math.sqrt(direction.x ** 2 + direction.y ** 2);

    if (distance > 5) {
      // Normalize the direction vector
      direction.x /= distance;
      direction.y /= distance;

      // Calculate the amount to move in this frame
      const moveAmount = speed * (timeDelta / 1000);

      // Calculate the potential new position
      let newX = playerSprite.x + direction.x * moveAmount;
      let newY = playerSprite.y + direction.y * moveAmount;

      // Check for collisions with all specified collision targets
      let isColliding = false;

      for (const targetSprites of collisionTargets) {
        for (const targetSprite of targetSprites) {
          const playerBounds = playerSprite.getBounds();
          const targetBounds = targetSprite.getBounds();

          playerBounds.width -= 20 * scale;
          playerBounds.height -= 20 * scale;

          if (playerBounds.intersects(targetBounds)) {
            isColliding = true;
            break; // Exit the inner loop on collision
          }
        }
        if (isColliding) break; // Exit the outer loop on collision
      }

      // Apply friction when colliding
      if (isColliding) {
        // Calculate the normalized collision normal vector
        const normalX = (newX - playerSprite.x) / moveAmount;
        const normalY = (newY - playerSprite.y) / moveAmount;

        // Calculate the dot product of the movement direction and collision normal
        const dotProduct = direction.x * normalX + direction.y * normalY;

        // Apply friction to the movement direction
        direction.x -= normalX * dotProduct * friction;
        direction.y -= normalY * dotProduct * friction;

        // Recalculate the new position after friction is applied
        newX = playerSprite.x + direction.x * moveAmount;
        newY = playerSprite.y + direction.y * moveAmount;
      }

      // Update the player's position
      playerSprite.x = newX;
      playerSprite.y = newY;
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
