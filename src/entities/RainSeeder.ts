export class RainSeeder extends Phaser.Physics.Arcade.Sprite {
  water: Phaser.Physics.Arcade.Group;
  seedCount: number = 1;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    water: Phaser.Physics.Arcade.Group,
  ) {
    super(scene, x, y, 'rain_seeder');
    scene.add.existing(this);
    this.water = water;
  }

  configure(): void {
    this.setBounce(0.75);
    this.setGravityY(600);
    this.setImmovable(true);
  }

  seed(): void {
    if (this.seedCount <= 0) return;
    // jump
    this.setVelocityY(-300);
    // start rain
    const createWaterDroplet = () => {
      const waterDroplet = this.water.create(
        Phaser.Math.Between(this.x - 500, this.x + 500),
        0,
        'water_droplet'
      );
      waterDroplet.setLifespan(1000);  // Set lifespan
      const velocityX = Phaser.Math.Between(-40, 40);
      const velocityY = Phaser.Math.Between(400, 800);
      waterDroplet.setVelocityX(velocityX);
      waterDroplet.setVelocityY(velocityY);
    };
    for (let i = 0; i < 6000; i++) {  // Uniformly distribute 6000 droplets over 3000ms
      this.scene.time.delayedCall(i * 3000/6000, createWaterDroplet);
    }
    this.seedCount--;
    this.setTint(0xff0000);
  }

  static preloadAssets(scene: Phaser.Scene): void {
    scene.load.setPath('assets/images');
    scene.load.image('rain_seeder', 'rain_seeder.png');
  }
}