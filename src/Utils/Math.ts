import { MovingSprite } from './MovingSprite';
import { Point, Sprite } from 'pixi.js';

/**
 * generates a random integer within a range
 * @param min - the minimum value
 * @param max - the maximum value
 * @returns the calulated value
 */

export const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Helper function to clamp a value between a minimum and maximum
 * @param value - the number to clamp
 * @param min - the minimum value
 * @param max - the maximum value
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(value, max));
};

/**
 * get the Euclidean distance between 2 Point objects
 * @param p1 - the first point
 * @param p2 - the second point
 * @returns the distance between each point
 */
export const calculateDistanceBetweenPoints = (
  p1: Point,
  p2: Point
): number => {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};

/**
 * Calculates the normalized direction vector from point1 to point2.
 *
 * @param point1 - The starting point.
 * @param point2 - The target point.
 * @returns The normalized direction vector.
 */
export const calculateDirectionVector = (
  point1: Point,
  point2: Point
): Point => {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  const distance = calculateDistanceBetweenPoints(point1, point2);
  return new Point(dx / distance, dy / distance);
};

/**
 * Checks for circular collision between two PIXI.Sprite objects.
 *
 * @param sprite1 - The first sprite.
 * @param sprite2 - The second sprite.
 * @returns True if there is a collision; otherwise, false.
 */
export const checkCircularCollision = (
  sprite1: Sprite,
  sprite2: Sprite
): boolean => {
  const radius1 = sprite1.width / 2;
  const radius2 = sprite2.width / 2;
  const distance = calculateDistanceBetweenPoints(
    sprite1.position,
    sprite2.position
  );
  return distance < radius1 + radius2;
};

/**
 * Checks for circular collision between a MovingSprite and an array of rectangle collision target Sprites.
 *
 * @param movingSprite - The MovingSprite with a circular hit area.
 * @param collisionTargets - An array of rectangle collision target Sprites.
 * @returns An array of collision target Sprites that collide with the movingSprite.
 */
export const checkCircularSpriteCollisionWithRectangleSpriteList = (
  movingSprite: MovingSprite,
  collisionTargets: Sprite[]
): Sprite[] => {
  const collidedSprites: Sprite[] = [];

  for (const target of collisionTargets) {
    if (checkCircularCollisionWithRectangle(movingSprite, target)) {
      collidedSprites.push(target);
    }
  }

  return collidedSprites;
};

/**
 * Checks for circular collision between a MovingSprite and a rectangle PIXI.Sprite object.
 *
 * @param movingSprite - The MovingSprite with a circular hit area.
 * @param rectangleSprite - The rectangle Sprite representing a collision target.
 * @returns True if there is a collision; otherwise, false.
 */
export const checkCircularCollisionWithRectangle = (
  movingSprite: MovingSprite,
  rectangleSprite: Sprite
): boolean => {
  const radius = movingSprite.width / 2;
  const circleX = movingSprite.x;
  const circleY = movingSprite.y;
  const rectX = rectangleSprite.x;
  const rectY = rectangleSprite.y;
  const rectWidth = rectangleSprite.width;
  const rectHeight = rectangleSprite.height;

  // Calculate the nearest point on the rectangle to the circle
  const closestX = Math.max(rectX, Math.min(circleX, rectX + rectWidth));
  const closestY = Math.max(rectY, Math.min(circleY, rectY + rectHeight));

  // Calculate the distance between the circle's center and the closest point on the rectangle
  const distance = Math.sqrt(
    (circleX - closestX) ** 2 + (circleY - closestY) ** 2
  );

  return distance < radius;
};
