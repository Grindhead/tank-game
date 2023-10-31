import './resources/css/styles.css';
import { Application, Assets, Text } from 'pixi.js';
import Stats from 'stats.js';
import { Engine } from './Engine/Engine';
import * as Constants from './Utils/Constants';
import { MainMenuScreen } from './Scene/MainMenu/MainMenuScreen';
import { SimpleFadeTransition } from './Transition/Transition';
import { GameScreen } from './Scene/Game/GameScreen';

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

/**
 * The {@link PIXI.Application} instance
 */
const app = new Application({
  antialias: true,
  width: window.innerWidth,
  height: window.innerHeight
});

document.body.appendChild(app.view as unknown as Node);

/**
 * setup the application
 */
const setup = () => {
  const engine: Engine = new Engine(app, [
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
  ]);

  app.ticker.add((delta) => {
    stats.begin();
    engine.update(delta);
    stats.end();
  });
};

/* eslint-disable */
// @ts-ignore
window.WebFontConfig = {
  google: {
    families: ['Lacquer']
  },
  active() {
    loadingText = new Text('Loading...', {
      fontFamily: 'Lacquer',
      fontSize: '5em',
      align: 'center'
    });
    app.stage.addChild(loadingText);
    loadingText.x = window.innerWidth / 2 - loadingText.width / 2;
    loadingText.y = window.innerHeight / 2 - loadingText.height / 2;

    Assets.load(['atlas.json']).then(() => {
      if (loadingText) {
        app.stage.removeChild(loadingText);
      }
      loadingText?.destroy();
      loadingText = null;
      setup();
    });
  }
};
/* eslint-enable */

/**
 * load the webfont from google
 * ignore the typescript errors
 */
(function () {
  const wf = document.createElement('script');
  wf.src = `${
    document.location.protocol === 'https:' ? 'https' : 'http'
  }://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js`;
  wf.type = 'text/javascript';
  wf.async = true;
  const s = document.getElementsByTagName('script')[0];
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  s.parentNode.insertBefore(wf, s);
})();
