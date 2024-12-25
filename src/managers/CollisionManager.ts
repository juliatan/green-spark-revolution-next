import { Player } from '@/entities/Player';
import { Robot } from '@/entities/Robot';
import { Scene } from 'phaser';
import { UIManager } from './UIManager';

export class CollisionManager {
  constructor(private scene: Scene) {}

  setupCollisions(
    player: Player,
    robot: Robot,
    layer: Phaser.Tilemaps.TilemapLayer,
  ): void {
    this.scene.physics.add.collider(player, layer);
    this.scene.physics.add.collider(robot, layer);
  }

  setupOverlaps(player: Player, robot: Robot, uiManager: UIManager): void {
    this.scene.physics.add.overlap(
      player,
      robot,
      () => uiManager.updateScore(1),
      undefined,
      this
    );
  }
}
