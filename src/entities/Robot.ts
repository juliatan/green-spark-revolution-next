export class Robot extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'robot_spritesheet');
    scene.add.existing(this);
    scene.physics.add.existing(this);
  }

  public configure(): void {
    this.setBounce(0.0);
    this.setImmovable(true);
    this.setCollideWorldBounds(true);
    this.setVelocityX(-60); // automatically start walking
  }

  update(): void {
    if (this.body) {
      if (this.body.velocity.x > 0) {
        this.anims.play('robotMoveRight', true);
      } else if (this.body.velocity.x < 0) {
        this.anims.play('robotMoveLeft', true);
      }
    }
  }

  static preloadAssets(scene: Phaser.Scene): void {
    scene.load.setPath('assets/images');
    scene.load.spritesheet('robot_spritesheet', 'robot_spritesheet.png', {
      frameWidth: 48,
      frameHeight: 80,
    });
  }

  static createAnimations(scene: Phaser.Scene): void {
    scene.anims.create({
      key: 'robotMoveLeft',
      frames: scene.anims.generateFrameNumbers('robot_spritesheet', { start: 0, end: 7 }),
      frameRate: 10,
      repeat: -1,
    });

    scene.anims.create({
      key: 'robotMoveRight',
      frames: scene.anims.generateFrameNumbers('robot_spritesheet', { start: 8, end: 15 }),
      frameRate: 10,
      repeat: -1,
    });
  }
}
