import { Schema } from "effect";

import { TaggedUnion } from "../../lib/effect/index.js";
import { StringParts } from "../../lib/string.js";
import { exactOptional } from "../../lib/utils.js";
import { EmailHeadlineSize } from "./headlines.js";

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

export type EmailViewProps = {
  readonly subject: string;
  /** Display headline. Defaults to the email subject. */
  readonly headline?: string;
  /** Trailing word set in kelly, as the site hero sets its emphasis. */
  readonly accent?: string;
  /**
   * Absolute URL of a pre-rendered headline tile (see `headlines.ts`). It
   * replaces the text headline, which becomes its alt text.
   */
  readonly headlineImage?: string;
  /** Inbox preview text; defaults to a summary of the first block. */
  readonly preheader?: string;
  /** Destination for the headline link. */
  readonly home?: string;
  readonly blocks: readonly Block[];
  readonly metadata?: EmailMetadata;
};

const color = {
  canvas: "#f8f6f0",
  ink: "#131711",
  kelly: "#169b4d",
  muted: "#5d6455",
  rule: "#dcd8cc",
};

/** Alt text on the headline tile, legible against its ink backing. */
const onInk = "#f4f2ec";

/**
 * Body copy uses each platform's own UI face; brand type lives in the headline
 * tile. The display stack only serves the text headline, and swaps Arial Black
 * (wide, and deaf to `font-stretch`) for condensed faces each OS ships.
 */
const font = {
  display:
    "'Archivo', 'HelveticaNeue-CondensedBlack', 'Helvetica Neue Condensed Black', 'AvenirNextCondensed-Heavy', 'Bahnschrift', 'Roboto Condensed', 'sans-serif-condensed', 'Arial Narrow', 'Helvetica Neue', Arial, sans-serif",
  body: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
};

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

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
      return block.items.map(matchupText).join(" • ");
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

const headlineText = (input: EmailViewProps) =>
  StringParts(input.headline ?? input.subject)
    .addNullable(input.accent)
    .make(" ");

const text = (input: EmailViewProps) =>
  StringParts()
    .add(headlineText(input))
    .add("")
    .addParts(
      ...input.blocks.flatMap((block, index) =>
        index === 0 ? blockText(block) : ["", ...blockText(block)],
      ),
    )
    .make("\n");

/**
 * Live text is always dark on light, so clients that force dark mode can flip
 * it cleanly; anything that must keep exact colors lives in the headline tile.
 */
const element = {
  spacer: (height: number) =>
    `<div style="height: ${height.toString()}px; line-height: ${height.toString()}px; font-size: ${height.toString()}px;">&nbsp;</div>`,

  rule: () =>
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td class="email-rule" style="border-top: 1px solid ${color.rule}; font-size: 0; line-height: 0;">&nbsp;</td>
</tr>
</table>`,

  headlineImage: (src: string, alt: string) =>
    `<img src="${escapeHtml(src)}" width="${EmailHeadlineSize.width.toString()}" height="${EmailHeadlineSize.height.toString()}" alt="${alt}" style="display: block; width: 100%; max-width: ${EmailHeadlineSize.width.toString()}px; height: auto; border: 0; border-radius: 18px; background-color: ${color.ink}; font-family: ${font.display}; font-weight: 900; font-size: 28px; line-height: 1.1; text-transform: uppercase; color: ${onInk};" />`,

  headlineText: (headline: string, accent: string) =>
    `<h1 class="email-ink email-display" style="margin: 0; mso-line-height-rule: exactly; font-family: ${font.display}; font-weight: 900; font-stretch: condensed; font-size: 36px; line-height: 0.95; text-transform: uppercase; color: ${color.ink}; word-break: break-word;">${headline}${accent}</h1>`,

  accent: (value: string) =>
    ` <span class="email-accent" style="color: ${color.kelly};">${value}</span>`,

  matchup: (matchup: string, time: string) =>
    `<p class="email-ink" style="margin: 0; mso-line-height-rule: exactly; font-family: ${font.body}; font-weight: 700; font-size: 16px; line-height: 1.4; color: ${color.ink}; word-break: break-word;">${matchup}</p>
<p class="email-muted" style="margin: 4px 0 0; mso-line-height-rule: exactly; font-family: ${font.body}; font-size: 14px; line-height: 1.4; color: ${color.muted};">${time}</p>`,

  separator: (value: string) =>
    `<span class="email-muted" style="font-weight: 400; color: ${color.muted};">${value}</span>`,

  item: (value: string) =>
    `<p class="email-ink" style="margin: 0; mso-line-height-rule: exactly; font-family: ${font.body}; font-weight: 700; font-size: 16px; line-height: 1.4; color: ${color.ink}; word-break: break-word;">${value}</p>`,

  paragraph: (value: string) =>
    `<p class="email-ink" style="margin: 0; mso-line-height-rule: exactly; font-family: ${font.body}; font-size: 16px; line-height: 1.5; color: ${color.ink};">${value}</p>`,

  note: (value: string) =>
    `<p class="email-muted" style="margin: 0; mso-line-height-rule: exactly; font-family: ${font.body}; font-size: 13px; line-height: 1.5; color: ${color.muted};">${value}</p>`,

  entry: (label: string, detail: string, value: string) =>
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td class="email-ink" style="font-family: ${font.body}; font-weight: 700; font-size: 14px; line-height: 1.4; color: ${color.ink};">${label}</td>
<td class="email-muted" align="right" style="padding-left: 12px; font-family: ${font.body}; font-size: 12px; line-height: 1.4; color: ${color.muted}; white-space: nowrap;">${detail}</td>
</tr>
<tr>
<td colspan="2" style="padding-top: 6px;">
${element.paragraph(value)}
</td>
</tr>
</table>`,

  link: (href: string, label: string) =>
    `<a href="${escapeHtml(href)}" class="email-muted" style="display: inline-block; padding: 8px 0; font-family: ${font.body}; font-size: 12px; color: ${color.muted}; text-decoration: underline;">${escapeHtml(label)}</a>`,
};

