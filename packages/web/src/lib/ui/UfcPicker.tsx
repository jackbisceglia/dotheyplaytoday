import type { Subject } from "@dtpt/core/modules/subjects/schema";
import { Predicate } from "effect";
import {
  createMemo,
  createSignal,
  createUniqueId,
  For,
  onSettled,
  Show,
} from "solid-js";

import { getVisibleUfcFighters } from "../catalog/ufc.js";
import { searchKey } from "../search.js";

export function UfcPicker(props: {
  readonly subjects: readonly Subject[];
  readonly selected: ReadonlySet<string>;
  readonly rejectedSelectionId?: string | undefined;
  readonly onToggle: (subject: Subject) => void;
}) {
  const [search, setSearch] = createSignal("");
  const searchId = `ufc-fighter-search-${createUniqueId()}`;
  const coverage = createMemo(() =>
    props.subjects
      .filter((subject) => Predicate.isTagged(subject.details, "mma_tracking"))
      .toSorted((a, b) => {
        const numbered = (subject: Subject) =>
          Predicate.isTagged(subject.details, "mma_tracking") &&
          subject.details.scope === "numbered";
        return Number(numbered(b)) - Number(numbered(a));
      }),
  );
  const fighters = createMemo(() =>
    getVisibleUfcFighters(props.subjects, search()),
  );
  const searching = () => searchKey(search()).length > 0;
  let list: HTMLDivElement | undefined;

  onSettled(() => () => {
    document.body.style.removeProperty("min-height");
  });

  return (
    <div class="ufc-picker">
      <fieldset class="form-section ufc-cards">
        <legend class="form-label">Cards</legend>
        <div class="ufc-coverage">
          <For each={coverage()}>
            {(subject) => (
              <button
                type="button"
                class="team-card ufc-coverage-tile"
                aria-label={
                  Predicate.isTagged(subject.details, "mma_tracking") &&
                  subject.details.scope === "numbered"
                    ? "PPVs: numbered UFC events"
                    : "All UFC cards: numbered events and Fight Nights"
                }
                aria-pressed={props.selected.has(subject.id) ? "true" : "false"}
                data-rejected={
                  props.rejectedSelectionId === subject.id ? "true" : undefined
                }
                onClick={() => {
                  props.onToggle(subject);
                }}
              >
                {Predicate.isTagged(subject.details, "mma_tracking") &&
                subject.details.scope === "numbered"
                  ? "PPVs"
                  : "All"}
              </button>
            )}
          </For>
        </div>
      </fieldset>
      <div class="form-section">
        <label class="form-label" for={searchId}>
          Fighters
        </label>
        <input
          id={searchId}
          type="search"
          class="form-input"
          placeholder="Search fighters"
          value={search()}
          onInput={(event) => {
            // Fewer results can shorten the page under the scroll position,
            // and the browser would clamp the scroll and move this input. Hold
            // the page down to the viewport's bottom; the slack sits above the
            // footer.
            document.body.style.minHeight = `${String(scrollY + innerHeight)}px`;
            setSearch(event.currentTarget.value);
            list?.scrollTo({ top: 0 });
          }}
        />
        <div
          ref={list}
          class="ufc-fighter-list"
          role="group"
          aria-label={searching() ? "Matching fighters" : "Men's P4P top 15"}
        >
          <For
            each={fighters()}
            fallback={
              <p class="ufc-empty">
                {searching()
                  ? "No matching fighters."
                  : "Search to find a fighter."}
              </p>
            }
          >
            {(fighter) => (
              <button
                type="button"
                class="ufc-fighter-row"
                aria-pressed={props.selected.has(fighter.id) ? "true" : "false"}
                data-rejected={
                  props.rejectedSelectionId === fighter.id ? "true" : undefined
                }
                onClick={() => {
                  props.onToggle(fighter);
                }}
              >
                <Show when={!searching()}>
                  <span class="ufc-fighter-rank">
                    <span class="visually-hidden">P4P rank </span>
                    {fighter.details.p4p}
                  </span>
                </Show>
                <span class="ufc-fighter-name">{fighter.details.display}</span>
                <span class="ufc-fighter-check" aria-hidden="true">
                  {props.selected.has(fighter.id) ? "✓" : "+"}
                </span>
              </button>
            )}
          </For>
        </div>
      </div>
    </div>
  );
}
