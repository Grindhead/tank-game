import { Application, Container } from 'pixi.js';
import { AbstractGameScene } from '../Scene/Scene';
import { SceneTransition, TransitionType } from '../Transition/Transition';

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
  private app: Application;
  private currentScene: SceneSettings;

  constructor(app: Application, scenes: SceneSettings[]) {
    this.app = app;
    this.sceneSettings = scenes;
    this.sceneSettings.forEach((sceneSettings: SceneSettings) => {
      sceneSettings.gameScene.init(this.app, this.sceneSwitcher);
    });

    // Finding the scene with the lowest index
    this.currentScene = scenes.reduce((prev, curr) => {
      if (prev === undefined) {
        return curr;
      } else {
        return prev.index > curr.index ? curr : prev;
      }
    }, undefined);

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

    gameScene.setup(sceneContainer);

    sceneSettings.fadeInTransition.init(
      this.app,
      TransitionType.FADE_IN,
      sceneContainer
    );
    sceneSettings.fadeOutTransition.init(
      this.app,
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