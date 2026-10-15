import { expect, it } from "vitest";

import { getSportsLogo } from "./index.js";

it("provides NCAA men's basketball through the shared logo matcher", () => {
  expect(
    getSportsLogo({
      _tag: "sports_team",
      league: { id: "ncaam", conferenceId: "acc", apRank: null },
      display: "Example",
      location: "Example",
      name: "Example",
      abbreviation: "EX",
      slug: "example",
    }),
  ).toBe("🏀");
});
