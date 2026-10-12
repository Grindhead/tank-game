const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const { TILE_TYPES, generateGrid } = require('../src/Resources/create-level.cjs');

const count = (grid, value) =>
  grid.flat().filter((tile) => tile === value).length;

test('tile mapping matches the renderer: 1 = wall, 2 = hay', () => {
  assert.deepEqual(TILE_TYPES, { EMPTY: 0, WALL: 1, HAY: 2 });
  const gameScreen = fs.readFileSync(
    path.join(__dirname, '../src/Scene/Game/GameScreen.ts'),
    'utf8'
  );
  assert.match(gameScreen, /tileTypes\.json/);
  assert.match(gameScreen, /spriteType === TILE_TYPES\.WALL\)[\s\S]*?rocks\.png[\s\S]*?Infinity/);
  assert.match(gameScreen, /spriteType === TILE_TYPES\.HAY\)[\s\S]*?hay\.png[\s\S]*?life = 100/);
});

test('generated level has 50 walls and 25 destructible hay tiles', () => {
  for (let i = 0; i < 20; i++) {
    const grid = generateGrid();
    assert.equal(grid.length, 50);
    grid.forEach((row) => assert.equal(row.length, 50));
    assert.equal(count(grid, TILE_TYPES.WALL), 50);
    assert.equal(count(grid, TILE_TYPES.HAY), 25);
  }
});

test('committed staticMaze.json uses the documented mapping', () => {
  const { data } = require('../src/Resources/JSON/staticMaze.json');
  assert.equal(count(data, TILE_TYPES.WALL), 50);
  assert.equal(count(data, TILE_TYPES.HAY), 25);
});
