import { Show } from "solid-js";
import type { ParentProps } from "solid-js";

import { ManageAuthHint } from "../lib/auth/ManageAuthHint.js";

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
    <>
      <ManageAuthHint />
      <DevCatalogNotice />
      {props.children}
    </>
  );
}
