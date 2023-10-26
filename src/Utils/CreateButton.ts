import { Container, Graphics, Sprite, Text, TextStyle } from 'pixi.js';
import * as Constants from './Constants';

/**
 * creates a new button
 * @param text - the text to show
 * @returns a {@link Sprite}
 */
export const createButton = (text: string): Sprite => {
  const width = 150;
  const height = 50;

  const button: Sprite = new Sprite();
  const buttonBackground: Graphics = new Graphics();
  buttonBackground.beginFill(0xfff, 1);
  buttonBackground.drawRoundedRect(-width / 2, -height / 2, width, height, 50);
  buttonBackground.endFill();
  buttonBackground.cacheAsBitmap = true;

  button.addChild(buttonBackground);

  const style: TextStyle = new TextStyle({
    fill: '0xff0000',
    fontFamily: 'Lacquer',
    fontSize: '2em'
  });

  const textfield: Text = new Text(text, style);
  textfield.x = -textfield.width / 2;
  textfield.y = -textfield.height / 2;
  button.addChild(textfield);
  button.eventMode = 'dynamic';
  button.cursor = 'pointer';
  return button;
};

/**
 * Create and return a back button leading to the main menu
 * @returns a {@link Sprite} new back button
 */
export const createBackButton = (sceneSwitcher, parent: Container): Sprite => {
  const button: Sprite = createButton('back');
  button.x = 100;
  button.y = 60;

  button.addListener('pointerup', () => {
    sceneSwitcher(Constants.PAGE_MAIN_MENU);
  });

  return parent.addChild(button);
};
