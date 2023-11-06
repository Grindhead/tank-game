import { Application, Container } from 'pixi.js';
import { AbstractGameScene } from '../Scene/Scene';
import { SceneTransition, TransitionType } from '../Transition/Transition';
import { setScale } from '../Utils/getGameScale';
import * as Constants from '../Utils/Constants';

/**
 * Scene wrapper interface.
 */
export interface SceneSettings {
  /**
   * The index of the scene
   */
  index: number;

  /**
   * The name of the scene
   */
  name?: string;

  /**
   * a reference to the current {@link AbstractGameScene} instance
   */
  gameScene: AbstractGameScene;

  /**
   * the current fade in {@link SceneTransition} instance
   */
  fadeInTransition: SceneTransition;

  /**
   * the current fade out {@link SceneTransition} instance
   */
  fadeOutTransition: SceneTransition;
}

/**
 * Manages game scenes.
 */
export class Engine {
  /**
   * the {@link SceneSettings} instance
   */
  private sceneSettings: SceneSettings[];

  /**
   * the current {@link Application}
   */
  private app: Application;

  /**
   * the current {@link SceneSettings}
   */
  private currentScene: SceneSettings;

  /**
   * an engine to control what screen to show
   * @param app - the current {@link Application}
   * @param scenes - an array of {@link SceneSettings}
   */
  constructor(app: Application, scenes: SceneSettings[]) {
    this.app = app;
    this.sceneSettings = scenes;

    // Finding the scene with the lowest index
    this.currentScene = scenes.reduce(
      (prev: SceneSettings, curr: SceneSettings) => {
        if (prev === undefined) {
          return curr;
        } else {
          return prev.index > curr.index ? curr : prev;
        }
      }
    );

    this.setupScene(this.currentScene);
    window.addEventListener('resize', this.onresize);
  }

  /**
   * Scene switching mechanism. Finalizes the current scene and sets up
   * the target scene.
   * @param sceneName - the name of the scene to display
   * @returns void
   */
  sceneSwitcher = (sceneName: string): void => {
    const scene = this.sceneSettings.find((sceneSettings) => {
      return sceneSettings.name === sceneName;
    });

    if (scene) {
      this.setupScene(scene);
      this.currentScene = scene;
    } else {
      console.error('SCENE NOT FOUND: ' + sceneName);
    }
  };

  /**
   * Adds a scene to the APP.STAGE, removing all previous children.
   * @param sceneSettings - the {@link SceneSettings} the scene needs to use
   * @returns void
   */
  setupScene(sceneSettings: SceneSettings): void {
    this.app.stage.removeChildren();

    // close the current scene if we have one
    if (this.currentScene) {
      this.currentScene.gameScene.close();
    }

    const sceneContainer = new Container();
    this.app.stage.addChild(sceneContainer);

    const gameScene: AbstractGameScene = sceneSettings.gameScene;

    sceneSettings.fadeInTransition.init(TransitionType.FADE_IN, sceneContainer);

    gameScene.init(this.app, this.sceneSwitcher);
    gameScene.setup(sceneContainer);

    sceneSettings.fadeOutTransition.init(
      TransitionType.FADE_OUT,
      sceneContainer
    );

    gameScene.fadeInTransition = sceneSettings.fadeOutTransition;
    gameScene.fadeOutTransition = sceneSettings.fadeInTransition;
  }

  /**
   * Resize the canvas to the size of the window
   * @returns void
   */
  onresize = (): void => {
    this.app.view.width = window.innerWidth;
    this.app.view.height = window.innerHeight;

    setScale(
      Constants.GRID_X_COUNT * Constants.TILE_WIDTH,
      Constants.GRID_Y_COUNT * Constants.TILE_HEIGHT
    );

    this.app.renderer.resize(this.app.view.width, this.app.view.height);
    this.currentScene.gameScene.updateDisplay();
  };

  /**
   * APP update loop.
   * @param delta - the deltaTime the game uses
   * @returns void
   */
  update(delta: number): void {
    this.currentScene.gameScene.update(delta);
  }
}
