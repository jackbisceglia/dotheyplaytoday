import { Schema } from "effect";

import { Notification } from "../notification.js";

const decode = Schema.decodeUnknownSync;

export const notification = decode(Notification)({
  sendAt: "2026-05-24T13:00:00.000Z",
  user: {
    id: "00000000-0000-4000-8000-000000000101",
    name: "fan@example.com",
    email: "fan@example.com",
    emailVerified: false,
    timezone: "America/New_York",
    unsubscribeToken: "00000000-0000-4000-8000-000000000201",
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    updatedAt: new Date("2026-01-01T00:00:00.000Z"),
  },
  subscription: {
    id: "00000000-0000-4000-8000-000000000401",
    userId: "00000000-0000-4000-8000-000000000101",
    subjectId: "00000000-0000-4000-8000-000000000301",
    schedule: {
      _tag: "fixed_local_time",
      sendAtSecondsLocal: 32400,
    },
    lastSentAt: null,
  },
  subject: {
    id: "00000000-0000-4000-8000-000000000301",
    _tag: "sports_team",
    details: {
      _tag: "sports_team",
      leagueId: "nba",
      location: "Boston",
      name: "Celtics",
      display: "Boston Celtics",
      abbreviation: "BOS",
      slug: "boston-celtics",
    },
  },
  events: [
    {
      id: "00000000-0000-4000-8000-000000000701",
      _tag: "sports_game",
      sourceId: "sports_game:seed:00000000-0000-4000-8000-000000000701",
      startsAt: "2026-05-24T20:00:00.000Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nba",
      },
      participants: [
        {
          _tag: "sports_game",
          id: "00000000-0000-4000-8000-000000000801",
          eventId: "00000000-0000-4000-8000-000000000701",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "New York Knicks",
          },
        },
        {
          _tag: "sports_game",
          id: "00000000-0000-4000-8000-000000000802",
          eventId: "00000000-0000-4000-8000-000000000701",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Boston Celtics",
          },
        },
      ],
    },
    {
      id: "00000000-0000-4000-8000-000000000702",
      _tag: "sports_game",
      sourceId: "sports_game:seed:00000000-0000-4000-8000-000000000702",
      startsAt: "2026-05-25T00:30:00.000Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nba",
      },
      participants: [
        {
          _tag: "sports_game",
          id: "00000000-0000-4000-8000-000000000803",
          eventId: "00000000-0000-4000-8000-000000000702",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Boston Celtics",
          },
        },
        {
          _tag: "sports_game",
          id: "00000000-0000-4000-8000-000000000804",
          eventId: "00000000-0000-4000-8000-000000000702",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Miami Heat",
          },
        },
      ],
    },
  ],
});

/**
 * An NFL game-day send landing on kickoff Sunday, 9:00 AM in the recipient's
 * timezone. The season-opener header is gated on both of those facts.
 */
export const nflNotification = decode(Notification)({
  sendAt: "2026-09-13T13:00:00.000Z",
  user: {
    id: "00000000-0000-4000-8000-000000000102",
    name: "bird@example.com",
    email: "bird@example.com",
    emailVerified: false,
    timezone: "America/New_York",
    unsubscribeToken: "00000000-0000-4000-8000-000000000202",
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    updatedAt: new Date("2026-01-01T00:00:00.000Z"),
  },
  subscription: {
    id: "00000000-0000-4000-8000-000000000402",
    userId: "00000000-0000-4000-8000-000000000102",
    subjectId: "00000000-0000-4000-8000-000000000302",
    schedule: {
      _tag: "fixed_local_time",
      sendAtSecondsLocal: 32400,
    },
    lastSentAt: null,
  },
  subject: {
    id: "00000000-0000-4000-8000-000000000302",
    _tag: "sports_team",
    details: {
      _tag: "sports_team",
      leagueId: "nfl",
      location: "Philadelphia",
      name: "Eagles",
      display: "Philadelphia Eagles",
      abbreviation: "PHI",
      slug: "philadelphia-eagles",
    },
  },
  events: [
    {
      id: "00000000-0000-4000-8000-000000000703",
      _tag: "sports_game",
      sourceId: "sports_game:seed:00000000-0000-4000-8000-000000000703",
      startsAt: "2026-09-13T17:00:00.000Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          id: "00000000-0000-4000-8000-000000000805",
          eventId: "00000000-0000-4000-8000-000000000703",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Dallas Cowboys",
          },
        },
        {
          _tag: "sports_game",
          id: "00000000-0000-4000-8000-000000000806",
          eventId: "00000000-0000-4000-8000-000000000703",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Philadelphia Eagles",
          },
        },
      ],
    },
  ],
});

/** A COD match day; the subscribed team is listed second on the match. */
export const esportsNotification = decode(Notification)({
  sendAt: "2026-12-05T14:00:00.000Z",
  user: {
    id: "00000000-0000-4000-8000-000000000103",
    name: "green@example.com",
    email: "green@example.com",
    emailVerified: true,
    timezone: "America/New_York",
    unsubscribeToken: "00000000-0000-4000-8000-000000000203",
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    updatedAt: new Date("2026-01-01T00:00:00.000Z"),
  },
  subscription: {
    id: "00000000-0000-4000-8000-000000000403",
    userId: "00000000-0000-4000-8000-000000000103",
    subjectId: "00000000-0000-4000-8000-000000000303",
    schedule: {
      _tag: "fixed_local_time",
      sendAtSecondsLocal: 32400,
    },
    lastSentAt: null,
  },
  subject: {
    id: "00000000-0000-4000-8000-000000000303",
    _tag: "esports_team",
    details: {
      _tag: "esports_team",
      gameId: "cod",
      location: "Texas",
      name: "OpTic",
      display: "OpTic Texas",
      abbreviation: "TX",
      slug: "optic-texas",
    },
  },
  events: [
    {
      id: "00000000-0000-4000-8000-000000000704",
      _tag: "esports_match",
      sourceId: "esports_match:seed:00000000-0000-4000-8000-000000000704",
      startsAt: "2026-12-05T20:00:00.000Z",
      availability: "active",
      details: {
        _tag: "esports_match",
        gameId: "cod",
      },
      participants: [
        {
          _tag: "esports_match",
          id: "00000000-0000-4000-8000-000000000807",
          eventId: "00000000-0000-4000-8000-000000000704",
          details: {
            _tag: "esports_match",
            title: "FaZe Vegas",
          },
        },
        {
          _tag: "esports_match",
          id: "00000000-0000-4000-8000-000000000808",
          eventId: "00000000-0000-4000-8000-000000000704",
          details: {
            _tag: "esports_match",
            title: "OpTic Texas",
          },
        },
      ],
    },
  ],
});
