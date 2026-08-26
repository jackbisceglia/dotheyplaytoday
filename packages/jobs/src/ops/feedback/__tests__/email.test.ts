import { describe, expect, it } from "@effect/vitest";
import { ConfigProvider, DateTime, Effect, Layer, Ref } from "effect";

import type { EmailRendered } from "@dtpt/core/modules/email/render";
import { Email } from "@dtpt/core/modules/email/service";
import { Feedback, FeedbackId } from "@dtpt/core/modules/feedback/schema";
import { sendFeedback } from "../email.js";

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

const ConfigLayerTest = ConfigProvider.layer(
  ConfigProvider.fromEnv({ env: { ADMIN_EMAIL: "owner@example.com" } }),
);

describe("feedback digest email", () => {
  it.effect("renders and sends to the configured administrator", () =>
    Effect.gen(function* () {
      const sent = yield* Ref.make<
        readonly {
          readonly recipient: string;
          readonly idempotencyKey: string;
          readonly rendered: EmailRendered;
        }[]
      >([]);

      const EmailLayerTest = Layer.succeed(
        Email,
        Email.of({
          send: (delivery, rendered) =>
            Ref.update(sent, (deliveries) => [
              ...deliveries,
              { ...delivery, rendered },
            ]),
        }),
      );

      yield* sendFeedback(feedback, "feedback-digest-id").pipe(
        Effect.provide([EmailLayerTest, ConfigLayerTest]),
      );

      const deliveries = yield* Ref.get(sent);
      const delivery = deliveries[0];

      expect(delivery).toMatchObject({
        recipient: "owner@example.com",
        idempotencyKey: "feedback-digest-id",
        rendered: {
          subject: "2 new feedback submissions",
        },
      });
      expect(delivery?.rendered).not.toHaveProperty("metadata");
      expect(delivery?.rendered.body.text).toContain("New subject");
      expect(delivery?.rendered.body.text).toContain(
        "2026-08-22T00:15:00.000Z",
      );
      expect(delivery?.rendered.body.text).toContain(
        "Please add the Liberty & WNBA <schedule>.",
      );
      expect(delivery?.rendered.body.html).toContain(
        "Please add the Liberty &amp; WNBA &lt;schedule&gt;.",
      );
      expect(delivery?.rendered.body.text).not.toContain("Unsubscribe");
    }),
  );
});
