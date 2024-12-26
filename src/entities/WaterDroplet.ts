export class WaterDroplet extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'water_droplet');
    scene.add.existing(this);
    scene.physics.add.existing(this);
  }

  configure(): void {
    this.setBounce(0.0);
    this.setMass(0.000)
    console.log('water created')
  }

  static preloadAssets(scene: Phaser.Scene): void {
    scene.load.setPath('assets/images');
    scene.load.image('water_droplet', 'water_droplet.png');
  }
}
