import { Boot } from '@/scenes/Boot';
import { Game as MainGame } from '@/scenes/Game';
import { GameOver } from '@/scenes/GameOver';
import { Preloader } from '@/scenes/Preloader';
import { AUTO, Game } from 'phaser';

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Phaser.Types.Core.GameConfig = {
  type: AUTO,
  width: 1024, // 64 blocks x 16 pixels
  height: 256, // 16 blocks x 16 pixels
  parent: 'game-container',
  backgroundColor: '0xffffff',
  scene: [Boot, Preloader, MainGame, GameOver],
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
