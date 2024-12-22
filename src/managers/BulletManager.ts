import { Robot } from "@/entities/Robot";
import { Scene } from "phaser";

export class BulletManager {
  private scene: Scene;
  private bullets: Phaser.Physics.Arcade.Group;

  constructor(scene: Scene) {
    this.scene = scene;
    this.createBulletGroup();
  }

  private createBulletGroup(): void {
    this.bullets = this.scene.physics.add.group({
      defaultKey: 'bullet',
      maxSize: 10, // max number allowed at once
      allowGravity: false,
    });
  }

  setupCollisions(robot: Robot, layer: Phaser.Tilemaps.TilemapLayer): void {
    this.scene.physics.add.collider(robot, this.bullets,  (robot: any, bullet: any) => {
      (bullet as Phaser.Physics.Arcade.Sprite).destroy();

      // TODO: Fix typescript once we know what type the robot will be
      robot.setTint(0xff0000);
      robot.setVelocity(0, 0);
      robot.anims.stop();
    });

    this.scene.physics.add.collider(this.bullets, layer, (bullet) => {
      (bullet as Phaser.Physics.Arcade.Sprite).destroy();
    });
  }

  shoot(x: number, y: number, direction: number): void {
    const bullet = this.bullets.get(
      x,
      y,
      'bullet'
    ) as Phaser.Physics.Arcade.Sprite;

    if (bullet) {
      bullet.setActive(true).setVisible(true);
      const speed = 400;
      bullet.setVelocityX(speed * direction);

      // Destroy bullet after some time
      this.scene.time.delayedCall(1500, () => {
        bullet.destroy();
      });
    }
  }
}
