import { createSignal, onCleanup } from "solid-js";

type Store<T> = {
  get: () => T;
  listen: (listener: (value: T) => void) => () => void;
};

// Temporary bridge until better-auth ships Solid 2 bindings.
export function useStore<T>(store: Store<T>): () => T {
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
