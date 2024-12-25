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
      key: 'map',
      tileWidth: 8,
      tileHeight: 8,
    });

    const tileset = this.map.addTilesetImage('tiles');
    if (!tileset) {
      throw new Error('Failed to load tileset image');
    }

    const createdLayer = this.map.createLayer(0, tileset, 0, 0);
    if (!createdLayer) {
      throw new Error('Failed to create layer');
    }

    this.layer = createdLayer;
    this.layer.setCollisionBetween(1, 6); // set collision for all tiles in range

    // For debugging collision tiles
    // const debugGraphics = this.add.graphics().setAlpha(0.75);
    // this.layer.renderDebug(debugGraphics, {
    //   tileColor: null, // Color of non-colliding tiles
    //   collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
    //   faceColor: new Phaser.Display.Color(40, 39, 37, 255), // Color of colliding face edges
    // });
  }

  static preloadAssets(scene: Phaser.Scene): void {
    scene.load.setPath('assets/images');
    scene.load.image('tileset', 'tileset.png');
    scene.load.setPath('assets/levels');
    scene.load.tilemapCSV('level_1_tilemap', 'level_1.csv');
  }
}
