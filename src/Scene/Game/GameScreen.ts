import {
  Application,
  Container,
  Graphics,
  Point,
  Sprite,
  Texture
} from 'pixi.js';
import levelData from '../../Resources/JSON/staticMaze.json';
import {
  GRID_X_COUNT,
  GRID_Y_COUNT,
  PAGE_MAIN_MENU,
  TILE_HEIGHT,
  TILE_WIDTH
} from '../../Utils/Constants';
import {
  AbstractGameScene,
  GameSprite,
  SceneState,
  addControlSpriteKeyboardListeners,
  addControlSpriteWithKeyboard,
  createBullet,
  drawTireMark,
  getScale,
  stopControllingAllSpritesWithKeyboard,
  updateBullets,
  updateKeyboardMovement,
  updateTireMarks
} from 'midgar-pixi-tech';

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
 * the spread of the bullet firing angle
 */
const BULLET_SPREAD: number = 15;

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
   * the {@link Graphics} object to draw tire marks too
   */
  private tireMarks: Graphics | null = null;

  /**
   * Basic initialization of a scene, passing in the {@link Application} and {@link sceneSwitcher}
   * @param app - the {@link Application} for the project
   * @param sceneSwitcher - controls switching between scenes
   * @param sceneContainer - the {@link Container} the scene uses
   * @returns void
   */
  public override init = (
    app: Application,
    sceneSwitcher: (sceneName: string) => void,
    sceneContainer: Container
  ): void => {
    super.init(app, sceneSwitcher, sceneContainer);

    this.sceneState = SceneState.LOAD;

    this.scale = getScale();

    this.spawnPoint = new Point();
    this.createGrid();
    this.createTireMarks();
    this.createPlayer();
    this.updateDisplay();
    addControlSpriteKeyboardListeners();

    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handleKeyUp);

    this.createBackButton(PAGE_MAIN_MENU);
  };

  /**
   * create the {@link Graphics} used to draw the tire marks and add to the display list
   */
  createTireMarks = (): void => {
    this.tireMarks = new Graphics();
    this.sceneContainer!.addChild(this.tireMarks);
  };

  /**
   * handle a key down event
   * @param e - the {@link KeyboardEvent}
   * @returns void
   */
  handleKeyDown = (e: KeyboardEvent): void => {
    if (e.key === ' ') {
      this.isSpaceDown = true;
    } else if (e.key === 't') {
      this.changeTank();
    }
  };

  /**
   * handle a key up event
   * @param e - the {@link KeyboardEvent}
   * @returns void
   */
  handleKeyUp = (e: KeyboardEvent): void => {
    if (e.key === ' ') {
      this.isSpaceDown = false;
    }
  };

  /**
   * change the currently used tank
   * @returns void
   */
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
        this.player!.tint = 0x0000ff;
        break;

      case 2:
        this.player!.tint = 0x00ff00;
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
      if (this.currentTankType === 0) {
        createBullet(
          this.player!.x,
          this.player!.y,
          this.player!.angle - BULLET_SPREAD,
          this.sceneContainer!,
          false,
          10
        );

        createBullet(
          this.player!.x,
          this.player!.y,
          this.player!.angle + BULLET_SPREAD,
          this.sceneContainer!,
          true,
          10
        );
      } else if (this.currentTankType === 1) {
        createBullet(
          this.player!.x,
          this.player!.y,
          this.player!.angle,
          this.sceneContainer!,
          true,
          25
        );
      } else {
        createBullet(
          this.player!.x,
          this.player!.y,
          this.player!.angle,
          this.sceneContainer!,
          false,
          20
        );

        createBullet(
          this.player!.x,
          this.player!.y,
          this.player!.angle - BULLET_SPREAD,
          this.sceneContainer!,
          false,
          20
        );

        createBullet(
          this.player!.x,
          this.player!.y,
          this.player!.angle + BULLET_SPREAD,
          this.sceneContainer!,
          true,
          20
        );
      }
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
    drawTireMark(this.tireMarks!, this.player!);
    updateTireMarks(this.tireMarks!, 0.01, delta);
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
    super.close();
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
      sprite.alpha = 0.2;
    }

    this.sceneContainer!.addChild(sprite);
    return sprite;
  };
}
