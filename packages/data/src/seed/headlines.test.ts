import { existsSync, readFileSync } from "node:fs";
import { expect, it } from "vitest";
import { Predicate } from "effect";
import { buildHeadlineImagePath } from "@dtpt/core/modules/email/headline";
import { gameDayLines } from "@dtpt/core/modules/notifier/email";
import { weeklyDigestLines } from "@dtpt/core/modules/weekly-digest/email";

import { SeedCollections } from "./index.js";

it("ships a valid headline PNG for every catalog team and the weekly digest", () => {
  const headlines = [
    weeklyDigestLines,
    ...SeedCollections.flatMap((collection) =>
      collection.subjects.flatMap((subject) =>
        Predicate.isTagged(subject.details, "sports_team")
          ? [gameDayLines(subject.details)]
          : [],
      ),
    ),
  ];
  for (const lines of headlines) {
    const path = new URL(
      `../../../web/public/${buildHeadlineImagePath(lines)}`,
      import.meta.url,
    );
    expect(existsSync(path), path.pathname).toBe(true);
    const png = readFileSync(path);
    expect(png.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
    expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([960, 384]);
  }
});
