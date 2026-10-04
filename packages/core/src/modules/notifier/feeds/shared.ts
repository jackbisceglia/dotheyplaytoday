import { DateTime } from "effect";

import type { User } from "../../users/schema.js";

/** What every feed needs from the email layer to render its view. */
export type FeedContext = {
  readonly home: string;
  readonly unsubscribeUrl: string;
};

export const isTaggedAs =
  <const TTag extends PropertyKey>(tag: TTag) =>
  <TValue extends { readonly _tag: PropertyKey }>(
    value: TValue,
  ): value is Extract<TValue, { readonly _tag: TTag }> =>
    value._tag === tag;

type TitledEvent = {
  readonly participants: readonly {
    readonly details: { readonly title: string };
  }[];
};

/**
 * When every event in the batch shares exactly one participant title, that
 * title must be the subscriber's team: the events were pulled in because
 * they're the subject's games, so a team present in all of them can only be
 * the subject. This is a structural inference, not a guess.
 */
export const findSharedParticipantTitle = (
  events: readonly TitledEvent[],
): string | undefined => {
  if (events.length < 2) return undefined;

  const titleCounts = new Map<string, number>();

  for (const event of events) {
    for (const participant of event.participants) {
      const title = participant.details.title;

      titleCounts.set(title, (titleCounts.get(title) ?? 0) + 1);
    }
  }

  let sharedTitle: string | undefined;

  for (const [title, count] of titleCounts) {
    if (count !== events.length) continue;
    if (sharedTitle !== undefined) return undefined;
    sharedTitle = title;
  }

  return sharedTitle;
};

export const formatStartTime = (
  event: { readonly startsAt: DateTime.Utc },
  tz: User["timezone"],
) => {
  const userLocaleDateTime = DateTime.setZone(event.startsAt, tz);

  return DateTime.format(userLocaleDateTime, {
    locale: "en-US",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZoneName: "short",
  });
};
