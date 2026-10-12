const fs = require('fs');
const path = require('path');

/**
 * The single tile value mapping shared by level generation and GameScreen:
 * EMPTY = 0 (floor), WALL = 1 (indestructible rocks), HAY = 2 (destructible hay).
 */
const TILE_TYPES = require('./JSON/tileTypes.json');

/**
 * places `count` tiles of `value` on random empty cells of the grid
 */
const placeTiles = (grid, count, value, random) => {
  const gridSize = grid.length;
  for (let i = 0; i < count; i++) {
    let x, y;
    do {
      x = Math.floor(random() * gridSize);
      y = Math.floor(random() * gridSize);
    } while (grid[y][x] !== TILE_TYPES.EMPTY);

    grid[y][x] = value;
  }
};

/**
 * builds a grid with `wallTiles` indestructible wall tiles and
 * `destructibleTiles` destructible hay tiles.
 */
const generateGrid = ({
  gridSize = 50,
  wallTiles = 50,
  destructibleTiles = 25,
  random = Math.random
} = {}) => {
  const grid = [];

  // Initialize a 2D array filled with empty tiles
  for (let i = 0; i < gridSize; i++) {
    grid.push(Array(gridSize).fill(TILE_TYPES.EMPTY));
  }

  placeTiles(grid, wallTiles, TILE_TYPES.WALL, random);
  placeTiles(grid, destructibleTiles, TILE_TYPES.HAY, random);

  return grid;
};

/**
 * creates a new level with 25 destructable tiles and 50 wall tiles in a 50x50 grid.
 */
const createLevel = () => {
  const levelData = { data: generateGrid() };
  // Convert the grid to a JSON string
  const jsonGrid = JSON.stringify(levelData);

  // Create the output directory if it doesn't exist
  const outputPath = path.join(__dirname, '/JSON');
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath);
  }

  // Save the JSON to a file
  fs.writeFileSync(outputPath + '/staticMaze.json', jsonGrid);
};

module.exports = { TILE_TYPES, generateGrid, createLevel };

if (require.main === module) {
  createLevel();
}
