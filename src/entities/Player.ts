import { InputManager } from "@/managers/InputManager";
import { EyeManager } from "@/managers/EyeManager";
import { RainSeeder } from "@/entities/RainSeeder";

enum PlayerDirection {
  Left,
  Right
}

export class Player extends Phaser.Physics.Arcade.Sprite {
  playerDirection: PlayerDirection;
  inputManager: InputManager;
  lastAttackTime: number; // Track the last attack time
  lastActTime: number; // Track the last act time
  attackCooldown: number = 400; // Cooldown period in milliseconds
  actCoolDown: number = 400; // Cooldown period in milliseconds
  water: Phaser.Physics.Arcade.Group;
  eye: EyeManager;

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
    this.eye = new EyeManager(scene);
    this.playerDirection = direction;
    this.lastAttackTime = 0;
    this.lastActTime = 0;
    this.water = water;
  }

  configure(): void {
    this.setBounce(0.0);
    this.setCollideWorldBounds(true);
    this.setGravityY(600);
    this.setMass(1);
  }

  update(): void {
    this.navigate();
    this.attack();
    this.act()
  }

  navigate(): void {
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

  attack(): void {
    const currentTime = this.scene.time.now;
    // Watergun cannot attack continuously, so we need to check the cooldown
    if (this.inputManager.isKeyPressed('a') && currentTime - this.lastAttackTime > this.attackCooldown) {
      this.lastAttackTime = currentTime;
      // Create water droplets
      const createWaterDroplet = () => {
        const waterDroplet = this.water.create(
          this.playerDirection === PlayerDirection.Left ? this.x - 24 : this.x + 24,
          this.y,
          'water_droplet'
        );
        waterDroplet.setLifespan(200);  // Set lifespan
        const velocityX = Phaser.Math.Between(300, 500) * (this.playerDirection === PlayerDirection.Left ? -1 : 1);
        const velocityY = Phaser.Math.Between(-30, 10);
        waterDroplet.setVelocityX(velocityX);
        waterDroplet.setVelocityY(velocityY);
      };
      for (let i = 0; i < 200; i++) {  // Uniformly distribute droplets over 300ms
        this.scene.time.delayedCall(i * 300 / 200, createWaterDroplet);
      }
    }
  }

  act(): void {
    const currentTime = this.scene.time.now;

    // Check if the cooldown period has elapsed
    if (this.inputManager.isKeyPressed('q') && currentTime - this.lastActTime > this.actCoolDown) {
      this.lastActTime = currentTime;

      // Determine the eye position and line of sight angles based on player direction
      const eyeX = this.x + (this.playerDirection === PlayerDirection.Right ? 24 : -24);
      const eyeY = this.y + 24; // Eye position relative to the player
      const distance = 100; // Line of sight distance
      const startAngle = this.playerDirection === PlayerDirection.Right ? Phaser.Math.DegToRad(-45) : Phaser.Math.DegToRad(135);
      const endAngle = this.playerDirection === PlayerDirection.Right ? Phaser.Math.DegToRad(45) : Phaser.Math.DegToRad(225);

      // Use the EyeManager to get objects in the line of sight
      const objectsInSight = this.eye.getChildrenInLineOfSight(
        eyeX,
        eyeY,
        startAngle,
        endAngle,
        distance
      );

      // If RainSeeder is in line of sight, call seed method
      for (const object of objectsInSight) {
        if (object instanceof RainSeeder) {
          const rainSeeder = object as RainSeeder;
          rainSeeder.seed();
        }
      }
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