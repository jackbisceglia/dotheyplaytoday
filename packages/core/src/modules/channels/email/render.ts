import { StringParts } from "../../../lib/string.js";

export type EmailRendered = {
  readonly subject: string;
  readonly body: {
    readonly text: string;
    readonly html: string;
  };
};

export type Unsubscribe = {
  readonly href: string;
  readonly text: string;
};

export type EmailViewProps = {
  readonly subject: string;
  readonly main: readonly string[];
  readonly unsubscribe: Unsubscribe;
};

const color = {
  paper: "#f8f6f0",
  ink: "#131711",
  kelly: "#169b4d",
  kellyDeep: "#0c6b34",
  muted: "#6b7360",
};

const font = {
  display: "'Arial Black', Arial, Helvetica, sans-serif",
  body: "Arial, Helvetica, sans-serif",
};

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const text = (main: readonly string[], unsubscribe: Unsubscribe) =>
  StringParts()
    .addParts(...main.map((line) => line.replaceAll("\t", ", ")))
    .add("")
    .add(`${unsubscribe.text}: ${unsubscribe.href}`)
    .make("\n");

const html = (
  subject: string,
  main: readonly string[],
  unsubscribe: Unsubscribe,
) => {
  const element = {
    div: '<div style="height: 12px; line-height: 12px; font-size: 12px;">&nbsp;</div>',
    a: (href: string, text: string) =>
      `<a href="${escapeHtml(href)}" style="color: ${color.kellyDeep}; font-weight: 700;">${escapeHtml(text)}</a>`,
    p: (content: string) =>
      `<p style="margin: 0 0 10px; font-size: 15px; line-height: 1.5; color: ${color.ink}; font-family: ${font.body};">${content}</p>`,
    item: (content: string) =>
      `<p style="margin: 0 0 8px; font-size: 15px; line-height: 1.4; font-weight: 700; color: ${color.ink}; font-family: ${font.body};"><span style="color: ${color.kelly};">&#9679;</span>&nbsp; ${content}</p>`,
    row: (label: string, value: string) =>
      `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
        <td style="padding: 6px 0; font-size: 15px; font-weight: 700; line-height: 1.4; color: ${color.ink}; font-family: ${font.body};">${label}</td>
        <td style="padding: 6px 0 6px 16px; font-size: 13px; font-weight: 400; line-height: 1.4; color: ${color.ink}; font-family: ${font.body}; text-align: right; white-space: nowrap;">${value}</td>
      </tr></table>`,
  };

  const Main = StringParts(
    ...main.map((line) => {
      if (line === "") return element.div;
      if (line.startsWith("- ")) return element.item(escapeHtml(line.slice(2)));

      const tabIndex = line.indexOf("\t");
      if (tabIndex !== -1) {
        return element.row(
          escapeHtml(line.slice(0, tabIndex)),
          escapeHtml(line.slice(tabIndex + 1)),
        );
      }

      return element.p(escapeHtml(line));
    }),
  ).make("");

  const Footer = `<p style="margin: 0; font-size: 12px; line-height: 1.6; letter-spacing: 0.08em; text-transform: uppercase; color: ${color.muted}; font-family: ${font.body};">${element.a(unsubscribe.href, unsubscribe.text)}</p>`;

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body style="margin: 0; padding: 32px 16px; font-family: ${font.body}; color: ${color.ink}; background-color: ${color.paper};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; margin: 0 auto;">
      <tr>
        <td style="padding: 0 0 20px; border-bottom: 3px solid ${color.ink};">
          <span style="font-family: ${font.display}; font-weight: 900; font-size: 16px; letter-spacing: 0.02em; text-transform: uppercase; color: ${color.ink};">dothey<span style="color: ${color.kelly};">play</span>today</span>
        </td>
      </tr>
      <tr>
        <td style="padding: 28px 0 0;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border: 3px solid ${color.ink}; background-color: #ffffff; box-shadow: 6px 6px 0 ${color.kelly};">
            <tr>
              <td style="padding: 28px;">
                <p style="margin: 0 0 18px; font-family: ${font.display}; font-weight: 900; font-size: 21px; line-height: 1.25; letter-spacing: 0; text-transform: uppercase; color: ${color.ink};">${escapeHtml(subject)}</p>
                ${Main}
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding: 24px 4px 0; text-align: center;">
          ${Footer}
        </td>
      </tr>
    </table>
  </body>
</html>`;
};

export function EmailView(input: EmailViewProps): EmailRendered {
  return {
    subject: input.subject,
    body: {
      text: text(input.main, input.unsubscribe),
      html: html(input.subject, input.main, input.unsubscribe),
    },
  };
}
