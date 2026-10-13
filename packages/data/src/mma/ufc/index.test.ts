import { describe, expect, it } from "vitest";
import { DateTime, Predicate, Schema } from "effect";

import { MmaSeed } from "../../schema/mma.js";
import { ufcCollection } from "./index.js";

const catalog = Schema.decodeUnknownSync(MmaSeed)(ufcCollection);

describe("UFC catalog", () => {
  it("links the upcoming lineups to their fighter and coverage feeds", () => {
    expect(catalog.events).toHaveLength(5);
    expect(catalog.events.map((event) => event.participants.length)).toEqual([
      24, 26, 18, 2, 2,
    ]);
    expect(catalog.subjects).toHaveLength(127);
    expect(new Set(catalog.subjects.map((subject) => subject.id)).size).toBe(
      127,
    );

    for (const event of catalog.events) {
      for (const participant of event.participants) {
        expect(
          catalog.subjects.find(
            (subject) => subject.details.display === participant.details.title,
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
              (participant) =>
                participant.details.title === subject.details.display,
            ),
      );
      expect(subject.feedIds).toEqual(expected.map((event) => event.sourceId));
    }
  });

  it("includes the men's P4P top 10 even without a booked fight", () => {
    const ranked = catalog.subjects
      .filter(
        (subject) =>
          Predicate.isTagged(subject.details, "mma_fighter") &&
          subject.details.p4p !== null,
      )
      .toSorted((a, b) => {
        const rank = (subject: typeof a) =>
          Predicate.isTagged(subject.details, "mma_fighter")
            ? (subject.details.p4p ?? Infinity)
            : Infinity;
        return rank(a) - rank(b);
      });
    expect(ranked.map((subject) => subject.details.display)).toEqual([
      "Islam Makhachev",
      "Alexander Volkanovski",
      "Justin Gaethje",
      "Petr Yan",
      "Ilia Topuria",
      "Joshua Van",
      "Sean Strickland",
      "Tom Aspinall",
      "Merab Dvalishvili",
      "Alex Pereira",
    ]);
    expect(ranked[0]?.feedIds).toEqual([]);
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
