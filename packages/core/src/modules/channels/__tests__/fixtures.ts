import { Schema } from "effect";

import { Notification } from "../notification/schema.js";
import { SignupConfirmation } from "../signup/schema.js";

const decode = Schema.decodeUnknownSync;

export const notification = decode(Notification)({
  sendAt: "2026-05-24T13:00:00.000Z",
  user: {
    id: "00000000-0000-4000-8000-000000000101",
    email: "fan@example.com",
    timezone: "America/New_York",
    unsubscribeToken: "00000000-0000-4000-8000-000000000201",
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

export const signupConfirmation = SignupConfirmation.cases.first_signup.make({
  user: notification.user,
  subjects: [
    notification.subject,
    {
      ...notification.subject,
      details: {
        ...notification.subject.details,
        location: "New York",
        name: "Knicks & Nets",
        display: "New York Knicks & Nets <Team>",
        abbreviation: "NYK",
        slug: "new-york-knicks",
      },
    },
  ],
  schedule: notification.subscription.schedule,
});
