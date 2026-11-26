import { DateTime } from "effect";

import { EventId, EventSourceId } from "../../events/schema.js";
import { EventWithParticipants } from "../../events/joined.js";
import { ParticipantId } from "../../events/participants/schema.js";
import { digest, giants } from "../../weekly-digest/__tests__/fixtures.js";

const game = (
  index: number,
  startsAt: string,
  away: string,
  home: string,
  leagueId: "nfl" | "ncaaf" = "nfl",
) => {
  const id = EventId.make(
    `00000000-0000-4000-8000-${index.toString().padStart(12, "0")}`,
  );

  return EventWithParticipants.make({
    id,
    _tag: "sports_game",
    sourceId: EventSourceId.make(`sports_game:test:${id}`),
    startsAt: DateTime.makeUnsafe(startsAt),
    availability: "active",
    details: { _tag: "sports_game", leagueId },
    participants: [
      {
        _tag: "sports_game",
        id: ParticipantId.make(id.replace(/^0{8}/, "10000000")),
        eventId: id,
        details: { _tag: "sports_game", role: "away", title: away },
      },
      {
        _tag: "sports_game",
        id: ParticipantId.make(id.replace(/^0{8}/, "20000000")),
        eventId: id,
        details: { _tag: "sports_game", role: "home", title: home },
      },
    ],
  });
};

/** The catalog's Thanksgiving 2026 slate, plus its neighbors that must be excluded. */
export const thanksgiving = {
  bearsAtLions: game(
    901,
    "2026-11-26T18:00:00Z",
    "Chicago Bears",
    "Detroit Lions",
  ),
  eaglesAtCowboys: game(
    902,
    "2026-11-26T21:30:00Z",
    "Philadelphia Eagles",
    "Dallas Cowboys",
  ),
  chiefsAtBills: game(
    903,
    "2026-11-27T01:20:00Z",
    "Kansas City Chiefs",
    "Buffalo Bills",
  ),
};

export const excluded = {
  /** Wednesday 8 PM ET, already Thursday in UTC. */
  packersAtRams: game(
    904,
    "2026-11-26T01:00:00Z",
    "Green Bay Packers",
    "Los Angeles Rams",
  ),
  /** Black Friday, 3 PM ET. */
  broncosAtSteelers: game(
    905,
    "2026-11-27T20:00:00Z",
    "Denver Broncos",
    "Pittsburgh Steelers",
  ),
  /** Thanksgiving college football is outside an NFL edition. */
  college: game(
    906,
    "2026-11-27T00:30:00Z",
    "Memphis Tigers",
    "Tulane Green Wave",
    "ncaaf",
  ),
};

export const slate = [
  excluded.packersAtRams,
  thanksgiving.chiefsAtBills,
  excluded.college,
  thanksgiving.eaglesAtCowboys,
  thanksgiving.bearsAtLions,
  excluded.broncosAtSteelers,
];

export const fan = digest.user;
export const nflTeam = giants;
