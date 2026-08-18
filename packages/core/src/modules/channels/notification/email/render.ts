import { StringParts } from "../../../../lib/string.js";
import {
  emailDesign,
  escapeHtml,
  type EmailRendered,
  renderUnsubscribeHtml,
  renderUnsubscribeText,
  type Unsubscribe,
} from "../../email/design.js";

export type { EmailRendered } from "../../email/design.js";

export type NotificationEmailViewProps = {
  readonly subject: string;
  readonly main: readonly string[];
  readonly unsubscribe: Unsubscribe;
};

const text = (main: readonly string[], unsubscribe: Unsubscribe) =>
  StringParts()
    .addParts(...main)
    .add("")
    .add(renderUnsubscribeText(unsubscribe))
    .make("\n");

const html = (
  subject: string,
  main: readonly string[],
  unsubscribe: Unsubscribe,
) => {
  const element = {
    div: '<div style="height: 10px;"></div>',
    p: (content: string) =>
      `<p style="${emailDesign.paragraph}">${content}</p>`,
  };

  const Main = StringParts(
    ...main.map((line) =>
      line === "" ? element.div : element.p(escapeHtml(line)),
    ),
  ).make("");

  const Footer = renderUnsubscribeHtml(unsubscribe);

  return `<!DOCTYPE html>
<html lang="en">
  <body style="${emailDesign.body}">
    <div style="${emailDesign.container}">
      <p style="${emailDesign.heading}">${escapeHtml(subject)}</p>
      ${Main}
      <div style="${emailDesign.footer}">${Footer}</div>
    </div>
  </body>
</html>`;
};

export function NotificationEmailView(
  input: NotificationEmailViewProps,
): EmailRendered {
  return {
    subject: input.subject,
    body: {
      text: text(input.main, input.unsubscribe),
      html: html(input.subject, input.main, input.unsubscribe),
    },
  };
}
