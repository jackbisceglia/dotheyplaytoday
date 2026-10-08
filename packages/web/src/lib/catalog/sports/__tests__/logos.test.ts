import { describe, expect, it } from "vitest";

import { getMlbLogo } from "../mlb.js";
import { getNbaLogo } from "../nba.js";
import { getNflLogo } from "../nfl.js";
import { getNhlLogo } from "../nhl.js";

const leagues = [
  {
    name: "MLB",
    lookup: getMlbLogo,
    abbreviation: "BOS",
    logo: "🧦",
    fallback: "⚾",
  },
  {
    name: "NBA",
    lookup: getNbaLogo,
    abbreviation: "BOS",
    logo: "🍀",
    fallback: "🏀",
  },
  {
    name: "NFL",
    lookup: getNflLogo,
    abbreviation: "ARI",
    logo: "🌵",
    fallback: "🏈",
  },
  {
    name: "NHL",
    lookup: getNhlLogo,
    abbreviation: "BOS",
    logo: "🐻",
    fallback: "🏒",
  },
];

describe.each(leagues)(
  "$name logos",
  ({ lookup, abbreviation, logo, fallback }) => {
    it("returns the configured team logo", () => {
      expect(lookup(abbreviation)).toBe(logo);
    });

    it.each(["UNKNOWN", "toString", "__proto__", "constructor"])(
      "returns the league fallback for %s",
      (value) => {
        expect(lookup(value)).toBe(fallback);
      },
    );
  },
);
