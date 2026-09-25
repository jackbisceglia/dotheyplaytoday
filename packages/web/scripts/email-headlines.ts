// Renders every email headline tile into `public/`. Run `pnpm email:generate`
// after building core and data, whose dists this imports.
// The specs and tile size live in `@dtpt/core/modules/email/headlines`.

import { Resvg } from "@resvg/resvg-js";
import {
  EmailHeadlines,
  EmailHeadlineSize,
  type EmailHeadline,
} from "@dtpt/core/modules/email/headlines";
import { SeedCollections } from "@dtpt/data/seed/index";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import satori from "satori";

import { el, INK, loadFont, mascot, type Node } from "./brand.ts";

/** Drawn at twice the CSS size for dense screens. */
const SCALE = 2;
const PAD = 22;
const MASCOT = 36;
const GAP = 20;
/** Every headline must fit at this size, so every tile shares one height. */
const SIZE = 48;
const LINE_HEIGHT = 0.92;

// Reversed out, a softer paper and a brighter kelly hold up better on ink.
const ON_INK = "#f4f2ec";
const KELLY_ON_INK = "#2fbf68";

const { width: WIDTH, height: HEIGHT } = EmailHeadlineSize;

const publicDir = fileURLToPath(new URL("../public/", import.meta.url));

const font = await loadFont("ArchivoCondensed-Black.ttf");
const fonts = [
  { name: "Archivo Condensed", data: font, weight: 900, style: "normal" },
] as never;

const line = (children: unknown): Node =>
  el(
    "div",
    {
      display: "flex",
      fontFamily: "Archivo Condensed",
      fontSize: SIZE * SCALE,
      lineHeight: LINE_HEIGHT,
      letterSpacing: -0.01 * SIZE * SCALE,
      color: ON_INK,
    },
    children,
  );

const secondLine = (headline: EmailHeadline): Node => {
  const accent = (marginLeft: number) =>
    el(
      "span",
      { color: KELLY_ON_INK, marginLeft },
      headline.accent.toUpperCase(),
    );

  return headline.second === ""
    ? line([accent(0)])
    : line([
        el("span", {}, headline.second.toUpperCase()),
        accent(SIZE * 0.13 * SCALE),
      ]);
};

const tile = (headline: EmailHeadline): Node =>
  el(
    "div",
    {
      width: WIDTH * SCALE,
      height: HEIGHT * SCALE,
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      padding: PAD * SCALE,
      borderRadius: 18 * SCALE,
      backgroundColor: INK,
    },
    [
      mascot(MASCOT * SCALE),
      el("div", { display: "flex", height: GAP * SCALE }),
      line(headline.first.toUpperCase()),
      secondLine(headline),
    ],
  );

/** Width in CSS pixels of one headline line at the tile's display size. */
const measure = async (node: Node) => {
  const svg = await satori(node, {
    width: WIDTH * SCALE * 4,
    height: SIZE * SCALE * 2,
    fonts,
  });

  return new Resvg(svg).getBBox()?.width ?? 0;
};

const assertFits = async (headline: EmailHeadline) => {
  const available = (WIDTH - PAD * 2) * SCALE;

  for (const node of [
    line(headline.first.toUpperCase()),
    secondLine(headline),
  ]) {
    const width = await measure(node);

    if (width > available) {
      throw new Error(
        `${headline.path} overflows its tile by ${Math.ceil((width - available) / SCALE).toString()}px`,
      );
    }
  }
};

const contentHeight = Math.round(
  PAD + MASCOT + GAP + SIZE * LINE_HEIGHT * 2 + PAD + 4,
);
if (contentHeight !== HEIGHT) {
  throw new Error(
    `EmailHeadlineSize.height should be ${contentHeight.toString()}, not ${HEIGHT.toString()}`,
  );
}

const teams = SeedCollections.flatMap((collection) =>
  collection.subjects.flatMap((subject) => {
    const headline = EmailHeadlines.team(subject.details);

    return headline === undefined ? [] : [headline];
  }),
);

const headlines = [
  EmailHeadlines.signIn,
  EmailHeadlines.confirmation,
  EmailHeadlines.nflKickoff,
  ...teams,
];

// Start clean so renamed or dropped teams leave no stale tiles behind.
await rm(path.join(publicDir, path.dirname(EmailHeadlines.signIn.path)), {
  recursive: true,
  force: true,
});

for (const headline of headlines) {
  await assertFits(headline);

  const svg = await satori(tile(headline) as never, {
    width: WIDTH * SCALE,
    height: HEIGHT * SCALE,
    fonts,
  });
  const png = new Resvg(svg).render().asPng();
  const target = path.join(publicDir, headline.path);

  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, png);
}

console.log(`rendered ${headlines.length.toString()} email headlines`);
