import { InputManager } from "@/managers/InputManager";

enum PlayerDirection {
  Left,
  Right
}

export class Player extends Phaser.Physics.Arcade.Sprite {
  playerDirection: PlayerDirection = PlayerDirection.Right;
  inputManager: InputManager;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player_spritesheet');
    this.init();
    this.createAnimations();
    this.inputManager = new InputManager(scene);
  }

  private init(): void {
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.setBounce(0.0);
    this.setCollideWorldBounds(true);
  }

  private createAnimations(): void {
    this.scene.anims.create({
      key: 'playerIsStillFacingLeft',
      frames: [{ key: 'player_spritesheet', frame: 7 }],
    });

    this.scene.anims.create({
      key: 'playerIsStillFacingRight',
      frames: [{ key: 'player_spritesheet', frame: 8 }],
    });

    this.scene.anims.create({
      key: 'playerMoveLeft',
      frames: this.scene.anims.generateFrameNumbers('player_spritesheet', {
        start: 0,
        end: 7,
      }),
      frameRate: 10,  // Should depend on velocity and framesize - if jittery, add more frames
      repeat: -1,
    });

    this.scene.anims.create({
      key: 'playerMoveRight',
      frames: this.scene.anims.generateFrameNumbers('player_spritesheet', {
        start: 8,
        end: 15,
      }),
      frameRate: 10,  // Should depend on velocity and framesize - if jittery, add more frames
      repeat: -1,
    });
  }

  update(): void {
    const isGrounded = this.body?.blocked.down;

    if (this.inputManager.isKeyPressed('ArrowLeft')) {
      this.anims.play('playerMoveLeft', true);
      this.playerDirection = PlayerDirection.Left;
      if (isGrounded) this.setVelocityX(-160);
    } else if (this.inputManager.isKeyPressed('ArrowRight')) {
      this.anims.play('playerMoveRight', true);
      this.playerDirection = PlayerDirection.Right;
      if (isGrounded) this.setVelocityX(160);
    } else {
      if (this.playerDirection === PlayerDirection.Left) {
        this.anims.play('playerIsStillFacingLeft');
      } else {
        this.anims.play('playerIsStillFacingRight');
      }
      if (isGrounded) this.setVelocityX(0);
    }

    if (this.inputManager.isKeyPressed('ArrowUp')) {
      if (isGrounded) this.setVelocityY(-500);
    }
  }

  static preloadAssets(scene: Phaser.Scene): void {
    scene.load.setPath('assets/images');
    scene.load.spritesheet('player_spritesheet', 'player_spritesheet.png', {
      frameWidth: 48,
      frameHeight: 48,
    });
  }
}