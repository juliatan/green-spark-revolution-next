export enum RobotDirection {
  Left,
  Right
}

export abstract class Robot extends Phaser.Physics.Arcade.Sprite {
  robotDirection: RobotDirection;

  constructor(scene: Phaser.Scene, x: number, y: number, direction: RobotDirection = RobotDirection.Right) {
    super(scene, x, y, 'robot_spritesheet');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.robotDirection = direction;
  }

  configure(): void {
    this.setBounce(0.0);
    this.setImmovable(true);
    this.setCollideWorldBounds(true);
  }

  update(): void {
    const canSeePlayer = false; // TODO: Implement this

    if (canSeePlayer) {
      this.attackPlayer();
    } else {
      this.defaultDirective();
    }
  }

  attackPlayer(): void {
    // TODO: Implement this
  }

  abstract defaultDirective(): void

  static preloadAssets(scene: Phaser.Scene): void {
    scene.load.setPath('assets/images');
    scene.load.spritesheet('robot_spritesheet', 'robot_spritesheet.png', {
      frameWidth: 48,
      frameHeight: 80,
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