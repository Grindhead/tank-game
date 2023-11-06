import { Sprite } from 'pixi.js';
import { checkCircularCollisionWithRectangle, clamp } from './Math';
import { MovingSprite } from './MovingSprite';

enum ROTATION_DIRECTION {
  LEFT,
  RIGHT
}

const MAX_SPEED: number = 34;
const MAX_ROTATION_SPEED: number = 10;
const ACCELERATION: number = 0.1; // Increase acceleration for a more responsive feel
const ROTATION_ACCELERATION: number = 0.04; // Increase rotation acceleration
const LATERAL_FRICTION: number = 0.95; // Apply lateral friction
/**
 * The drag applied to the sprite each frame.
 */
const ROTATION_DRAG: number = 0.95; // Adjust rotation drag
const DRAG: number = 0.98;

let spriteList: MovingSprite[] = [];
let rotationSpeed: number = 0;
let leftKeyIsDown: boolean = false;
let rightKeyIsDown: boolean = false;
let upKeyIsDown: boolean = false;
let downKeyIsDown: boolean = false;

export const addKeyboardListeners = (): void => {
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('keyup', handleKeyUp);
};

const removeKeyboardListeners = (): void => {
  document.removeEventListener('keydown', handleKeyDown);
  document.removeEventListener('keyup', handleKeyUp);
};

const handleKeyDown = (e: KeyboardEvent): void => {
  if (e.key === 'ArrowLeft' || e.key === 'a') {
    leftKeyIsDown = true;
  } else if (e.key === 'ArrowRight' || e.key === 'd') {
    rightKeyIsDown = true;
  } else if (e.key === 'ArrowUp' || e.key === 'w') {
    upKeyIsDown = true;
  } else if (e.key === 'ArrowDown' || e.key === 's') {
    downKeyIsDown = true;
  }
};

const handleKeyUp = (e: KeyboardEvent): void => {
  if (e.key === 'ArrowLeft' || e.key === 'a') {
    leftKeyIsDown = false;
  } else if (e.key === 'ArrowRight' || e.key === 'd') {
    rightKeyIsDown = false;
  } else if (e.key === 'ArrowUp' || e.key === 'w') {
    upKeyIsDown = false;
  } else if (e.key === 'ArrowDown' || e.key === 's') {
    downKeyIsDown = false;
  }
};

export const addControlSpriteWithKeyboard = (sprite: MovingSprite): void => {
  spriteList.push(sprite);
};

export const stopControllingAllSpritesWithKeyboard = (): void => {
  spriteList = [];
  removeKeyboardListeners();
};

export const updateKeyboardMovement = (delta: number, wallList: Sprite[]) => {
  spriteList.forEach((sprite) => {
    if (leftKeyIsDown) {
      updateRotationSpeed(ROTATION_DIRECTION.LEFT, delta, sprite);
    } else if (rightKeyIsDown) {
      updateRotationSpeed(ROTATION_DIRECTION.RIGHT, delta, sprite);
    }

    if (upKeyIsDown) {
      const accelerationX = ACCELERATION * Math.cos(sprite.rotation);
      const accelerationY = ACCELERATION * Math.sin(sprite.rotation);

      sprite.velocity.x += accelerationX;
      sprite.velocity.y += accelerationY;
    } else if (downKeyIsDown) {
      applyDrag(sprite);
    }

    applyLateralFriction(sprite); // Apply lateral friction
    handleWallCollisions(sprite, wallList);

    applyDrag(sprite);
    rotationSpeed *= ROTATION_DRAG;
    sprite.rotation += rotationSpeed;
    sprite.velocity.x = clamp(sprite.velocity.x, -MAX_SPEED, MAX_SPEED);
    sprite.velocity.y = clamp(sprite.velocity.y, -MAX_SPEED, MAX_SPEED);
    sprite.x += sprite.velocity.x;
    sprite.y += sprite.velocity.y;
  });
};

const handleWallCollisions = (movingSprite: MovingSprite, walls: Sprite[]) => {
  walls.forEach((wall) => {
    if (checkCircularCollisionWithRectangle(movingSprite, wall)) {
      const collisionAngle = Math.atan2(
        wall.y - movingSprite.y,
        wall.x - movingSprite.x
      );

      // Calculate the opposite force based on the collision angle
      const oppositeForceX = Math.cos(collisionAngle) * ACCELERATION * 2;
      const oppositeForceY = Math.sin(collisionAngle) * ACCELERATION * 2;

      // Apply the opposite force to simulate hitting a wall
      movingSprite.velocity.x -= oppositeForceX;
      movingSprite.velocity.y -= oppositeForceY;

      // Optionally, you can add a rotation effect for a more realistic response
      // const rotationForce = Math.sign(rotationSpeed) * 0.02;
      // movingSprite.rotation += rotationForce;
    }
  });
};

const applyDrag = (sprite: MovingSprite): void => {
  sprite.velocity.x *= DRAG;
  sprite.velocity.y *= DRAG;
};

const applyLateralFriction = (sprite: MovingSprite): void => {
  sprite.velocity.x *= LATERAL_FRICTION;
  sprite.velocity.y *= LATERAL_FRICTION;
};

const updateRotationSpeed = (
  direction: number,
  delta: number,
  sprite: MovingSprite
): void => {
  if (direction === ROTATION_DIRECTION.LEFT) {
    rotationSpeed -= ROTATION_ACCELERATION * delta;
  } else if (direction === ROTATION_DIRECTION.RIGHT) {
    rotationSpeed += ROTATION_ACCELERATION * delta;
  }

  // Modify rotation speed based on sprite's speed
  const speed = Math.sqrt(
    sprite.velocity.x * sprite.velocity.x +
      sprite.velocity.y * sprite.velocity.y
  );
  const speedFactor = (speed / MAX_SPEED) * 10;
  rotationSpeed *= speedFactor;
  rotationSpeed = clamp(rotationSpeed, -MAX_ROTATION_SPEED, MAX_ROTATION_SPEED);
};
