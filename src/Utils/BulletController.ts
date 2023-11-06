import { Container, Texture } from 'pixi.js';
import { GameSprite } from '../Scene/Game/GameSprite';
import { checkCircularCollisionWithRectangle } from './Math';

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
export const RELOAD_COOLDOWN: number = 10;

/**
 * time remaining until we have reloaded
 */
export let reloadTime: number = 0;

/**
 * an array of all the bullets
 */
let BULLET_LIST: GameSprite[] = [];

/**
 * create a moving bullet at an x and y location with a angle to set a velocity
 * @param x - the y position to create the bullet at
 * @param y - the x position to create the bullet at
 * @param angle - the angle in degrees
 * @param reload - does the player need to reload
 * @param damage - the damage the bullet deals to a target
 * @returns {@link MovingSprite}
 */
export const createBullet = (
  x: number,
  y: number,
  angle: number,
  sceneContainer: Container,
  reload: boolean,
  damage: number
): GameSprite | undefined => {
  if (reloadTime > 0) return;
  const bullet = new GameSprite(Texture.from('bullet.png'));
  bullet.x = x;
  bullet.y = y;
  bullet.anchor.set(0.5);
  bullet.angle = angle;
  const angleInRadians = angle * (Math.PI / 180);
  bullet.velocity.x = Math.cos(angleInRadians) * BULLET_SPEED;
  bullet.velocity.y = Math.sin(angleInRadians) * BULLET_SPEED;
  bullet.damage = damage;
  bullet.life = BULLET_LIFE;
  sceneContainer.addChildAt(bullet, 0);
  BULLET_LIST.push(bullet);

  if (reload) reloadTime = RELOAD_COOLDOWN;

  return bullet;
};

/**
 * update the position of each bullet
 * @param delta - the current time delta
 * @returns an array of {@link GameSprite}
 */
export const updateBullets = (
  delta: number,
  targetList: GameSprite[],
  gameWidth: number,
  gameHeight: number
): GameSprite[] => {
  reloadTime -= delta;

  BULLET_LIST = BULLET_LIST.filter((bullet: GameSprite) => {
    bullet.x += bullet.velocity.x * delta;
    bullet.y += bullet.velocity.y * delta;
    bullet.life! -= delta;

    targetList.forEach((target) => {
      if (checkCircularCollisionWithRectangle(bullet, target)) {
        bullet.life = 0;
        target.life -= 35;
      }
    });

    if (
      bullet.x <= 0 ||
      bullet.x >= gameWidth ||
      bullet.y < 0 ||
      bullet.y > gameHeight
    ) {
      bullet.life = 0;
    }

    if (bullet.life <= 0) {
      killSprite(bullet);
    }

    return bullet.life > 0;
  });

  targetList = targetList.filter((target) => {
    if (target.life <= 0) {
      killSprite(target);
    }

    return target.life > 0;
  });

  return targetList;
};

/**
 * destroys a sprite and remove it from the display list
 * @param sprite - the sprite to kill
 * @returns void
 */
const killSprite = (sprite: GameSprite): void => {
  sprite.parent.removeChild(sprite);
  sprite.destroy();
};
