import { describe, expect, it } from "@effect/vitest";
import {
  ChannelClientRequestError,
  ChannelClientResponseError,
  ConsoleChannelLayer,
  ConsoleNotifierLayer,
  DatabaseReadError,
  DatabaseWriteError,
  EmailAddress,
  Events,
  EventWithParticipants,
  Notifier,
  NotificationRecipient,
  Subscriptions,
  type Notification,
} from "@dtpt/core-v2";
import { DateTime, Effect, Exit, Layer, Schema } from "effect";

import { notify } from "./index.js";

const decode = Schema.decodeUnknownSync;
const utc = decode(Schema.DateTimeUtcFromString);

const ids = {
  userA: "00000000-0000-4000-8000-000000000101",
  userB: "00000000-0000-4000-8000-000000000102",
  unsubscribeA: "00000000-0000-4000-8000-000000000201",
  unsubscribeB: "00000000-0000-4000-8000-000000000202",
  subjectA: "00000000-0000-4000-8000-000000000301",
  subjectB: "00000000-0000-4000-8000-000000000302",
  subscriptionA: "00000000-0000-4000-8000-000000000401",
  subscriptionB: "00000000-0000-4000-8000-000000000402",
  eventA: "00000000-0000-4000-8000-000000000501",
  eventB: "00000000-0000-4000-8000-000000000502",
  participantAway: "00000000-0000-4000-8000-000000000601",
  participantHome: "00000000-0000-4000-8000-000000000602",
};

const now = utc("2026-05-24T13:00:00.000Z");

const makeRecipient = (
  opts: {
    readonly userId?: string;
    readonly email?: string;
    readonly timezone?: string;
    readonly unsubscribeToken?: string;
    readonly subscriptionId?: string;
    readonly subjectId?: string;
    readonly sendAtSecondsLocal?: number;
    readonly lastSentAt?: string | null;
    readonly subjectName?: string;
  } = {},
) =>
  decode(NotificationRecipient)({
    user: {
      id: opts.userId ?? ids.userA,
      email: opts.email ?? "fan@example.com",
      timezone: opts.timezone ?? "America/New_York",
      unsubscribeToken: opts.unsubscribeToken ?? ids.unsubscribeA,
    },
    subscription: {
      id: opts.subscriptionId ?? ids.subscriptionA,
      userId: opts.userId ?? ids.userA,
      subjectId: opts.subjectId ?? ids.subjectA,
      schedule: {
        _tag: "fixed_local_time",
        sendAtSecondsLocal: opts.sendAtSecondsLocal ?? 9 * 60 * 60,
      },
      lastSentAt: opts.lastSentAt ?? null,
      subject: {
        id: opts.subjectId ?? ids.subjectA,
        _tag: "sports_team",
        details: {
          _tag: "sports_team",
          leagueId: "nba",
          location: "Boston",
          name: opts.subjectName ?? "Celtics",
          abbreviation: "BOS",
          slug: "boston-celtics",
        },
      },
    },
  });

const makeEvent = (
  opts: {
    readonly id?: string;
    readonly startsAt?: string;
  } = {},
) =>
  decode(EventWithParticipants)({
    id: opts.id ?? ids.eventA,
    _tag: "sports_game",
    sourceId: `sports_game:seed:${opts.id ?? ids.eventA}`,
    startsAt: opts.startsAt ?? "2026-05-24T20:00:00.000Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        id: ids.participantAway,
        eventId: opts.id ?? ids.eventA,
        details: {
          _tag: "sports_game",
          role: "away",
          title: "New York Knicks",
        },
      },
      {
        _tag: "sports_game",
        id: ids.participantHome,
        eventId: opts.id ?? ids.eventA,
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Boston Celtics",
        },
      },
    ],
  });

