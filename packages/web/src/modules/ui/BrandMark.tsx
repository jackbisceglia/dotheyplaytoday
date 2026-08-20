import { createEffect, createSignal, createUniqueId } from "solid-js";

const EYE_LOOK_RADIUS = 1.3;

type BrandMarkProps = {
  readonly class?: string;
};

export function BrandMark(props: BrandMarkProps) {
  let svg: SVGSVGElement | undefined;
  const [pupil, setPupil] = createSignal({ x: 0, y: 0 });
  const pupilTransform = () =>
    `translate(${pupil().x.toFixed(3)} ${pupil().y.toFixed(3)})`;
  const uid = createUniqueId();
  const frameId = `mascot-frame-${uid}`;
  const headId = `mascot-head-${uid}`;

  createEffect(
    () => undefined,
    () => {
      const handleMove = (event: PointerEvent) => {
        if (!svg) return;
        const rect = svg.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const angle = Math.atan2(event.clientY - cy, event.clientX - cx);
        setPupil({
          x: Math.cos(angle) * EYE_LOOK_RADIUS,
          y: Math.sin(angle) * EYE_LOOK_RADIUS,
        });
      };

      window.addEventListener("pointermove", handleMove, { passive: true });
      return () => {
        window.removeEventListener("pointermove", handleMove);
      };
    },
  );

  return (
    <svg
      ref={svg}
      class={props.class}
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <clipPath id={frameId}>
          <rect width="32" height="32" rx="5" />
        </clipPath>
        <clipPath id={headId}>
          <circle cx="12" cy="27.5" r="19" />
        </clipPath>
      </defs>
      <g clip-path={`url(#${frameId})`}>
        <rect width="32" height="32" fill="var(--ink)" />
        <circle cx="12" cy="27.5" r="19" fill="var(--kelly)" />
        <g clip-path={`url(#${headId})`}>
          <rect x="-8" y="11.6" width="40" height="3.7" fill="var(--paper)" />
        </g>
        <circle cx="6.1" cy="17.25" r="3.85" fill="var(--kelly-deep)" />
        <circle cx="17.1" cy="17.25" r="3.85" fill="var(--kelly-deep)" />
        <circle cx="6.5" cy="16.8" r="3.7" fill="var(--paper)" />
        <circle cx="17.5" cy="16.8" r="3.7" fill="var(--paper)" />
        <circle
          class="mascot-pupil"
          cx="7.9"
          cy="15.7"
          r="1.7"
          fill="var(--ink)"
          transform={pupilTransform()}
        />
        <circle
          class="mascot-pupil"
          cx="18.7"
          cy="15.7"
          r="1.7"
          fill="var(--ink)"
          transform={pupilTransform()}
        />
      </g>
    </svg>
  );
}
