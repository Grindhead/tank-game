import { Container, Point, Sprite, Texture } from 'pixi.js';
import { createButton } from '../../Utils/CreateButton';
import { AbstractGameScene, SceneState } from '../Scene';
import levelData from '../../Resources/JSON/staticMaze.json';

type SpriteType = 1 | 2;

/**
 * the GameScreen class
 */
export class GameScreen extends AbstractGameScene {
  /**
   * an array of all the rocks displayed
   */
  private rocksList: Sprite[];

  /**
   * an array of all the hay bales displayed
   */
  private hayList: Sprite[];

  /**
   * the player tank sprite
   */
  private player: Sprite;

  /**
   * sets up the scene
   * @param sceneContainer - the Container for the scene
   * @returns void
   */
  setup = (sceneContainer: Container): void => {
    //const center = new Point(window.innerWidth / 2, window.innerHeight / 2);
    this.sceneContainer = sceneContainer;
    this.sceneState = SceneState.LOAD;

    this.createGrid();
    this.createPlayer();

    this.updateDisplay();
  };

  /**
   * creates the player sprite
   * @returns Sprite
   */
  createPlayer = () => {
    this.player = new Sprite(Texture.from('tank.png'));
    const center = new Point(window.innerWidth / 2, window.innerHeight / 2);
    this.player.x = center.x;
    this.player.y = center.y;
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
   * adds a button to the screen
   * @param name - the name of the button
   * @param x - the x position of the button
   * @param y - the y position of the button
   * @returns Sprite
   */
  addButton = (name: string, x: number, y: number): Sprite => {
    const button = createButton(name);
    button.addListener('pointerup', () => {
      this.sceneSwitcher(name);
    });
    button.x = x;
    button.y = y;

    this.sceneContainer.addChild(button);

    return button;
  };

  /**
   * closes the scene
   * @returns void
   */
  close = (): void => {
    if (this.sceneContainer) {
      this.sceneContainer.destroy();
      this.sceneContainer = null;

      this.hayList.forEach((hay) => {
        hay.destroy();
      });

      this.hayList = null;

      this.rocksList.forEach((rock) => {
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
    const gridXCount = 50,
      gridYCount = 50,
      tileWidth = 35,
      tileHeight = 35;
    const scale = Math.min(
      window.innerWidth / (gridXCount * tileWidth),
      window.innerHeight / (gridYCount * tileHeight)
    );
    const gridWidth = gridXCount * tileWidth * scale;
    const xPadding = (window.innerWidth - gridWidth) / 2;
    this.hayList = [];
    this.rocksList = [];
    const grid = levelData.data;
    grid.forEach((xData, i) => {
      xData.forEach((yData, j) => {
        const data = grid[i][j];

        const sprite = this.createSprite(data as SpriteType);
        sprite.scale.set(scale);
        sprite.x = xPadding + i * (tileWidth * scale);
        sprite.y = j * (tileHeight * scale);
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
      this.rocksList.push(sprite);
    } else if (spriteType === 2) {
      sprite = new Sprite(Texture.from('hay.png'));
      this.hayList.push(sprite);
    } else {
      sprite = new Sprite(Texture.from('tile.png'));
    }
    console.log('adding ', sprite, this.sceneContainer);
    this.sceneContainer.addChild(sprite);
    return sprite;
  };
}
