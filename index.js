const CELL_WIDTH = 24;
const CELL_HEIGHT = 24;

const WIDTH = 20;
const HEIGHT = 20;

const PIXEL_WIDTH = CELL_WIDTH * WIDTH;
const PIXEL_HEIGHT = CELL_HEIGHT * HEIGHT;

let config = {
  type: Phaser.AUTO,
  width: PIXEL_WIDTH,
  height: PIXEL_HEIGHT,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

let game = new Phaser.Game(config);

let maze;

function preload() {
  this.load.spritesheet("tileset", "assets/tileset.png", {
    frameWidth: 16,
    frameHeight: 16,
  });

  this.load.spritesheet("player", "assets/player.png", {
    frameWidth: 24,
    frameHeight: 24,
  });
}

function create() {
  // Sprite init

  let player = this.physics.add.sprite(CELL_WIDTH, CELL_HEIGHT, "player");

  this.anims.create({
    key: "idle",
    frames: this.anims.generateFrameNumbers("player", { start: 0, end: 3 }),
    frameRate: 8,
    repeat: -1,
  });

  player.anims.play("idle", true);

  // Maze init
  maze = generateMaze();

  // Place walls in the pattern in maze
}

function update() {
  // Player control stuff
}

function generateMaze() {
  // TODO
}
