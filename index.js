const CELL_WIDTH = 32;
const CELL_HEIGHT = 32;

const WIDTH = 20;
const HEIGHT = 20;

const PIXEL_WIDTH = CELL_WIDTH * WIDTH;
const PIXEL_HEIGHT = CELL_HEIGHT * HEIGHT;

const SCALE = CELL_WIDTH / 16;

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
let player;

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
  // Init floor tiles
  this.anims.create({
    key: "floor",
    frames: this.anims.generateFrameNumbers("tileset", {
      start: 129,
      end: 129,
    }),
    frameRate: 0,
    repeat: -1,
  });

  let floor_tiles = [];
  for (let i = 0; i < WIDTH; i++) {
    let cross_tiles = [];
    for (let j = 0; j < HEIGHT; j++) {
      let floor = this.physics.add.sprite(
        CELL_WIDTH * i + CELL_WIDTH / 2,
        CELL_HEIGHT * j + CELL_HEIGHT / 2,
        "tileset"
      );
      floor.displayWidth = CELL_WIDTH;
      floor.displayHeight = CELL_HEIGHT;
      floor.scale = SCALE;
      floor.anims.play("floor", true);
      cross_tiles.push(floor);
    }
    floor_tiles.push(cross_tiles);
  }

  // Sprite init
  player = this.physics.add.sprite(
    CELL_WIDTH + CELL_WIDTH / 2,
    CELL_HEIGHT + CELL_HEIGHT / 2,
    "player"
  );
  player.displayWidth = CELL_WIDTH;
  player.displayHeight = CELL_HEIGHT;
  player.scale = SCALE;

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

let wasDown = {
  up: false,
  right: false,
  left: false,
  down: false,
};

function update() {
  // Player control stuff
  let cursors = this.input.keyboard.createCursorKeys();

  // TODO: ADD CHECKS IF WALL IN THE WAY
  if (cursors.up.isDown) {
    wasDown.up = true;
  } else if (wasDown.up) {
    wasDown.up = false;
    player.y -= CELL_HEIGHT;
  }
  if (cursors.right.isDown) {
    wasDown.right = true;
  } else if (wasDown.right) {
    wasDown.right = false;
    player.x += CELL_HEIGHT;
  }
  if (cursors.down.isDown) {
    wasDown.down = true;
  } else if (wasDown.down) {
    wasDown.down = false;
    player.y += CELL_HEIGHT;
  }
  if (cursors.left.isDown) {
    wasDown.left = true;
  } else if (wasDown.left) {
    wasDown.left = false;
    player.x -= CELL_HEIGHT;
  }
}

/**
 * [
 *    {
 *        up: bool;
 *        right: bool;
 *        down: bool;
 *        left: bool;
 *    }
 * ]
 */
function generateMaze() {
  // TODO
}
