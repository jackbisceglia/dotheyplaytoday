import { describe, expect, it } from "@effect/vitest";
import { Effect } from "effect";
import { TestClock } from "effect/testing";

import { getFeedbackWindow } from "../index.js";

describe("feedback email job", () => {
  it.effect("computes a half-open 12-hour UTC window", () =>
    Effect.gen(function* () {
      yield* TestClock.setTime(Date.parse("2026-08-22T12:37:42.000Z"));
      const window = yield* getFeedbackWindow();

      expect(window.from).toBe("2026-08-22T00:00:00.000Z");
      expect(window.to).toBe("2026-08-22T12:00:00.000Z");
    }),
  );
});
