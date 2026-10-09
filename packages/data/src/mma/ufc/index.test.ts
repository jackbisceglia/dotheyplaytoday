import { describe, expect, it } from "vitest";
import { DateTime, Predicate, Schema } from "effect";

import { MmaSeed } from "../../schema/mma.js";
import { ufcCollection } from "./index.js";

const catalog = Schema.decodeUnknownSync(MmaSeed)(ufcCollection);

describe("UFC catalog", () => {
  it("links the upcoming lineups to their fighter and coverage feeds", () => {
    expect(catalog.events).toHaveLength(5);
    expect(catalog.subjects).toHaveLength(120);
    expect(new Set(catalog.subjects.map((subject) => subject.id)).size).toBe(
      120,
    );

    for (const event of catalog.events) {
      for (const participant of event.participants) {
        expect(
          catalog.subjects.find(
            (subject) => subject.id === participant.details.subjectId,
          )?.feedIds,
        ).toContain(event.sourceId);
      }
    }

    for (const subject of catalog.subjects) {
      const expected = catalog.events.filter((event) =>
        Predicate.isTagged(subject, "mma_tracking")
          ? subject.details.scope === "all" ||
            event.details.category === "numbered"
          : event.participants.some(
              (participant) => participant.details.subjectId === subject.id,
            ),
      );
      expect(subject.feedIds).toEqual(expected.map((event) => event.sourceId));
    }
  });

  it("uses the earliest prelim segment and applies Eastern DST by event date", () => {
    const timezone = DateTime.zoneMakeNamedUnsafe("America/New_York");
    const localStarts = catalog.events.map((event) =>
      DateTime.format(DateTime.setZone(event.startsAt, timezone), {
        locale: "en-US",
        hour: "numeric",
        minute: "2-digit",
        timeZoneName: "short",
      }),
    );
    expect(localStarts).toEqual([
      "5:00 PM EDT",
      "5:00 PM EDT",
      "10:00 AM EDT",
      "5:00 PM EDT",
      "5:00 PM EST",
    ]);
  });
});
