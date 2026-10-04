import { createEffect, createSignal } from "solid-js";

// TanStack Router's two thresholds: `pendingMs` keeps the indicator off screen
// for quick work, `pendingMinMs` stops a shown one blinking straight back out.
const pendingMs = 200;
const pendingMinMs = 400;

export function usePendingIndicator(pending: () => boolean): () => boolean {
  const [visible, setVisible] = createSignal(false);

  // When the indicator appeared, or undefined while it is hidden. Survives
  // pending work restarting mid-hold, so an overlapping cycle cannot strand it.
  let shownAt: number | undefined;

  const hide = () => {
    shownAt = undefined;
    setVisible(false);
  };

  createEffect(pending, (isPending) => {
    if (isPending) {
      if (shownAt !== undefined) return;

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

    if (remaining <= 0) {
      hide();
      return;
    }

    const timer = window.setTimeout(hide, remaining);

    return () => {
      window.clearTimeout(timer);
    };
  });

  return visible;
}
