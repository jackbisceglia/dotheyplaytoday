import { ConfigProvider, Effect, Layer, Schema } from "effect";
import { describe, expect, it } from "vitest";

import { Id } from "../../../../lib/id/service.js";
import { EmailAddressFromString } from "../../../users/schema.js";
import { Email } from "../../service.js";
import { renderMagicLink, sendMagicLink } from "../magic-link.js";

const ConfigLayerTest = ConfigProvider.layer(
  ConfigProvider.fromEnv({
    env: { VITE_WEB_URL_BASE: "https://dotheyplay.today" },
  }),
);

describe("magic-link email", () => {
  it("renders a transactional sign-in link", async () => {
    const rendered = await Effect.runPromise(
      renderMagicLink(
        "https://api.dotheyplay.today/api/auth/magic-link/verify?token=secret",
      ).pipe(Effect.provide(ConfigLayerTest)),
    );

    expect(rendered.subject).toBe("Sign in to dotheyplaytoday");
    expect(rendered.body.text).toContain("Sign in:");
    expect(rendered.body.html).toContain("token=secret");
  });

  it("delivers through the provider-neutral Email boundary", async () => {
    const deliveries: unknown[] = [];
    const EmailFake = Layer.succeed(
      Email,
      Email.of({
        send: (delivery, rendered) =>
          Effect.sync(() => deliveries.push({ delivery, rendered })),
      }),
    );
    const IdFake = Layer.succeed(
      Id,
      Id.of({
        generate: () => Effect.succeed("delivery-id"),
        makeFromBrandedSchema: (schema) =>
          Effect.succeed(schema.make("delivery-id")),
      }),
    );
    const recipient = Schema.decodeUnknownSync(EmailAddressFromString)(
      "user@example.com",
    );

    await Effect.runPromise(
      sendMagicLink(recipient, "https://api.example.com/verify").pipe(
        Effect.provide([EmailFake, IdFake]),
        Effect.provide(ConfigLayerTest),
      ),
    );

    expect(deliveries).toHaveLength(1);
    expect(deliveries[0]).toMatchObject({
      delivery: {
        recipient: "user@example.com",
        idempotencyKey: "delivery-id",
      },
    });
  });
});
