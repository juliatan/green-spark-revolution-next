import { WaterDroplet } from "@/entities/WaterDroplet";

export class EyeManager {
    scene: Phaser.Scene;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    getChildrenInLineOfSight(
        x: number,
        y: number,
        startAngle: number,
        endAngle: number,
        distance: number
    ) {
        const children = this.scene.children.getChildren().filter(
            (child) => !(child instanceof WaterDroplet) // Exclude WaterDroplets
        );
        const line = new Phaser.Geom.Line(x, y, x + distance, y);
        const detectedChildren = new Set<Phaser.GameObjects.GameObject>();
        const angleStep = Phaser.Math.DegToRad(1); // 1 degree steps
        const distStep = 5; // pixel steps

        for (let angle = startAngle; angle <= endAngle; angle += angleStep) {
            for (let dist = distStep; dist <= distance; dist += distStep) {
                let timeMapObstuction: boolean = false;
                Phaser.Geom.Line.SetToAngle(line, x, y, angle, dist);

                // Check for collision with TilemapLayer objects
                for (const child of children) {
                    if (child instanceof Phaser.Tilemaps.TilemapLayer) {
                        const tilemapLayer = child as Phaser.Tilemaps.TilemapLayer;

                        // Get tiles within the line's shape and check for collision
                        const tiles = tilemapLayer.getTilesWithinShape(line, { isNotEmpty: true });
                        for (const tile of tiles) {
                            if (tile.collides) { // Only consider tiles marked for collision
                                detectedChildren.add(child);
                                timeMapObstuction = true;
                                break; // No need to check more tiles in this layer for the current angle
                            }
                        }
                    }
                }

                if (timeMapObstuction) {
                    break; // No need to check for other objects if there is a tilemap obstruction
                }
                // Check collision with other game objects
                for (const child of children) {
                    if (child instanceof Phaser.GameObjects.Sprite || child instanceof Phaser.GameObjects.Image) {
                        const bounds = child.getBounds();
                        if (Phaser.Geom.Intersects.LineToRectangle(line, bounds)) {
                            detectedChildren.add(child);
                        }
                    }
                }
            }
        }

        return Array.from(detectedChildren);
    }
}
