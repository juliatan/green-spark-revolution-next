import { EventBus } from '@/game/EventBus';
import { Scene } from 'phaser';

export class MainGame extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameText: Phaser.GameObjects.Text;

    constructor ()
    {
        super('MainGame');
    }

    create ()
    {
        this.camera = this.cameras.main;

        this.gameText = this.add.text(384, 240, 'Play', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        EventBus.emit('current-scene-ready', this);
    }
}
