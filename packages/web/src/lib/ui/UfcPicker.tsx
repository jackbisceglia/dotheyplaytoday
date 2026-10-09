import type { Subject } from "@dtpt/core/modules/subjects/schema";
import { Predicate } from "effect";
import { createMemo, createSignal, For } from "solid-js";

import { getSubjectLogo } from "../catalog/index.js";

export function UfcPicker(props: {
  readonly subjects: readonly Subject[];
  readonly selected: ReadonlySet<string>;
  readonly rejectedSelectionId?: string | undefined;
  readonly onToggle: (subject: Subject) => void;
}) {
  const [search, setSearch] = createSignal("");
  const coverage = createMemo(() =>
    props.subjects.filter((subject) =>
      Predicate.isTagged(subject.details, "mma_tracking"),
    ),
  );
  const currentCoverage = () =>
    coverage().find((subject) => props.selected.has(subject.id));
  const fighters = createMemo(() => {
    const query = search().trim().toLowerCase();

    return props.subjects
      .filter(
        (subject) =>
          Predicate.isTagged(subject.details, "mma_fighter") &&
          subject.details.display.toLowerCase().includes(query),
      )
      .toSorted((a, b) => a.details.display.localeCompare(b.details.display));
  });

  return (
    <>
      <fieldset class="form-section">
        <legend class="form-label">UFC card coverage</legend>
        <div class="league-row">
          <button
            type="button"
            class="league-pill"
            aria-pressed={currentCoverage() ? "false" : "true"}
            onClick={() => {
              const current = currentCoverage();
              if (current) props.onToggle(current);
            }}
          >
            Off
          </button>
          <For each={coverage()}>
            {(subject) => (
              <button
                type="button"
                class="league-pill"
                aria-pressed={props.selected.has(subject.id) ? "true" : "false"}
                onClick={() => {
                  if (!props.selected.has(subject.id)) props.onToggle(subject);
                }}
              >
                {subject.details.display}
              </button>
            )}
          </For>
        </div>
      </fieldset>
      <p class="form-hint">
        All includes numbered events and Fight Nights. Contender Series is
        excluded. Coverage uses one pick; each fighter uses one pick. Fighter
        follows work with coverage off.
      </p>
      <label class="form-label" for="ufc-fighter-search">
        Follow fighters
      </label>
      <input
        id="ufc-fighter-search"
        type="search"
        class="form-input"
        placeholder="Find a fighter"
        value={search()}
        onInput={(event) => setSearch(event.currentTarget.value)}
      />
      <div class="team-grid">
        <For
          each={fighters()}
          fallback={<p class="form-hint">No matching fighters.</p>}
        >
          {(fighter) => (
            <button
              type="button"
              class="team-card"
              aria-pressed={props.selected.has(fighter.id) ? "true" : "false"}
              data-rejected={
                props.rejectedSelectionId === fighter.id ? "true" : undefined
              }
              onClick={() => {
                props.onToggle(fighter);
              }}
            >
              <span class="team-glyph" aria-hidden="true">
                {getSubjectLogo(fighter.details)}
              </span>
              <span class="team-name">{fighter.details.display}</span>
            </button>
          )}
        </For>
      </div>
    </>
  );
}
