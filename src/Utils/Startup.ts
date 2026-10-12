/**
 * Wraps a callback so it only ever runs once, however many times it is called.
 * @param fn - the callback to guard
 * @returns the guarded callback
 */
export const once = <T extends unknown[]>(
  fn: (...args: T) => void
): ((...args: T) => void) => {
  let called = false;
  return (...args: T) => {
    if (called) {
      return;
    }
    called = true;
    fn(...args);
  };
};

/**
 * Waits for a web font, but continues after `timeoutMs` or on any loader
 * failure, so a blocked font never stops the game from starting.
 * @param loadFont - starts loading the font; must call `done` when the font is active, inactive or failed
 * @param onReady - called exactly once when startup may continue
 * @param timeoutMs - how long to wait before giving up on the font
 * @param setTimer - timer function, injectable for tests
 * @returns void
 */
export const waitForFont = (
  loadFont: (done: () => void) => void,
  onReady: () => void,
  timeoutMs: number,
  setTimer: (cb: () => void, ms: number) => unknown = setTimeout
): void => {
  const ready = once(onReady);
  setTimer(ready, timeoutMs);
  try {
    loadFont(ready);
  } catch {
    ready();
  }
};

/**
 * the callbacks used by {@link loadWithRetry}
 */
export interface LoadWithRetryOptions {
  /**
   * loads the assets; `attempt` starts at 0 and increases on each retry
   */
  load: (attempt: number) => Promise<unknown>;
  /**
   * called once, after the first successful load
   */
  onLoaded: () => void;
  /**
   * called when a load fails; call `retry` to try again
   */
  onError: (error: unknown, retry: () => void) => void;
}

/**
 * Loads assets and reports failures with a retry hook. `onLoaded` runs at most
 * once, so retrying can never initialize the game twice.
 * @param options - the {@link LoadWithRetryOptions}
 * @returns void
 */
export const loadWithRetry = (options: LoadWithRetryOptions): void => {
  const loaded = once(options.onLoaded);
  let attempt = 0;
  let inFlight = false;
  let done = false;

  const run = (): void => {
    if (inFlight || done) {
      return;
    }
    inFlight = true;
    const current = attempt;
    attempt++;
    options.load(current).then(
      () => {
        inFlight = false;
        done = true;
        loaded();
      },
      (error: unknown) => {
        inFlight = false;
        options.onError(error, run);
      }
    );
  };

  run();
};
