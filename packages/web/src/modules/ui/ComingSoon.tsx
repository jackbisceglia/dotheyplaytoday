import { createSignal, createUniqueId } from "solid-js";
import type { ParentProps } from "solid-js";

type ComingSoonProps = ParentProps<{
  readonly class?: string;
  readonly message?: string;
}>;

/** A focusable, inactive control with an accessible explanatory tooltip. */
export function ComingSoon(props: ComingSoonProps) {
  const descriptionId = `coming-soon-${createUniqueId()}`;
  const [dismissed, setDismissed] = createSignal(false);

  return (
    <span
      class="coming-soon"
      onPointerEnter={() => {
        setDismissed(false);
      }}
    >
      <button
        type="button"
        class={props.class}
        aria-disabled="true"
        aria-describedby={descriptionId}
        onClick={(event) => {
          event.preventDefault();
        }}
        onFocus={() => {
          setDismissed(false);
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.stopPropagation();
            setDismissed(true);
          }
        }}
      >
        {props.children}
      </button>
      <span
        id={descriptionId}
        class="coming-soon-tooltip"
        role="tooltip"
        hidden={dismissed()}
      >
        {props.message ?? "Coming soon"}
      </span>
    </span>
  );
}
