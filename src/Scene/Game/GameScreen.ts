import { Container, Point, Sprite, Texture } from 'pixi.js';
import { AbstractGameScene, SceneState } from '../Scene';
import levelData from '../../Resources/JSON/staticMaze.json';
import { getScale } from '../../Utils/getGameScale';
import {
  GRID_X_COUNT,
  GRID_Y_COUNT,
  TILE_HEIGHT,
  TILE_WIDTH
} from '../../Utils/Constants';
import {
  addControlSpriteKeyboardListeners,
  addControlSpriteWithKeyboard,
  stopControllingAllSpritesWithKeyboard,
  updateKeyboardMovement
} from '../../Utils/ControlSpriteWithKeyboard';
import { GameSprite } from './GameSprite';
import { createBullet, updateBullets } from '../../Utils/BulletController';

/**
 * the type of sprite to create
 * 0 = empty
 * 1 = wall
 * 2 = hay
 */
type GridSpriteType = 0 | 1 | 2;

/**
 * the type of tank
 */
type TankType = 0 | 1 | 2;

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
   * an array of all the collision targets
   */
  private collisionTargetList: GameSprite[] | null = null;

  /**
   * the player tank sprite
   */
  private player: GameSprite | null = null;

  /**
   * the player spawn point
   */
  private spawnPoint: Point = new Point();

  /**
   * the full grid
   */
  private grid: Sprite[] | null = null;

  /**
   * the game scale
   */
  private scale: number = 0;

  /**
   * is the space button down
   */
  private isSpaceDown: boolean = false;

  /**
   * the current tank the player is using
   */
  private currentTankType: TankType = 0;

  /**
   * sets up the scene
   * @param sceneContainer - the Container for the scene
   * @returns void
   */
  setup = (sceneContainer: Container): void => {
    this.sceneContainer = sceneContainer;
    this.sceneState = SceneState.LOAD;

    this.sceneContainer.eventMode = 'dynamic';
    this.sceneContainer.cursor = 'none';

    this.scale = getScale();

    this.spawnPoint = new Point();
    this.createGrid();
    this.createPlayer();
    this.updateDisplay();
    addControlSpriteKeyboardListeners();

    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handleKeyUp);
  };

  handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === ' ') {
      this.isSpaceDown = true;
    } else if (e.key === 't') {
      this.changeTank();
    }
  };

  handleKeyUp = (e: KeyboardEvent) => {
    if (e.key === ' ') {
      this.isSpaceDown = false;
    }
  };

  changeTank = (): void => {
    this.currentTankType++;

    if (this.currentTankType > 2) {
      this.currentTankType = 0;
    }

    switch (this.currentTankType) {
      case 0:
        this.player!.tint = 0xff0000;
        break;

      case 1:
        this.player!.tint = 0x00ff00;
        break;

      case 2:
        this.player!.tint = 0x0000ff;
        break;

      default:
    }
  };

  /**
   * handle a player firing using the spacebar
   * @returns void
   */
  handleFire = (): void => {
    if (this.isSpaceDown) {
      createBullet(
        this.player!.x,
        this.player!.y,
        this.player!.angle,
        this.sceneContainer!
      );
    }
  };

  /**
   * creates the player sprite
   * @returns void
   */
  createPlayer = (): void => {
    this.player = new GameSprite(Texture.from('tank.png'));
    this.player.x = this.spawnPoint.x;
    this.player.y = this.spawnPoint.y;
    this.player.scale.set(this.scale * 4);
    this.player.anchor.set(0.5);
    this.sceneContainer!.addChild(this.player);
    this.player.tint = 0xff0000;
    addControlSpriteWithKeyboard(this.player);
  };

  /**
   * repositions visual elements when the browser is resized
   * @returns void
   */
  updateDisplay = (): void => {
    const gridWidth = GRID_X_COUNT * TILE_WIDTH * this.scale;
    const xPadding = (window.innerWidth - gridWidth) / 2;
    this.sceneContainer?.scale.set(this.scale);
    if (this.sceneContainer) this.sceneContainer.x = xPadding;
    this.spawnPoint.x *= this.scale;
    this.spawnPoint.y *= this.scale;
  };

  /**
   * updates the scene
   * @param delta - the time delta
   * @returns void
   */
  sceneUpdate = (delta: number): void => {
    updateKeyboardMovement(
      delta,
      this.collisionTargetList!,
      TILE_WIDTH * GRID_X_COUNT,
      TILE_HEIGHT * GRID_Y_COUNT
    );
    this.handleFire();
    this.collisionTargetList = updateBullets(
      delta,
      this.collisionTargetList!,
      TILE_WIDTH * GRID_X_COUNT,
      TILE_HEIGHT * GRID_Y_COUNT
    );
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

    stopControllingAllSpritesWithKeyboard();

    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('keyup', this.handleKeyUp);
  };

  /**
   * generates a 50x50 grid of 35x35 tiles of random hay bales and walls
   * @returns void
   */
  createGrid = (): void => {
    this.spawnPoint = new Point();
    this.grid = [];
    this.hayList = [];
    this.rocksList = [];
    this.collisionTargetList = [];
    const data = levelData.data;

    this.spawnPoint = new Point(150, 10);

    data.forEach((xData, i) => {
      xData.forEach((yData, j) => {
        const data = yData as GridSpriteType;
        const sprite = this.createSprite(data);
        sprite.x = i * TILE_WIDTH;
        sprite.y = j * TILE_HEIGHT;
        this.grid!.push(sprite);
      });
    });
  };

  /**
   * creates a new Sprite based on the type provided
   * @param spriteType - the {@link GridSpriteType} to return
   * @returns Sprite
   */
  createSprite = (spriteType: GridSpriteType): Sprite => {
    let sprite: GameSprite;
    if (spriteType === 1) {
      sprite = new GameSprite(Texture.from('rocks.png'));
      this.rocksList!.push(sprite);
      sprite.life = Infinity;
      this.collisionTargetList!.push(sprite);
    } else if (spriteType === 2) {
      sprite = new GameSprite(Texture.from('hay.png'));
      sprite.life = 100;
      this.hayList!.push(sprite);
      this.collisionTargetList!.push(sprite);
    } else {
      sprite = new GameSprite(Texture.from('tile.png'));
    }

    this.sceneContainer!.addChild(sprite);
    return sprite;
  };
}
