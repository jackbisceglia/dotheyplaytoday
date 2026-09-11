import { createSignal, onCleanup } from "solid-js";

type Store<T> = {
  get: () => T;
  listen: (listener: (value: T) => void) => () => void;
};

// Nanostore → Solid 2 bridge. Temporary: delete once better-auth ships
// Solid 2 bindings and point lib/auth.ts at better-auth/solid instead.
// Takes the store as input so the bridge never imports the auth client.
export function useStore<T>(store: Store<T>): () => T {
  // Activate before reading, so initialization updates are captured.
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const deactivate = store.listen(() => {});

  const [state, setState] = createSignal({ value: store.get() });
  const unsubscribe = store.listen((value) => {
    setState({ value });
  });

  onCleanup(unsubscribe);
  deactivate();

  return () => state().value;
}
