import { expect, it } from "vitest";

import { getSportsLogo } from "./index.js";

it("provides college football through the shared logo matcher", () => {
  expect(
    getSportsLogo({
      _tag: "sports_team",
      league: { id: "ncaaf", conferenceId: "acc", apRank: null },
      display: "Example",
      location: "Example",
      name: "Example",
      abbreviation: "EX",
      slug: "example",
    }),
  ).toBe("🏈");
});
