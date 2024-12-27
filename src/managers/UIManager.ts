import { Scene } from 'phaser';

export class UIManager {
  private scene: Scene;
  private healthText: Phaser.GameObjects.Text;

  constructor(scene: Scene) {
    this.scene = scene;
    this.createHealthText();
  }

  private createHealthText(): void {
    this.healthText = this.scene.add
      .text(16, 16, 'VOLITION: 100%', {
        fontSize: '16px',
        color: '#000',
      })
      .setScrollFactor(0) // Set scroll factor to 0 to keep text fixed on screen
      .setDepth(1); // Set depth to ensure text is rendered on top of everything
  }

  update(player_health: number): void {
    this.healthText.setText('Health: ' + player_health + '%');
  }
}
