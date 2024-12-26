import { InputManager } from "@/managers/InputManager";

enum PlayerDirection {
  Left,
  Right
}

export class Player extends Phaser.Physics.Arcade.Sprite {
  playerDirection: PlayerDirection;
  inputManager: InputManager;
  lastAttackTime: number; // Track the last attack time
  attackCooldown: number = 500; // Cooldown period in milliseconds
  water: Phaser.Physics.Arcade.Group;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    water: Phaser.Physics.Arcade.Group,
    direction: PlayerDirection = PlayerDirection.Right,
    ) {
    super(scene, x, y, 'player_spritesheet');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.inputManager = new InputManager(scene);
    this.playerDirection = direction;
    this.lastAttackTime = 0;
    this.water = water;
  }

  configure(): void {
    this.setBounce(0.0);
    this.setCollideWorldBounds(true);
  }

  update(): void {
    this.navigate();
    this.attack();
  }

  navigate(): void {
    const isGrounded = this.body?.blocked.down;
    if (this.inputManager.isKeyPressed('ArrowLeft')) {
      this.play('playerMoveLeft', true);
      this.playerDirection = PlayerDirection.Left;
      if (isGrounded) this.setVelocityX(-160);
    } else if (this.inputManager.isKeyPressed('ArrowRight')) {
      this.play('playerMoveRight', true);
      this.playerDirection = PlayerDirection.Right;
      if (isGrounded) this.setVelocityX(160);
    } else {
      if (this.playerDirection === PlayerDirection.Left) {
        this.play('playerIsStillFacingLeft');
      } else {
        this.play('playerIsStillFacingRight');
      }
      if (isGrounded) this.setVelocityX(0);
    }

    if (this.inputManager.isKeyPressed('ArrowUp')) {
      if (isGrounded) this.setVelocityY(-500);
    }
  }

  attack(): void {
    const currentTime = this.scene.time.now;
    // Watergun cannot attack continuously, so we need to check the cooldown
    if (this.inputManager.isKeyPressed('a') && currentTime - this.lastAttackTime > this.attackCooldown) {
      this.lastAttackTime = currentTime;
      console.log('Player attacks!');
      // create one water droplet at the player's position, players velocity is added to the droplet
      const waterDroplet = this.water.create(this.playerDirection === PlayerDirection.Left? this.x-24 : this.x + 24, this.y, 'water_droplet');
      waterDroplet.setVelocityX((this.body?.velocity.x || 0) + (this.playerDirection === PlayerDirection.Left ? -200 : 200));
    }
  }

  static preloadAssets(scene: Phaser.Scene): void {
    scene.load.setPath('assets/images');
    scene.load.spritesheet('player_spritesheet', 'player_spritesheet.png', {
      frameWidth: 48,
      frameHeight: 48,
    });
  }

  static createAnimations(scene: Phaser.Scene): void {
    scene.anims.create({
      key: 'playerIsStillFacingLeft',
      frames: [{ key: 'player_spritesheet', frame: 7 }],
    });

    scene.anims.create({
      key: 'playerIsStillFacingRight',
      frames: [{ key: 'player_spritesheet', frame: 8 }],
    });

    scene.anims.create({
      key: 'playerMoveLeft',
      frames: scene.anims.generateFrameNumbers('player_spritesheet', {
        start: 0,
        end: 7,
      }),
      frameRate: 10,  // Should depend on velocity and framesize - if jittery, add more frames
      repeat: -1,
    });

    scene.anims.create({
      key: 'playerMoveRight',
      frames: scene.anims.generateFrameNumbers('player_spritesheet', {
        start: 8,
        end: 15,
      }),
      frameRate: 10,  // Should depend on velocity and framesize - if jittery, add more frames
      repeat: -1,
    });
  }
}