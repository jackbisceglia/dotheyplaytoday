import { useHref } from "@solidjs/router";

// Path registry for the application.
export const paths = {
  home: "/",
  feedback: "/feedback",
  unsubscribe: "/unsubscribe/:token",
} as const;

// Base-aware href for a registered path. Returns a plain string: the input
// is static and the router base never changes mid-render, so there is
// nothing to stay subscribed to.
export function useApplicationPath(name: keyof typeof paths): string {
  const href = useHref(() => paths[name]);
  return href();
}
