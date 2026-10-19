import { describe, expect, it } from "@effect/vitest";
import { DateTime, Effect } from "effect";

import { fighter, ufcCard } from "../../notifier/__tests__/fixtures.js";
import { sportsSchedule, SportsScheduleRenderError } from "../sports.js";
import { mets, makeGame } from "./fixtures.js";

const timezone = DateTime.zoneMakeNamedUnsafe("America/New_York");

describe("sports schedule presentation", () => {
  it.effect(
    "adapts domain games into ordered display rows without email configuration",
    () =>
      Effect.gen(function* () {
        const schedule = yield* sportsSchedule(
          {
            subject: mets,
            events: [
              makeGame(mets, "Braves", "2026-10-07T23:00:00Z", 731, false),
              makeGame(mets, "Phillies", "2026-10-05T23:10:00Z", 730),
            ],
          },
          timezone,
        );

        expect(schedule).toEqual({
          title: "New York Mets",
          rows: [
            {
              date: "Mon, Oct 5",
              label: "New York Mets vs Phillies",
              time: "7:10 PM",
            },
            {
              date: "Wed, Oct 7",
              label: "New York Mets @ Braves",
              time: "7:00 PM",
            },
          ],
        });
      }),
  );

  it.effect(
    "rejects non-sports subjects even when quiet, and non-sports events at its boundary",
    () =>
      Effect.gen(function* () {
        for (const group of [
          { subject: fighter("Test Fighter"), events: [] },
          { subject: mets, events: [ufcCard()] },
        ]) {
          const error = yield* sportsSchedule(group, timezone).pipe(
            Effect.flip,
          );

          expect(error).toBeInstanceOf(SportsScheduleRenderError);
          expect(error.subjectId).toBe(group.subject.id);
        }
      }),
  );
});
