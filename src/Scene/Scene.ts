import { Application, Container, Sprite } from 'pixi.js';
import { SceneTransition } from '../Transition/Transition';
import { createBackButton } from '../Utils/CreateButton';
/**
 * Scene state enum, representing its lifecycle.
 */
export enum SceneState {
  LOAD,
  PROCESS,
  FINALIZE,
  DONE
}

/**
 * Base interface for all game scenes.
 */
export interface GameScene {
  sceneUpdate(delta: number): void;
}

/**
 * Base implementation of a scene. Provides lifecycle update logic.
 */
export abstract class AbstractGameScene implements GameScene {
  protected sceneState: SceneState;
  protected app: Application;
  protected sceneSwitcher: (sceneName: string) => void;
  private fadeInSceneTransition: SceneTransition;
  private fadeOutSceneTransition: SceneTransition;
  protected sceneContainer: Container;
  protected backButton: Sprite;

  /**
   * fade in the scene
   * @param fadeInSceneTransition - a {@link SceneTransition} object that controls the fade in transition
   */
  set fadeInTransition(fadeInSceneTransition: SceneTransition) {
    this.fadeInSceneTransition = fadeInSceneTransition;
  }

  /**
   * fade out the scene
   * @param fadeOutSceneTransition - a {@link SceneTransition} object that controls the fade out transition
   */
  set fadeOutTransition(fadeOutSceneTransition: SceneTransition) {
    this.fadeOutSceneTransition = fadeOutSceneTransition;
  }

  /**
   * Basic initialization of a scene, passing in the APP
   * @param app - the {@link Application} for the project
   * @param sceneSwitcher - controls switching between scenes
   * @returns void
   */
  init = (
    app: Application,
    sceneSwitcher: (sceneName: string) => void
  ): void => {
    this.app = app;
    this.sceneSwitcher = sceneSwitcher;
  };

  /**
   * Update the current screen if the canvas size changes
   */
  abstract updateDisplay(): void;

  /**
   * Setup the scene for usage.
   * @param sceneContainer - the {@link Container} the scene uses
   * @returns void
   */
  public setup = (sceneContainer: Container): void => {
    this.backButton = createBackButton(this.sceneSwitcher, sceneContainer);
  };

  /**
   * Core scene update loop.
   * @param delta - the timeDelta applied each frame
   * @returns void
   */
  abstract sceneUpdate(delta: number): void;

  /**
   * Core scene tear down.
   @returns void
   */
  public close = (): void => {
    this.backButton.destroy();
    this.backButton = null;
  };

  /**
   * Scene lifecycle update loop.
   * @param delta - the timeDelta applied each frame
   * @returns void
   */
  update = (delta: number): void => {
    switch (this.sceneState) {
      case SceneState.LOAD:
        this.fadeInSceneTransition.update(delta, () => {
          this.sceneState = SceneState.PROCESS;
        });
        break;
      case SceneState.PROCESS:
        break;
      case SceneState.FINALIZE:
        this.fadeOutSceneTransition.update(delta, () => {
          this.sceneState = SceneState.DONE;
        });
        break;
    }

    this.sceneUpdate(delta);
  };

  /**
   * Sets the sceneState to SceneState.FINALIZE once setup is complete.
   * @returns void
   */
  setFinalizing = (): void => {
    this.sceneState = SceneState.FINALIZE;
  };
}
