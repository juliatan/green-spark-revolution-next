import { Player } from '@/entities/Player';
import { RainSeeder } from '@/entities/RainSeeder';
import { Robot } from '@/entities/Robot';
import { WaterDroplet } from '@/entities/WaterDroplet';
import { LevelManager } from '@/managers/LevelManager';
import { Scene } from 'phaser';

export class Preloader extends Scene {
  constructor() {
    super('Preloader');
  }

  init() {
    //  A simple progress bar. This is the outline of the bar.
    this.add.rectangle(384, 240, 468, 32).setStrokeStyle(1, 0xffffff);

    // Add "Loading Assets..." text above the progress bar.
    const loadingText = this.add.text(384, 200, 'Loading Assets...', {
      fontFamily: 'Arial', fontSize: 16, color: '#ffffff',
    });
    loadingText.setOrigin(0.5); // Center the text horizontally and vertically.

    //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
    const bar = this.add.rectangle(384 - 230, 240, 4, 28, 0xffffff);

    //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
    this.load.on('progress', (progress: number) => {

      //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
      bar.width = 4 + (460 * progress);

    });
  }

  preload() {
    LevelManager.preloadAssets(this);
    WaterDroplet.preloadAssets(this);
    Player.preloadAssets(this);
    Robot.preloadAssets(this);
    RainSeeder.preloadAssets(this);
  }

  create() {
    //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
    //  For example, you can define global animations here, so we can use them in other scenes.

    this.time.delayedCall(500, () => {  // So that quick progress bar doesn't feel like a bug
      this.scene.start('MainGame');
    });
  }
}
