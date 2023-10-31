import { Container, Point, Sprite, Texture } from 'pixi.js';
import { AbstractGameScene, SceneState } from '../Scene';
import levelData from '../../Resources/JSON/staticMaze.json';

/**
 * the type of sprite to create
 * 0 = empty
 * 1 = wall
 * 2 = hay
 */
type SpriteType = 1 | 2;

/**
 * the amount of colums in the grid
 */
const gridXCount: number = 50;

/**
 * the amount of rows in the grid
 */
const gridYCount: number = 50;

/**
 * the width of each grid tile in pixels
 */
const tileWidth: number = 35;

/**
 * the height of each grid tile in pixels
 */
const tileHeight: number = 35;

/**
 * the GameScreen class
 */
export class GameScreen extends AbstractGameScene {
  /**
   * an array of all the rocks displayed
   */
  private rocksList: Sprite[] | null = null;

  /**
   * an array of all the hay bales displayed
   */
  private hayList: Sprite[] | null = null;

  /**
   * the player tank sprite
   */
  private player: Sprite | null = null;

  /**
   * the player spawn point
   */
  private spawnPoint: Point = new Point();

  /**
   * sets up the scene
   * @param sceneContainer - the Container for the scene
   * @returns void
   */
  setup = (sceneContainer: Container): void => {
    //const center = new Point(window.innerWidth / 2, window.innerHeight / 2);
    this.sceneContainer = sceneContainer;
    this.sceneState = SceneState.LOAD;

    this.spawnPoint = new Point();
    this.createGrid();
    this.createPlayer();
    this.updateDisplay();
  };

  /**
   * creates the player sprite
   * @returns void
   */
  createPlayer = (): void => {
    const scale = getScale(gridXCount, gridYCount, tileWidth, tileHeight);
    this.player = new Sprite(Texture.from('tank.png'));
    this.player.x = this.spawnPoint.x;
    this.player.y = this.spawnPoint.y;
    this.player.scale.set(scale);
    this.sceneContainer?.addChild(this.player);
  };

  /**
   * repositions visual elements when the browser is resized
   * @returns void
   */
  updateDisplay = (): void => {
    //const center = new Point(window.innerWidth / 2, window.innerHeight / 2);
  };

  /**
   * updates the scene
   * @returns void
   */
  sceneUpdate = (): void => {};

  /**
   * closes the scene
   * @returns void
   */
  close = (): void => {
    if (this.sceneContainer) {
      this.sceneContainer.destroy();
      this.sceneContainer = null;

      this.hayList?.forEach((hay) => {
        hay.destroy();
      });

      this.hayList = null;

      this.rocksList?.forEach((rock) => {
        rock.destroy();
      });

      this.rocksList = null;
    }
  };

  /**
   * generates a 50x50 grid of 35x35 tiles of random hay bales and walls
   * @returns void
   */
  createGrid = (): void => {
    this.spawnPoint = new Point();
    const scale = getScale(gridXCount, gridYCount, tileWidth, tileHeight);
    const gridWidth = gridXCount * tileWidth * scale;
    const xPadding = (window.innerWidth - gridWidth) / 2;
    this.hayList = [];
    this.rocksList = [];
    const grid = levelData.data;

    grid.forEach((xData, i) => {
      xData.forEach((yData, j) => {
        const data = yData;
        // we can be sure that this data exists and is exported at this point
        const type = grid[i]![j] as SpriteType;
        const sprite = this.createSprite(type as SpriteType);
        sprite.scale.set(scale);
        sprite.x = xPadding + i * (tileWidth * scale);
        sprite.y = j * (tileHeight * scale);
        if (this.spawnPoint === null && data === 0) {
          this.spawnPoint = new Point(sprite.x, sprite.y);
        }
      });
    });
  };

  /**#
   * creates a new Sprite based on the type provided
   * @param spriteType - the {@link SpriteType} to return
   * @returns Sprite
   */
  createSprite = (spriteType: SpriteType): Sprite => {
    let sprite: Sprite;
    if (spriteType === 1) {
      sprite = new Sprite(Texture.from('rocks.png'));
      this.rocksList?.push(sprite);
    } else if (spriteType === 2) {
      sprite = new Sprite(Texture.from('hay.png'));
      this.hayList?.push(sprite);
    } else {
      sprite = new Sprite(Texture.from('tile.png'));
    }

    this.sceneContainer?.addChild(sprite);
    return sprite;
  };
}

/**
 * get the scale of the grid tiles and player
 *
 * @param gridXCount - the number of tiles on the x axis
 * @param gridYCount - the number of tiles on the y axis
 * @param tileWidth - the width of each tile
 * @param tileHeight - the height of each tile
 * @returns the calculated scale of each tile
 */
const getScale = (
  gridXCount: number,
  gridYCount: number,
  tileWidth: number,
  tileHeight: number
): number => {
  return Math.min(
    window.innerWidth / (gridXCount * tileWidth),
    window.innerHeight / (gridYCount * tileHeight)
  );
};
