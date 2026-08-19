import { describe, expect, it } from "@effect/vitest";
import { ConfigProvider, Effect, Schema } from "effect";

import { notification } from "../../../__tests__/fixtures.js";
import { SignupConfirmation } from "../../schema.js";
import { renderSignupConfirmation } from "../render.js";

const WebConfigLayerTest = ConfigProvider.layer(
  ConfigProvider.fromEnv({
    env: {
      VITE_WEB_URL_BASE: "https://example.com",
      VITE_WEB_URL_PORT: "8080",
    },
  }),
);

const signupConfirmation = SignupConfirmation.cases.firstSignup.make({
  user: notification.user,
  subjects: [
    notification.subject,
    {
      ...notification.subject,
      details: {
        ...notification.subject.details,
        location: "New York",
        name: "Knicks & Nets",
        display: "New York Knicks & Nets <Team>",
        abbreviation: "NYK",
        slug: "new-york-knicks",
      },
    },
  ],
  schedule: notification.subscription.schedule,
});

const repeatConfirmation = SignupConfirmation.cases.repeatSignup.make({
  user: signupConfirmation.user,
  subjects: signupConfirmation.subjects,
  schedule: signupConfirmation.schedule,
});

describe("signup confirmation email", () => {
  it("decodes both confirmation variants", () => {
    const decode = Schema.decodeUnknownSync(SignupConfirmation);
    const encode = Schema.encodeUnknownSync(SignupConfirmation);

    expect(decode(encode(signupConfirmation))._tag).toBe("firstSignup");
    expect(decode(encode(repeatConfirmation))._tag).toBe("repeatSignup");
  });

  it.effect("renders distinct, complete text and HTML receipts", () =>
    Effect.gen(function* () {
      const first = yield* renderSignupConfirmation(signupConfirmation);
      const repeat = yield* renderSignupConfirmation(repeatConfirmation);

      expect(first.subject).toBe("Welcome to dotheyplaytoday");
      expect(first.body.text).toContain("You're on the roster");
      expect(repeat.subject).toBe("Your dotheyplaytoday picks are updated");
      expect(repeat.body.text).toContain("previous picks have been replaced");

      for (const rendered of [first, repeat]) {
        expect(rendered.body.text).toContain("Boston Celtics");
        expect(rendered.body.text).toContain("New York Knicks & Nets <Team>");
        expect(rendered.body.text).toContain("9:00 AM (America/New_York)");
        expect(rendered.body.text).toContain(
          "https://example.com:8080/unsubscribe/00000000-0000-4000-8000-000000000201",
        );
        expect(rendered.body.html).toContain("Boston Celtics");
        expect(rendered.body.html).toContain(
          "New York Knicks &amp; Nets &lt;Team&gt;",
        );
        expect(rendered.body.html).not.toContain(
          "New York Knicks & Nets <Team>",
        );
      }
    }).pipe(Effect.provide(WebConfigLayerTest)),
  );
});
