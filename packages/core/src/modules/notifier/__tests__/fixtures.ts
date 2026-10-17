import { Schema } from "effect";

import { EventWithParticipants } from "../../events/joined.js";
import { Subject } from "../../subjects/schema.js";
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
      league: { id: "nba", conferenceId: "east" },
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
      league: { id: "nfl", conferenceId: "nfc" },
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

export const fighter = (display: string) =>
  decode(Subject)({
    id: "10000000-0000-4000-8000-000000000101",
    _tag: "mma_fighter",
    details: {
      _tag: "mma_fighter",
      league: { id: "ufc" },
      display,
      profileUrl: "https://www.ufc.com/athlete/test",
    },
  });

const ufcFights = [
  ["main", ["Joaquin Buckley", "Mike Malott"]],
  ["main", ["Erin Blanchfield", "Jasmine Jasudavicius"]],
  ["prelims", ["Cristian Perez Gonzalez", "Kyle Nelson"]],
  ["prelims", ["Louis Jourdain"]],
] as const;

/** A Fight Night with prelims at 7:00 PM and the main card at 10:00 PM EDT. */
export const ufcCard = ({
  id = "20000000-0000-4000-8000-000000000011",
  title = "UFC Fight Night: Buckley vs Malott",
  timings = {
    prelims: "2026-10-03T23:00:00.000Z",
    main: "2026-10-04T02:00:00.000Z",
  },
} = {}) =>
  decode(EventWithParticipants)({
    id,
    sourceId: `mma_card:ufc:${id}`,
    _tag: "mma_card",
    startsAt: timings.prelims,
    availability: "active",
    participants: ufcFights.flatMap(([placement, fighters], fight) =>
      fighters.map((title, index) => ({
        id: `${id.slice(0, -2)}${fight.toString()}${index.toString()}`,
        eventId: id,
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title,
          fightId: `fight-${(fight + 1).toString()}`,
          placement,
        },
      })),
    ),
    details: {
      _tag: "mma_card",
      leagueId: "ufc",
      title,
      category: "fight_night",
      venue: { title: "Test Arena", location: "Test City" },
      timings,
    },
  });
