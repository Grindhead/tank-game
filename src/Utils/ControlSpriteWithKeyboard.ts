import { clamp } from './Math';
import { MovingSprite } from './MovingSprite';

/**
 * The direction in which a sprite is rotating.
 */
enum ROTATION_DIRECTION {
  LEFT,
  RIGHT
}

/**
 * The maximum movement speed.
 */
const MAX_SPEED: number = 5;

/**
 * The max speed a sprite can rotate at.
 */
const MAX_ROTATION_SPEED: number = 0.02;

/**
 * The acceleration for sprite movement.
 */
const ACCELERATION: number = 0.2; // Increase acceleration for a more responsive feel

/**
 * The acceleration for sprite rotation.
 */
const ROTATION_ACCELERATION: number = 0.005; // Increase rotation acceleration

/**
 * The drag applied to the sprite each frame.
 */
const ROTATION_DRAG: number = 0.95; // Adjust rotation drag

/**
 * The drag applied to the sprite's velocity each frame.
 */
const DRAG: number = 0.94;

/**
 * An array of all the sprites to be controlled by the keyboard.
 */
let spriteList: MovingSprite[] = [];

/**
 * The speed at which the sprites are currently rotating.
 */
let rotationSpeed: number = 0;

/**
 * Is the left key down.
 */
let leftKeyIsDown: boolean = false;

/**
 * Is the right key down.
 */
let rightKeyIsDown: boolean = false;

/**
 * Is the up key down.
 */
let upKeyIsDown: boolean = false;

/**
 * Is the down key down.
 */
let downKeyIsDown: boolean = false;

/**
 * Add event listeners to handle keyboard input.
 * @returns - void
 */
export const addKeyboardListeners = (): void => {
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('keyup', handleKeyUp);
};

/**
 * Remove event listeners for keyboard input.
 * @returns - void
 */
const removeKeyboardListeners = (): void => {
  document.removeEventListener('keydown', handleKeyDown);
  document.removeEventListener('keyup', handleKeyUp);
};

/**
 * Handle key down events and update key states.
 * @param e - The KeyboardEvent.
 * @returns - void
 */
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

/**
 * Handle key up events and update key states.
 * @param e - The KeyboardEvent.
 * @returns - void
 */
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

/**
 * Add a sprite to be rotated and controlled with the keyboard.
 * @param sprite - The sprite to be controlled.
 * @returns - void
 */
export const addRotateSpriteWithKeyboard = (sprite: MovingSprite): void => {
  spriteList.push(sprite);
};

/**
 * Stop controlling and rotating sprites with the keyboard.
 * @returns - void
 */
export const stopRotatingSpritesWithKeyboard = (): void => {
  spriteList = [];
  removeKeyboardListeners();
};

/**
 * Update the movement and rotation of sprites based on keyboard input.
 * @param delta - The time delta.
 * @returns - void
 */
export const updateKeyboardMovement = (delta: number) => {
  spriteList.forEach((sprite) => {
    if (leftKeyIsDown) {
      updateRotationSpeed(ROTATION_DIRECTION.LEFT, delta);
    } else if (rightKeyIsDown) {
      updateRotationSpeed(ROTATION_DIRECTION.RIGHT, delta);
    }

    if (upKeyIsDown) {
      // Calculate acceleration in the direction of rotation
      const accelerationX = ACCELERATION * Math.cos(sprite.rotation);
      const accelerationY = ACCELERATION * Math.sin(sprite.rotation);

      sprite.velocity.x += accelerationX;
      sprite.velocity.y += accelerationY;
    } else if (downKeyIsDown) {
      applyBrake(sprite); // Apply braking when the down key is pressed
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

/**
 * Apply drag to the sprite's velocity.
 * @param sprite - The sprite to apply drag to.
 * @returns - void
 */
const applyDrag = (sprite: MovingSprite): void => {
  sprite.velocity.x *= DRAG;
  sprite.velocity.y *= DRAG;
};

/**
 * Apply braking to slow down the sprite's velocity when the down key is pressed.
 * @param sprite - The sprite to apply braking to.
 * @returns - void
 */
const applyBrake = (sprite: MovingSprite): void => {
  if (
    Math.abs(sprite.velocity.x) >= 0.1 ||
    Math.abs(sprite.velocity.y) >= 0.1
  ) {
    // Apply braking to slow down when the down key is pressed
    sprite.velocity.x *= 0.9; // Adjust the braking factor for desired behavior
    sprite.velocity.y *= 0.9;
  } else {
    sprite.velocity.x = 0;
    sprite.velocity.y = 0;
  }
};

/**
 * Update the rotation speed of the sprite.
 * @param direction - The direction of rotation (LEFT or RIGHT).
 * @param delta - The time delta.
 * @returns - void
 */
const updateRotationSpeed = (direction: number, delta: number): void => {
  if (direction === ROTATION_DIRECTION.LEFT) {
    rotationSpeed -= ROTATION_ACCELERATION * delta;
  } else if (direction === ROTATION_DIRECTION.RIGHT) {
    rotationSpeed += ROTATION_ACCELERATION * delta;
  }

  rotationSpeed = clamp(rotationSpeed, -MAX_ROTATION_SPEED, MAX_ROTATION_SPEED);
};
