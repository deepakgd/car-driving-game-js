const textures = {
  BACKGROUND: 'background',
  FOREGROUND: 'foreground',
  SNOWAREA: 'snowarea',
  OBSTACLE_ONE: 'obstacle_one',
  OBSTACLE_TWO: 'obstacle_two',
}

class Game extends Phaser.Scene {
  constructor() {
    super();
    this.moveCam = false;
    this.speed = 50;
  }

  preload() {
    // this.load.image('bg', 'assets/pics/the-end-by-iloe-and-made.jpg');
    this.load.image(textures.BACKGROUND, "assets/images/1.png");
    this.load.image(textures.SNOWAREA, "assets/images/2.png");
    this.load.image(textures.FOREGROUND, "assets/images/3.png");
    this.load.image("car", "assets/images/car.png");
    this.load.image(textures.OBSTACLE_ONE, "assets/images/obstacle-1.png");
    this.load.image(textures.OBSTACLE_TWO, "assets/images/obstacle-2.png");
    this.load.spritesheet("blast", "assets/images/bomb.png", {
      frameWidth: 128,
      frameHeight: 128,
    });
    this.totalWidth = this.scale.width * 20;
  }

  create() {
    this.cameras.main.setBounds(0, 0, this.totalWidth, 240);
    this.physics.world.setBounds(0, 240, this.totalWidth, 370);

    // create repeated background 
    let bgWidth = this.textures.get(textures.BACKGROUND).getSourceImage().width - 5;
    let bgCount = Math.ceil(this.totalWidth / bgWidth);
    this.createRepeatedTexture(bgWidth, -2, textures.BACKGROUND, 0, 0.5, bgCount);

    // create repeated snow area - game play area
    let snowWidth = this.textures.get(textures.SNOWAREA).getSourceImage().width - 5;
    let snowCount = Math.ceil(this.totalWidth / snowWidth);
    this.createRepeatedTexture(snowWidth, 220, textures.SNOWAREA, 0, 1, snowCount);

    // create foreground
    let fgWidth = this.textures.get(textures.FOREGROUND).getSourceImage().width - 5;
    let fgCount = Math.ceil(this.totalWidth / fgWidth) * 1.5;
    this.createRepeatedTexture(fgWidth, 725, textures.FOREGROUND, 1, 1.3, fgCount);

    // for (let x = 0; x < 15; x++) {
      // this.add
      //   .image(490 * x, 220, "snow")
      //   .setOrigin(0)
      //   .setScrollFactor(1);
      // this.add
      //   .image(600 * x, 0, "bg")
      //   .setOrigin(0)
      //   .setScrollFactor(0.5);
    // }

    // added separate loop to fix snow and foreground overlap issue
    // for (let x = 0; x < 10; x++) {
    //   this.add
    //     .image(1250 * x, 720, "foreground")
    //     .setOrigin(1)
    //     .setScrollFactor(1.3);
    // }

    this.cursors = this.input.keyboard.createCursorKeys();

    // this.player = this.physics.add.image(400, 100, 'block');
    this.player = this.physics.add.image(100, 275, "car");
    // this.player.setBodySize(65, 65, true)
    // this.player.setscale(1.5)

    // The sprite is then set to collide with the world bounds. The bounds, by default, are on the outside of the game dimensions. As we set the game to be 800 x 600 then the player won't be able to run outside of this area. It will stop the player from being able to run off the edges of the screen or jump through the top
    this.player.setCollideWorldBounds(true);

    // create obstacles group
    var obstacles = this.physics.add.group({ collideWorldBounds: true });
    obstacles.create(1600, 245, textures.OBSTACLE_ONE);
    obstacles.create(2410, 512, textures.OBSTACLE_TWO).setOrigin(0);

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
    console.log(this.player.y)
    // 333 / 5 = 66.6
    this.player.setVelocityX(100);

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(0);
    } else if (this.cursors.right.isDown) {
      this.speed += 20;
      this.player.setVelocityX(this.speed);
    } else {
      // if (this.speed > 0) {
      //   this.speed -= 5;
      //   this.player.setVelocityX(this.speed);
      // }
    }

    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-50);
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(50);
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

  /**
   * createRepeatedTexture
   * @param {string} texture
   * @param {number} origin
   * @param {number} scrollFactor
   */
   createRepeatedTexture(width, height, texture, origin, scrollFactor, count) {
    let x = -2;
    for (let i = 0; i < count; i++) {
      const m = this.add
        .image(x, height, texture)
        .setOrigin(origin)
        .setScrollFactor(scrollFactor);

      x += width;
    }
  }
}

const config = {
  type: Phaser.AUTO,
  // parent: 'game-area',
  // width: 800,
  // height: 600,
  scale: {
    parent: "game-area",
    // mode: Phaser.Scale.FIT,
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
