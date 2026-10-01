// Renders every tiled email headline into `public/`. Run `pnpm assets:generate`
// after building core and data, whose dists this imports.

import { Resvg } from "@resvg/resvg-js";
import {
  emphasize,
  HeadlineImageSize,
  buildHeadlineImagePath,
  type Lines,
} from "@dtpt/core/modules/email/headline";
import { confirmationLines } from "@dtpt/core/modules/email/transactional/confirmation";
import { signInLines } from "@dtpt/core/modules/email/transactional/sign-in";
import { gameDayLines, kickoffLines } from "@dtpt/core/modules/notifier/email";
import { weeklyDigestLines } from "@dtpt/core/modules/weekly-digest/email";
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

const { width: WIDTH, height: HEIGHT } = HeadlineImageSize;

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

/** One headline line: the lead in paper, then any kelly accent. */
const emphasizedLine = ({ lead, accent }: { lead: string; accent: string }) =>
  line([
    ...(lead === "" ? [] : [el("span", {}, lead.toUpperCase())]),
    ...(accent === ""
      ? []
      : [
          el(
            "span",
            {
              color: KELLY_ON_INK,
              marginLeft: lead === "" ? 0 : SIZE * 0.13 * SCALE,
            },
            accent.toUpperCase(),
          ),
        ]),
  ]);

const tile = (lines: Lines): Node =>
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
      ...emphasize(lines).map(emphasizedLine),
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

const assertFits = async (lines: Lines) => {
  const available = (WIDTH - PAD * 2) * SCALE;

  for (const node of emphasize(lines).map(emphasizedLine)) {
    const width = await measure(node);

    if (width > available) {
      throw new Error(
        `${buildHeadlineImagePath(lines)} overflows its tile by ${Math.ceil((width - available) / SCALE).toString()}px`,
      );
    }
  }
};

const contentHeight = Math.round(
  PAD + MASCOT + GAP + SIZE * LINE_HEIGHT * 2 + PAD + 4,
);
if (contentHeight !== HEIGHT) {
  throw new Error(
    `HeadlineImageSize.height should be ${contentHeight.toString()}, not ${HEIGHT.toString()}`,
  );
}

const teams = SeedCollections.flatMap((collection) =>
  collection.subjects.map((subject) => gameDayLines(subject.details)),
);

// Teams that share a name ("Kings", "Giants") share one image.
const headlines = [
  ...new Map(
    [
      signInLines,
      confirmationLines,
      kickoffLines,
      weeklyDigestLines,
      ...teams,
    ].map((lines) => [buildHeadlineImagePath(lines), lines]),
  ),
];

// Start clean so renamed or dropped headlines leave no stale images behind.
await rm(path.join(publicDir, "email/headlines"), {
  recursive: true,
  force: true,
});

for (const [file, lines] of headlines) {
  await assertFits(lines);

  const svg = await satori(tile(lines) as never, {
    width: WIDTH * SCALE,
    height: HEIGHT * SCALE,
    fonts,
  });
  const png = new Resvg(svg).render().asPng();
  const target = path.join(publicDir, file);

  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, png);
}

console.log(`rendered ${headlines.length.toString()} email headlines`);
