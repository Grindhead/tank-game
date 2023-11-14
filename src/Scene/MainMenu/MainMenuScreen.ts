import {
  Application,
  Container,
  Point,
  Sprite,
  Text,
  TextStyle
} from 'pixi.js';
import * as Constants from '../../Utils/Constants';
import { AbstractGameScene, SceneState, getScale } from 'midgar-pixi-tech';

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
   * Basic initialization of a scene, passing in the {@link Application} and {@link sceneSwitcher}
   * @param app - the {@link Application} for the project
   * @param sceneSwitcher - controls switching between scenes
   * @param sceneContainer - the {@link Container} the scene uses
   * @returns void
   */
  override init = (
    app: Application,
    sceneSwitcher: (sceneName: string) => void,
    sceneContainer: Container
  ): void => {
    super.init(app, sceneSwitcher, sceneContainer);
    const center = new Point(window.innerWidth / 2, window.innerHeight / 2);
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

    this.sceneContainer?.addChild(this.header);
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
    this.header.style.wordWrapWidth = Math.max(
      800 * getScale(),
      window.innerWidth - 20 * getScale()
    );

    this.playButton.x = center.x;
    this.playButton.y = center.y;
  };

  /**
   * updates the scene
   * @returns void
   */
  public override sceneUpdate = (): void => {};

  /**
   * closes the scene
   * @returns void
   */
  public close(): void {
    super.close();
    if (this.header) {
      this.header.destroy();
      this.header = null;

      this.playButton?.destroy();
      this.playButton = null;

      this.sceneContainer?.destroy();
      this.sceneContainer = null;
    }
  }
}
