import { startWithAssetRecovery } from './Utils/startup';
import './Resources/CSS/styles.css';
import { Application, Assets } from 'pixi.js';
import Stats from 'stats.js';
import * as Constants from './Utils/Constants';
import { MainMenuScreen } from './Scene/MainMenu/MainMenuScreen';
import { GameScreen } from './Scene/Game/GameScreen';
import {
  Engine,
  SimpleFadeTransition,
  setScale
} from 'midgar-pixi-tech';

/**
 * text to display while loading is in progress
 */


/**
 * Mr D00b stats for performance testing
 */
const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);
stats.dom.id = 'stats';

// set the internal scale of the game
setScale(
  Constants.GRID_X_COUNT * Constants.TILE_WIDTH,
  Constants.GRID_Y_COUNT * Constants.TILE_HEIGHT
);

/**
 * The {@link PIXI.Application} instance
 */
const app = new Application({
  antialias: true,
  width: window.innerWidth,
  height: window.innerHeight,
  resolution: window.devicePixelRatio,
  resizeTo: window
});

document.body.appendChild(app.view as unknown as Node);

const setup = () => {
  const engine: Engine = new Engine(
    app,
    [
      {
        index: 0,
        name: Constants.PAGE_MAIN_MENU,
        gameScene: new MainMenuScreen(),
        fadeInTransition: new SimpleFadeTransition(0.1),
        fadeOutTransition: new SimpleFadeTransition()
      },
      {
        index: 1,
        name: Constants.PAGE_GAME,
        gameScene: new GameScreen(),
        fadeInTransition: new SimpleFadeTransition(0.1),
        fadeOutTransition: new SimpleFadeTransition()
      }
    ],
    Constants.GRID_X_COUNT * Constants.TILE_WIDTH,
    Constants.GRID_Y_COUNT * Constants.TILE_HEIGHT
  );

  app.ticker.add((delta) => {
    stats.begin();
    engine.update(delta);
    stats.end();
  });
};


startWithAssetRecovery({load: () => Assets.load(['atlas.json']), ready: setup, fontFamily: 'Lacquer'});
