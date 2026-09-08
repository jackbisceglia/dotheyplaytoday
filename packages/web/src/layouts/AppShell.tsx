import type { ParentProps } from "solid-js";
import { Loading, Show } from "solid-js";

export function AppShell(props: ParentProps) {
  return (
    <>
      <Show when={import.meta.env.DEV}>
        <aside class="dev-catalog-notice" role="status">
          Development catalog: event notifications are available for the NBA
          only.
        </aside>
      </Show>
      <Loading fallback={<p>Loading...</p>}>{props.children}</Loading>
    </>
  );
}
