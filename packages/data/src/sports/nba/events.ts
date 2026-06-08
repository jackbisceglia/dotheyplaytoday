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
  finalsGame3SpursKnicks: {
    id: "00000000-0000-4000-8000-000000000702",
    _tag: "sports_game",
    sourceId: "sports_game:seed:00000000-0000-4000-8000-000000000702",
    startsAt: "2026-06-09T00:30:00Z",
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
          title: "New York Knicks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "San Antonio Spurs",
        },
      },
    ],
  },
  finalsGame4SpursKnicks: {
    id: "00000000-0000-4000-8000-000000000703",
    _tag: "sports_game",
    sourceId: "sports_game:seed:00000000-0000-4000-8000-000000000703",
    startsAt: "2026-06-11T00:30:00Z",
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
          title: "New York Knicks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "San Antonio Spurs",
        },
      },
    ],
  },
} as const satisfies Record<string, NbaSportEventSeed>;

export const events = Object.values(Games);
