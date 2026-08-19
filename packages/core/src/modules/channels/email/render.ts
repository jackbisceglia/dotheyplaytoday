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

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const text = (main: readonly string[], unsubscribe: Unsubscribe) =>
  StringParts()
    .addParts(...main)
    .add("")
    .add(`${unsubscribe.text}: ${unsubscribe.href}`)
    .make("\n");

const html = (
  subject: string,
  main: readonly string[],
  unsubscribe: Unsubscribe,
) => {
  const element = {
    div: '<div style="height: 10px;"></div>',
    a: (href: string, text: string) =>
      `<a href="${escapeHtml(href)}" style="color: #6b7280;">${escapeHtml(text)}</a>`,
    p: (content: string) =>
      `<p style="margin: 0 0 8px; font-size: 15px; line-height: 1.5; color: #1f2937;">${content}</p>`,
  };

  const Main = StringParts(
    ...main.map((line) =>
      line === "" ? element.div : element.p(escapeHtml(line)),
    ),
  ).make("");

  const Footer = element.p(element.a(unsubscribe.href, unsubscribe.text));

  return `<!DOCTYPE html>
<html lang="en">
  <body style="margin: 0; padding: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #111827; background-color: #ffffff;">
    <div style="max-width: 560px; border-left: 3px solid #2563eb; padding: 4px 0 4px 16px; background-color: #ffffff;">
      <p style="margin: 0 0 12px; font-size: 24px; line-height: 1.2; font-weight: 700; color: #111827;">${escapeHtml(subject)}</p>
      ${Main}
      <div style="margin-top: 18px; padding-top: 12px; border-top: 1px solid #f3f4f6; font-size: 12px; line-height: 1.5; color: #6b7280;">${Footer}</div>
    </div>
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
