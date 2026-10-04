// Shared pieces for the image renderers (`og.ts`, `email-headlines.ts`).
// Colors mirror `src/styles/global.css`; the mascot mirrors `favicon.svg`.

import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const PAPER = "#0a0a0b";
export const INK = "#f4f4f5";
export const ACCENT = "#ff2aa3";
export const ACCENT_WASH = "#1c1c1f";
export const MUTED = "rgba(244, 244, 245, 0.6)";
// The mascot keeps its daylight colors on the dark page.
const MASCOT_FRAME = "#1c1c1f";
const MASCOT_SHADE = "#a8106a";

// Satori cannot parse the variable Saira the site loads, so cache static cuts.
const UPSTREAM =
  "https://cdn.jsdelivr.net/gh/Omnibus-Type/Saira@master/Saira/fonts/ttf";

const fontsDir = fileURLToPath(new URL("../assets/fonts/", import.meta.url));

export async function loadFont(file: string): Promise<Buffer> {
  await mkdir(fontsDir, { recursive: true });

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
export type Style = Record<string, unknown>;
export type Node = { type: string; key: null; props: Record<string, unknown> };

export const el = (type: string, style: Style, children?: unknown): Node => ({
  type,
  key: null,
  props: { style, ...(children === undefined ? {} : { children }) },
});

export function mascot(size: number): Node {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="${size.toString()}" height="${size.toString()}">
  <defs>
    <clipPath id="frame"><rect width="32" height="32" rx="5" /></clipPath>
    <clipPath id="head"><circle cx="12" cy="27.5" r="19" /></clipPath>
  </defs>
  <g clip-path="url(#frame)">
    <rect width="32" height="32" fill="${MASCOT_FRAME}" />
    <circle cx="12" cy="27.5" r="19" fill="${ACCENT}" />
    <g clip-path="url(#head)">
      <rect x="-8" y="11.6" width="40" height="3.7" fill="${INK}" />
    </g>
    <circle cx="6.1" cy="17.25" r="3.85" fill="${MASCOT_SHADE}" />
    <circle cx="17.1" cy="17.25" r="3.85" fill="${MASCOT_SHADE}" />
    <circle cx="6.5" cy="16.8" r="3.7" fill="${INK}" />
    <circle cx="17.5" cy="16.8" r="3.7" fill="${INK}" />
    <circle cx="7.9" cy="15.7" r="1.7" fill="${MASCOT_FRAME}" />
    <circle cx="18.7" cy="15.7" r="1.7" fill="${MASCOT_FRAME}" />
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
