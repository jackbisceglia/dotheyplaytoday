import { useHref } from "@solidjs/router";

// Path registry for the application.
export const paths = {
  home: "/",
  feedback: "/feedback",
  unsubscribe: "/unsubscribe/:token",
} as const;

export type PathHooks = {
  [K in keyof typeof paths as `use${Capitalize<string & K>}`]: () => () => string;
};

const toHookName = (key: string): string =>
  `use${key.slice(0, 1).toUpperCase()}${key.slice(1)}`;

const createPathHooks = (
  spec: Record<string, string>,
): Record<string, () => () => string> =>
  Object.fromEntries(
    Object.entries(spec).map(([key, value]) => [
      toHookName(key),
      () => useHref(() => value),
    ]),
  );

export const pathHooks = createPathHooks(paths) as PathHooks;
