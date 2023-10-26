import { Application, Container, Graphics, Sprite } from 'pixi.js';

/**
 * transition types
 */
export enum TransitionType {
  FADE_OUT = 'hide_mask',
  FADE_IN = 'show_mask'
}

/**
 * Base interface for a scene transition.
 */
export interface SceneTransition {
  /**
   * Initializes the transition, can be called multiple times.
   * @param app - the {@link Application} the project uses
   * @param type - the {@link TransitionType} to use
   * @param sceneContainer - the {@link Container} the scenes use
   * @returns void
   */
  init(app: Application, type: TransitionType, sceneContainer: Container): void;

  /**
   * update the transition each frame
   * @param delta - the deltaTime between each frame
   * @param callback - a callback once the update is complete
   * @returns void
   */
  update(delta: number, callback: () => void): void;
}

/**
 * Simple transition that can fade into/out of black.
 */
export class SimpleFadeTransition implements SceneTransition {
  private app: Application;
  private type: TransitionType;
  private transitionSprite: Sprite;
  private updateStep: number;

  /**
   * a transition class
   * @param updateStep - deltaTime updateStep
   */
  constructor(updateStep: number = 0.01) {
    this.updateStep = updateStep;
  }

  /**
   * init the transition
   * @param app - the {@link Application} the game uses
   * @param type - the {@link TransitionType} the game uses
   * @param sceneContainer - the {@link Container} the game uses
   * @returns void
   */
  public init = (
    app: Application,
    type: TransitionType,
    sceneContainer: Container
  ): void => {
    this.app = app;
    this.type = type;
    this.createTransitionSprite(type);
    sceneContainer.addChild(this.transitionSprite);
  };

  /**
   * creates a sprite to fade the screen
   * @param type - the {@link TransitionType} the game uses
   * @returns void
   */
  private createTransitionSprite = (type: TransitionType): void => {
    const graphics = new Graphics();
    graphics.beginFill(0x000000);
    graphics.drawRect(0, 0, this.app.renderer.width, this.app.renderer.height);
    graphics.endFill();
    this.transitionSprite = new Sprite(
      this.app.renderer.generateTexture(graphics)
    );
    const alpha = type === TransitionType.FADE_OUT ? 1 : 0;
    this.transitionSprite.alpha = alpha;
  };

  /**
   * update the transition
   * @param delta - the deltaTime the game uses
   * @param callback - a callback once the update is complete
   * @returns void
   */
  update = (delta: number, callback: () => void): void => {
    switch (this.type) {
      case TransitionType.FADE_OUT:
        if (this.transitionSprite.alpha > 0) {
          this.transitionSprite.alpha -= this.updateStep * delta;
        } else {
          callback();
        }
        break;

      case TransitionType.FADE_IN:
        if (this.transitionSprite.alpha < 1) {
          this.transitionSprite.alpha += this.updateStep * delta;
        } else {
          callback();
        }
        break;
    }
  };
}
