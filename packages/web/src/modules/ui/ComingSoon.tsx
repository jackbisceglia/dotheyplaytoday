import { createEffect, createSignal, createUniqueId } from "solid-js";
import type { ParentProps } from "solid-js";

type ComingSoonProps = ParentProps<{
  readonly class?: string;
  readonly message?: string;
}>;

const TOOLTIP_GAP = 8;
const VIEWPORT_MARGIN = 8;

/** A focusable, inactive control with an accessible explanatory tooltip. */
export function ComingSoon(props: ComingSoonProps) {
  const descriptionId = `coming-soon-${createUniqueId()}`;
  const [visible, setVisible] = createSignal(false);
  const [placement, setPlacement] = createSignal({ top: 0, left: 0 });

  let trigger: HTMLButtonElement | undefined;
  let tooltip: HTMLSpanElement | undefined;

  // The tooltip is fixed to the viewport so an ancestor scroll container — the
  // league row — cannot clip it. That trades clipping for staleness: it has to
  // be re-measured whenever anything it is anchored to moves.
  const place = () => {
    if (!trigger || !tooltip) return;

    const anchor = trigger.getBoundingClientRect();
    const half = tooltip.getBoundingClientRect().width / 2;
    const centre = anchor.left + anchor.width / 2;
    const min = VIEWPORT_MARGIN + half;
    const max = window.innerWidth - VIEWPORT_MARGIN - half;

    setPlacement({
      top: anchor.bottom + TOOLTIP_GAP,
      left: max < min ? centre : Math.min(Math.max(centre, min), max),
    });
  };

  const show = () => {
    place();
    setVisible(true);
  };

  createEffect(visible, (isVisible) => {
    if (!isVisible) return;

    // Capture, so scrolling the league row itself is caught too.
    window.addEventListener("scroll", place, { capture: true, passive: true });
    window.addEventListener("resize", place, { passive: true });
    return () => {
      window.removeEventListener("scroll", place, { capture: true });
      window.removeEventListener("resize", place);
    };
  });

  return (
    <span
      class="coming-soon"
      onPointerEnter={show}
      onPointerLeave={() => {
        setVisible(false);
      }}
      onFocusIn={show}
      onFocusOut={() => {
        setVisible(false);
      }}
    >
      <button
        ref={trigger}
        type="button"
        class={props.class}
        aria-disabled="true"
        aria-describedby={descriptionId}
        onClick={(event) => {
          event.preventDefault();
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.stopPropagation();
            setVisible(false);
          }
        }}
      >
        {props.children}
      </button>
      <span
        ref={tooltip}
        id={descriptionId}
        class="coming-soon-tooltip"
        role="tooltip"
        data-visible={visible() ? "true" : "false"}
        style={{
          top: `${placement().top.toString()}px`,
          left: `${placement().left.toString()}px`,
        }}
      >
        {props.message ?? "Coming soon"}
      </span>
    </span>
  );
}
