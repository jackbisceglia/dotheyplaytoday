import { Show } from "solid-js";
import type { ParentProps } from "solid-js";

export function RootShell(props: ParentProps) {
  return (
    <>
      <Show when={import.meta.env.DEV}>
        <aside class="dev-catalog-notice" role="status">
          Development catalog: event notifications are available for the NBA
          only.
        </aside>
      </Show>
      {props.children}
    </>
  );
}
