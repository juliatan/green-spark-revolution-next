import { log } from "console";

export class WaterDroplet extends Phaser.Physics.Arcade.Sprite {
  private lifespan: number = 500; // Default lifespan in milliseconds
  private creationTime: number;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'water_particle');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.creationTime = scene.time.now;

  }

  configure(): void {
    this.setBounce(0.1);
    this.setMass(0.1);
  }

  setLifespan(lifespan: number): void {
    this.lifespan = lifespan;
    // Automatically destroy after lifespan
    this.scene.time.delayedCall(this.lifespan, () => {
      this.destroy();
    });
  }

  update(): void {
    const elapsed = this.scene.time.now - this.creationTime;
    const progress = Phaser.Math.Clamp(elapsed / this.lifespan, 0, 1);

    // Update alpha from 1 to 0
    this.setAlpha(1 - progress);

    // Update scale from 0.5 to 2
    this.setScale(0.5 + (2 - 0.5) * progress);
  }

  static preloadAssets(scene: Phaser.Scene): void {
    scene.load.setPath('assets/images');
    scene.load.image('water_particle', 'water_particle.png');
  }
}
