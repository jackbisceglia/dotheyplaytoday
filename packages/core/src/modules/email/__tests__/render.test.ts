import { describe, expect, it } from "vitest";

import { Headline } from "../headline.js";
import { EmailView, ScheduleSection } from "../render.js";

describe("schedule section layout", () => {
  const render = (section: typeof ScheduleSection.Type) =>
    EmailView({
      subject: "Your plans",
      headline: Headline.cases.text.make({
        lines: ["Your plans", "At a glance"],
      }),
      blocks: [section],
    });

  it("renders arbitrary dated labels consistently in HTML and plain text", () => {
    const email = render(
      ScheduleSection.make({
        title: "Museum <visits>",
        emptyText: "Nothing booked.",
        rows: [{ date: "Wed, Oct 7", label: "Art & design", time: "2:00 PM" }],
      }),
    );

    expect(email.body.text).toContain(
      "Museum <visits>\n- Art & design\n  Wed, Oct 7 · 2:00 PM",
    );

    expect(email.body.html).toContain("Museum &lt;visits&gt;");
    expect(email.body.html).toContain("Art &amp; design");
    expect(email.body.html).toContain("&bull;");
    expect(email.body.html).toContain("Wed, Oct 7 · 2:00 PM");
    expect(email.body.html).not.toContain("Nothing booked.");
    expect(email.body.text).not.toContain("No games");
  });

  it("uses caller-supplied empty content in both formats and escapes HTML", () => {
    const email = render(
      ScheduleSection.make({
        title: "Museum visits",
        emptyText: "Nothing <booked> & no reservations.",
        rows: [],
      }),
    );

    expect(email.body.text).toContain(
      "Museum visits\nNothing <booked> & no reservations.",
    );

    expect(email.body.html).toContain(
      "Nothing &lt;booked&gt; &amp; no reservations.",
    );

    expect(email.body.text).not.toContain("No games");
  });
});
