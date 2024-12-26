import { Player } from '@/entities/Player';
import { Robot } from '@/entities/Robot';
import { EventBus } from '@/game/EventBus';
import { LevelManager } from '@/managers/LevelManager';
import { UIManager } from '@/managers/UIManager';
import { Scene } from 'phaser';

export class MainGame extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  player: Player;
  robots: Phaser.Physics.Arcade.Group;
  levelManager: LevelManager;
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
    this.setupCamera();
    this.setupCollisions();

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
    this.robots.runChildUpdate
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
    this.player = new Player(this, 380, 200);
    this.robots = this.physics.add.group({
      classType: Robot,
      createCallback: (go) => go.configure(),
    });
    const robot_1 = new Robot(this, 450, 200);
    this.robots.add(robot_1);
    const robot_2 = new Robot(this, 550, 200);
    this.robots.add(robot_2);
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

  private setupCollisions(): void {
    this.physics.add.collider(this.player, this.levelManager.layer);
    this.physics.add.collider(this.robots, this.levelManager.layer);
    this.physics.add.collider(this.robots, this.player);
    this.physics.add.collider(this.robots, this.robots);
  }
}
