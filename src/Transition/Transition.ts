import { Container, Graphics } from 'pixi.js';

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
   * @param type - the {@link TransitionType} to use
   * @param sceneContainer - the {@link Container} the scenes use
   * @returns void
   */
  init(type: TransitionType, sceneContainer: Container): void;

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
  private sceneContainer: Container | null = null;
  private type: TransitionType | null = null;
  private transitionSprite: Graphics | null = null;
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
   * @param type - the {@link TransitionType} the game uses
   * @param sceneContainer - the {@link Container} the game uses
   * @returns void
   */
  public init = (type: TransitionType, sceneContainer: Container): void => {
    this.type = type;
    this.sceneContainer = sceneContainer;
    this.createTransitionSprite(type);
    if (this.transitionSprite) {
      sceneContainer.addChild(this.transitionSprite);
    }
  };

  /**
   * creates a sprite to fade the screen
   * @param type - the {@link TransitionType} the game uses
   * @returns void
   */
  private createTransitionSprite = (type: TransitionType): void => {
    if (!this.sceneContainer) {
      throw new Error('App is not set in the current transition');
    }

    const graphics = new Graphics();
    graphics.beginFill(0x000000);
    graphics.drawRect(
      0,
      0,
      this.sceneContainer.width * 2,
      this.sceneContainer.height * 2
    );
    graphics.endFill();

    const alpha = type === TransitionType.FADE_OUT ? 1 : 0;
    graphics.alpha = alpha;

    this.transitionSprite = graphics;
  };

  /**
   * update the transition
   * @param delta - the deltaTime the game uses
   * @param callback - a callback once the update is complete
   * @returns void
   */
  update = (delta: number, callback: () => void): void => {
    if (!this.transitionSprite) {
      return;
    }

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
