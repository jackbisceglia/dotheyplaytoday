import { describe, expect, it } from "vitest";

import { Teams, subjects } from "./subjects.js";

describe("college football coverage and identities", () => {
  it("uses football affiliations, including football-only members", () => {
    expect(Teams.ArmyBlackKnights.details.league.conferenceId).toBe("aac");
    expect(Teams.NavyMidshipmen.details.league.conferenceId).toBe("aac");
    expect(Teams.SacramentoStateHornets.details.league.conferenceId).toBe(
      "mac",
    );
    expect(Teams.NorthernIllinoisHuskies.details.league.conferenceId).toBe(
      "mountain-west",
    );
    expect(Teams.NorthDakotaStateBison.details.league.conferenceId).toBe(
      "mountain-west",
    );
    expect(Teams.UTEPMiners.details.league.conferenceId).toBe("mountain-west");
    expect(Teams.TexasStateBobcats.details.league.conferenceId).toBe("pac-12");
  });

  it("does not turn basketball membership or opponent appearances into coverage", () => {
    const names = subjects.map((subject) => subject.details.display);
    for (const excluded of [
      "Notre Dame Fighting Irish",
      "UConn Huskies",
      "Gonzaga Bulldogs",
      "Wichita State Shockers",
      "Liberty Flames",
      "James Madison Dukes",
      "South Dakota State Jackrabbits",
    ]) {
      expect(names).not.toContain(excluded);
    }
  });

  it("preserves full school names, nicknames and unique dashboard keys", () => {
    expect(Teams.ArmyBlackKnights.details.name).toBe("Black Knights");
    expect(Teams.NavyMidshipmen.details.name).toBe("Midshipmen");
    expect(Teams.NorthTexasMeanGreen.details.name).toBe("Mean Green");
    expect(
      new Set(subjects.map((subject) => subject.details.abbreviation)).size,
    ).toBe(subjects.length);
    expect(
      new Set(subjects.map((subject) => subject.details.display)).size,
    ).toBe(subjects.length);
    expect(subjects.every((subject) => subject.feedIds.length > 0)).toBe(true);
  });
});
