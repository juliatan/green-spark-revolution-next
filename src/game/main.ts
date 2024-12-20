import { Boot } from '@/game/scenes/Boot';
import { Game as MainGame } from '@/game/scenes/Game';
import { GameOver } from '@/game/scenes/GameOver';
import { MainMenu } from '@/game/scenes/MainMenu';
import { Preloader } from '@/game/scenes/Preloader';
import { AUTO, Game } from 'phaser';

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Phaser.Types.Core.GameConfig = {
  type: AUTO,
  width: 1024,
  //   height: 768,
  //   width: 4096,
  height: 256,
  parent: 'game-container',
  backgroundColor: '0xffffff',
  scene: [Boot, Preloader, MainMenu, MainGame, GameOver],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 300 },
      debug: false,
    },
  },
};

const StartGame = (parent: string) => {
  return new Game({ ...config, parent });
};

export default StartGame;
