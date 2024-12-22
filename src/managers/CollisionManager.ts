import { Player } from '@/entities/Player';
import { Robot } from '@/entities/Robot';
import { Scene } from 'phaser';
import { BulletManager } from './BulletManager';
import { UIManager } from './UIManager';

export class CollisionManager {
  constructor(private scene: Scene) {}

  setupCollisions(
    player: Player,
    robot: Robot,
    layer: Phaser.Tilemaps.TilemapLayer,
    bulletManager: BulletManager
  ): void {
    this.scene.physics.add.collider(player, layer);

    this.scene.physics.add.collider(
      robot,
      layer,
      this.handleRobotCollision,
      undefined,
      this
    );

    bulletManager.setupCollisions(robot, layer);
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

  // TODO: fix Typescript
  private handleRobotCollision(robot: any): void {
    if (robot.body?.blocked.left) {
      robot.setVelocityX(60); // Move right
    } else if (robot.body?.blocked.right) {
      robot.setVelocityX(-60); // Move left
    }
  }
}