type HarnessOptions = {
  readonly recipients: readonly NotificationRecipient[];
  readonly eventsBySubject?: ReadonlyMap<
    string,
    readonly EventWithParticipants[]
  >;
  readonly listBySubject?: (
    subjectId: Parameters<Events["Service"]["listBySubject"]>[0],
    opts: Parameters<Events["Service"]["listBySubject"]>[1],
  ) => Effect.Effect<
    readonly EventWithParticipants[],
    DatabaseReadError | Schema.SchemaError
  >;
  readonly deliver?: (
    notification: Notification,
  ) => ReturnType<Notifier["Service"]["deliver"]>;
  readonly markSent?: (
    input: Parameters<Subscriptions["Service"]["markSent"]>[0],
  ) => ReturnType<Subscriptions["Service"]["markSent"]>;
};

const makeHarness = (opts: HarnessOptions) => {
  const deliveries: Notification[] = [];
  const markSentCalls: Parameters<Subscriptions["Service"]["markSent"]>[0][] =
    [];
  const eventQueries: {
    readonly subjectId: string;
    readonly opts: Parameters<Events["Service"]["listBySubject"]>[1];
  }[] = [];

  const SubscriptionsLayerTest = Layer.succeed(
    Subscriptions,
    Subscriptions.of({
      list: () => Effect.succeed([]),
      listNotificationRecipients: () => Effect.succeed(opts.recipients),
      replaceForUser: () => Effect.void,
      markSent: (input) =>
        Effect.sync(() => markSentCalls.push(input)).pipe(
          Effect.andThen(opts.markSent ? opts.markSent(input) : Effect.void),
        ),
    }),
  );

  const EventsLayerTest = Layer.succeed(
    Events,
    Events.of({
      get: () => Effect.die("unused"),
      upsert: () => Effect.die("unused"),
      setParticipants: () => Effect.die("unused"),
      listBySubject: (subjectId, queryOpts) =>
        Effect.sync(() =>
          eventQueries.push({ subjectId, opts: queryOpts }),
        ).pipe(
          Effect.andThen(
            opts.listBySubject
              ? opts.listBySubject(subjectId, queryOpts)
              : Effect.succeed(opts.eventsBySubject?.get(subjectId) ?? []),
          ),
        ),
    }),
  );

  const NotifierLayerTest = Layer.succeed(
    Notifier,
    Notifier.of({
      deliver: (notification) =>
        Effect.sync(() => deliveries.push(notification)).pipe(
          Effect.andThen(
            opts.deliver ? opts.deliver(notification) : Effect.void,
          ),
        ),
    }),
  );

  return {
    deliveries,
    eventQueries,
    markSentCalls,
    layer: Layer.mergeAll(
      SubscriptionsLayerTest,
      EventsLayerTest,
      NotifierLayerTest,
    ),
  };
};

