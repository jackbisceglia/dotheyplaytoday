import { Array, Option } from "effect";

/** One string per line. The brand sets the final word in kelly. */
export type Lines = Array.NonEmptyReadonlyArray<string>;

/**
 * A resolved email headline. Tiled headlines point at a pre-rendered PNG of
 * the brand's condensed display type: no Gmail client loads web fonts, and
 * forced dark modes recolor text but leave images alone. Text headlines render
 * the lines as live text instead.
 */
export type Headline = {
  readonly lines: Lines;
  readonly image: Option.Option<string>;
  readonly href: Option.Option<string>;
};

/** Size in CSS pixels. The PNGs are drawn at twice this for dense screens. */
export const HeadlineImageSize = { width: 480, height: 192 } as const;

/**
 * Bump when the artwork changes; Gmail caches images by URL. Copy changes need
 * nothing, since the file name is the copy.
 */
const design = "v1";

export const headlineText = (lines: Lines) => lines.join(" ");

/**
 * Where the pre-rendered image of `lines` lives under the web root. The web
 * app's `email:generate` script writes to the same path.
 */
export const imagePath = (lines: Lines) => {
  const slug = headlineText(lines)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return `email/headlines/${design}/${slug}.png`;
};

/** Each line split into its lead and the kelly accent, which ends the last. */
export const emphasize = (lines: Lines) =>
  lines.map((line, index) => {
    if (index < lines.length - 1) return { lead: line, accent: "" };

    const split = line.lastIndexOf(" ");

    return {
      lead: split === -1 ? "" : line.slice(0, split),
      accent: line.slice(split + 1),
    };
  });

export const makeTiledHeadline = (home: string, lines: Lines): Headline => {
  const root = home.replace(/\/+$/, "");

  return {
    lines,
    image: Option.some(`${root}/${imagePath(lines)}`),
    href: Option.some(home),
  };
};

export const makeTextHeadline = (lines: Lines, href?: string): Headline => ({
  lines,
  image: Option.none(),
  href: Option.fromUndefinedOr(href),
});
