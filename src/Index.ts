import './Resources/CSS/styles.css';
import { Application, Assets, Text } from 'pixi.js';
import Stats from 'stats.js';
import * as Constants from './Utils/Constants';
import { loadWithRetry, once, waitForFont } from './Utils/Startup';
import { MainMenuScreen } from './Scene/MainMenu/MainMenuScreen';
import { GameScreen } from './Scene/Game/GameScreen';
import {
  Engine,
  SimpleFadeTransition,
  getScale,
  setScale
} from 'midgar-pixi-tech';

/**
 * text to display while loading is in progress
 */
let loadingText: Text | null;

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

/**
 * how long to wait for the web font before starting with a fallback font
 */
const FONT_TIMEOUT_MS: number = 3000;

/**
 * the font stack used for loading text, with a fallback if Lacquer is blocked
 */
const LOADING_FONT: string = 'Lacquer, sans-serif';

/**
 * setup the application. Guarded so only one {@link Engine} and one ticker
 * listener are ever created, even if loading is retried.
 */
const setup = once(() => {
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
});

/**
 * the DOM element used to report a load failure; plain HTML so it works even
 * when the font or atlas could not be loaded
 */
let errorPanel: HTMLDivElement | null = null;

/**
 * show or update the load failure panel with a retry button
 * @param retry - retries the load
 * @returns void
 */
const showLoadError = (retry: () => void): void => {
  if (!errorPanel) {
    errorPanel = document.createElement('div');
    errorPanel.id = 'load-error';
    errorPanel.setAttribute('role', 'alert');
    document.body.appendChild(errorPanel);
  }
  errorPanel.textContent = '';

  const message = document.createElement('p');
  message.textContent =
    'The game assets (atlas.json / atlas.png) could not be loaded. ' +
    'Check your connection and try again.';
  errorPanel.appendChild(message);

  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = 'Retry';
  button.addEventListener('click', () => {
    button.disabled = true;
    button.textContent = 'Retrying...';
    retry();
  });
  errorPanel.appendChild(button);
};

/**
 * remove the load failure panel if it is showing
 * @returns void
 */
const hideLoadError = (): void => {
  errorPanel?.remove();
  errorPanel = null;
};

/**
 * show the loading text, load the atlas and start the game
 * @returns void
 */
const start = (): void => {
  loadingText = new Text('Loading...', {
    fontFamily: LOADING_FONT,
    fontSize: 50 * getScale() + 'px',
    align: 'center'
  });
  app.stage.addChild(loadingText);
  loadingText.x = window.innerWidth / 2 - loadingText.width / 2;
  loadingText.y = window.innerHeight / 2 - loadingText.height / 2;

  loadWithRetry({
    // Assets caches a failed promise per url, so retries use a fresh url
    load: (attempt) =>
      Assets.load(attempt === 0 ? 'atlas.json' : `atlas.json?retry=${attempt}`),
    onLoaded: () => {
      hideLoadError();
      if (loadingText) {
        app.stage.removeChild(loadingText);
      }
      loadingText?.destroy();
      loadingText = null;
      setup();
    },
    onError: (error, retry) => {
      console.error('Failed to load the texture atlas', error);
      if (loadingText) {
        loadingText.text = 'Loading failed';
        loadingText.x = window.innerWidth / 2 - loadingText.width / 2;
      }
      showLoadError(() => {
        if (loadingText) {
          loadingText.text = 'Loading...';
          loadingText.x = window.innerWidth / 2 - loadingText.width / 2;
        }
        retry();
      });
    }
  });
};

/**
 * load the webfont from google, then start. If the font loader is blocked,
 * errors, or takes too long, the game starts anyway with a fallback font.
 */
waitForFont(
  (done) => {
    // eslint-disable-next-line
    // @ts-ignore
    window.WebFontConfig = {
      google: {
        families: ['Lacquer']
      },
      active: done,
      inactive: done
    };

    const wf = document.createElement('script');
    wf.src = `${
      document.location.protocol === 'https:' ? 'https' : 'http'
    }://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js`;
    wf.type = 'text/javascript';
    wf.async = true;
    wf.onerror = done;
    const s = document.getElementsByTagName('script')[0];
    if (s?.parentNode) {
      s.parentNode.insertBefore(wf, s);
    } else {
      document.head.appendChild(wf);
    }
  },
  start,
  FONT_TIMEOUT_MS
);
