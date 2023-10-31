import { Container, Point, Sprite, Text, TextStyle } from 'pixi.js';
import * as Constants from '../../Utils/Constants';
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
      fontFamily: 'Lacquer',
      fontSize: '5em'
    });

    this.header = new Text('Welcome\nPlease enjoy your stay.', headerStyle);

    sceneContainer.addChild(this.header);
    this.header.anchor.set(0.5, 0.5);
    this.updateDisplay();
  };
  /**
   * repositions visual elements when the browser is resized
   * @returns void
   */
  updateDisplay = (): void => {
    if (!this.app || !this.header || !this.playButton) {
      return;
    }

    this.header.x = this.app.renderer.width / 2;
    this.header.y = this.app.renderer.height * 0.2;
    this.header.style.wordWrap = true;
    this.header.style.wordWrapWidth = window.innerWidth - 50;
    const center = new Point(window.innerWidth / 2, window.innerHeight / 2);
    this.playButton.x = center.x;
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
