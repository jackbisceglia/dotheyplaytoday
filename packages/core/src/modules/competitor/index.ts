import { Effect, DateTime, Array, Option } from "effect";
import { TaggedError } from "../../lib/effect";

class CompetitorNotFoundError extends TaggedError("CompetitorNotFoundError") {}

class ScheduleNotFoundError extends TaggedError("ScheduleNotFoundError") {}

class NoRemainingEventsError extends TaggedError("NoRemainingEventsError") {}

type Schedule = {
  id: string;
  date: DateTime.Utc;
  competitorId: string;
  opponent: string;
};

type CompetitorShape = {
  id: string;
  title: string;
  sport: string;
  schedule: Omit<Schedule, "competitorId">[];
};

// TODO: reassess DateTime handling with real data source
const celtics = {
  id: "boston-celtics",
  title: "Boston Celtics",
  sport: "basketball",
  schedule: [
    {
      id: "boston-celtics-1",
      date: DateTime.unsafeMake(new Date("2026-01-11T23:30:00Z")), // 7:30 PM EST on Jan 11 (crosses midnight UTC)
      opponent: "Indiana Pacers",
    },
    {
      id: "boston-celtics-2",
      date: DateTime.unsafeMake(new Date("2026-01-16T20:00:00Z")),
      opponent: "Miami Heat",
    },
  ],
} satisfies CompetitorShape;

const teams = [celtics];

export class Competitors extends Effect.Service<Competitors>()("Competitors", {
  effect: Effect.gen(function* () {
    const schedules = new Map<string, Omit<Schedule, "competitorId">[]>();

    yield* Effect.void;

    const load = Effect.fn("load")(function* () {
      // TODO: check
      yield* Effect.void;

      teams.forEach((team) => {
        schedules.set(team.id, team.schedule);
      });
    });

    const getSchedule = Effect.fn("getSchedule")(function* (id: string) {
      const withId = (schedule: Omit<Schedule, "competitorId">) =>
        ({ ...schedule, competitorId: id }) satisfies Schedule;

      const competitor = teams.find((team) => team.id === id);

      if (!competitor) {
        return yield* new CompetitorNotFoundError(
          `Could not find competitor ${id}`,
        );
      }

      const events = schedules.get(id);

      if (!events) {
        return yield* new ScheduleNotFoundError(
          `Could not find schedule for competitor ${id}`,
        );
      }

      return events.map(withId);
    });

    const getNextEvent = Effect.fn("getNextEvent")(function* (id: string) {
      const schedule = yield* getSchedule(id);
      const now = yield* DateTime.now;

      // TODO: binary search (assumes schedule is sorted chronologically)
      const nextEvent = Array.findFirst(schedule, (event) =>
        DateTime.greaterThanOrEqualTo(event.date, now),
      );

      if (Option.isNone(nextEvent)) {
        return yield* new NoRemainingEventsError(
          `No remaining events for competitor ${id}`,
        );
      }

      return nextEvent.value;
    });

    const get = Effect.fn("competitors.get")(function* (id: string) {
      yield* Effect.void;

      const competitor = teams.find((team) => team.id === id);

      if (!competitor) {
        return yield* new CompetitorNotFoundError(
          `Could not find competitor ${id}`,
        );
      }

      return {
        id: competitor.id,
        title: competitor.title,
        sport: competitor.sport,
      };
    });

    return {
      load,
      get,
      getSchedule,
      getNextEvent,
    };
  }),
}) {}
