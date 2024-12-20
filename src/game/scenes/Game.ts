import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class Game extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  gameText: Phaser.GameObjects.Text;
  player: Phaser.Physics.Arcade.Sprite;
  robot: Phaser.Physics.Arcade.Sprite;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super('Game');
  }

  create() {
    // this.camera = this.cameras.main;
    // this.camera.setBackgroundColor(0x00ff00);

    this.background = this.add.image(512, 384, 'background');
    this.background.setAlpha(0.5);

    // create group to hold still assets i.e. the platforms
    const platforms = this.physics.add.staticGroup();

    // add ground
    // platforms.create(400, 588, 'ground');
    platforms.create(400, 250, 'ground');

    // add floating platform on x, y coordinates relative to top left corner, middle of image
    platforms.create(600, 100, 'island');
    platforms.create(50, 150, 'island');
    platforms.create(650, 200, 'island');
    platforms.create(250, 220, 'island');

    // add player
    this.player = this.physics.add.sprite(380, 200, 'player');
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true); // otherwise player falls through

    // add robot
    this.robot = this.physics.add.sprite(1000, 200, 'robot');
    this.robot.setBounce(0.2);
    this.robot.setCollideWorldBounds(true);
    // add collider physics rule between player and all types of platforms
    this.physics.add.collider(this.player, platforms);
    this.physics.add.collider(this.robot, platforms);

    // allow access to keyboard events
    this.cursors = this.input.keyboard.createCursorKeys();

    // create player animation
    this.anims.create({
      key: 'playerIsStill',
      frames: [{ key: 'player', frame: 8 }],
      frameRate: 20,
    });

    this.anims.create({
      key: 'playerMoveLeft',
      frames: this.anims.generateFrameNumbers('player', { start: 0, end: 7 }),
      frameRate: 10,
      repeat: -1, // infinitely repeated
    });

    this.anims.create({
      key: 'playerMoveRight',
      frames: this.anims.generateFrameNumbers('player', { start: 8, end: 15 }),
      frameRate: 10,
      repeat: -1,
    });

    // create robot animation
    this.anims.create({
      key: 'robotMoveLeft',
      frames: this.anims.generateFrameNumbers('robot', { start: 0, end: 7 }),
      frameRate: 10,
      repeat: -1, // infinitely repeated
    });

    this.anims.create({
      key: 'robotMoveRight',
      frames: this.anims.generateFrameNumbers('robot', { start: 8, end: 15 }),
      frameRate: 10,
      repeat: -1,
    });

    // create robot animation
    this.robot.setVelocityX(-360);
    this.robot.anims.play('robotMoveLeft', true);

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
      this.player.anims.play('playerMoveLeft', true); // true sets animation to loop
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
      this.player.anims.play('playerMoveRight', true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play('playerIsStill');
    }

    // if player sits on bottom, and up arrow pressed, push to top (gravity will be simulated)
    if (this.cursors.up.isDown && this.player.body?.touching.down) {
      this.player.setVelocityY(-230);
    }
  }

    changeScene() {
      this.scene.start('GameOver');
    }
}
