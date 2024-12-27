import { EyeManager } from "@/managers/EyeManager";
import { Player } from "./Player";

export enum RobotDirection {
  Left,
  Right
}

export abstract class Robot extends Phaser.Physics.Arcade.Sprite {
  robotDirection: RobotDirection;
  health: number = 100;
  explosion: Phaser.GameObjects.Particles.ParticleEmitter;
  mindBeam: Phaser.GameObjects.Particles.ParticleEmitter;
  eye: EyeManager;
  lastAttackTime: number = 0; // Track the last attack time
  lastWatchTime: number = 0; // Track the last act time
  attackCooldown: number = 100; // Cooldown period in milliseconds
  watchCoolDown: number = 250; // Cooldown period in milliseconds
  playerInLineOfSight: Player | null = null;

  constructor(scene: Phaser.Scene, x: number, y: number, direction: RobotDirection = RobotDirection.Right) {
    super(scene, x, y, 'robot_spritesheet');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.eye = new EyeManager(scene);
    this.robotDirection = direction;
    this.explosion = scene.add.particles(0, 0, 'explosion_particle', {
      x: (particle, key, t, value) => this.x,
      y: (particle, key, t, value) => this.y,
      quantity: 1,
      speed: { min: -50, max: 50 },
      angle: { min: 0, max: 360 },
      scale: { start: 0, end: 5 },
      alpha: { start: 1, end: 0 },
      lifespan: 1000,
    });
    this.explosion.stop();
    this.mindBeam = scene.add.particles(0, 0, 'mindbeam_wave', {
      x: (particle, key, t, value) => this.robotDirection === RobotDirection.Left ? this.x - 24 : this.x + 24,
      y: (particle, key, t, value) => this.y - 12,
      quantity: 1,
      speed: 100,
      angle: (particle, key, t, value) => this.robotDirection === RobotDirection.Left ? 180 - 20 : 20,  // TODO why is this highlighted as an error?
      scale: { start: 0, end: 3 },
      alpha: { start: 1, end: 0 },
      lifespan: 500,
      frequency: 100,  // once every 200 ms
      rotate: (particle, key, t, value) => this.robotDirection === RobotDirection.Left ? 180 - 20 : 20,
    });
    this.mindBeam.stop();
  }

  configure(): void {
    this.setBounce(0.0);
    this.setImmovable(true);
    this.setCollideWorldBounds(true);
    this.setGravityY(600);
  }

  update(): void {
    this.watchForPlayer(); // TODO: make this not blocking
    if (this.playerInLineOfSight) {
      this.mindBeam.start();
      this.attackPlayer(this.playerInLineOfSight);
    } else {
      this.mindBeam.stop();
      this.defaultDirective();
    }
  }

  watchForPlayer(): Player | undefined {
    const currentTime = this.scene.time.now;
    if (currentTime - this.lastWatchTime < this.watchCoolDown) {
      return;
    }
    this.lastWatchTime = currentTime;
    const player = this.eye.getChildrenInLineOfSight(
      this.x,
      this.y,
      this.robotDirection === RobotDirection.Left ? Phaser.Math.DegToRad(180 - 30) : Phaser.Math.DegToRad(10),
      this.robotDirection === RobotDirection.Left ? Phaser.Math.DegToRad(180 - 10) : Phaser.Math.DegToRad(30),
      120
    ).find((child) => child instanceof Player) as Player;
    this.playerInLineOfSight = player;
  }

  attackPlayer(player: Player): void {
    this.setVelocityX(0); // Stand idle while attacking
    const currentTime = this.scene.time.now;
    if (currentTime - this.lastAttackTime > this.attackCooldown) {
      this.lastAttackTime = currentTime;
      player.takeDamage(1);
    }
  }

  abstract defaultDirective(): void

  static preloadAssets(scene: Phaser.Scene): void {
    scene.load.setPath('assets/images');
    scene.load.image('explosion_particle', 'explosion_particle.png');
    scene.load.image('mindbeam_wave', 'mind_beam.png');
    scene.load.spritesheet('robot_spritesheet', 'robot_spritesheet.png', {
      frameWidth: 48,
      frameHeight: 80,
    });
  }

  takeDamage(damage: number): void {
    this.health -= damage;
    if (this.health <= 0) {
      this.destroy();
    }
  }

  destroy(): void {
    this.explosion.start();
    // Destroy the particle emitter after the explosion
    this.scene.time.delayedCall(250, () => {
      this.explosion.stop();
      this.mindBeam.stop();
      super.destroy();
    });
  }

  static createAnimations(scene: Phaser.Scene): void {
    scene.anims.create({
      key: 'robotIsStillFacingLeft',
      frames: [{ key: 'robot_spritesheet', frame: 7 }],
    });

    scene.anims.create({
      key: 'robotIsStillFacingRight',
      frames: [{ key: 'robot_spritesheet', frame: 8 }],
    });

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

export class SentryRobot extends Robot {
  defaultDirective(): void {
    this.setVelocityX(0); // Stand idle
    if (this.robotDirection === RobotDirection.Left) {
      this.anims.play('robotIsStillFacingLeft', true);
    } else {
      this.anims.play('robotIsStillFacingRight', true);
    }
  }
}

export class PatrolRobot extends Robot {
  private patrolStart: number;
  private patrolEnd: number;
  private patrolSpeed: number = 100;

  constructor(scene: Phaser.Scene, x: number, y: number, direction: RobotDirection, patrolStart: number, patrolEnd: number) {
    super(scene, x, y, direction);
    this.patrolStart = patrolStart;
    this.patrolEnd = patrolEnd;
    this.robotDirection = direction;
  }

  defaultDirective(): void {
    if (this.robotDirection === RobotDirection.Left) {
      this.setVelocityX(-this.patrolSpeed);
      this.anims.play('robotMoveLeft', true);

      if (this.x <= this.patrolStart) {
        this.robotDirection = RobotDirection.Right;
      }
    } else {
      this.setVelocityX(this.patrolSpeed);
      this.anims.play('robotMoveRight', true);

      if (this.x >= this.patrolEnd) {
        this.robotDirection = RobotDirection.Left;
      }
    }
  }
}