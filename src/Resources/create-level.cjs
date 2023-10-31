const fs = require('fs');
const path = require('path');

/**
 * creates a new level with 25 destructable tiles and 50 wall tiles in a 50x50 grid.
 */
const createLevel = () => {
  const gridSize = 50;
  const destructibleTiles = 25;
  const wallTiles = 50;
  const grid = [];

  // Initialize a 2D array filled with zeros
  for (let i = 0; i < gridSize; i++) {
    grid.push(Array(gridSize).fill(0));
  }

  // Create walls
  for (let i = 0; i < wallTiles; i++) {
    let x, y;
    do {
      x = Math.floor(Math.random() * gridSize);
      y = Math.floor(Math.random() * gridSize);
    } while (grid[y][x] !== 0);

    grid[y][x] = 2;
  }

  // Create destructible tiles
  for (let i = 0; i < destructibleTiles; i++) {
    let x, y;
    do {
      x = Math.floor(Math.random() * gridSize);
      y = Math.floor(Math.random() * gridSize);
    } while (grid[y][x] !== 0);

    grid[y][x] = 1;
  }
  const levelData = { data: grid };
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

createLevel();