describe("v2 notify orchestration", () => {
  it.effect("sends one due notification and marks sent on success", () => {
    const recipient = makeRecipient();
    const event = makeEvent();
    const harness = makeHarness({
      recipients: [recipient],
      eventsBySubject: new Map([[recipient.subscription.subject.id, [event]]]),
    });

    return Effect.gen(function* () {
      yield* notify({ now }).pipe(Effect.provide(harness.layer));

      expect(harness.deliveries).toHaveLength(1);
      const [delivery] = harness.deliveries;
      expect(delivery).toBeDefined();
      if (!delivery) return;
      expect(delivery.subscription).not.toHaveProperty("subject");
      expect(DateTime.formatIso(delivery.sendAt)).toBe(
        "2026-05-24T13:00:00.000Z",
      );
      expect(harness.markSentCalls).toEqual([
        { subscriptionId: recipient.subscription.id, sentAt: now },
      ]);
    });
  });

  it.effect("queries events with the user's local day UTC range", () => {
    const recipient = makeRecipient();
    const harness = makeHarness({
      recipients: [recipient],
      eventsBySubject: new Map([
        [recipient.subscription.subject.id, [makeEvent()]],
      ]),
    });

    return Effect.gen(function* () {
      yield* notify({ dryRun: true, now }).pipe(Effect.provide(harness.layer));

      expect(harness.eventQueries).toHaveLength(1);
      const [eventQuery] = harness.eventQueries;
      expect(eventQuery).toBeDefined();
      if (!eventQuery?.opts?.range) return;
      expect(eventQuery.subjectId).toBe(recipient.subscription.subject.id);
      expect(DateTime.formatIso(eventQuery.opts.range.from)).toBe(
        "2026-05-24T04:00:00.000Z",
      );
      expect(DateTime.formatIso(eventQuery.opts.range.to)).toBe(
        "2026-05-25T04:00:00.000Z",
      );
      expect(eventQuery.opts.availability).toBeUndefined();
    });
  });

  it.effect("attempts notifier delivery in dry-run without markSent", () => {
    const recipient = makeRecipient();
    const harness = makeHarness({
      recipients: [recipient],
      eventsBySubject: new Map([
        [recipient.subscription.subject.id, [makeEvent()]],
      ]),
    });

    return Effect.gen(function* () {
      yield* notify({ dryRun: true, now }).pipe(Effect.provide(harness.layer));

      expect(harness.deliveries).toHaveLength(1);
      expect(harness.markSentCalls).toHaveLength(0);
    });
  });

  it.effect("console notifier layer does not require Resend config", () =>
    Effect.gen(function* () {
      yield* Notifier;
    }).pipe(
      Effect.provide(
        ConsoleNotifierLayer.pipe(Layer.provide(ConsoleChannelLayer)),
      ),
    ),
  );

  it.effect(
    "force bypasses due and already-sent guards but still requires events",
    () => {
      const recipient = makeRecipient({
        sendAtSecondsLocal: 10 * 60 * 60,
        lastSentAt: "2026-05-24T12:00:00.000Z",
      });
      const harness = makeHarness({
        recipients: [recipient],
        eventsBySubject: new Map([
          [recipient.subscription.subject.id, [makeEvent()]],
        ]),
      });

      return Effect.gen(function* () {
        yield* notify({ force: true, now }).pipe(Effect.provide(harness.layer));

        expect(harness.deliveries).toHaveLength(1);
        expect(harness.markSentCalls).toHaveLength(1);
      });
    },
  );

  it.effect("filters recipients by user email", () =>
    Effect.gen(function* () {
      const target = makeRecipient({
        email: "target@example.com",
        subjectId: ids.subjectA,
        subscriptionId: ids.subscriptionA,
      });
      const other = makeRecipient({
        userId: ids.userB,
        email: "other@example.com",
        unsubscribeToken: ids.unsubscribeB,
        subjectId: ids.subjectB,
        subscriptionId: ids.subscriptionB,
        subjectName: "Knicks",
      });
      const userEmail = decode(EmailAddress)("target@example.com");
      const harness = makeHarness({
        recipients: [target, other],
        eventsBySubject: new Map([
          [target.subscription.subject.id, [makeEvent()]],
          [other.subscription.subject.id, [makeEvent({ id: ids.eventB })]],
        ]),
      });

      yield* notify({ userEmail, now }).pipe(Effect.provide(harness.layer));

      expect(harness.deliveries).toHaveLength(1);
      expect(harness.deliveries[0]?.user.email).toBe("target@example.com");
    }),
  );

  it.effect(
    "skips delivery and markSent when there are no same-day events",
    () => {
      const recipient = makeRecipient();
      const harness = makeHarness({
        recipients: [recipient],
        eventsBySubject: new Map([[recipient.subscription.subject.id, []]]),
      });

      return Effect.gen(function* () {
        yield* notify({ force: true, now }).pipe(Effect.provide(harness.layer));

        expect(harness.deliveries).toHaveLength(0);
        expect(harness.markSentCalls).toHaveLength(0);
      });
    },
  );

  it.effect(
    "continues later recipients after provider request and response errors",
    () => {
      const first = makeRecipient({
        email: "first@example.com",
        subjectId: ids.subjectA,
        subscriptionId: ids.subscriptionA,
      });
      const second = makeRecipient({
        userId: ids.userB,
        email: "second@example.com",
        unsubscribeToken: ids.unsubscribeB,
        subjectId: ids.subjectB,
        subscriptionId: ids.subscriptionB,
        subjectName: "Knicks",
      });
      const harness = makeHarness({
        recipients: [first, second],
        eventsBySubject: new Map([
          [first.subscription.subject.id, [makeEvent()]],
          [second.subscription.subject.id, [makeEvent({ id: ids.eventB })]],
        ]),
        deliver: (notification) =>
          notification.subscription.id === first.subscription.id
            ? Effect.fail(
                new ChannelClientRequestError({
                  channel: "email",
                  message: "network",
                  cause: new Error("network"),
                }),
              )
            : Effect.fail(
                new ChannelClientResponseError({
                  channel: "email",
                  message: "bad recipient",
                  code: "validation_error",
                  statusCode: 422,
                }),
              ),
      });

      return Effect.gen(function* () {
        yield* notify({ now }).pipe(Effect.provide(harness.layer));

        expect(harness.deliveries).toHaveLength(2);
        expect(harness.markSentCalls).toHaveLength(0);
      });
    },
  );

  it.effect("continues later recipients after markSent fails", () => {
    const first = makeRecipient({
      email: "first@example.com",
      subjectId: ids.subjectA,
      subscriptionId: ids.subscriptionA,
    });
    const second = makeRecipient({
      userId: ids.userB,
      email: "second@example.com",
      unsubscribeToken: ids.unsubscribeB,
      subjectId: ids.subjectB,
      subscriptionId: ids.subscriptionB,
      subjectName: "Knicks",
    });
    const harness = makeHarness({
      recipients: [first, second],
      eventsBySubject: new Map([
        [first.subscription.subject.id, [makeEvent()]],
        [second.subscription.subject.id, [makeEvent({ id: ids.eventB })]],
      ]),
      markSent: (input) =>
        input.subscriptionId === first.subscription.id
          ? Effect.fail(
              new DatabaseWriteError({
                operation: "Subscriptions.markSent",
                metadata: { subscriptionId: input.subscriptionId },
              }),
            )
          : Effect.void,
    });

    return Effect.gen(function* () {
      yield* notify({ now }).pipe(Effect.provide(harness.layer));

      expect(harness.deliveries).toHaveLength(2);
      expect(harness.markSentCalls).toHaveLength(2);
    });
  });

  it.effect("aborts the run when event reads fail", () => {
    const recipient = makeRecipient();
    const harness = makeHarness({
      recipients: [recipient],
      listBySubject: () =>
        Effect.fail(
          new DatabaseReadError({
            operation: "Events.listBySubject",
          }),
        ),
    });

    return Effect.gen(function* () {
      const error = yield* notify({ now }).pipe(
        Effect.provide(harness.layer),
        Effect.flip,
      );

      expect(error).toBeInstanceOf(DatabaseReadError);
      expect(harness.deliveries).toHaveLength(0);
      expect(harness.markSentCalls).toHaveLength(0);
    });
  });

  it.effect("aborts the run when rendering dies", () => {
    const first = makeRecipient({
      email: "first@example.com",
      subjectId: ids.subjectA,
      subscriptionId: ids.subscriptionA,
    });
    const second = makeRecipient({
      userId: ids.userB,
      email: "second@example.com",
      unsubscribeToken: ids.unsubscribeB,
      subjectId: ids.subjectB,
      subscriptionId: ids.subscriptionB,
      subjectName: "Knicks",
    });
    const harness = makeHarness({
      recipients: [first, second],
      eventsBySubject: new Map([
        [first.subscription.subject.id, [makeEvent()]],
        [second.subscription.subject.id, [makeEvent({ id: ids.eventB })]],
      ]),
      deliver: () => Effect.die(new Error("render defect")),
    });

    return Effect.gen(function* () {
      const exit = yield* notify({ now }).pipe(
        Effect.provide(harness.layer),
        Effect.exit,
      );

      expect(Exit.isFailure(exit)).toBe(true);
      expect(harness.deliveries).toHaveLength(1);
      expect(harness.markSentCalls).toHaveLength(0);
    });
  });
});
