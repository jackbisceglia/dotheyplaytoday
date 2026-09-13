import { Schema } from "effect";

import { TaggedUnion } from "../../lib/effect/index.js";
import { StringParts } from "../../lib/string.js";
import { exactOptional } from "../../lib/utils.js";

export type EmailMetadata = {
  readonly unsubscribe: string;
};

export type EmailRendered = {
  readonly subject: string;
  readonly metadata?: EmailMetadata | undefined;
  readonly body: {
    readonly text: string;
    readonly html: string;
  };
};

// TODO: Move sports-specific matchup rendering into an email/render/sports module.
/** One matchup entry: "leading <separator> trailing", plus its start time. */
export type EmailMatchup = typeof EmailMatchup.Type;
export const EmailMatchup = Schema.Struct({
  leading: Schema.String,
  separator: Schema.String,
  trailing: Schema.String,
  detail: Schema.String,
});

export const Text = Schema.TaggedStruct("text", { value: Schema.String });
export const List = Schema.TaggedStruct("list", {
  items: Schema.Array(Schema.String),
});
export const Matchups = Schema.TaggedStruct("matchups", {
  items: Schema.Array(EmailMatchup),
});
export const Note = Schema.TaggedStruct("note", { value: Schema.String });
export const Entry = Schema.TaggedStruct("entry", {
  label: Schema.String,
  detail: Schema.String,
  value: Schema.String,
});
export const Link = Schema.TaggedStruct("link", {
  href: Schema.String,
  text: Schema.String,
});

export type Block = typeof Blocks.Type;
export const Blocks = TaggedUnion([Text, List, Matchups, Note, Entry, Link]);

/** A reversed-out header that replaces the wordmark rule on special dates. */
export type EmailHero = {
  readonly headline: string;
  /** Trailing word of the headline, set in kelly against the ink panel. */
  readonly accent: string;
};

export type EmailViewProps = {
  readonly subject: string;
  /** Display headline. Defaults to the email subject. */
  readonly headline?: string;
  /** Trailing word set in kelly, as the site hero sets its emphasis. */
  readonly accent?: string;
  /** Inbox preview text; defaults to a summary of the first block. */
  readonly preheader?: string;
  /** Destination for the wordmark link. */
  readonly home?: string;
  /** Replaces the wordmark header. Absent on ordinary sends. */
  readonly hero?: EmailHero;
  readonly blocks: readonly Block[];
  readonly metadata?: EmailMetadata;
};

const color = {
  canvas: "#f8f6f0",
  ink: "#131711",
  kelly: "#169b4d",
  kellyDeep: "#0c6b34",
  kellyWash: "#dbeee2",
  muted: "#5d6455",
};

/** Reversed-out values, only legible against `color.ink`. */
const onInk = {
  canvas: "#f4f2ec",
};

const font = {
  display: "'Archivo', 'Arial Black', 'Helvetica Neue', Arial, sans-serif",
  body: "'Archivo', 'Helvetica Neue', Arial, Helvetica, sans-serif",
};

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

/**
 * Keeps light text light in the Gmail app's dark mode, which inverts text
 * colors but leaves background images alone. Neutral text only: the blend
 * re-inverts by RGB, so a colored run would come back in the opposite hue.
 */
const gmailKeepLight = (text: string) =>
  `<span class="email-gmail-screen"><span class="email-gmail-difference">${text}</span></span>`;

const matchupText = (matchup: EmailMatchup) =>
  `${matchup.detail} - ${matchup.leading} ${matchup.separator} ${matchup.trailing}`;

/** One-line summary of a block, used for inbox preview text. */
const blockPreview = (block: Block): string => {
  switch (block._tag) {
    case "text":
    case "note":
      return block.value;
    case "entry":
      return `${block.label}: ${block.value}`;
    case "link":
      return block.text;
    case "list":
      return block.items.join(", ");
    case "matchups":
      return block.items.map(matchupText).join(" \u2022 ");
  }
};

