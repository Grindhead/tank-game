import test from 'node:test';
import assert from 'node:assert/strict';
import { loadWithRetry, once, waitForFont } from '../src/Utils/Startup.ts';

const flush = () => new Promise((r) => setImmediate(r));

test('once runs the callback a single time', () => {
  let calls = 0;
  const f = once(() => calls++);
  f(); f(); f();
  assert.equal(calls, 1);
});

test('blocked font still starts (timeout path)', () => {
  let started = 0;
  let timer;
  waitForFont(() => {}, () => started++, 3000, (cb) => (timer = cb));
  assert.equal(started, 0);
  timer();
  assert.equal(started, 1);
});

test('font loader error or inactive starts once, timeout does not start again', () => {
  let started = 0;
  let timer;
  waitForFont((done) => { done(); done(); }, () => started++, 3000, (cb) => (timer = cb));
  timer();
  assert.equal(started, 1);
});

test('font loader throwing still starts', () => {
  let started = 0;
  waitForFont(() => { throw new Error('blocked'); }, () => started++, 3000, () => {});
  assert.equal(started, 1);
});

test('missing atlas reports error; retry initializes exactly once', async () => {
  let loaded = 0;
  const errors = [];
  const attempts = [];
  let retryFn;
  loadWithRetry({
    load: (attempt) => {
      attempts.push(attempt);
      return attempt < 2 ? Promise.reject(new Error('404')) : Promise.resolve();
    },
    onLoaded: () => loaded++,
    onError: (e, retry) => { errors.push(e.message); retryFn = retry; }
  });
  await flush();
  assert.deepEqual(errors, ['404']);
  assert.equal(loaded, 0);
  retryFn();
  retryFn(); // double click while in flight is ignored
  await flush();
  assert.deepEqual(errors, ['404', '404']);
  retryFn();
  await flush();
  assert.equal(loaded, 1);
  retryFn(); // stale retry after success does not initialize again
  await flush();
  assert.equal(loaded, 1);
  assert.deepEqual(attempts, [0, 1, 2]);
});
