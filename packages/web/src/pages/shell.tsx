import { createSignal, Show } from "solid-js";
import type { ParentProps } from "solid-js";

import { ManageAuthHint } from "../lib/auth/ManageAuthHint.js";

function DevCatalogNotice() {
  const [isVisible, setIsVisible] = createSignal(true);

  return (
    <Show when={import.meta.env.DEV && isVisible()}>
      <aside class="dev-catalog-notice" role="status">
        <span>
          Development catalog: event notifications are available for the NBA
          only.
        </span>
        <button
          type="button"
          aria-label="Dismiss development catalog notice"
          onClick={() => {
            setIsVisible(false);
          }}
        >
          ×
        </button>
      </aside>
    </Show>
  );
}

export function RootShell(props: ParentProps) {
  return (
    <>
      <ManageAuthHint />
      <DevCatalogNotice />
      {props.children}
    </>
  );
}
