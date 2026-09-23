import { createEffect, createSignal } from "solid-js";

/**
 * TanStack Router's two pending thresholds, which solve two different flashes.
 *
 * `pendingMs` is how long work may run before the loading UI is allowed to
 * appear at all, so quick loads paint straight to content. `pendingMinMs` is
 * how long it stays once it has appeared, so work that finishes just past the
 * first threshold cannot blink the UI in and out.
 */
const pendingMs = 200;
const pendingMinMs = 400;

/**
 * Tracks whether a loading indicator should be on screen for `pending` work.
 * Never true for work shorter than {@link pendingMs}; once true, stays true
 * for at least {@link pendingMinMs}.
 */
export function usePendingIndicator(pending: () => boolean): () => boolean {
  const [visible, setVisible] = createSignal(false);

  // Mirrors `visible` as a plain value so the effect never has to read the
  // signal back: when it was shown, or undefined while it is hidden.
  let shownAt: number | undefined;

  createEffect(pending, (isPending) => {
    if (isPending) {
      const timer = window.setTimeout(() => {
        shownAt = Date.now();
        setVisible(true);
      }, pendingMs);

      return () => {
        window.clearTimeout(timer);
      };
    }

    // Finished inside the quiet window: nothing was ever shown.
    if (shownAt === undefined) return;

    const remaining = pendingMinMs - (Date.now() - shownAt);
    shownAt = undefined;

    if (remaining <= 0) {
      setVisible(false);
      return;
    }

    const timer = window.setTimeout(() => {
      setVisible(false);
    }, remaining);

    return () => {
      window.clearTimeout(timer);
    };
  });

  return visible;
}
