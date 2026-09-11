import { Show } from "solid-js";
import type { ParentProps } from "solid-js";

import { AuthHintSync } from "../lib/auth/HintSync.js";

function DevCatalogNotice() {
  return (
    <Show when={import.meta.env.DEV}>
      <aside class="dev-catalog-notice" role="status">
        Development catalog: event notifications are available for the NBA
        only.
      </aside>
    </Show>
  );
}

export function RootShell(props: ParentProps) {
  return (
    <AuthHintSync>
      <DevCatalogNotice />
      {props.children}
    </AuthHintSync>
  );
}
