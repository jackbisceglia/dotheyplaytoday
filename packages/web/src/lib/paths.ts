import { useHref } from "@solidjs/router";

// Path registry for the application.
export const paths = {
  landing: "/",
  login: "/?modal=login",
  home: "/home",
  feedback: "/feedback",
  unsubscribe: "/unsubscribe",
  unsubscribeToken: "/unsubscribe/:token",
} as const;

export function useApplicationPath(name: keyof typeof paths) {
  return useHref(() => paths[name]);
}