const stack = (parts: readonly string[], gap: number) =>
  parts.join(`\n${element.spacer(gap)}\n`);

/** Consecutive items, split by hairlines with room on either side. */
const ruled = (parts: readonly string[]) =>
  parts.join(
    `\n${element.spacer(16)}\n${element.rule()}\n${element.spacer(16)}\n`,
  );

const blockHtml = (block: Block): string => {
  switch (block._tag) {
    case "text":
      return element.paragraph(escapeHtml(block.value));
    case "list":
      return ruled(block.items.map((item) => element.item(escapeHtml(item))));
    case "matchups":
      return ruled(
        block.items.map((matchup) =>
          element.matchup(
            `${escapeHtml(matchup.leading)} ${element.separator(escapeHtml(matchup.separator))} ${escapeHtml(matchup.trailing)}`,
            escapeHtml(matchup.detail),
          ),
        ),
      );
    case "note":
      return element.note(escapeHtml(block.value));
    case "entry":
      return element.entry(
        escapeHtml(block.label),
        escapeHtml(block.detail),
        escapeHtml(block.value),
      );
    case "link":
      return element.link(block.href, block.text);
  }
};

const headerHtml = (input: EmailViewProps) => {
  const headline = escapeHtml(input.headline ?? input.subject);

  const header =
    input.headlineImage === undefined
      ? element.headlineText(
          headline,
          input.accent === undefined
            ? ""
            : element.accent(escapeHtml(input.accent)),
        )
      : element.headlineImage(
          input.headlineImage,
          escapeHtml(headlineText(input)),
        );

  if (input.home === undefined) return header;

  return `<a href="${escapeHtml(input.home)}" style="display: block; text-decoration: none;">${header}</a>`;
};

const previewText = (blocks: readonly Block[]) => {
  const [first] = blocks;

  return first === undefined ? undefined : blockPreview(first);
};

/** Dark palette for clients that honor it; Outlook marks its own dark mode. */
const darkRules = (scope: (selector: string, background: boolean) => string) =>
  [
    `${scope(".email-bg", true)} { background-color: #12160f !important; }`,
    `${scope(".email-ink", false)} { color: #f1efe8 !important; }`,
    `${scope(".email-muted", false)} { color: #a9af9d !important; }`,
    `${scope(".email-accent", false)} { color: #4fcf7f !important; }`,
    `${scope(".email-rule", false)} { border-color: #343b2f !important; }`,
  ].join("\n      ");

const html = (input: EmailViewProps) => {
  const preheader =
    input.preheader ?? previewText(input.blocks) ?? input.subject;

  const Main = stack(input.blocks.map(blockHtml), 24);

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
    <link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..900&amp;display=swap" rel="stylesheet" />
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

      @media (prefers-color-scheme: dark) {
      ${darkRules((selector) => selector)}
      }

      ${darkRules((selector, background) => `[data-${background ? "ogsb" : "ogsc"}] ${selector}`)}
    </style>
    <!--[if mso]><style>.email-display { font-family: Arial, sans-serif !important; }</style><![endif]-->
  </head>
  <body class="body email-bg" style="margin: 0; padding: 0; background-color: ${color.canvas}; font-family: ${font.body}; color: ${color.ink};">
    <div style="display: none; max-height: 0; max-width: 0; overflow: hidden; opacity: 0; font-size: 1px; line-height: 1px; color: transparent; mso-hide: all;">${escapeHtml(preheader)}&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;</div>
    <table role="presentation" class="email-bg" width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%; background-color: ${color.canvas};">
      <tr>
        <td align="center" style="padding: 24px 16px 40px;">
          <!--[if mso]><table role="presentation" width="${EmailHeadlineSize.width.toString()}" align="center" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%; max-width: ${EmailHeadlineSize.width.toString()}px; margin: 0 auto;">
            <tr>
              <td style="padding: 0 0 28px;">
                ${headerHtml(input)}
              </td>
            </tr>
            <tr>
              <td>
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
