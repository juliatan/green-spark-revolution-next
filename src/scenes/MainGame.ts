import { WaterDroplet } from '@/entities/WaterDroplet';
import { Player } from '@/entities/Player';
import { Robot, SentryRobot, PatrolRobot, RobotDirection } from '@/entities/Robot';
import { EventBus } from '@/game/EventBus';
import { LevelManager } from '@/managers/LevelManager';
import { UIManager } from '@/managers/UIManager';
import { Scene } from 'phaser';

export class MainGame extends Scene {
  levelManager: LevelManager;
  player: Player;
  robots: Phaser.Physics.Arcade.Group;
  water: Phaser.Physics.Arcade.Group;
  camera: Phaser.Cameras.Scene2D.Camera;
  uiManager: UIManager;

  constructor() {
    super('MainGame');
  }

  preload() {
    this.initialiseManagers();
  }

  create() {
    this.setupLevel();
    this.setupEntities();
    this.setupCollisions();
    this.setupCamera();

    // Set the world bounds to match map size
    this.physics.world.setBounds(
      0,
      0,
      this.levelManager.map.widthInPixels,
      this.levelManager.map.heightInPixels
    );

    EventBus.emit('current-scene-ready', this);
  }

  update() {
    this.player.update();
    this.robots.getChildren().forEach((robot) => (robot as Robot).update());
  }

  changeScene() {
    this.scene.start('GameOver');
  }

  private initialiseManagers(): void {
    this.levelManager = new LevelManager(this);
    this.uiManager = new UIManager(this);
  }

  private setupLevel(): void {
    this.levelManager.createLevel();
  }

  private setupEntities() {
    // Setup WaterDroplets Group, to make it easier to manage multiple droplets
    this.water = this.physics.add.group({
      classType: WaterDroplet,
      createCallback: (go) => {
        (go as WaterDroplet).configure();
      }
    });
    // Setup Player
    Player.createAnimations(this);
    this.player = new Player(this, 450, 200, this.water);  // TODO: location from Tiled
    this.player.configure();
    // Setup Robots Group, to make it easier to manage multiple robots
    Robot.createAnimations(this);
    this.robots = this.physics.add.group({
      classType: Robot,
      createCallback: (go) => {
        (go as Robot).configure();
      }
    });
    // Sentry Robots
    this.robots.add(new SentryRobot(this, 200, 200, RobotDirection.Left));  // TODO: location from Tiled
    this.robots.add(new SentryRobot(this, 700, 400, RobotDirection.Right));  // TODO: location from Tiled
    // Patrol Robots
    this.robots.add(new PatrolRobot(this, 1000, 400, RobotDirection.Left, 800, 1200));  // TODO: location and range from Tiled
  }

  private setupCollisions(): void {
    this.physics.add.collider(this.player, this.levelManager.layer);
    this.physics.add.collider(this.robots, this.levelManager.layer);
    this.physics.add.collider(this.robots, this.player);
    this.physics.add.collider(this.robots, this.robots);
    this.physics.add.collider(this.water, this.levelManager.layer, (waterDroplet, layer) => { (waterDroplet as WaterDroplet).destroy() });
    this.physics.add.collider(this.water, this.player, (waterDroplet, player) => { (waterDroplet as WaterDroplet).destroy() });
    this.physics.add.collider(this.water, this.robots, (waterDroplet, robot) => {
      (waterDroplet as WaterDroplet).destroy();
      (robot as Robot).takeDamage(100);
    });
  }

  private setupCamera(): void {
    this.camera = this.cameras.main;
    this.camera.startFollow(this.player);

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
    this.camera.setDeadzone(100);
  }
}
