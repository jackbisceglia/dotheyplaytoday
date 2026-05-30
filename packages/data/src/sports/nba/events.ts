import type { Schema } from "effect";

import { SportsSeed } from "../../schema/sports.js";

type SportsSeedInput = Schema.Codec.Encoded<typeof SportsSeed>;
type NbaSportEventSeed = SportsSeedInput["events"][number];

export const Games = {
  celticsKnicks: {
    id: "00000000-0000-4000-8000-000000000701",
    _tag: "sports_game",
    sourceId: "sports_game:seed:00000000-0000-4000-8000-000000000701",
    startsAt: "2026-06-01T23:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Boston Celtics",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "New York Knicks",
        },
      },
    ],
  },
} as const satisfies Record<string, NbaSportEventSeed>;

export const events = Object.values(Games);
