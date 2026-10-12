import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

// Checks each path segment against the real directory listing, so casing
// mismatches fail even on case-insensitive file systems.
const existsWithExactCase = (absolute) => {
  const rel = path.relative(root, absolute).split(path.sep);
  let dir = root;
  for (const segment of rel) {
    if (!fs.readdirSync(dir).includes(segment)) return false;
    dir = path.join(dir, segment);
  }
  return true;
};

test('Index.ts relative non-TS imports resolve with exact casing', () => {
  const file = path.join(root, 'src/Index.ts');
  const source = fs.readFileSync(file, 'utf8');
  const specifiers = [...source.matchAll(/import\s+(?:[^'"]+from\s+)?'(\.[^']+)'/g)]
    .map((m) => m[1])
    .filter((s) => path.extname(s));
  assert.ok(specifiers.includes('./Resources/CSS/styles.css'));
  for (const specifier of specifiers) {
    const target = path.resolve(path.dirname(file), specifier);
    assert.ok(existsWithExactCase(target), `${specifier} does not exist with this casing`);
  }
});
