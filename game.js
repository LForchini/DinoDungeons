const CELL_WIDTH = 32;
const CELL_HEIGHT = 32;

const WIDTH = 20;
const HEIGHT = 20;

const PIXEL_WIDTH = CELL_WIDTH * WIDTH;
const PIXEL_HEIGHT = CELL_HEIGHT * HEIGHT;

const SCALE = CELL_WIDTH / 16;

const TILESET_OFFSET_X = 6;
const TILESET_OFFSET_Y = 4;
const TILESET_WIDTH = 19;

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
let player, player_sprite;

function preload() {
  this.load.image("tileset", "assets/tileset.png");

  this.load.spritesheet("player", "assets/player.png", {
    frameWidth: 24,
    frameHeight: 24,
  });
}

function create() {
  // Player init
  player = { x: 1, y: 1 };
  player_sprite = this.physics.add.sprite(
    maze_to_pixel_x(player.x),
    maze_to_pixel_y(player.y),
    "player"
  );

  player_sprite.displayWidth = CELL_WIDTH;
  player_sprite.displayHeight = CELL_HEIGHT;
  player_sprite.scale = SCALE;

  this.anims.create({
    key: "idle",
    frames: this.anims.generateFrameNumbers("player", { start: 0, end: 3 }),
    frameRate: 8,
    repeat: -1,
  });

  player_sprite.anims.play("idle", true);

  // Maze init
  maze = generateMaze();

  // Place walls in the pattern in maze
  let tile_layer = [];
  for (let i = 0; i < WIDTH; i++) {
    let tile_column = [];
    for (let j = 0; j < HEIGHT; j++) {
      // FORMAT IS: UP RIGHT DOWN LEFT
      let n = [
        i > 0 ? maze[j][i - 1].wall : null,
        j < HEIGHT - 1 ? maze[j + 1][i].wall : null,
        i < WIDTH - 1 ? maze[j][i+1].wall : null,
        j > 0 ? maze[j-1][i].wall : null,
      ];
      let c = n.filter((v) => v).length;

      if (!maze[j][i].wall) {
        tile_column.push(ctot(2, -2));
      } else {
        // NO NEIGHBOURS
        if (c == 0) {
          tile_column.push(ctot(-1, 2));

          // ONE NEIGHBOUR
        } else if (c == 1) {
          if (n[0]) {
            tile_column.push(ctot(4, 3));
          } else if (n[1]) {
            tile_column.push(ctot(0, 0));
          } else if (n[2]) {
            tile_column.push(ctot(4, 0));
          } else if (n[3]) {
            tile_column.push(ctot(3, 0));
          } else {
            tile_column.push(ctot(-1, 2))
          }

          // TWO NEIGHBOURS
        } else if (c == 2) {
          if (n[0] && n[1]) {
            tile_column.push(ctot(0, 2))
          } else if (n[0] && n[2]) {
            tile_column.push(ctot(4, 2));
          } else if (n[0] && n[3]) {
            tile_column.push(ctot(1, 2));
          } else if (n[1] && n[2]) {
            tile_column.push(ctot(0, 1));
          } else if (n[1] && n[3]) {
            tile_column.push(ctot(1, 0));
          } else if (n[2] && n[3]) {
            tile_column.push(ctot(1, 1));
          } else {
            tile_column.push(ctot(-1, 2));
          }
        
          // THREE NEIGHBOURS
        } else if (c == 3) {
          if (n[0] && n[1] && n[2]) {
            tile_column.push(ctot(2, 2));
          } else if (n[0] && n[1] && n[3]) {
            tile_column.push(ctot(3, 2));
          } else if (n[0] && n[2] && n[3]) {
            tile_column.push(ctot(3, 1));
          } else if (n[1] && n[2] && n[3]) {
            tile_column.push(ctot(2, 1));
          } else {
            tile_column.push(ctot(-1, 2));
          }

          // FOUR NEIGHBOURS
        } else if (c == 4) {
          tile_column.push(ctot(3, 3));
        } else {
          tile_column.push(ctot(-1, 2));
        }
      
        
      }
    }
    tile_layer.push(tile_column);
  }
  tile_layer[0][1] = ctot(-2, 2);
  tile_layer[WIDTH - 2][HEIGHT - 2] = ctot(-1, 0);

  const map = this.make.tilemap({
    data: tile_layer,
    tileWidth: 16,
    tileHeight: 16,
  });

  const tiles = map.addTilesetImage("tileset");
  const layer = map.createLayer(0, tiles, 0, 0).setDepth(-1);
  layer.scale = SCALE;
}

