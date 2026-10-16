import { DateTime } from "effect";

import { EventId } from "../../events/schema.js";
import { EventWithParticipants } from "../../events/service.js";
import { notification } from "../../notifier/__tests__/fixtures.js";
import { Subject, SubjectId } from "../../subjects/schema.js";
import { WeeklyDigest } from "../schema.js";

const team = (
  name: string,
  leagueId: Subject["details"]["leagueId"],
  index: number,
) =>
  Subject.make({
    ...notification.subject,
    id: SubjectId.make(
      `00000000-0000-4000-8000-${index.toString().padStart(12, "0")}`,
    ),
    details: {
      ...notification.subject.details,
      name,
      display: `New York ${name}`,
      location: "New York",
      leagueId,
    },
  });
export const mets = team("Mets", "mlb", 310);
export const knicks = team("Knicks", "nba", 311);
export const giants = team("Giants", "nfl", 312);
export const rangers = team("Rangers", "nhl", 313);

export const makeGame = (
  subject: Subject,
  opponent: string,
  startsAt: string,
  index: number,
  home = true,
) => {
  const base = notification.events[0];
  const id = EventId.make(
    `00000000-0000-4000-8000-${index.toString().padStart(12, "0")}`,
  );
  return EventWithParticipants.make({
    ...base,
    id,
    startsAt: DateTime.makeUnsafe(startsAt),
    details: { ...base.details, leagueId: subject.details.leagueId },
    participants: base.participants.map((participant) => ({
      ...participant,
      eventId: id,
      details: {
        ...participant.details,
        title:
          (participant.details.role === "home") === home
            ? subject.details.display
            : opponent,
      },
    })),
  });
};

/** Fictional fixtures matching the approved visual POC. */
export const digest = WeeklyDigest.make({
  user: { ...notification.user, emailVerified: true },
  from: DateTime.makeUnsafe("2026-10-05T04:00:00.000Z"),
  to: DateTime.makeUnsafe("2026-10-12T04:00:00.000Z"),
  teams: [
    {
      subject: mets,
      events: [
        makeGame(mets, "Atlanta Braves", "2026-10-05T23:10:00Z", 710),
        makeGame(mets, "Atlanta Braves", "2026-10-06T23:10:00Z", 711),
        makeGame(
          mets,
          "Philadelphia Phillies",
          "2026-10-09T23:05:00Z",
          712,
          false,
        ),
      ],
    },
    {
      subject: knicks,
      events: [
        makeGame(knicks, "Boston Celtics", "2026-10-07T23:00:00Z", 713, false),
        makeGame(knicks, "Brooklyn Nets", "2026-10-09T23:30:00Z", 714),
      ],
    },
    {
      subject: giants,
      events: [
        makeGame(giants, "Philadelphia Eagles", "2026-10-11T17:00:00Z", 715),
      ],
    },
    { subject: rangers, events: [] },
  ],
});
