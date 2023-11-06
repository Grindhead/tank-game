import { clamp } from './Math';
import { MovingSprite } from './MovingSprite';

enum ROTATION_DIRECTION {
  LEFT,
  RIGHT
}

const MAX_SPEED: number = 5;
const MAX_ROTATION_SPEED: number = 0.02;
const ACCELERATION: number = 0.1; // Increase acceleration for a more responsive feel
const ROTATION_ACCELERATION: number = 0.01; // Increase rotation acceleration
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

export const addRotateSpriteWithKeyboard = (sprite: MovingSprite): void => {
  spriteList.push(sprite);
};

export const stopRotatingSpritesWithKeyboard = (): void => {
  spriteList = [];
  removeKeyboardListeners();
};

export const updateKeyboardMovement = (delta: number) => {
  spriteList.forEach((sprite) => {
    if (leftKeyIsDown) {
      updateRotationSpeed(ROTATION_DIRECTION.LEFT, delta);
    } else if (rightKeyIsDown) {
      updateRotationSpeed(ROTATION_DIRECTION.RIGHT, delta);
    }

    if (upKeyIsDown) {
      const accelerationX = ACCELERATION * Math.cos(sprite.rotation);
      const accelerationY = ACCELERATION * Math.sin(sprite.rotation);

      sprite.velocity.x += accelerationX;
      sprite.velocity.y += accelerationY;
    } else if (downKeyIsDown) {
      applyDrag(sprite);
    } else {
      applyLateralFriction(sprite); // Apply lateral friction when no acceleration is applied
    }

    applyDrag(sprite);
    rotationSpeed *= ROTATION_DRAG;
    sprite.rotation += rotationSpeed;
    sprite.velocity.x = clamp(sprite.velocity.x, -MAX_SPEED, MAX_SPEED);
    sprite.velocity.y = clamp(sprite.velocity.y, -MAX_SPEED, MAX_SPEED);
    sprite.x += sprite.velocity.x;
    sprite.y += sprite.velocity.y;
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

const updateRotationSpeed = (direction: number, delta: number): void => {
  if (direction === ROTATION_DIRECTION.LEFT) {
    rotationSpeed -= ROTATION_ACCELERATION * delta;
  } else if (direction === ROTATION_DIRECTION.RIGHT) {
    rotationSpeed += ROTATION_ACCELERATION * delta;
  }

  rotationSpeed = clamp(rotationSpeed, -MAX_ROTATION_SPEED, MAX_ROTATION_SPEED);
};
