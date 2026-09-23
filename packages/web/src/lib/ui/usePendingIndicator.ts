import { createEffect, createSignal } from "solid-js";

// TanStack Router's two thresholds: `pendingMs` keeps the indicator off screen
// for quick work, `pendingMinMs` stops a shown one blinking straight back out.
const pendingMs = 200;
const pendingMinMs = 400;

export function usePendingIndicator(pending: () => boolean): () => boolean {
  const [visible, setVisible] = createSignal(false);

  // Mirrors `visible` so the effect never has to read the signal back.
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
