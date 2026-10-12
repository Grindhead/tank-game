/**
 * Tracks whether the fire key is held.
 *
 * The latch only engages on a fresh (non auto-repeat) press, and is cleared on
 * release, on scene exit and when the page loses focus. This stops a stale
 * "held" state from firing every frame after the keyup was missed (for
 * example when the key is released in another scene or another tab).
 */
export class FireLatch {
  /**
   * is the fire key currently held
   */
  private held: boolean = false;

  /**
   * handle a key down for the fire key
   * @param isRepeat - true when the event is an auto-repeat of a held key
   * @returns void
   */
  press(isRepeat: boolean): void {
    if (!isRepeat) {
      this.held = true;
    }
  }

  /**
   * handle a key up for the fire key
   * @returns void
   */
  release(): void {
    this.held = false;
  }

  /**
   * clear the latch, e.g. on scene exit or focus loss
   * @returns void
   */
  reset(): void {
    this.held = false;
  }

  /**
   * should the player fire this frame
   * @returns boolean
   */
  isHeld(): boolean {
    return this.held;
  }
}
