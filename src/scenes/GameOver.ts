import { count } from 'console';
import { EventBus } from '@/game/EventBus';
import { Scene } from 'phaser';

export class GameOver extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  gameOverText: Phaser.GameObjects.Text;
  timerText: Phaser.GameObjects.Text;
  countdown: number;

  constructor() {
    super('GameOver');
  }

  create() {
    this.camera = this.cameras.main

    this.gameOverText = this.add.text(384, 240, 'Game Over', {
      fontFamily: 'Arial Black', fontSize: 64, color: '#000000',
      stroke: '#ffffff', strokeThickness: 8,
      align: 'center'
    }).setOrigin(0.5).setDepth(100);


    // Set restart timer
    this.countdown = 5;

    this.timerText = this.add.text(384, 300, `Restarting in: ${this.countdown}`, {
      fontFamily: 'Arial',
      fontSize: 16,
      color: '#ffffff',
      align: 'center'
    }).setOrigin(0.5).setDepth(100);


    this.time.addEvent({
      delay: 1000, // 1 second in milliseconds
      callback: this.changeScene,
      callbackScope: this,
      repeat: this.countdown - 1 // Repeat 4 times for a total of 5 seconds
    });

    EventBus.emit('current-scene-ready', this);
  }

  changeScene() {
    // Decrease countdown and update the timer text
    if (this.countdown > 1) {
      this.countdown--;
      this.timerText.setText(`Restarting in: ${this.countdown}`);
    } else {
      this.scene.start('MainGame');
    }
  }
}
