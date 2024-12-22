import { Player } from "@/entities/Player";
import { Scene } from "phaser";
import { BulletManager } from "./BulletManager";

export class InputManager {
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private keyA: Phaser.Input.Keyboard.Key;

  constructor(private scene: Scene) {
    this.setupControls();
  }

  private setupControls(): void {
    if (!this.scene.input?.keyboard) {
      throw new Error('Keyboard input is not available');
    }
    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.keyA = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.A
    );
  }

  handleShoot(player: Player, bulletManager: BulletManager): void {
    if (Phaser.Input.Keyboard.JustDown(this.keyA)) {
      // Set bullet velocity based on player direction
      // TODO: Fix
      const direction = player.flipX ? -1 : 1;
      bulletManager.shoot(player.x, player.y, direction);
    }
  }
}
