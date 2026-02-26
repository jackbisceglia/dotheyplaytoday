import { describe, expect, it } from "@effect/vitest";
import { DateTime, Effect, Either, Layer, Schema } from "effect";

import { SportsEvent } from "../modules/events/schema.js";
import { Notifier } from "../modules/notifier/service.js";
import {
  type NotifierMessage,
  NotifierContext,
  NotifierResponseError,
} from "../modules/notifier/providers/service.js";
import { User } from "../modules/users/schema.js";

const decode = Schema.decodeUnknownSync;

const sampleIds = {
  userId: "00000000-0000-0000-0000-000000000031",
  eventIdA: "00000000-0000-0000-0000-000000000032",
  eventIdB: "00000000-0000-0000-0000-000000000033",
};

const user = decode(User)({
  id: sampleIds.userId,
  email: "fan@example.com",
  timezone: "America/New_York",
});

const makeEvent = (opts: {
  id: string;
  startUtc: string;
  site: "home" | "away";
  teamName: string;
  opponent: string;
}) =>
  decode(SportsEvent)({
    id: opts.id,
    _tag: "sports",
    startUtc: opts.startUtc,
    site: opts.site,
    teamName: opts.teamName,
    opponent: opts.opponent,
  });

const formatStartTime = (utc: DateTime.Utc, timezone: User["timezone"]) =>
  DateTime.format(DateTime.setZone(utc, timezone), {
    locale: "en-US",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZoneName: "short",
  });

const makeNotifierLayerTest = (opts: {
  sent: NotifierMessage[];
  fail?: boolean;
}) => {
  const provider = {
    send: (message: NotifierMessage) => {
      if (opts.fail) {
        return NotifierResponseError.make({
          channel: message.channel,
          message: "provider failure",
          code: "application_error",
          statusCode: 500,
        });
      }

      return Effect.sync(() => {
        opts.sent.push(message);
      });
    },
  };

  const NotifierContextLayerTest = Layer.succeed(NotifierContext, provider);

  const NotifierLayer = Notifier.Default.pipe(
    Layer.provide(NotifierContextLayerTest),
  );

  return NotifierLayer;
};

describe("Notifier", () => {
  it.effect("should render single-game subject with local tipoff time", () => {
    const sent: NotifierMessage[] = [];

    const event = makeEvent({
      id: sampleIds.eventIdA,
      startUtc: "2026-02-10T00:30:00Z",
      site: "home",
      teamName: "Celtics",
      opponent: "Raptors",
    });

    const expectedTime = formatStartTime(event.startUtc, user.timezone);

    return Effect.gen(function* () {
      const notifier = yield* Notifier;
      yield* notifier.send(user, [event]);

      expect(sent).toHaveLength(1);
      const [message] = sent;
      expect(message?.channel).toBe("email");
      expect(message?.title).toBe(`Celtics vs. Raptors, ${expectedTime}`);
      expect(message?.body).toContain("Raptors");
      expect(message?.body).toContain(expectedTime);
    }).pipe(Effect.provide(makeNotifierLayerTest({ sent })));
  });

  it.effect("should render multi-game subject and include all matchups", () => {
    const sent: NotifierMessage[] = [];

    const earlyEvent = makeEvent({
      id: sampleIds.eventIdA,
      startUtc: "2026-02-10T00:30:00Z",
      site: "away",
      teamName: "Celtics",
      opponent: "Raptors",
    });

    const lateEvent = makeEvent({
      id: sampleIds.eventIdB,
      startUtc: "2026-02-10T03:30:00Z",
      site: "home",
      teamName: "Celtics",
      opponent: "Knicks",
    });

    const expectedEarly = formatStartTime(earlyEvent.startUtc, user.timezone);
    const expectedLate = formatStartTime(lateEvent.startUtc, user.timezone);

    return Effect.gen(function* () {
      const notifier = yield* Notifier;
      yield* notifier.send(user, [lateEvent, earlyEvent]);

      expect(sent).toHaveLength(1);
      const [message] = sent;
      expect(message?.title).toBe("Celtics play today, 2 games");
      expect(message?.body).toContain(`Celtics @ Raptors, ${expectedEarly}`);
      expect(message?.body).toContain(`Celtics vs. Knicks, ${expectedLate}`);

      const body = message?.body ?? "";
      expect(body.indexOf("Raptors")).toBeLessThan(body.indexOf("Knicks"));
    }).pipe(Effect.provide(makeNotifierLayerTest({ sent })));
  });

  it.effect("should return provider failures to caller", () => {
    const sent: NotifierMessage[] = [];

    const event = makeEvent({
      id: sampleIds.eventIdA,
      startUtc: "2026-02-10T00:30:00Z",
      site: "home",
      teamName: "Celtics",
      opponent: "Raptors",
    });

    return Effect.gen(function* () {
      const notifier = yield* Notifier;
      const result = yield* Effect.either(notifier.send(user, [event]));

      Either.match(result, {
        onLeft: (error) => {
          expect(error._tag).toBe("NotifierResponseError");
        },
        onRight: () => expect.fail("Expected provider failure to propagate"),
      });
      expect(sent).toHaveLength(0);
    }).pipe(Effect.provide(makeNotifierLayerTest({ sent, fail: true })));
  });
});
