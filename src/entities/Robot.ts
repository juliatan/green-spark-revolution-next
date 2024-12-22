export class Robot extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'robot');
    this.init();
    this.createAnimations();
    this.anims.play('robotMoveLeft', true);
  }

  private init(): void {
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.setBounce(0.2);
    this.setCollideWorldBounds(true);
    this.setVelocityX(-60); // automatically start walking
  }

  private createAnimations(): void {
    this.anims.create({
      key: 'robotMoveLeft',
      frames: this.anims.generateFrameNumbers('robot', { start: 0, end: 7 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'robotMoveRight',
      frames: this.anims.generateFrameNumbers('robot', { start: 8, end: 15 }),
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
}
