import { createSignal, onCleanup } from "solid-js";

type Store<T> = {
  get: () => T;
  listen: (listener: (value: T) => void) => () => void;
};

// Temporary bridge until better-auth ships Solid 2 bindings.
export function useStore<T>(store: Store<T>): () => T {
  const deactivate = store.listen(() => {
    // lint(eslint/no-empty-function): Activate the lazy store before reading its initial state; this temporary listener does not consume updates.
  });

  const [state, setState] = createSignal({ value: store.get() });
  const unsubscribe = store.listen((value) => {
    setState({ value });
  });

  onCleanup(unsubscribe);
  deactivate();

  return () => state().value;
}