let wasDown = {
  up: false,
  right: false,
  left: false,
  down: false,
};

let won = false;

function update() {
  // Player control stuff
  let cursors = this.input.keyboard.createCursorKeys();

  if (cursors.up.isDown) {
    wasDown.up = true;
  } else if (wasDown.up) {
    wasDown.up = false;
    player.y -= 1;
    if (maze[player.x][player.y].wall) player.y += 1;
    if (player.y < 0) player.y = 0;
  }
  if (cursors.right.isDown) {
    wasDown.right = true;
  } else if (wasDown.right) {
    wasDown.right = false;
    player.x += 1;
    if (maze[player.x][player.y].wall) player.x -= 1;
    if (player.x > WIDTH - 1) player.x = WIDTH - 1;
  }
  if (cursors.down.isDown) {
    wasDown.down = true;
  } else if (wasDown.down) {
    wasDown.down = false;
    player.y += 1;
    if (maze[player.x][player.y].wall) player.y -= 1;
    if (player.y > HEIGHT - 1) player.y = HEIGHT - 1;
  }
  if (cursors.left.isDown) {
    wasDown.left = true;
  } else if (wasDown.left) {
    wasDown.left = false;
    player.x -= 1;
    if (maze[player.x][player.y].wall) player.x += 1;
    if (player.x < 0) player.x = 0;
  }

  player_sprite.x = maze_to_pixel_x(player.x);
  player_sprite.y = maze_to_pixel_y(player.y);

  if (player.x == WIDTH - 2 && player.y == HEIGHT - 2 && !won) {
    alert("You have won!");
    won = true;
    location.reload();
  }
}

function maze_to_pixel_x(x) {
  return x * CELL_WIDTH + CELL_WIDTH / 2;
}
function maze_to_pixel_y(y) {
  return y * CELL_HEIGHT + CELL_HEIGHT / 2;
}

function ctot(x, y) {
  return TILESET_WIDTH * (TILESET_OFFSET_Y + y) + TILESET_OFFSET_X + x;
}

/**
 * [
 *  [
 *    {
 *      wall: bool;
 *    }
 *  ]
 *]
 * 
 * TODO: currently a placeholder that returns a 2d array of these objects
 */
function generateMaze() {
  let m = [];
  for (let i = 0; i < WIDTH; i++) {
    let c = [];
    for (let j = 0; j < HEIGHT; j++) {
      c.push({
        wall: true
      });
    }
    m.push(c);
  }



  let stack = [[1, 1]];
  while (stack.length > 0) {
    let [current_x, current_y] = stack.pop()
    

     let neighbour_coords = [
        [current_x,current_y - 1],
        [current_x + 1,current_y],
        [current_x,current_y + 1],
        [current_x - 1,current_y]
    ];
    shuffleArray(neighbour_coords)

    
    let count_free = neighbour_coords.filter(([vx, vy]) => !m[vx][vy].wall).length;
    if (count_free == 1 || (current_x == 1 && current_y == 1)) {
      m[current_x][current_y].wall = false;
    } else {
      continue
    }

    for (let i = 0; i < neighbour_coords.length;i++) {
      let coord = neighbour_coords[i];
      let [n_x, n_y] = coord;
      if (n_x <= 0 || n_x >= WIDTH-1) continue;
      if (n_y <= 0 || n_y >= HEIGHT - 1) continue;
      if (!m[n_x][n_y].wall) continue;
      let n_n_coords = [
        [n_x,n_y - 1],
        [n_x + 1,n_y],
        [n_x,n_y + 1],
        [n_x - 1,n_y]
      ];

      let count_free = n_n_coords.filter(([vx, vy]) => !m[vx][vy].wall).length;

      if (count_free == 1) {
        stack.push([n_x, n_y]);
      }
      
    }
      
  }

  return m;
}
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}