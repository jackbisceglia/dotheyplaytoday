import { Effect } from "effect";

export type GameInfo = {
  teamId: string;
  opponent: string;
  gameTime: Date;
  isHome: boolean;
};

export class Schedule extends Effect.Service<Schedule>()("Schedule", {
  effect: Effect.gen(function* () {
    yield* Effect.void;

    return {
      hasGameToday: Effect.fn("schedule.hasGameToday")(function* (
        _teamId: string,
      ) {
        yield* Effect.void;
        // TODO: Check if team has game today
        // Will query sports API (e.g., ESPN, NBA API) for schedule
        return false;
      }),

      hasGameNow: Effect.fn("schedule.hasGameNow")(function* (_teamId: string) {
        yield* Effect.void;
        // TODO: Check if team has game starting soon (within threshold)
        // Useful for pre-game alerts
        return false;
      }),

      getGameInfo: Effect.fn("schedule.getGameInfo")(function* (
        _teamId: string,
      ) {
        yield* Effect.void;
        // TODO: Get full game info for today if exists
        // Returns null if no game today
        return null as GameInfo | null;
      }),
    };
  }),
}) {}
