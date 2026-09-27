import { describe, expect, it } from "@effect/vitest";

import {
  buildHeadlineImagePath,
  emphasize,
  makeTiledHeadline,
} from "../headline.js";

describe("email headline", () => {
  it("names the image after the copy", () => {
    expect(buildHeadlineImagePath(["Knicks", "play today."])).toBe(
      "email/headlines/knicks-play-today.png",
    );
    expect(buildHeadlineImagePath(["Your sign-in", "link."])).toBe(
      "email/headlines/your-sign-in-link.png",
    );
  });

  it("sets the final word of the last line as the accent", () => {
    expect(emphasize(["Knicks", "play today."])).toEqual([
      { lead: "Knicks", accent: "" },
      { lead: "play", accent: "today." },
    ]);
    expect(emphasize(["Your sign-in", "link."])).toEqual([
      { lead: "Your sign-in", accent: "" },
      { lead: "", accent: "link." },
    ]);
  });

  it("points tiled headlines at the image under the web root", () => {
    expect(
      makeTiledHeadline("https://example.com/", ["Knicks", "play today."]),
    ).toEqual({
      _tag: "tiled",
      lines: ["Knicks", "play today."],
      image: "https://example.com/email/headlines/knicks-play-today.png",
      href: "https://example.com/",
    });
  });
});
