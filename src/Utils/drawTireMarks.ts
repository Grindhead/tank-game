import { Graphics, Sprite } from 'pixi.js';

type TireMark = {
  x: number;
  y: number;
  rotation: number;
  width: number;
  alpha: number;
};

/**
 * an array of the tire marks drawn each frame
 */
let tireMarkList: TireMark[] = [];

/**
 * Draw a tire mark behind a sprite.
 *
 * @param graphics - The PIXI Graphics object to draw the tire mark on.
 * @param sprite - The Sprite to target.
 * @returns void
 */
export const drawTireMark = (graphics: Graphics, sprite: Sprite): void => {
  const tireMarkColor = 0x473131;
  const offset = sprite.width * 0.2;
  const circleRadius = sprite.width * 0.05;

  const position1X =
    sprite.x - Math.cos(sprite.rotation + Math.PI / 2) * offset;
  const position1Y =
    sprite.y - Math.sin(sprite.rotation + Math.PI / 2) * offset;

  const position2X =
    sprite.x - Math.cos(sprite.rotation - Math.PI / 2) * offset;
  const position2Y =
    sprite.y - Math.sin(sprite.rotation - Math.PI / 2) * offset;

  graphics.lineStyle(0); // No outline
  graphics.beginFill(tireMarkColor, sprite.alpha);

  // Draw circles at the specified positions
  graphics.drawCircle(position1X, position1Y, circleRadius);
  graphics.drawCircle(position2X, position2Y, circleRadius);

  graphics.endFill();

  const data: TireMark = {
    x: sprite.x,
    y: sprite.y,
    rotation: sprite.rotation,
    width: sprite.width,
    alpha: 0.8
  };

  tireMarkList.push(data);
};

/**
 * Update and fade tire marks.
 *
 * @param graphics - The PIXI Graphics object with tire marks.
 * @param tireMarkFadeSpeed - The speed at which tire marks fade.
 * @param delta - The time delta.
 * @returns void
 */
export const updateTireMarks = (
  graphics: Graphics,
  tireMarkFadeSpeed: number,
  delta: number
): void => {
  graphics.clear();
  graphics.lineStyle(1);

  tireMarkList = tireMarkList.filter((mark) => {
    drawTireMark(graphics, mark as Sprite);
    mark.alpha -= tireMarkFadeSpeed * delta;
    return mark.alpha > 0;
  });
};
