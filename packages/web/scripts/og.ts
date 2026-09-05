/*
---
Agent Zone - only briefly reviewed
---
*/

// Renders the Open Graph card to `public/og.png`. Run `pnpm og:generate`.
// Colors mirror `src/styles/global.css`; the mascot mirrors `favicon.svg`.

import { Resvg } from "@resvg/resvg-js";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import satori from "satori";

const WIDTH = 1200;
const HEIGHT = 630;
const TAGLINE = "Game-day emails for your teams";

const PAPER = "#f8f6f0";
const INK = "#131711";
const KELLY = "#169b4d";
const KELLY_DEEP = "#0c6b34";
const KELLY_WASH = "#e2f3e7";
const MUTED = "rgba(19, 23, 17, 0.72)";

// Satori cannot parse the variable Archivo the site loads, so cache static cuts.
const UPSTREAM =
  "https://cdn.jsdelivr.net/gh/Omnibus-Type/Archivo@master/fonts/ttf";

const DISPLAY = "ArchivoCondensed-Black.ttf";
const TEXT = "Archivo-Regular.ttf";

const fontsDir = fileURLToPath(new URL("../assets/fonts/", import.meta.url));

async function loadFont(file: string): Promise<Buffer> {
  const target = path.join(fontsDir, file);
  const cached = await stat(target).then(
    () => true,
    () => false,
  );

  if (!cached) {
    const response = await fetch(`${UPSTREAM}/${file}`);
    if (!response.ok) {
      throw new Error(
        `Failed to download ${file}: ${response.status.toString()}`,
      );
    }

    await writeFile(target, Buffer.from(await response.arrayBuffer()));
  }

  return readFile(target);
}

// Hand-built element objects: this package's `jsx` config targets Solid.
type Style = Record<string, unknown>;
type Node = { type: string; key: null; props: Record<string, unknown> };

const el = (type: string, style: Style, children?: unknown): Node => ({
  type,
  key: null,
  props: { style, ...(children === undefined ? {} : { children }) },
});

function mascot(size: number): Node {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="${size.toString()}" height="${size.toString()}">
  <defs>
    <clipPath id="frame"><rect width="32" height="32" rx="5" /></clipPath>
    <clipPath id="head"><circle cx="12" cy="27.5" r="19" /></clipPath>
  </defs>
  <g clip-path="url(#frame)">
    <rect width="32" height="32" fill="${INK}" />
    <circle cx="12" cy="27.5" r="19" fill="${KELLY}" />
    <g clip-path="url(#head)">
      <rect x="-8" y="11.6" width="40" height="3.7" fill="${PAPER}" />
    </g>
    <circle cx="6.1" cy="17.25" r="3.85" fill="${KELLY_DEEP}" />
    <circle cx="17.1" cy="17.25" r="3.85" fill="${KELLY_DEEP}" />
    <circle cx="6.5" cy="16.8" r="3.7" fill="${PAPER}" />
    <circle cx="17.5" cy="16.8" r="3.7" fill="${PAPER}" />
    <circle cx="7.9" cy="15.7" r="1.7" fill="${INK}" />
    <circle cx="18.7" cy="15.7" r="1.7" fill="${INK}" />
  </g>
</svg>`;

  return {
    type: "img",
    key: null,
    props: {
      src: `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`,
      width: size,
      height: size,
      style: { display: "flex" },
    },
  };
}

function wordmark(size: number): Node {
  const part = (text: string, color: string) =>
    el(
      "span",
      {
        fontFamily: "Archivo Condensed",
        fontWeight: 900,
        fontSize: size,
        letterSpacing: size * 0.02,
        color,
      },
      text.toUpperCase(),
    );

  return el(
    "div",
    { display: "flex", alignItems: "baseline" },
    [part("dothey", INK), part("play", KELLY), part("today", INK)],
  );
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
      backgroundImage: `radial-gradient(circle at 50% 44%, ${KELLY_WASH} 0%, ${PAPER} 62%)`,
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
          fontFamily: "Archivo",
          fontWeight: 400,
          fontSize: 32,
          lineHeight: 1.4,
          color: MUTED,
        },
        TAGLINE,
      ),
    ],
  );

await mkdir(fontsDir, { recursive: true });
const [display, text] = await Promise.all([loadFont(DISPLAY), loadFont(TEXT)]);

const svg = await satori(card() as never, {
  width: WIDTH,
  height: HEIGHT,
  fonts: [
    { name: "Archivo Condensed", data: display, weight: 900, style: "normal" },
    { name: "Archivo", data: text, weight: 400, style: "normal" },
  ] as never,
});

const png = new Resvg(svg, { fitTo: { mode: "width", value: WIDTH } })
  .render()
  .asPng();

const target = fileURLToPath(new URL("../public/og.png", import.meta.url));
await writeFile(target, png);
console.log(`rendered ${path.relative(process.cwd(), target)}`);
