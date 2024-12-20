import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class Game extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  gameText: Phaser.GameObjects.Text;
  player: Phaser.Physics.Arcade.Sprite;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super('Game');
  }

  create() {
    // this.camera = this.cameras.main;
    // this.camera.setBackgroundColor(0x00ff00);

    // this.background = this.add.image(512, 384, 'background');
    // this.background.setAlpha(0.5);

    // this.gameText = this.add.text(512, 384, 'Make something fun!\nand share it with us:\nsupport@phaser.io', {
    //     fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
    //     stroke: '#000000', strokeThickness: 8,
    //     align: 'center'
    // }).setOrigin(0.5).setDepth(100);
    // create group to hold still assets i.e. the platforms
    const platforms = this.physics.add.staticGroup();

    // add ground
    platforms.create(400, 588, 'ground');

    // add floating platform on x, y coordinates relative to top left corner, middle of image
    platforms.create(600, 450, 'island');
    platforms.create(50, 250, 'island');
    platforms.create(650, 220, 'island');
    platforms.create(250, 520, 'island');
    platforms.create(250, 320, 'island');

    // add player
    this.player = this.physics.add.sprite(380, 500, 'player');
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true); // otherwise player falls through

    // add collider physics rule between player and all types of platforms
    this.physics.add.collider(this.player, platforms);

    // allow access to keyboard events
    this.cursors = this.input.keyboard.createCursorKeys();

    // create player animation
    this.anims.create({
      key: 'still',
      frames: [{ key: 'player', frame: 4 }],
      frameRate: 20,
    });

    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }), // composed of 4 frames
      frameRate: 10,
      repeat: -1, // infinitely repeated
    });

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('player', { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });

    // add stars
    const stars = this.physics.add.group();
    // drop from sky, y=0
    stars.create(22, 0, 'star');
    stars.create(122, 0, 'star');
    stars.create(222, 0, 'star');
    stars.create(322, 0, 'star');
    stars.create(422, 0, 'star');
    stars.create(522, 0, 'star');
    stars.create(622, 0, 'star');
    stars.create(722, 0, 'star');

    this.physics.add.collider(stars, platforms);

    // allow player to pick up stars
    let score = 0;
    const scoreText = this.add.text(16, 16, 'Stars: 0', {
      fontSize: '32px',
      color: '#000',
    });

    this.physics.add.overlap(
      this.player,
      stars,
      // hide star when overlap
      (player, star) => {
        const starSprite = star as Phaser.Physics.Arcade.Image;
        starSprite.disableBody(true, true);
        // increment star counter
        score += 1;
        scoreText.setText('Stars: ' + score);
      },
      undefined,
      this
    );

    EventBus.emit('current-scene-ready', this);
  }

  update() {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.anims.play('left', true); // true sets animation to loop
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
      this.player.anims.play('right', true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play('still');
    }

    // if player sits on bottom, and up arrow pressed, push to top (gravity will be simulated)
    if (this.cursors.up.isDown && this.player.body?.touching.down) {
      this.player.setVelocityY(-330);
    }
  }

  //   changeScene() {
  //     this.scene.start('GameOver');
  //   }
}
