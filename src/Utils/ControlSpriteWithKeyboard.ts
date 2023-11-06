import { clamp } from './Math';
import { MovingSprite } from './MovingSprite';

/**
 * the direction in which a sprite is rotating
 */
enum ROTATION_DIRECTION {
  LEFT,
  RIGHT
}

/**
 * the max speed a sprite can rotate at
 */
const MAX_ROTATION_SPEED: number = 0.12;

/**
 * the speed at which a sprites accelteration increases
 */
const ROTATION_ACCELERATION: number = 0.005;

/**
 * the speed at which a sprites rotation decreases
 */
const ROTATION_DRAG: number = 0.92;

/**
 * the speed at which a sprite will accelerate each frame
 */
const ACCELERATION: number = 0.1;

/**
 * drag applied to the sprite each frame
 */
const DRAG: number = 0.05;

/**
 * an array of all the sprites to be controlled by the keyboard
 */
let spriteList: MovingSprite[] = [];

/**
 * the speed at which the sprites are currently rotating
 */
let rotationSpeed: number = 0;

/**
 * is the left key down
 */
let leftKeyIsDown: boolean = false;

/**
 * is the right key down
 */
let rightKeyIsDown: boolean = false;

/** is the up key down */
let upKeyIsDown: boolean = false;

/** is the down key down */
let downKeyIsDown: boolean = false;

/**
 * Listen for keyboard events and update key states.
 * @returns - void
 */
export const addKeyboardListeners = (): void => {
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('keyup', handleKeyUp);
};

/**
 * Remove keyboard events.
 * @returns - void
 */
const removeKeyboardListeners = (): void => {
  document.removeEventListener('keydown', handleKeyDown);
  document.removeEventListener('keyup', handleKeyUp);
};

/**
 * Handle key down events to update key states.
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
 * Handle key up events to update key states.
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
 * Add a sprite to be rotated each frame.
 * @param sprite - The sprite to rotate each frame.
 * @returns - void
 */
export const addRotateSpriteWithKeyboard = (sprite: MovingSprite): void => {
  spriteList.push(sprite);
};

/**
 * Removes the event listener for mouse movement.
 * @returns - void
 */
export const stopRotatingSpritesWithKeyboard = (): void => {
  spriteList = [];
  removeKeyboardListeners();
};

/**
 * Updates and rotates an array of sprites based on keyboard input
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
      sprite.velocity.x += ACCELERATION * delta;
    } else if (downKeyIsDown) {
      sprite.velocity.x -= ACCELERATION * delta;
    }

    if (Math.abs(sprite.velocity.x) >= 0.1) {
      sprite.velocity.x -= DRAG;
    } else {
      sprite.velocity.x = 0;
    }

    rotationSpeed *= ROTATION_DRAG;
    sprite.rotation += rotationSpeed;
  });
};

/**
 * rotate all sprites based on keyboard input (WASD or arrows)
 * @param direction - the {@link ROTATION_DIRECTION} to update the {@link rotationSpeed}
 * @param delta  - the current time delta
 * @returns - void
 */
const updateRotationSpeed = (direction: number, delta: number): void => {
  if (direction === ROTATION_DIRECTION.LEFT) {
    rotationSpeed -= ROTATION_ACCELERATION * delta;
  } else if (direction === ROTATION_DIRECTION.RIGHT) {
    rotationSpeed += ROTATION_ACCELERATION * delta;
  } else {
    throw new Error('Sprite rotation direction not recognised: ' + direction);
  }

  rotationSpeed = clamp(rotationSpeed, -MAX_ROTATION_SPEED, MAX_ROTATION_SPEED);
};
