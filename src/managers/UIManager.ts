import { Scene } from "phaser";

export class UIManager {
  private scene: Scene;
  private health: number = 0;
  private healthText: Phaser.GameObjects.Text;

  constructor(scene: Scene) {
    this.scene = scene;
    this.createHealthText();
    this.health = 4;
  }

  private createHealthText(): void {
    this.healthText = this.scene.add.text(16, 16, 'Health: 4  ', {
      fontSize: '32px',
      color: '#000',
    });
  }

  updateScore(points: number): void {
    this.health -= points;
    this.healthText.setText('Health: ' + this.health);
  }
}
