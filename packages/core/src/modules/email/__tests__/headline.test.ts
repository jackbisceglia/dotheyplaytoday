import { describe, expect, it } from "@effect/vitest";

import {
  emphasize,
  imagePath,
  makeTextHeadline,
  makeTiledHeadline,
} from "../headline.js";

describe("email headline", () => {
  it("names the image after the copy", () => {
    expect(imagePath(["Knicks", "play today."])).toBe(
      "email/headlines/v1/knicks-play-today.png",
    );
    expect(imagePath(["Your sign-in", "link."])).toBe(
      "email/headlines/v1/your-sign-in-link.png",
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
      image: "https://example.com/email/headlines/v1/knicks-play-today.png",
      href: "https://example.com/",
    });
  });

  it("keeps text headlines to their lines", () => {
    expect(makeTextHeadline(["New feedback", "landed."])).toEqual({
      _tag: "text",
      lines: ["New feedback", "landed."],
    });
  });
});
