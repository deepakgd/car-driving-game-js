const textures = {
  BACKGROUND: "background",
  FOREGROUND: "foreground",
  SNOWAREA: "snowarea",
  BIKE: "bike",
  OBSTACLE_ONE: "obstacle_one",
  OBSTACLE_TWO: "obstacle_two",
  OBSTACLE_THREE: "obstacle_three",
  OBSTACLE_FOUR: "obstacle_four",
  ICE_PATCH_ONE: "ice_patch_one",
  ICE_PATCH_TWO: "ice_patch_two",
  DROP_ONE: "drop_one"
};
// 20480

const positions = {
    desktop: {
      obstacle1: { x: 1600, y: 265, texture: textures.OBSTACLE_ONE  },
      obstacle2: { x: 2410, y: 570, texture: textures.OBSTACLE_TWO  },
      obstacle3: { x: 3300, y: 460, texture: textures.OBSTACLE_THREE  },
      obstacle4: { x: 5800, y: 480, texture: textures.OBSTACLE_FOUR   },
      obstacle5: { x: 7100, y: 590, texture: textures.OBSTACLE_ONE   },
      obstacle6: { x: 7680, y: 265, texture: textures.OBSTACLE_THREE   },
      obstacle7: { x: 12800, y: 265, texture: textures.OBSTACLE_FOUR  },
      icepatch1: { x: 9814, y: 460, texture: textures.ICE_PATCH_ONE  },
      drop1: { x: 12600, y: 540, texture: textures.DROP_ONE },
      obstacle8: { x: 13800, y: 390, texture: textures.OBSTACLE_TWO },
      obstacle9: { x: 16180, y: 430, texture: textures.OBSTACLE_FOUR  },
      obstacle10: { x: 17040, y: 280, texture: textures.OBSTACLE_THREE  },
      obstacle11: { x: 17820, y: 590, texture: textures.OBSTACLE_ONE  },
      obstacle12: { x: 19200, y: 480, texture: textures.OBSTACLE_TWO  },
      icepatch2: { x: 20500, y: 450, texture: textures.ICE_PATCH_TWO },
      obstacle13: { x: 21760, y: 360, texture: textures.OBSTACLE_FOUR },
      obstacle14: { x: 24020, y: 500, texture: textures.OBSTACLE_THREE },
    },
    mobile: {
      obstacle1: { x: 1600, y: 265, texture: textures.OBSTACLE_ONE  },
      obstacle2: { x: 2410, y: 570, texture: textures.OBSTACLE_TWO  },
      obstacle3: { x: 3300, y: 460, texture: textures.OBSTACLE_THREE  },
      obstacle4: { x: 5800, y: 480, texture: textures.OBSTACLE_FOUR   },
      obstacle5: { x: 7100, y: 590, texture: textures.OBSTACLE_ONE   },
      obstacle6: { x: 7680, y: 265, texture: textures.OBSTACLE_THREE   },
      obstacle7: { x: 12800, y: 265, texture: textures.OBSTACLE_FOUR  },
      icepatch1: { x: 9814, y: 460, texture: textures.ICE_PATCH_ONE  }
    }
}

