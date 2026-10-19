import { describe, expect, it } from "vitest";

import { SportParticipant } from "../participants/variants/sport.schema.js";
import { sportsSubjectSide } from "../variants/sport.js";

const home = {
  details: SportParticipant.make({ role: "home", title: "Boston Celtics" }),
};
const away = {
  details: SportParticipant.make({ role: "away", title: "New York Knicks" }),
};

describe("sports subject side", () => {
  it("matches normalized names and retains original participant identities", () => {
    const homeSide = sportsSubjectSide(home, away, " BOSTON CELTICS ");
    const awaySide = sportsSubjectSide(home, away, "new york knicks");

    expect(homeSide).toEqual({
      leading: home,
      trailing: away,
      separator: "vs.",
    });
    expect(homeSide?.leading).toBe(home);
    expect(awaySide).toEqual({ leading: away, trailing: home, separator: "@" });
    expect(awaySide?.leading).toBe(away);
  });

  it("leaves an unknown team unresolved so callers can enforce their own policy", () => {
    expect(sportsSubjectSide(home, away, "Miami Heat")).toBeUndefined();
  });
});
