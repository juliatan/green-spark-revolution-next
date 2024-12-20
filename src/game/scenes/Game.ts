import { EventBus } from '@/game/EventBus';
import { Scene } from 'phaser';

export class Game extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  gameText: Phaser.GameObjects.Text;
  layer: Phaser.Tilemaps.TilemapLayer;
  player: Phaser.Physics.Arcade.Sprite;
  robot: Phaser.Physics.Arcade.Sprite;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  controls: Phaser.Cameras.Controls.FixedKeyControl;
  bullets: Phaser.Physics.Arcade.Group;
  keyA: Phaser.Input.Keyboard.Key;

  constructor() {
    super('Game');
  }

  preload() {
    this.load.tilemapCSV('map', '../assets/levels/level_1.csv');
    //   this.load.tilemapTiledJSON('map', '../assets/tilemaps/tuxemon-town.json');
  }

  create() {
    const map = this.make.tilemap({ key: 'map', tileWidth: 8, tileHeight: 8 });
    const tileset = map.addTilesetImage('tiles');

    if (!tileset) {
      throw new Error('Failed to load tileset image');
    }

    const createdLayer = map.createLayer(0, tileset, 0, 0); // layer name or index, tileset, x, y

    if (!createdLayer) {
      throw new Error('Failed to load tileset image');
    }

    this.layer = createdLayer;
    this.layer.setCollisionBetween(1, 6); // set collision for all tiles in range

    // const debugGraphics = this.add.graphics().setAlpha(0.75);
    // this.layer.renderDebug(debugGraphics, {
    //   tileColor: null, // Color of non-colliding tiles
    //   collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
    //   faceColor: new Phaser.Display.Color(40, 39, 37, 255), // Color of colliding face edges
    // });

    // Set the world bounds to match map size
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    // create group to hold still assets i.e. the platforms
    const platforms = this.physics.add.staticGroup();

    // add ground
    // platforms.create(400, 250, 'ground');
    platforms.create(600, 100, 'island');

    // add player
    this.player = this.physics.add.sprite(380, 200, 'player');
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true); // otherwise player falls through

    // add robot
    this.robot = this.physics.add.sprite(1000, 200, 'robot');
    this.robot.setBounce(0.2);
    this.robot.setCollideWorldBounds(true);

    // add collider physics rule between player and layer
    this.physics.add.collider(this.player, this.layer);

    // allow access to keyboard events
    if (this.input?.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
    } else {
      throw new Error('Keyboard input is not available');
    }

    // For scrolling through the map
    this.camera = this.cameras.main; // get main camera
    this.camera.startFollow(this.player); // Set camera to follow the player

    // Set camera bounds to match the map size
    this.camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    // Add some lerp (smoothing) to the camera movement
    this.camera.setLerp(0.1, 0.1);

    // Set camera dead zone - area where player can move without moving camera
    this.camera.setDeadzone(200, 256);

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
      repeat: -1,
    });

    this.anims.create({
      key: 'robotMoveRight',
      frames: this.anims.generateFrameNumbers('robot', { start: 8, end: 15 }),
      frameRate: 10,
      repeat: -1,
    });

    // create robot animation
    this.robot.setVelocityX(-60);
    this.robot.anims.play('robotMoveLeft', true);

    this.physics.add.collider(
      this.robot,
      this.layer,
      this.handleRobotCollision,
      undefined,
      this
    );

    // add stars
    const stars = this.physics.add.group();
    // drop from sky, y=0
    stars.create(422, 0, 'star');
    stars.create(522, 0, 'star');

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

    // Create bullets group
    this.bullets = this.physics.add.group({
      defaultKey: 'bullet', // sprite key for bullets
      maxSize: 10, // maximum number of bullets allowed at once
      allowGravity: false,
    });

    // Add 'A' key binding
    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);

    // Add collision between bullets and layer/robot
    this.physics.add.overlap(
      this.robot,
      this.bullets,
      (robot, bullet) => {
        bullet.destroy();

        // TODO: Fix typescript once we know what type the robot will be
        robot.setTint(0xff0000);
        robot.setVelocity(0, 0);
        robot.anims.stop();
      },
      undefined,
      this
    );

    this.physics.add.collider(this.bullets, this.layer, (bullet) => {
      bullet.destroy();
    });

    EventBus.emit('current-scene-ready', this);
  }

  update(time: number, delta: number) {
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

    // if player is blocked on its bottom, and up arrow pressed, push to top (gravity will be simulated)
    if (this.cursors.up.isDown && this.player.body?.blocked.down) {
      this.player.setVelocityY(-200);
    }

    if (Phaser.Input.Keyboard.JustDown(this.keyA)) {
      // Get a bullet from the pool
      const bullet = this.bullets.get(
        this.player.x,
        this.player.y,
        'bullet'
      ) as Phaser.Physics.Arcade.Sprite;

      if (bullet) {
        bullet.setActive(true);
        bullet.setVisible(true);

        // Set bullet velocity based on player direction
        const direction = this.player.flipX ? -1 : 1; // TODO: doesn't work
        const speed = 400;
        bullet.setVelocityX(speed * direction);

        // Destroy bullet after some time
        this.time.delayedCall(1500, () => {
          bullet.destroy();
        });
      }
    }
  }

  changeScene() {
    this.scene.start('GameOver');
  }

  handleRobotCollision(robot: Phaser.Physics.Arcade.Sprite) {
    if (robot.body?.blocked.left) {
      robot.anims.play('robotMoveRight', true);
      robot.setVelocityX(60); // Move right
    } else if (robot.body?.blocked.right) {
      robot.setVelocityX(-60); // Move left
      robot.anims.play('robotMoveLeft', true);
    }
  }
}
