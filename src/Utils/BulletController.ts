import { Container, Texture } from 'pixi.js';
import { MovingSprite } from './MovingSprite';

/**
 * the life of the bullet
 */
const BULLET_LIFE: number = 100;

/**
 * the speed of the bullet in pixels
 */
const BULLET_SPEED: number = 10;

/**
 * the time it takes to reload
 */
const RELOAD_COOLDOWN: number = 10;

/**
 * time remaining until we have reloaded
 */
let reloadTime: number = 0;

/**
 * an array of all the bullets
 */
let BULLET_LIST: MovingSprite[] = [];

/**
 * create a moving bullet at an x and y location with a angle to set a velocity
 * @param x - the y position to create the bullet at
 * @param y - the x position to create the bullet at
 * @param angle - the angle in degrees
 * @returns {@link MovingSprite}
 */
export const createBullet = (
  x: number,
  y: number,
  angle: number,
  sceneContainer: Container
): MovingSprite | undefined => {
  if (reloadTime > 0) return;
  const bullet = new MovingSprite(Texture.from('hay.png'));
  bullet.x = x;
  bullet.y = y;
  bullet.anchor.set(0.5);

  const angleInRadians = angle * (Math.PI / 180);
  bullet.velocity.x = Math.cos(angleInRadians) * BULLET_SPEED;
  bullet.velocity.y = Math.sin(angleInRadians) * BULLET_SPEED;

  bullet.life = BULLET_LIFE;
  sceneContainer.addChild(bullet);
  BULLET_LIST.push(bullet);

  reloadTime = RELOAD_COOLDOWN;

  return bullet;
};

/**
 * update the position of each bullet
 * @param delta - the current time delta
 * @returns void
 */
export const updateBullets = (delta: number): void => {
  reloadTime -= delta;

  BULLET_LIST = BULLET_LIST.filter((bullet: MovingSprite) => {
    bullet.x += bullet.velocity.x * delta;
    bullet.y += bullet.velocity.y * delta;
    bullet.life! -= delta;

    if (bullet.life <= 0) {
      bullet.parent.removeChild(bullet);
      bullet.destroy();
    }

    return bullet.life > 0;
  });
};
