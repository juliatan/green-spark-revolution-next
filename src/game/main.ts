import { Boot } from '@/scenes/Boot';
import { MainGame } from '@/scenes/MainGame';
import { GameOver } from '@/scenes/GameOver';
import { Preloader } from '@/scenes/Preloader';
import { AUTO, Game } from 'phaser';

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Phaser.Types.Core.GameConfig = {
  type: AUTO,
  width: 768, // 48 blocks x 16 pixels
  height: 480, // 30 blocks x 16 pixels
  parent: 'game-container',
  scene: [Boot, Preloader, MainGame, GameOver],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 600 },
      debug: true,
      debugShowBody: true,
      debugShowStaticBody: true,
    },
  },
};

const StartGame = (parent: string) => {
  return new Game({ ...config, parent });
};

export default StartGame;
