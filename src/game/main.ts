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
   width: 1024, // 64 blocks x 16 pixels
   height: 256, // 16 blocks x 16 pixels
  //   height: 768,
  //   width: 4096,
//   width: 171,
//   height: 160,
//   zoom: 3, // Since we're working with 16x16 pixel tiles, let's scale up the canvas by 3x
//   pixelArt: true, // Force the game to scale images up crisply
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
