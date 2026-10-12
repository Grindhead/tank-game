import test from 'node:test';
import assert from 'node:assert/strict';
import { FireLatch } from '../src/Utils/FireLatch.ts';

test('press and release fires only while held', () => {
  const latch = new FireLatch();
  assert.equal(latch.isHeld(), false);
  latch.press(false);
  assert.equal(latch.isHeld(), true);
  latch.release();
  assert.equal(latch.isHeld(), false);
});

test('reset on scene exit, then key auto-repeat in new game does not fire', () => {
  const latch = new FireLatch();
  latch.press(false);
  latch.reset(); // scene closed while Space held
  latch.press(true); // auto-repeat keydown arriving after re-entry
  assert.equal(latch.isHeld(), false);
  latch.press(false); // fresh press
  assert.equal(latch.isHeld(), true);
});

test('focus loss stops firing until another press', () => {
  const latch = new FireLatch();
  latch.press(false);
  latch.reset(); // blur / hidden tab
  assert.equal(latch.isHeld(), false);
  latch.press(false);
  assert.equal(latch.isHeld(), true);
});
