import { InputManager } from "@/managers/InputManager";
import { Jersey_25 } from "next/font/google";

enum PlayerDirection {
  Left,
  Right
}

export class Player extends Phaser.Physics.Arcade.Sprite {
  playerDirection: PlayerDirection;
  inputManager: InputManager;
  lastAttackTime: number; // Track the last attack time
  attackCooldown: number = 500; // Cooldown period in milliseconds
  particleEmitter: Phaser.GameObjects.Particles.ParticleEmitter;
  graphics: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene, x: number, y: number, direction: PlayerDirection = PlayerDirection.Right) {
    super(scene, x, y, 'player_spritesheet');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.inputManager = new InputManager(scene);
    this.playerDirection = direction;
    this.lastAttackTime = 0;
    this.graphics = scene.add.graphics();

    // Create particle emitter
    this.particleEmitter = scene.add.particles(0, 0, 'water_particle', {
      // x: {
      //   onEmit: (particle, key, t, value) => {
      //     return this.x;
      //   },
      //   onUpdate: (particle, key, t, value) => {
      //     return value;
      //   }
      // },
      // y: {
      //   onEmit: (particle, key, t, value) => {
      //     return this.y;
      //   },
      //   onUpdate: (particle, key, t, value) => {
      //     return value;
      //   }
      // },
      lifespan: 500,
      speedX: { min: 200, max: 300 },
      speedY: { min: -30, max: 10 },
      gravityY: 100,
      quantity: 25,
      scale: { start: 0.5, end: 1 },
      alpha: { start: 1, end: 0 },
    })
  }

  configure(): void {
    this.setBounce(0.0);
    this.setCollideWorldBounds(true);
  }

  update(): void {
    this.navigate();
    this.attack();
    this.draw_emitter();  // for debugging
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
      // Start emitting particles
      this.particleEmitter.start();
      // Stop emitting after 100ms
      this.scene.time.delayedCall(400, () => {
        this.particleEmitter.stop();
      });
    }
  }

  draw_emitter(): void {
    this.graphics.clear();
    this.graphics.lineStyle(1, 0x00ff00);

    //  The current emitter bounds
    const vb = this.particleEmitter.getBounds();
    this.graphics.strokeRectShape(vb);
    this.graphics.lineStyle(1, 0xff0000);
  }

  static preloadAssets(scene: Phaser.Scene): void {
    scene.load.setPath('assets/images');
    scene.load.spritesheet('player_spritesheet', 'player_spritesheet.png', {
      frameWidth: 48,
      frameHeight: 48,
    });
    scene.load.image('water_particle', 'water_particle.png');
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