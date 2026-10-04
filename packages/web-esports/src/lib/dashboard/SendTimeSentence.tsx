import { For, Show } from "solid-js";

import { formatSecondsLocal, sendTimeIntervals } from "../time.js";

// While editing, the send time in the sentence becomes the control.
export function SendTimeSentence(props: {
  readonly savedTimes: readonly number[];
  readonly editing: boolean;
  readonly saving: boolean;
  readonly seconds: number;
  readonly onChange: (seconds: number) => void;
}) {
  return (
    <p class="dashboard-lede">
      We'll email you
      <Show when={props.editing || props.savedTimes.length > 0}>
        {" at "}
        <Show
          when={props.editing}
          fallback={
            <strong>
              {props.savedTimes.map(formatSecondsLocal).join(" / ")}
            </strong>
          }
        >
          <select
            class="lede-select"
            aria-label="Send time"
            disabled={props.saving}
            onChange={(event) => {
              props.onChange(Number(event.currentTarget.value));
            }}
          >
            <For each={sendTimeIntervals}>
              {(interval) => (
                <option
                  value={interval.value}
                  selected={props.seconds === interval.value}
                >
                  {interval.label}
                </option>
              )}
            </For>
          </select>
        </Show>
      </Show>{" "}
      on game day
    </p>
  );
}
