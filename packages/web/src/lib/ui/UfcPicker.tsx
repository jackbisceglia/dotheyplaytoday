import type { Subject } from "@dtpt/core/modules/subjects/schema";
import { Predicate } from "effect";
import { createMemo, createSignal, For } from "solid-js";

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
  const fighters = createMemo(() =>
    props.subjects
      .filter(
        (subject) =>
          Predicate.isTagged(subject.details, "mma_fighter") &&
          subject.details.display
            .toLowerCase()
            .includes(search().trim().toLowerCase()),
      )
      .toSorted((a, b) => a.details.display.localeCompare(b.details.display)),
  );

  return (
    <>
      <label class="form-label" for="ufc-coverage">
        UFC card coverage
      </label>
      <select
        id="ufc-coverage"
        class="form-input"
        value={currentCoverage()?.id ?? "off"}
        onChange={(event) => {
          const value = event.currentTarget.value;
          const choice =
            value === "off"
              ? currentCoverage()
              : coverage().find((subject) => subject.id === value);
          if (choice) props.onToggle(choice);
          event.currentTarget.value = currentCoverage()?.id ?? "off";
        }}
      >
        <option value="off">Off</option>
        <For each={coverage()}>
          {(subject) => (
            <option value={subject.id}>{subject.details.display}</option>
          )}
        </For>
      </select>
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
      <p class="form-hint">
        Choose from our supported fighters. More fighters and confirmed fights
        are added as the catalog is updated.
      </p>
      <div class="team-grid">
        <For each={fighters()}>
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
                🥊
              </span>
              <span class="team-name">{fighter.details.display}</span>
            </button>
          )}
        </For>
      </div>
    </>
  );
}
