import { Player } from '@/entities/Player';
import { Robot } from '@/entities/Robot';
import { EventBus } from '@/game/EventBus';
import { BulletManager } from '@/managers/BulletManager';
import { LevelManager } from '@/managers/LevelManager';
import { UIManager } from '@/managers/UIManager';
import { Scene } from 'phaser';

export class Game extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  keyA: Phaser.Input.Keyboard.Key;

  private player: Player;
  private robot: Robot;
  private levelManager: LevelManager;
  private bulletManager: BulletManager;
  private uiManager: UIManager;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super('Game');
  }

  preload() {
    this.levelManager = new LevelManager(this);
    this.levelManager.preloadAssets();
    this.initialiseManagers();
  }

  create() {
    this.setupLevel();
    this.setupEntities();
    this.setupCollisions();
    this.setupControls();

    // Set the world bounds to match map size
    this.physics.world.setBounds(
      0,
      0,
      this.levelManager.map.widthInPixels,
      this.levelManager.map.heightInPixels
    );

    // For scrolling through the map
    this.camera = this.cameras.main; // get main camera
    this.camera.startFollow(this.player); // Set camera to follow the player

    // Set camera bounds to match the map size
    this.camera.setBounds(
      0,
      0,
      this.levelManager.map.widthInPixels,
      this.levelManager.map.heightInPixels
    );

    // Add some lerp (smoothing) to the camera movement
    this.camera.setLerp(0.1, 0.1);

    // Set camera dead zone - area where player can move without moving camera
    this.camera.setDeadzone(200, 256);

    // let health = 4;
    // const healthText = this.add.text(16, 16, 'Health: 0', {
    //   fontSize: '32px',
    //   color: '#000',
    // });

    this.physics.add.overlap(
      this.player,
      this.robot,
      (player, star) => {
        this.uiManager.updateScore(1);
      },
      undefined,
      this
    );

    EventBus.emit('current-scene-ready', this);
  }

  update(time: number, delta: number) {
    this.player.update(this.cursors);
    this.robot.update();

    if (Phaser.Input.Keyboard.JustDown(this.keyA)) {
      // Set bullet velocity based on player direction
      const direction = this.player.flipX ? -1 : 1; // TODO: doesn't work
      this.bulletManager.shoot(this.player.x, this.player.y, direction);
    }
  }

  changeScene() {
    this.scene.start('GameOver');
  }

  // TODO: fix Typescript
  handleRobotCollision(robot: any) {
    if (robot.body?.blocked.left) {
      robot.anims.play('robotMoveRight', true);
      robot.setVelocityX(60); // Move right
    } else if (robot.body?.blocked.right) {
      robot.setVelocityX(-60); // Move left
      robot.anims.play('robotMoveLeft', true);
    }
  }

  private initialiseManagers(): void {
    this.bulletManager = new BulletManager(this);
    this.uiManager = new UIManager(this);
  }

  private setupLevel(): void {
    this.levelManager.createLevel();
  }

  private setupEntities() {
    this.player = new Player(this, 380, 200);
    this.robot = new Robot(this, 1000, 200);
  }

  private setupCollisions() {
    this.physics.add.collider(this.player, this.levelManager.layer);

    this.physics.add.collider(
      this.robot,
      this.levelManager.layer,
      this.handleRobotCollision,
      undefined,
      this
    );

    this.bulletManager.setupCollisions(this.robot, this.levelManager.layer);
  }

  private setupControls(): void {
    if (!this.input?.keyboard) {
      throw new Error('Keyboard input is not available');
    }
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
  }
}
