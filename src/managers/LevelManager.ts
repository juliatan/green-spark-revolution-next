import { Scene } from 'phaser';

export class LevelManager {
  private scene: Scene;
  public layer: Phaser.Tilemaps.TilemapLayer;
  public map: Phaser.Tilemaps.Tilemap;

  constructor(scene: Scene) {
    this.scene = scene;
  }

  createLevel(): void {
    this.map = this.scene.make.tilemap({
      key: 'level_1_tilemap',
      tileWidth: 16,
      tileHeight: 16,
    });

    const tileset = this.map.addTilesetImage('tileset', undefined, 16, 16, 1, 2);
    if (!tileset) {
      throw new Error('Failed to load tileset image');
    }

    const createdLayer = this.map.createLayer(0, tileset, 0, 0);
    if (!createdLayer) {
      throw new Error('Failed to create layer');
    }

    this.layer = createdLayer;
    this.layer.setCollisionBetween(1, 255); // set collision for all tiles in range

    // // For debugging collision tiles
    // const debugGraphics = this.scene.add.graphics().setAlpha(0.75);
    // this.layer.renderDebug(debugGraphics, {
    //   tileColor: null, // Color of non-colliding tiles
    //   collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
    //   faceColor: new Phaser.Display.Color(40, 39, 37, 255), // Color of colliding face edges
    // });
  }

  static preloadAssets(scene: Phaser.Scene): void {
    scene.load.image('tileset', 'assets/images/tileset.png');
    scene.load.tilemapCSV('level_1_tilemap', 'assets/levels/level_1.csv');
  }
}
