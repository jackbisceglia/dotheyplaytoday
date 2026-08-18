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

export const emailDesign = {
  body: "margin: 0; padding: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #111827; background-color: #ffffff;",
  container:
    "max-width: 560px; border-left: 3px solid #2563eb; padding: 4px 0 4px 16px; background-color: #ffffff;",
  heading:
    "margin: 0 0 12px; font-size: 24px; line-height: 1.2; font-weight: 700; color: #111827;",
  paragraph:
    "margin: 0 0 8px; font-size: 15px; line-height: 1.5; color: #1f2937;",
  link: "color: #6b7280;",
  footer:
    "margin-top: 18px; padding-top: 12px; border-top: 1px solid #f3f4f6; font-size: 12px; line-height: 1.5; color: #6b7280;",
} as const;

export const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

export const renderUnsubscribeText = (unsubscribe: Unsubscribe) =>
  `${unsubscribe.text}: ${unsubscribe.href}`;

export const renderUnsubscribeHtml = (unsubscribe: Unsubscribe) =>
  `<p style="${emailDesign.paragraph}"><a href="${escapeHtml(unsubscribe.href)}" style="${emailDesign.link}">${escapeHtml(unsubscribe.text)}</a></p>`;
