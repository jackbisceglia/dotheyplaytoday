import { StringParts } from "../../lib/string.js";

export type EmailRendered = {
  readonly subject: string;
  /** Mirrored into the List-Unsubscribe header by the transport. */
  readonly unsubscribeUrl: string;
  readonly body: {
    readonly text: string;
    readonly html: string;
  };
};

export type Unsubscribe = {
  readonly href: string;
  readonly text: string;
};

/** One matchup entry: "leading <separator> trailing", plus its start time. */
export type EmailMatchup = {
  readonly leading: string;
  readonly separator: string;
  readonly trailing: string;
  readonly detail: string;
};

/**
 * Content is described as blocks rather than pre-formatted lines so the text
 * and html renderers can each lay a block out on their own terms.
 */
export type EmailBlock =
  | { readonly _tag: "text"; readonly value: string }
  | { readonly _tag: "list"; readonly items: readonly string[] }
  | { readonly _tag: "matchups"; readonly items: readonly EmailMatchup[] }
  | { readonly _tag: "note"; readonly value: string };

export const EmailBlock = {
  /** A paragraph of body copy. */
  text: (value: string): EmailBlock => ({ _tag: "text", value }),
  /** Emphasized single-line entries, one row each. */
  list: (items: readonly string[]): EmailBlock => ({ _tag: "list", items }),
  /** Emphasized matchup entries with a secondary detail line. */
  matchups: (items: readonly EmailMatchup[]): EmailBlock => ({
    _tag: "matchups",
    items,
  }),
  /** Closing fine print, set apart by a rule. */
  note: (value: string): EmailBlock => ({ _tag: "note", value }),
};

export type EmailViewProps = {
  readonly subject: string;
  /** Display headline. Defaults to the email subject. */
  readonly headline?: string | undefined;
  /** Trailing word set in kelly, as the site hero sets its emphasis. */
  readonly accent?: string | undefined;
  /** Inbox preview text; defaults to a summary of the first block. */
  readonly preheader?: string | undefined;
  /** Destination for the wordmark link. */
  readonly home?: string | undefined;
  readonly blocks: readonly EmailBlock[];
  readonly unsubscribe: Unsubscribe;
};

const color = {
  canvas: "#f8f6f0",
  ink: "#131711",
  kelly: "#169b4d",
  kellyDeep: "#0c6b34",
  kellyWash: "#dbeee2",
  muted: "#5d6455",
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

const matchupText = (matchup: EmailMatchup) =>
  `${matchup.detail} - ${matchup.leading} ${matchup.separator} ${matchup.trailing}`;

/** One-line summary of a block, used for inbox preview text. */
const blockPreview = (block: EmailBlock): string => {
  switch (block._tag) {
    case "text":
    case "note":
      return block.value;
    case "list":
      return block.items.join(", ");
    case "matchups":
      return block.items.map(matchupText).join(" \u2022 ");
  }
};

const blockText = (block: EmailBlock): readonly string[] => {
  switch (block._tag) {
    case "text":
      return [block.value];
    case "list":
      return block.items.map((item) => `- ${item}`);
    case "matchups":
      return block.items.map(matchupText);
    case "note":
      return [block.value];
  }
};

const text = (input: EmailViewProps) =>
  StringParts()
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
    .add("")
    .add(`${input.unsubscribe.text}: ${input.unsubscribe.href}`)
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

  link: (href: string, label: string) =>
    `<a href="${escapeHtml(href)}" class="email-muted" style="display: inline-block; padding: 8px 4px; font-family: ${font.body}; font-weight: 700; font-size: 12px; color: ${color.muted}; text-decoration: underline;">${escapeHtml(label)}</a>`,
};

const stack = (parts: readonly string[], gap: number) =>
  parts.join(`\n${element.spacer(gap)}\n`);

const blockHtml = (block: EmailBlock): string => {
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
  }
};

const previewText = (blocks: readonly EmailBlock[]) => {
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

  const wordmark = `<span class="email-ink email-wordmark" style="font-family: ${font.display}; font-weight: 900; font-stretch: 75%; font-size: 15px; line-height: 1.2; letter-spacing: 0.02em; text-transform: uppercase; color: ${color.ink};">dothey<span class="email-accent" style="color: ${color.kelly};">play</span>today</span>`;

  const Wordmark =
    input.home === undefined
      ? wordmark
      : `<a href="${escapeHtml(input.home)}" class="email-ink" style="text-decoration: none; color: ${color.ink};">${wordmark}</a>`;

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
      }
    </style>
  </head>
  <body class="email-bg" style="margin: 0; padding: 0; background-color: ${color.canvas}; font-family: ${font.body}; color: ${color.ink};">
    <div style="display: none; max-height: 0; max-width: 0; overflow: hidden; opacity: 0; font-size: 1px; line-height: 1px; color: transparent; mso-hide: all;">${escapeHtml(preheader)}&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;</div>
    <table role="presentation" class="email-bg" width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%; background-color: ${color.canvas};">
      <tr>
        <td class="email-shell" align="center" style="padding: 24px 16px 32px;">
          <!--[if mso]><table role="presentation" width="480" align="center" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%; max-width: 480px; margin: 0 auto;">
            <tr>
              <td class="email-rule" style="padding: 0 0 12px; border-bottom: 3px solid ${color.ink};">
                ${Wordmark}
              </td>
            </tr>
            <tr>
              <td style="padding: 22px 0 0;">
                ${Headline}
                ${Main}
              </td>
            </tr>
            <tr>
              <td style="padding: 22px 0 0;">
                ${element.link(input.unsubscribe.href, input.unsubscribe.text)}
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
    unsubscribeUrl: input.unsubscribe.href,
    body: {
      text: text(input),
      html: html(input),
    },
  };
}
