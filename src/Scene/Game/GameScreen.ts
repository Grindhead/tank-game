import { Container, Point, Sprite, Texture } from 'pixi.js';
import { AbstractGameScene, SceneState } from '../Scene';
import levelData from '../../Resources/JSON/staticMaze.json';
import { getScale } from '../../Utils/getGameScale';
import { GRID_X_COUNT, TILE_HEIGHT, TILE_WIDTH } from '../../Utils/Constants';
import {
  addRotateSpriteTowardsMouseSprite,
  stopRotatingSprites,
  updateSpriteRotation
} from '../../Utils/rotateSpriteTowardsMouse';
import {
  addMoveSpriteTowardsMouse,
  updateSpriteMovement
} from '../../Utils/moveSpriteTowardsMouse';

/**
 * the type of sprite to create
 * 0 = empty
 * 1 = wall
 * 2 = hay
 */
type SpriteType = 1 | 2;

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
    this.sceneContainer = sceneContainer;
    this.sceneState = SceneState.LOAD;

    this.spawnPoint = new Point();
    this.createGrid();
    this.createPlayer();
    this.updateDisplay();

    addRotateSpriteTowardsMouseSprite(this.player!);
    addMoveSpriteTowardsMouse(this.player!);
  };

  /**
   * creates the player sprite
   * @returns void
   */
  createPlayer = (): void => {
    this.player = new Sprite(Texture.from('tank.png'));
    this.player.x = this.spawnPoint.x;
    this.player.y = this.spawnPoint.y;
    this.player.scale.set(getScale());
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
   * @param delta - the time delta
   * @returns void
   */
  sceneUpdate = (delta: number): void => {
    // rotate the player
    updateSpriteRotation(delta, 0.01);
    // move the player
    updateSpriteMovement(delta, 0.1);
    // update bullets
    // check collisions
  };

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

    stopRotatingSprites();
  };

  /**
   * generates a 50x50 grid of 35x35 tiles of random hay bales and walls
   * @returns void
   */
  createGrid = (): void => {
    this.spawnPoint = new Point();
    const scale = getScale();
    const gridWidth = GRID_X_COUNT * TILE_WIDTH * scale;
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
        sprite.x = xPadding + i * (TILE_WIDTH * scale);
        sprite.y = j * (TILE_HEIGHT * scale);
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
