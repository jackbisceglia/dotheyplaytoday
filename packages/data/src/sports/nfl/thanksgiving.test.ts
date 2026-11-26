import { ThanksgivingFootball2026 } from "@dtpt/core/modules/editions/catalog";
import { editionRange } from "@dtpt/core/modules/editions/edition";
import { DateTime } from "effect";
import { expect, it } from "vitest";

import { nflCollection } from "./index.js";

/** Verified 2026-11-26 against the published NFL Thanksgiving schedule. */
it("holds the Thanksgiving 2026 edition's NFL slate", () => {
  const { from, to } = editionRange(ThanksgivingFootball2026);
  const slate = nflCollection.events
    .filter((event) => {
      const startsAt = DateTime.makeUnsafe(event.startsAt);

      return (
        event.availability === "active" &&
        DateTime.isGreaterThanOrEqualTo(startsAt, from) &&
        DateTime.isLessThan(startsAt, to)
      );
    })
    .map((event) => {
      const title = (role: string) =>
        event.participants.find((p) => p.details.role === role)?.details.title;

      return `${event.startsAt} ${title("away") ?? ""} @ ${title("home") ?? ""}`;
    })
    .toSorted();

  expect(slate).toEqual([
    "2026-11-26T18:00:00Z Chicago Bears @ Detroit Lions",
    "2026-11-26T21:30:00Z Philadelphia Eagles @ Dallas Cowboys",
    "2026-11-27T01:20:00Z Kansas City Chiefs @ Buffalo Bills",
  ]);
});
