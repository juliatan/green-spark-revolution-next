export class Robot extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'robot_spritesheet');
    this.createAnimations();
  }

  public configure(): Robot {
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.setBounce(0.0);
    this.setImmovable(true);
    this.setCollideWorldBounds(true);
    this.setVelocityX(-60); // automatically start walking
    return this;
  }

  private createAnimations(): void {
    this.anims.create({
      key: 'robotMoveLeft',
      frames: this.anims.generateFrameNumbers('robot_spritesheet', { start: 0, end: 7 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'robotMoveRight',
      frames: this.anims.generateFrameNumbers('robot_spritesheet', { start: 8, end: 15 }),
      frameRate: 10,
      repeat: -1,
    });
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
}
