import { StringParts } from "../../../../lib/string.js";
import type { EmailRendered } from "../../email/clients/service.js";
import {
  escapeHtml,
  renderUnsubscribeHtml,
  renderUnsubscribeText,
  styles,
  type Unsubscribe,
} from "../../email/utils.js";

export type { EmailRendered } from "../../email/clients/service.js";

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
    p: (content: string) => `<p style="${styles.paragraph}">${content}</p>`,
  };

  const Main = StringParts(
    ...main.map((line) =>
      line === "" ? element.div : element.p(escapeHtml(line)),
    ),
  ).make("");

  const Footer = renderUnsubscribeHtml(unsubscribe);

  return `<!DOCTYPE html>
<html lang="en">
  <body style="${styles.body}">
    <div style="${styles.container}">
      <p style="${styles.heading}">${escapeHtml(subject)}</p>
      ${Main}
      <div style="${styles.footer}">${Footer}</div>
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
