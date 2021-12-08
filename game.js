class Game extends Phaser.Scene {
  constructor() {
    super();
    this.moveCam = false;
    this.speed = 50;
  }

  preload() {
    // this.load.image('bg', 'assets/pics/the-end-by-iloe-and-made.jpg');
    this.load.image("bg", "assets/images/1.png");
    this.load.image("snow", "assets/images/2.png");
    this.load.image("foreground", "assets/images/3.png");
    this.load.image("car", "assets/images/car.png");
    this.load.image("block", "assets/images/block.png");
    this.load.spritesheet("blast", "assets/images/bomb.png", {
      frameWidth: 128,
      frameHeight: 128,
    });
  }

  create() {
    this.cameras.main.setBounds(0, 0, 720 * 10, 240);
    this.physics.world.setBounds(0, 240, 1280 * 10, 400);

    for (let x = 0; x < 10; x++) {
      this.add.image(490 * x, 220, "snow").setOrigin(0).setScrollFactor(1);
      this.add.image(600 * x, 0, "bg").setOrigin(0).setScrollFactor(0.5);
      this.add.image(1200 * x, 720, "foreground").setOrigin(1).setScrollFactor(1.3);
    }
    


    this.cursors = this.input.keyboard.createCursorKeys();

    // this.player = this.physics.add.image(400, 100, 'block');
    this.player = this.physics.add.image(100, 125, "car");
    // this.player.setscale(1.5)

    // The sprite is then set to collide with the world bounds. The bounds, by default, are on the outside of the game dimensions. As we set the game to be 800 x 600 then the player won't be able to run outside of this area. It will stop the player from being able to run off the edges of the screen or jump through the top
    this.player.setCollideWorldBounds(true);

    // create obstacles group
    // var obstacles = this.physics.add.group({ collideWorldBounds: true });
    // var block1 = obstacles.create(200, 125, 'block');

    // obstacles
    // var obstacles = this.physics.add.staticGroup();
    // var block1 = obstacles.create(300, 125, "block");
    // var block2 = obstacles.create(450, 120, "block");
    // var block3 = obstacles.create(900, 120, "block");
    // block1.setScale(0.7).refreshBody();
    // block2.setScale(0.7).refreshBody();
    // block3.setScale(0.7).refreshBody();
    // block1.visible = false;
    // add collision
    // this.physics.add.collider(this.player, obstacles, this.hitBlock.bind(this));

    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("blast", { start: 0, end: 15 }),
      frameRate: 5,
      // repeat: -1
    });

    // this.player.body.setMaxSpeed(500);

    this.cameras.main.startFollow(this.player, true);
    // this.cameras.main.setZoom(2);
  }

  update() {
    const cam = this.cameras.main;

    this.player.setVelocity(0);

    if (this.moveCam) {
      if (this.cursors.left.isDown) {
        cam.scrollX -= 4;
      } else if (this.cursors.right.isDown) {
        cam.scrollX += 4;
      }

      if (this.cursors.up.isDown) {
        cam.scrollY -= 4;
      } else if (this.cursors.down.isDown) {
        cam.scrollY += 4;
      }
    } else {
      console.log("exe");
      if (this.cursors.left.isDown) {
        // this.player.setVelocityX(-400);
      } else if (this.cursors.right.isDown) {
        this.speed += 2;
        this.player.setVelocityX(this.speed);
        // this.player.setVelocityX(this.speed).setAccelerationX(this.speed);
        // this.physics.velocityFromRotation(this.player.rotation, this.player.body.maxSpeed, this.player.body.acceleration);
      } else {
        if (this.speed > 0) {
          this.speed -= 5;
          this.player.setVelocityX(this.speed);
        }
      }

      if (this.cursors.up.isDown) {
        this.player.setVelocityY(-50);
      } else if (this.cursors.down.isDown) {
        this.player.setVelocityY(50);
      }
    }
  }

  hitBlock() {
    console.log("invoked");
    console.log(this.player);
    this.bomb = this.physics.add.sprite(
      this.player.x,
      this.player.y - 50,
      "blast"
    );
    this.bomb.setScale(0.5).refreshBody();
    this.bomb.anims.play("left", true);
    this.player.disableBody(true, true);

    this.bomb.on("animationcomplete", () => {
      console.log("invoked bomb");
      this.bomb.disableBody(true, true);
    });
  }
}

const config = {
  type: Phaser.AUTO,
  // parent: 'game-area',
  // width: 800,
  // height: 600,
  scale: {
    parent: "game-area",
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1280,
    height: 720,
  },
  pixelArt: true,
  physics: {
    default: "arcade",
  },
  scene: [Game],
};

var moveCam = false;

const game = new Phaser.Game(config);
