import { useHref } from "@solidjs/router";

// Path registry for the application.
export const paths = {
  landing: "/",
  dashboard: "/home",
  feedback: "/feedback",
  unsubscribe: "/unsubscribe/:token",
} as const;

export function useApplicationPath(name: keyof typeof paths) {
  return useHref(() => paths[name]);
}
