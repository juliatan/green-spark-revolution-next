import { Player } from '@/entities/Player';
import { Robot } from '@/entities/Robot';
import { EventBus } from '@/game/EventBus';
import { CollisionManager } from '@/managers/CollisionManager';
import { InputManager } from '@/managers/InputManager';
import { LevelManager } from '@/managers/LevelManager';
import { UIManager } from '@/managers/UIManager';
import { Scene } from 'phaser';

export class MainGame extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  player: Player;
  robot: Robot;
  levelManager: LevelManager;
  uiManager: UIManager;
  collisionManager: CollisionManager;
  inputManager: InputManager

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
    this.setupCollisionsAndOverlaps();

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
    this.player.update(this.inputManager);
    this.robot.update();
  }

  changeScene() {
    this.scene.start('GameOver');
  }

  private initialiseManagers(): void {
    this.levelManager = new LevelManager(this);
    this.uiManager = new UIManager(this);
    this.collisionManager = new CollisionManager(this);
    this.inputManager = new InputManager(this);
  }

  private setupLevel(): void {
    this.levelManager.createLevel();
  }

  private setupEntities() {
    this.player = new Player(this, 380, 200);
    this.robot = new Robot(this, 450, 200);
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

  private setupCollisionsAndOverlaps(): void {
    this.collisionManager.setupCollisions(
      this.player,
      this.robot,
      this.levelManager.layer,
    );

    this.collisionManager.setupOverlaps(
      this.player,
      this.robot,
      this.uiManager
    );
  }
}
