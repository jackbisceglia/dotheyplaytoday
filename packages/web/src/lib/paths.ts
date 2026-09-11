import { useHref } from "@solidjs/router";

// Path registry for the application.
export const paths = {
  home: "/",
  feedback: "/feedback",
  unsubscribe: "/unsubscribe/:token",
} as const;

export function useApplicationPath(name: keyof typeof paths): string {
  const href = useHref(() => paths[name]);
  return href();
}