const blockText = (block: Block): readonly string[] => {
  switch (block._tag) {
    case "text":
      return [block.value];
    case "list":
      return block.items.map((item) => `- ${item}`);
    case "matchups":
      return block.items.map(matchupText);
    case "note":
      return [block.value];
    case "entry":
      return [block.label, block.detail, block.value];
    case "link":
      return [`${block.text}: ${block.href}`];
  }
};

const text = (input: EmailViewProps) =>
  StringParts()
    .addNullable(input.hero && `${input.hero.headline} ${input.hero.accent}`)
    .addIf(input.hero !== undefined, "")
    .add(
      StringParts(input.headline ?? input.subject)
        .addNullable(input.accent)
        .make(" "),
    )
    .add("")
    .addParts(
      ...input.blocks.flatMap((block, index) =>
        index === 0 ? blockText(block) : ["", ...blockText(block)],
      ),
    )
    .make("\n");

/**
 * Every layout style is inlined at its phone size and only widened by the
 * `min-width` media query below. Clients that drop `<style>` entirely — the
 * Gmail app signed into a non-Gmail account, most notably — then still get the
 * mobile layout rather than a desktop one squeezed into a phone.
 */
const element = {
  spacer: (height: number) =>
    `<div style="height: ${height.toString()}px; line-height: ${height.toString()}px; font-size: ${height.toString()}px;">&nbsp;</div>`,

  /** A soft kelly panel with a kelly accent down its leading edge. */
  panel: (content: string) =>
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td width="5" style="width: 5px; background-color: ${color.kelly}; font-size: 0; line-height: 0;">&nbsp;</td>
<td class="email-wash" style="padding: 14px 16px; background-color: ${color.kellyWash};">
${content}
</td>
</tr>
</table>`,

  matchup: (matchup: string, time: string) =>
    `<p class="email-ink email-title" style="margin: 0; mso-line-height-rule: exactly; font-family: ${font.display}; font-weight: 900; font-stretch: 85%; font-size: 15px; line-height: 1.35; color: ${color.ink}; word-break: break-word;">${matchup}</p>
<p class="email-accent" style="margin: 4px 0 0; mso-line-height-rule: exactly; font-family: ${font.body}; font-weight: 700; font-size: 12px; line-height: 1.4; color: ${color.kellyDeep};">${time}</p>`,

  separator: (value: string) =>
    `<span class="email-muted" style="font-family: ${font.body}; font-weight: 400; font-size: 13px; color: ${color.muted};">${value}</span>`,

  item: (value: string) =>
    `<p class="email-ink email-title" style="margin: 0; mso-line-height-rule: exactly; font-family: ${font.display}; font-weight: 900; font-size: 15px; line-height: 1.3; color: ${color.ink}; word-break: break-word;">${value}</p>`,

  paragraph: (value: string) =>
    `<p class="email-ink" style="margin: 0; mso-line-height-rule: exactly; font-family: ${font.body}; font-size: 15px; line-height: 1.55; color: ${color.ink};">${value}</p>`,

  note: (value: string) =>
    `<p class="email-muted" style="margin: 0; mso-line-height-rule: exactly; font-family: ${font.body}; font-size: 13px; line-height: 1.5; color: ${color.muted};">${value}</p>`,

  entry: (label: string, detail: string, value: string) =>
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td class="email-ink" style="font-family: ${font.body}; font-weight: 700; font-size: 13px; line-height: 1.4; color: ${color.ink};">${label}</td>
<td class="email-muted" align="right" style="padding-left: 12px; font-family: ${font.body}; font-size: 12px; line-height: 1.4; color: ${color.muted}; white-space: nowrap;">${detail}</td>
</tr>
<tr>
<td colspan="2" style="padding-top: 8px;">
${element.paragraph(value)}
</td>
</tr>
</table>`,

  link: (href: string, label: string) =>
    `<a href="${escapeHtml(href)}" class="email-muted" style="display: inline-block; padding: 8px 4px; font-family: ${font.body}; font-weight: 700; font-size: 12px; color: ${color.muted}; text-decoration: underline;">${escapeHtml(label)}</a>`,

  hero: (hero: EmailHero, wordmark: string) =>
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="email-hero" style="width: 100%; background-color: ${color.ink}; background-image: linear-gradient(${color.ink}, ${color.ink});">
<tr>
<td style="padding: 22px 20px 26px;">
${wordmark}
${element.spacer(20)}
<p class="email-hero-headline" style="margin: 0; mso-line-height-rule: exactly; font-family: ${font.display}; font-weight: 900; font-stretch: 62%; font-size: 22px; line-height: 1; letter-spacing: -0.02em; text-transform: uppercase; color: ${onInk.canvas}; word-break: break-word;">${gmailKeepLight(escapeHtml(hero.headline))} <span style="color: ${color.kelly};">${escapeHtml(hero.accent)}</span></p>
</td>
</tr>
</table>`,
};

const stack = (parts: readonly string[], gap: number) =>
  parts.join(`\n${element.spacer(gap)}\n`);

const blockHtml = (block: Block): string => {
  switch (block._tag) {
    case "text":
      return element.paragraph(escapeHtml(block.value));
    case "list":
      // One panel per item: a panel holding two names reads as a matchup,
      // which is exactly what it means in the game-day email.
      return stack(
        block.items.map((item) =>
          element.panel(element.item(escapeHtml(item))),
        ),
        8,
      );
    case "matchups":
      return stack(
        block.items.map((matchup) =>
          element.panel(
            element.matchup(
              `${escapeHtml(matchup.leading)} ${element.separator(escapeHtml(matchup.separator))} ${escapeHtml(matchup.trailing)}`,
              escapeHtml(matchup.detail),
            ),
          ),
        ),
        8,
      );
    case "note":
      return element.note(escapeHtml(block.value));
    case "entry":
      return element.panel(
        element.entry(
          escapeHtml(block.label),
          escapeHtml(block.detail),
          escapeHtml(block.value),
        ),
      );
    case "link":
      return element.link(block.href, block.text);
  }
};

/**
 * `reversed` drops the dark-mode color classes, since the hero is ink in both
 * schemes, and guards its light text against Gmail's dark-mode inversion.
 */
const wordmarkHtml = (home: string | undefined, reversed: boolean) => {
  const ink = reversed ? onInk.canvas : color.ink;
  const light = (text: string) => (reversed ? gmailKeepLight(text) : text);
  const accentClass = reversed ? "" : ` class="email-accent"`;
  const accent = `<span${accentClass} style="color: ${color.kelly};">play</span>`;
  const markClass = reversed ? "email-wordmark" : "email-ink email-wordmark";

  const mark = `<span class="${markClass}" style="font-family: ${font.display}; font-weight: 900; font-stretch: 75%; font-size: 15px; line-height: 1.2; letter-spacing: 0.02em; text-transform: uppercase; color: ${ink};">${light("dothey")}${accent}${light("today")}</span>`;

  if (home === undefined) return mark;

  const linkClass = reversed ? "" : ` class="email-ink"`;

  return `<a href="${escapeHtml(home)}"${linkClass} style="text-decoration: none; color: ${ink};">${mark}</a>`;
};

const headerHtml = (input: EmailViewProps) =>
  input.hero === undefined
    ? `<td class="email-rule" style="padding: 0 0 12px; border-bottom: 3px solid ${color.ink};">
                ${wordmarkHtml(input.home, false)}
              </td>`
    : `<td style="padding: 0;">
                ${element.hero(input.hero, wordmarkHtml(input.home, true))}
              </td>`;

const previewText = (blocks: readonly Block[]) => {
  const [first] = blocks;

  return first === undefined ? undefined : blockPreview(first);
};

const html = (input: EmailViewProps) => {
  const preheader =
    input.preheader ?? previewText(input.blocks) ?? input.subject;

  const headline = input.headline ?? input.subject;

  const Accent =
    input.accent === undefined
      ? ""
      : ` <span class="email-accent" style="color: ${color.kelly};">${escapeHtml(input.accent)}</span>`;

  const Headline = `<h1 class="email-ink email-headline" style="margin: 0 0 16px; mso-line-height-rule: exactly; font-family: ${font.display}; font-weight: 900; font-stretch: 75%; font-size: 20px; line-height: 1.05; letter-spacing: -0.01em; text-transform: uppercase; color: ${color.ink}; word-break: break-word;">${escapeHtml(headline)}${Accent}</h1>`;

  const Main = stack(input.blocks.map(blockHtml), 18);

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta http-equiv="x-ua-compatible" content="IE=edge" />
    <meta name="color-scheme" content="light dark" />
    <meta name="supported-color-schemes" content="light dark" />
    <!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
    <title>${escapeHtml(input.subject)}</title>
    <link href="https://fonts.googleapis.com/css2?family=Archivo:ital,wdth,wght@0,62..125,400..900;1,62..125,400..900&amp;display=swap" rel="stylesheet" />
    <style>
      :root {
        color-scheme: light dark;
        supported-color-schemes: light dark;
      }

      body {
        margin: 0;
        padding: 0;
        width: 100% !important;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
      }

      table {
        border-collapse: collapse;
      }

      /* Keep iOS from turning start times into blue "detected data" links. */
      a[x-apple-data-detectors] {
        color: inherit !important;
        text-decoration: none !important;
        font-size: inherit !important;
        font-family: inherit !important;
        font-weight: inherit !important;
        line-height: inherit !important;
      }

      @media screen and (min-width: 600px) {
        .email-shell {
          padding: 40px 24px 48px !important;
        }

        .email-wordmark {
          font-size: 18px !important;
        }

        .email-headline {
          font-size: 25px !important;
        }

        .email-title {
          font-size: 17px !important;
        }

        .email-hero-headline {
          font-size: 27px !important;
        }
      }

      @media (prefers-color-scheme: dark) {
        .email-bg {
          background-color: #12160f !important;
        }

        .email-ink {
          color: #f4f2ec !important;
        }

        .email-muted {
          color: #a9af9d !important;
        }

        .email-wash {
          background-color: #1f2a20 !important;
        }

        .email-rule {
          border-color: #414937 !important;
        }

        .email-accent {
          color: #5fd489 !important;
        }

        /* Lift the hero off the darkened canvas. */
        .email-hero {
          background-color: #1b2119 !important;
          background-image: linear-gradient(#1b2119, #1b2119) !important;
        }
      }

      /* Paired with gmailKeepLight. Gmail wraps the body in a sibling of <u>. */
      u + .body .email-gmail-screen {
        background: #000;
        mix-blend-mode: screen;
      }

      u + .body .email-gmail-difference {
        background: #000;
        mix-blend-mode: difference;
      }
    </style>
  </head>
  <body class="body email-bg" style="margin: 0; padding: 0; background-color: ${color.canvas}; font-family: ${font.body}; color: ${color.ink};">
    <div style="display: none; max-height: 0; max-width: 0; overflow: hidden; opacity: 0; font-size: 1px; line-height: 1px; color: transparent; mso-hide: all;">${escapeHtml(preheader)}&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;</div>
    <table role="presentation" class="email-bg" width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%; background-color: ${color.canvas};">
      <tr>
        <td class="email-shell" align="center" style="padding: 24px 16px 32px;">
          <!--[if mso]><table role="presentation" width="480" align="center" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%; max-width: 480px; margin: 0 auto;">
            <tr>
              ${headerHtml(input)}
            </tr>
            <tr>
              <td style="padding: 22px 0 0;">
                ${Headline}
                ${Main}
              </td>
            </tr>
          </table>
          <!--[if mso]></td></tr></table><![endif]-->
        </td>
      </tr>
    </table>
  </body>
</html>`;
};

export function EmailView(input: EmailViewProps): EmailRendered {
  return {
    subject: input.subject,
    ...exactOptional(input.metadata, (metadata) => ({ metadata })),
    body: {
      text: text(input),
      html: html(input),
    },
  };
}
