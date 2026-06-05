import { StringParts } from "../../../../lib/string.js";

export type EmailRendered = {
  readonly subject: string;
  readonly body: {
    readonly text: string;
    readonly html: string;
  };
};

export type EmailViewProps = {
  readonly subject: string;
  readonly main: readonly string[];
  readonly footer: readonly string[];
};

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const text = (main: readonly string[], footer: readonly string[]) =>
  StringParts()
    .addParts(...main)
    .add("")
    .addParts(...footer)
    .make("\n");

const html = (
  subject: string,
  main: readonly string[],
  footer: readonly string[],
) => {
  const divider = '<div style="height: 10px;"></div>';
  const p = (line: string) =>
    `<p style="margin: 0 0 8px; font-size: 15px; line-height: 1.5; color: #1f2937;">${escapeHtml(line)}</p>`;

  const Main = StringParts(
    ...main.map((line) => (line === "" ? divider : p(line))),
  ).make("");

  const Footer = StringParts(...footer.map((line) => p(line))).make("");

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
      text: text(input.main, input.footer),
      html: html(input.subject, input.main, input.footer),
    },
  };
}
