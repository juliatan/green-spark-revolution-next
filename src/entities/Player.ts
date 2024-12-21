export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player');
    this.init();
    this.createAnimations();
  }

  private init(): void {
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.setBounce(0.2);
    this.setCollideWorldBounds(true);
  }

  private createAnimations(): void {
    this.scene.anims.create({
      key: 'playerIsStill',
      frames: [{ key: 'player', frame: 8 }],
      frameRate: 20,
    });

    this.scene.anims.create({
      key: 'playerMoveLeft',
      frames: this.scene.anims.generateFrameNumbers('player', {
        start: 0,
        end: 7,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.scene.anims.create({
      key: 'playerMoveRight',
      frames: this.scene.anims.generateFrameNumbers('player', {
        start: 8,
        end: 15,
      }),
      frameRate: 10,
      repeat: -1,
    });
  }

  update(cursors: Phaser.Types.Input.Keyboard.CursorKeys): void {
    if (cursors.left.isDown) {
      this.setVelocityX(-160);
      this.anims.play('playerMoveLeft', true);
    } else if (cursors.right.isDown) {
      this.setVelocityX(160);
      this.anims.play('playerMoveRight', true);
    } else {
      this.setVelocityX(0);
      this.anims.play('playerIsStill');
    }

    if (cursors.up.isDown && this.body?.blocked.down) {
      this.setVelocityY(-130);
    }
  }
}