import { init, Sprite, GameLoop, initPointer} from 'kontra';
import { SceneManager } from './scenemanager';
import { GameScene } from './scenes/gameScene';
import { MainScene } from './scenes/mainMenu';
import { GameOverScreen } from './scenes/gameover';

let { canvas, context } = init();
let sceneManager = SceneManager();
let gameScene = GameScene(sceneManager, 'game', canvas);
let mainScene = MainScene(sceneManager, 'game', canvas);
let gameOverScene = GameOverScreen(sceneManager, 'game', canvas);
sceneManager.add('game', gameScene);
sceneManager.add('menu', mainScene); 
sceneManager.add('gameover', gameOverScene);

let loop = GameLoop({
  update: () => {
    sceneManager.update();
  },
  render: () => {
    sceneManager.render();
  }
});

sceneManager.show('menu',);
initPointer();
loop.start();