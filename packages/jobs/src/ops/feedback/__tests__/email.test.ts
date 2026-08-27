import { describe, expect, it } from "@effect/vitest";
import { DateTime } from "effect";

import { Feedback, FeedbackId } from "@dtpt/core/modules/feedback/schema";
import { render } from "../email.js";

const feedback = [
  Feedback.make({
    id: FeedbackId.make("00000000-0000-4000-8000-000000000001"),
    type: "new_subject",
    request: "Please add the Liberty & WNBA <schedule>.",
    createdAt: DateTime.makeUnsafe("2026-08-22T00:15:00.000Z"),
  }),
  Feedback.make({
    id: FeedbackId.make("00000000-0000-4000-8000-000000000002"),
    type: "general",
    request: "The signup flow is great.",
    createdAt: DateTime.makeUnsafe("2026-08-22T11:45:00.000Z"),
  }),
] as const;

describe("feedback digest email", () => {
  it("renders a feedback digest", () => {
    const rendered = render(feedback);

    expect(rendered.subject).toBe("2 new feedback submissions");
    expect(rendered).not.toHaveProperty("metadata");
    expect(rendered.body.text).toContain("New subject");
    expect(rendered.body.text).toContain("2026-08-22T00:15:00.000Z");
    expect(rendered.body.text).toContain(
      "Please add the Liberty & WNBA <schedule>.",
    );
    expect(rendered.body.html).toContain(
      "Please add the Liberty &amp; WNBA &lt;schedule&gt;.",
    );
    expect(rendered.body.text).not.toContain("Unsubscribe");
  });
});
