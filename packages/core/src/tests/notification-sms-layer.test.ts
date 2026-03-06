import { describe, expect, it } from "@effect/vitest";
import { Effect, Either, Schema } from "effect";

import { SportsEvent } from "../modules/events/schema.js";
import { Notifier } from "../modules/notifier/index.js";
import { NotifierLayerSms } from "../modules/notifier/sms/index.js";
import { User } from "../modules/users/schema.js";

const decode = Schema.decodeUnknownSync;

const user = decode(User)({
  id: "00000000-0000-0000-0000-000000000041",
  email: "fan@example.com",
  timezone: "America/New_York",
});

const event = decode(SportsEvent)({
  id: "00000000-0000-0000-0000-000000000042",
  _tag: "sports",
  startUtc: "2026-02-10T00:30:00Z",
  site: "home",
  teamName: "Celtics",
  opponent: "Raptors",
});

describe("NotifierLayerSms", () => {
  it.effect("should keep sms unavailable behind a typed notifier error", () =>
    Effect.gen(function* () {
      const notifier = yield* Notifier.pipe(Effect.provide(NotifierLayerSms));
      const result = yield* Effect.either(notifier.send(user, [event]));

      Either.match(result, {
        onLeft: (error) => {
          expect(error._tag).toBe("NotifierChannelUnavailable");
          expect(error.channel).toBe("sms");
        },
        onRight: () => expect.fail("Expected sms notifier to be unavailable"),
      });
    }),
  );
});