class Game extends Phaser.Scene {
  constructor() {
    super();
    this.moveCam = false;
    this.speed = 50;
    this.device = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) ? 'mobile' : 'desktop';
  }

  preload() {

    console.log(this.mobile)
    // this.load.image('bg', 'assets/pics/the-end-by-iloe-and-made.jpg');
    this.load.image(textures.BACKGROUND, "assets/images/1.png");
    this.load.image(textures.SNOWAREA, "assets/images/2.png");
    this.load.image(textures.FOREGROUND, "assets/images/3.png");
    this.load.spritesheet(textures.BIKE, "assets/images/bike.png", {
      frameWidth: 74,
      frameHeight: 65,
    });
    this.load.image(textures.OBSTACLE_ONE, "assets/images/obstacle-1.png");
    this.load.image(textures.OBSTACLE_TWO, "assets/images/obstacle-2.png");
    this.load.image(textures.OBSTACLE_THREE, "assets/images/obstacle-3.png");
    this.load.image(textures.OBSTACLE_FOUR, "assets/images/obstacle-4.png");
    this.load.image(textures.ICE_PATCH_ONE, "assets/images/icepatch-1.png");
    this.load.image(textures.ICE_PATCH_TWO, "assets/images/icepatch-2.png");
    this.load.image(textures.DROP_ONE, "assets/images/drop1.png");
    this.load.spritesheet("blast", "assets/images/bomb.png", {
      frameWidth: 128,
      frameHeight: 128,
    });
    this.totalWidth = this.scale.width * 20;
  }

  create() {
    let gamePositions =  positions[this.device];
    this.cameras.main.setBounds(0, 0, this.totalWidth, 240);
    this.physics.world.setBounds(0, 170, this.totalWidth, 483);

    // create repeated background
    let bgWidth = this.textures.get(textures.BACKGROUND).getSourceImage().width - 5;
    let bgCount = Math.ceil(this.totalWidth / bgWidth);
    this.createRepeatedTexture(bgWidth, -2, textures.BACKGROUND, 0, 0.5, bgCount, 0);

    // create repeated snow area - game play area
    let snowWidth = this.textures.get(textures.SNOWAREA).getSourceImage().width - 5;
    let snowCount = Math.ceil(this.totalWidth / snowWidth);
    this.createRepeatedTexture(snowWidth, 220, textures.SNOWAREA, 0, 1, snowCount, 0);

    // create foreground
    let fgWidth = this.textures.get(textures.FOREGROUND).getSourceImage().width - 5;
    let fgCount = Math.ceil(this.totalWidth / fgWidth) * 1.5;
    this.createRepeatedTexture(fgWidth, 725, textures.FOREGROUND, 1, 1.3, fgCount, 1);

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


    // create ice patch group
    var icepatches = this.physics.add.group({ collideWorldBounds: true });
    icepatches.create(gamePositions.icepatch1.x, gamePositions.icepatch1.y, gamePositions.icepatch1.texture);
    icepatches.create(gamePositions.icepatch2.x, gamePositions.icepatch2.y, gamePositions.icepatch2.texture);

    // create ice drop
    var drops = this.physics.add.group({ collideWorldBounds: true });
    drops.create(gamePositions.drop1.x, gamePositions.drop1.y, gamePositions.drop1.texture)
    
    // keyboard event listener
    this.cursors = this.input.keyboard.createCursorKeys();

    // this.player = this.physics.add.image(400, 100, 'block');
    this.player = this.physics.add.sprite(100, 275, textures.BIKE);
    // this.player.setBodySize(80, 65, true)
    this.player.setScale(1.279);

    // The sprite is then set to collide with the world bounds. The bounds, by default, are on the outside of the game dimensions. As we set the game to be 800 x 600 then the player won't be able to run outside of this area. It will stop the player from being able to run off the edges of the screen or jump through the top
    this.player.setCollideWorldBounds(true);
    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers(textures.BIKE, {
        start: 0,
        end: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });

    // create obstacles group
    var obstacles = this.physics.add.group({ collideWorldBounds: true });
    obstacles.create(gamePositions.obstacle1.x, gamePositions.obstacle1.y, gamePositions.obstacle1.texture);
    obstacles.create(gamePositions.obstacle2.x, gamePositions.obstacle2.y, gamePositions.obstacle2.texture);
    obstacles.create(gamePositions.obstacle3.x, gamePositions.obstacle3.y, gamePositions.obstacle3.texture);
    obstacles.create(gamePositions.obstacle4.x, gamePositions.obstacle4.y, gamePositions.obstacle4.texture);
    obstacles.create(gamePositions.obstacle5.x, gamePositions.obstacle5.y, gamePositions.obstacle5.texture);
    obstacles.create(gamePositions.obstacle6.x, gamePositions.obstacle6.y, gamePositions.obstacle6.texture);
    obstacles.create(gamePositions.obstacle7.x, gamePositions.obstacle7.y, gamePositions.obstacle7.texture);
    obstacles.create(gamePositions.obstacle8.x, gamePositions.obstacle8.y, gamePositions.obstacle8.texture);
    obstacles.create(gamePositions.obstacle9.x, gamePositions.obstacle9.y, gamePositions.obstacle9.texture);
    obstacles.create(gamePositions.obstacle10.x, gamePositions.obstacle10.y, gamePositions.obstacle10.texture);
    obstacles.create(gamePositions.obstacle11.x, gamePositions.obstacle11.y, gamePositions.obstacle11.texture);
    obstacles.create(gamePositions.obstacle12.x, gamePositions.obstacle12.y, gamePositions.obstacle12.texture);
    obstacles.create(gamePositions.obstacle13.x, gamePositions.obstacle13.y, gamePositions.obstacle13.texture);
    obstacles.create(gamePositions.obstacle14.x, gamePositions.obstacle14.y, gamePositions.obstacle14.texture);
  


   

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
    console.log(this.player.y);
    // 333 / 5 = 66.6
    this.player.setVelocityX(100);
    this.player.anims.play("right", true);

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
      this.player.setVelocityY(-100);
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(100);
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
  createRepeatedTexture(width, height, texture, origin, scrollFactor, count, depth) {
    let x = -2;
    for (let i = 0; i < count; i++) {
      const m = this.add
        .image(x, height, texture)
        .setOrigin(origin)
        .setScrollFactor(scrollFactor)
        .setDepth(depth)

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
