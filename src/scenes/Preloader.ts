import { Scene } from 'phaser';

export class Preloader extends Scene {
  constructor() {
    super('Preloader');
  }

  init() {
    // Any assets loaded in Boot Screen can be displayed here immediately
    //  A simple progress bar. This is the outline of the bar.
    // this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);
    //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
    // const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);
    //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
    // this.load.on('progress', (progress: number) => {
    //   //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
    //   bar.width = 4 + 460 * progress;
    // });
  }

  preload() {
    this.load.setPath('assets/images');

    this.load.image('tiles', 'tileset.png');
    this.load.image('bullet', 'bullet.png');

    this.load.spritesheet('player', 'player.png', {
      frameWidth: 50,
      frameHeight: 50,
    });
    this.load.spritesheet('robot', 'robot.png', {
      frameWidth: 75,
      frameHeight: 75,
    });
  }

  create() {
    //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
    //  For example, you can define global animations here, so we can use them in other scenes.

    this.scene.start('Game');
  }
}
