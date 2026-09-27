import { Schema } from "effect";

import { TaggedUnion } from "../../lib/effect/index.js";

/** The brand sets the final word of the last line in kelly. */
export type Lines = typeof Lines.Type;
export const Lines = Schema.NonEmptyArray(Schema.String);

/**
 * A pre-rendered PNG of the brand's display type. No Gmail client loads web
 * fonts, and forced dark modes recolor text but leave images alone.
 */
export const TiledHeadline = Schema.TaggedStruct("tiled", {
  lines: Lines,
  image: Schema.String,
  href: Schema.String,
});

export const TextHeadline = Schema.TaggedStruct("text", { lines: Lines });

export type Headline = typeof Headline.Type;
export const Headline = TaggedUnion([TiledHeadline, TextHeadline]);

/** CSS pixels; the PNGs are drawn at twice this. */
export const HeadlineImageSize = { width: 480, height: 192 } as const;

/** Named after the copy, so the email and `email:generate` agree on the file. */
export const buildHeadlineImagePath = (lines: Lines) => {
  const slug = lines
    .join(" ")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return `email/headlines/${slug}.png`;
};

export const emphasize = (lines: Lines) =>
  lines.map((line, index) => {
    if (index < lines.length - 1) return { lead: line, accent: "" };

    const split = line.lastIndexOf(" ");

    return {
      lead: split === -1 ? "" : line.slice(0, split),
      accent: line.slice(split + 1),
    };
  });

export const makeTiledHeadline = (home: string, lines: Lines) =>
  TiledHeadline.make({
    lines,
    image: `${home.replace(/\/+$/, "")}/${buildHeadlineImagePath(lines)}`,
    href: home,
  });
