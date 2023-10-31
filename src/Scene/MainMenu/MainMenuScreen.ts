import { Container, Point, Sprite, Text, TextStyle } from 'pixi.js';
import * as Constants from '../../Utils/Constants';
import { getScale } from '../../Utils/getGameScale';
import { AbstractGameScene, SceneState } from '../Scene';

/**
 * the MainMenu class
 */
export class MainMenuScreen extends AbstractGameScene {
  /**
   * the text that appears as a header
   */
  private header: Text | null = null;

  /**
   * the play button
   */
  private playButton: Sprite | null = null;

  /**
   * sets up the scene
   * @param sceneContainer - the Container for the scene
   * @returns void
   */
  setup = (sceneContainer: Container): void => {
    const center = new Point(window.innerWidth / 2, window.innerHeight / 2);
    this.sceneContainer = sceneContainer;
    this.sceneState = SceneState.LOAD;
    this.playButton = this.addButton(
      Constants.PAGE_GAME,
      center.x,
      center.y + 105
    );

    const headerStyle: TextStyle = new TextStyle({
      align: 'center',
      dropShadow: true,
      fill: '0xff0000',
      fontFamily: 'Lacquer'
    });

    this.header = new Text('Welcome\nPlease enjoy your stay.', headerStyle);
    this.header.style.wordWrap = true;
    this.header.style.wordWrapWidth = 800 * getScale();
    sceneContainer.addChild(this.header);
    this.header.anchor.set(0.5, 0.5);
    this.updateDisplay();
  };
  /**
   * repositions visual elements when the browser is resized
   * @returns void
   */
  updateDisplay = (): void => {
    if (!this.header || !this.playButton) {
      return;
    }

    const center = new Point(window.innerWidth / 2, window.innerHeight / 2);
    this.header.x = center.x;
    this.header.y = window.innerHeight * 0.3;

    this.header.style.fontSize = Math.max(50 * getScale(), 24);

    this.playButton.x = center.x;
    this.playButton.y = center.y;
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
    if (this.header) {
      this.header.destroy();
      this.header = null;

      this.playButton?.destroy();
      this.playButton = null;

      this.sceneContainer?.destroy();
      this.sceneContainer = null;
    }
  };
}
