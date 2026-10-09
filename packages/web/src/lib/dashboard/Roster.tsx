import type { Subject } from "@dtpt/core/modules/subjects/schema";
import { Predicate } from "effect";
import { For, Match, Show, Switch } from "solid-js";

import { getSubjectLogo, getSubjectAbbreviation } from "../catalog/index.js";

// The same tiles in view and edit mode, so editing only adds controls around
// what's already on screen. Unfilled capacity reads as quiet empty slots; the
// first opens the editor, or says why Save is off when the draft is empty.
// Outside editing, each tile filters to its events in the schedule below.
export function Roster(props: {
  readonly subjects: readonly Subject[];
  readonly capacity: number;
  readonly editing: boolean;
  readonly saving: boolean;
  readonly onAdd: () => void;
  readonly onRemove: (subject: Subject) => void;
  readonly focusedId: string | undefined;
  readonly pinnedId: string | undefined;
  readonly onPreview: (id: string | undefined) => void;
  readonly onPin: (subject: Subject) => void;
}) {
  const openSlots = () =>
    Array.from({ length: props.capacity - props.subjects.length });

  return (
    <div class="roster">
      <For each={props.subjects}>
        {(subject) => (
          <Show
            when={props.editing}
            fallback={
              <button
                class="roster-team"
                type="button"
                data-focused={
                  props.focusedId === subject.id ? "true" : undefined
                }
                aria-pressed={props.pinnedId === subject.id ? "true" : "false"}
                aria-label={`Show only ${subject.details.display} events`}
                onClick={() => {
                  props.onPin(subject);
                }}
                onPointerEnter={(event) => {
                  if (event.pointerType === "mouse")
                    props.onPreview(subject.id);
                }}
                onPointerLeave={(event) => {
                  if (event.pointerType === "mouse") props.onPreview(undefined);
                }}
              >
                <RosterSubjectLabel subject={subject} />
              </button>
            }
          >
            <div class="roster-team">
              <RosterSubjectLabel subject={subject} />
              <button
                class="roster-remove"
                type="button"
                disabled={props.saving}
                aria-label={`Remove ${subject.details.display}`}
                onClick={() => {
                  props.onRemove(subject);
                }}
              >
                ×
              </button>
            </div>
          </Show>
        )}
      </For>
      <For each={openSlots()}>
        {(_slot, index) => (
          <Switch fallback={<div class="roster-slot" aria-hidden="true" />}>
            <Match when={index() === 0 && !props.editing}>
              <button class="roster-slot" type="button" onClick={props.onAdd}>
                + Add pick
              </button>
            </Match>
            <Match when={index() === 0 && props.subjects.length === 0}>
              <p class="roster-slot roster-slot-error" role="alert">
                Make a pick to save
              </p>
            </Match>
          </Switch>
        )}
      </For>
    </div>
  );
}

function RosterSubjectLabel(props: { readonly subject: Subject }) {
  return (
    <>
      <span class="team-glyph" aria-hidden="true">
        {getSubjectLogo(props.subject.details)}
      </span>
      <span class="roster-team-text">
        <span class="team-abbr">
          {getSubjectAbbreviation(props.subject.details)}
        </span>
        <span class="team-name">
          <Show
            when={
              Predicate.isTagged(props.subject.details, "sports_team") &&
              props.subject.details
            }
          >
            {(team) => (
              <>
                {team().name}
                <span aria-hidden="true"> · </span>
              </>
            )}
          </Show>
          {props.subject.details.leagueId.toUpperCase()}
        </span>
      </span>
    </>
  );
}
