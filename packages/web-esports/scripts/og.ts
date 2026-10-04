/*
---
Agent Zone - only briefly reviewed
---
*/

// Renders the Open Graph card to `public/og.png`. Run `pnpm assets:generate`.

import { Resvg } from "@resvg/resvg-js";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import satori from "satori";

import {
  el,
  INK,
  ACCENT,
  ACCENT_WASH,
  loadFont,
  mascot,
  MUTED,
  PAPER,
  type Node,
} from "./brand.ts";

const WIDTH = 1200;
const HEIGHT = 630;
const TAGLINE = "Match-day emails for your teams";

const DISPLAY = "SairaCondensed-Black.ttf";
const TEXT = "Saira-Regular.ttf";

function wordmark(size: number): Node {
  const part = (text: string, color: string) =>
    el(
      "span",
      {
        fontFamily: "Saira Condensed",
        fontWeight: 900,
        fontSize: size,
        letterSpacing: size * 0.02,
        color,
      },
      text.toUpperCase(),
    );

  return el("div", { display: "flex", alignItems: "baseline" }, [
    part("dothey", INK),
    part("play", ACCENT),
    part("today", INK),
  ]);
}

const card = (): Node =>
  el(
    "div",
    {
      width: WIDTH,
      height: HEIGHT,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: PAPER,
      backgroundImage: `radial-gradient(circle at 50% 44%, ${ACCENT_WASH} 0%, ${PAPER} 62%)`,
    },
    [
      el("div", { display: "flex", alignItems: "center", gap: 22 }, [
        mascot(88),
        wordmark(74),
      ]),
      el(
        "div",
        {
          display: "flex",
          marginTop: 30,
          fontFamily: "Saira",
          fontWeight: 400,
          fontSize: 32,
          lineHeight: 1.4,
          color: MUTED,
        },
        TAGLINE,
      ),
    ],
  );

const [display, text] = await Promise.all([loadFont(DISPLAY), loadFont(TEXT)]);

const svg = await satori(card() as never, {
  width: WIDTH,
  height: HEIGHT,
  fonts: [
    { name: "Saira Condensed", data: display, weight: 900, style: "normal" },
    { name: "Saira", data: text, weight: 400, style: "normal" },
  ] as never,
});

const png = new Resvg(svg, { fitTo: { mode: "width", value: WIDTH } })
  .render()
  .asPng();

const target = fileURLToPath(new URL("../public/og.png", import.meta.url));
await writeFile(target, png);
console.log(`rendered ${path.relative(process.cwd(), target)}`);
