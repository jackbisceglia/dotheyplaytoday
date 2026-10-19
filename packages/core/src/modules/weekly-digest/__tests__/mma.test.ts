import { describe, expect, it } from "@effect/vitest";
import { DateTime, Effect } from "effect";

import { all, numbered, fighterA, ny } from "../../mma/__tests__/fixtures.js";
import { ufcCard } from "../../notifier/__tests__/fixtures.js";
import { mmaSchedule, MmaScheduleRenderError } from "../mma.js";
import { digest } from "./fixtures.js";

describe("weekly MMA card presentation", () => {
  it.effect(
    "uses full card titles and local main-card dates and times in order",
    () =>
      Effect.gen(function* () {
        const first = ufcCard({
          timings: {
            prelims: "2026-10-20T21:00:00Z",
            main: "2026-10-21T00:00:00Z",
          },
        });
        const second = ufcCard({
          id: "20000000-0000-4000-8000-000000000012",
          title: "UFC 999: Test <Main> & Event",
          timings: {
            prelims: "2026-10-25T23:00:00Z",
            main: "2026-10-26T04:00:00Z",
          },
        });
        const schedule = yield* mmaSchedule(
          { subject: all, events: [second, first] },
          ny,
        );

        expect(schedule).toEqual({
          title: "All UFC events",
          rows: [
            {
              date: "Tue, Oct 20",
              label: "UFC Fight Night: Buckley vs Malott",
              time: "8:00 PM, main card",
            },
            {
              date: "Mon, Oct 26",
              label: "UFC 999: Test <Main> & Event",
              time: "12:00 AM, main card",
            },
          ],
        });
      }),
  );

  it.effect("handles quiet coverage and daylight saving changes", () =>
    Effect.gen(function* () {
      const quiet = yield* mmaSchedule({ subject: numbered, events: [] }, ny);

      expect(quiet.rows).toEqual([]);

      const card = ufcCard({
        timings: {
          prelims: "2026-11-01T04:00:00Z",
          main: "2026-11-01T07:00:00Z",
        },
      });
      const schedule = yield* mmaSchedule({ subject: all, events: [card] }, ny);

      expect(schedule.rows[0]?.time).toBe("2:00 AM, main card");
      expect(schedule.rows[0]?.date).toBe("Sun, Nov 1");

      const pacific = yield* mmaSchedule(
        { subject: all, events: [card] },
        DateTime.zoneMakeNamedUnsafe("America/Los_Angeles"),
      );

      expect(pacific.rows[0]?.date).toBe("Sun, Nov 1");
      expect(pacific.rows[0]?.time).toBe("12:00 AM, main card");
    }),
  );

  it.effect(
    "rejects fighter-only subjects and non-MMA events at its boundary",
    () =>
      Effect.gen(function* () {
        for (const group of [
          { subject: fighterA, events: [] },
          { subject: all, events: digest.groups[0].events },
        ]) {
          const error = yield* mmaSchedule(group, ny).pipe(Effect.flip);

          expect(error).toBeInstanceOf(MmaScheduleRenderError);
        }
      }),
  );
});
