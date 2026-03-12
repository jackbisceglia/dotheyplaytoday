import { describe, expect, it } from "@effect/vitest";
import { Database } from "@dtpt/core/modules/database/service";
import {
  type NonEmptyEvents,
  SportsEvent,
} from "@dtpt/core/modules/events/schema";
import type { NotifierError } from "@dtpt/core/modules/notifier/errors";
import { Notifier } from "@dtpt/core/modules/notifier";
import {
  NotifierRequestError,
  NotifierResponseError,
} from "@dtpt/core/modules/notifier/errors";
import { Subscription } from "@dtpt/core/modules/subscriptions/schema";
import { Topic } from "@dtpt/core/modules/topics/schema";
import { User } from "@dtpt/core/modules/users/schema";
import { DateTime, Effect, Either, Layer, Schema } from "effect";

import { notify as runNotifyJob } from "./index.js";

const decode = Schema.decodeUnknownSync;

class DataReadError extends Schema.TaggedError<DataReadError>()(
  "DataReadError",
  {
    path: Schema.String,
    message: Schema.String,
  },
) {}

const decodeUtc = (value: string) => decode(Schema.DateTimeUtc)(value);
const toIso = DateTime.formatIso;

const sampleIds = {
  userA: "00000000-0000-0000-0000-000000000301",
  userB: "00000000-0000-0000-0000-000000000302",
  topicA: "00000000-0000-0000-0000-000000000303",
  topicB: "00000000-0000-0000-0000-000000000304",
  subscriptionA: "00000000-0000-0000-0000-000000000305",
  subscriptionB: "00000000-0000-0000-0000-000000000306",
  eventA: "00000000-0000-0000-0000-000000000307",
  eventB: "00000000-0000-0000-0000-000000000308",
};

const now = decodeUtc("2026-02-10T14:00:00Z");

const makeUser = (
  opts: {
    id?: string;
    email?: string;
    timezone?: string;
  } = {},
) =>
  decode(User)({
    id: opts.id ?? sampleIds.userA,
    email: opts.email ?? "fan@example.com",
    timezone: opts.timezone ?? "America/New_York",
  });

const makeFixedSubscription = (
  opts: {
    id?: string;
    userId?: string;
    topicId?: string;
    sendAtSecondsLocal?: number;
    enabled?: boolean;
    lastSentAt?: string | null;
  } = {},
) =>
  decode(Subscription)({
    id: opts.id ?? sampleIds.subscriptionA,
    userId: opts.userId ?? sampleIds.userA,
    topicId: opts.topicId ?? sampleIds.topicA,
    schedule: {
      type: "fixed",
      sendAtSecondsLocal: opts.sendAtSecondsLocal ?? 9 * 3600,
    },
    enabled: opts.enabled ?? true,
    lastSentAt: opts.lastSentAt ?? null,
  });

const makeRelativeSubscription = (
  opts: {
    id?: string;
    userId?: string;
    topicId?: string;
    enabled?: boolean;
    lastSentAt?: string | null;
  } = {},
) =>
  decode(Subscription)({
    id: opts.id ?? sampleIds.subscriptionA,
    userId: opts.userId ?? sampleIds.userA,
    topicId: opts.topicId ?? sampleIds.topicA,
    schedule: {
      type: "relative",
      timeOffsetSeconds: -1800,
    },
    enabled: opts.enabled ?? true,
    lastSentAt: opts.lastSentAt ?? null,
  });

const makeEvent = (
  opts: {
    id?: string;
    startUtc?: string;
    site?: "home" | "away";
    teamName?: string;
    opponent?: string;
  } = {},
) =>
  decode(SportsEvent)({
    id: opts.id ?? sampleIds.eventA,
    _tag: "sports",
    startUtc: opts.startUtc ?? "2026-02-10T19:30:00Z",
    site: opts.site ?? "home",
    teamName: opts.teamName ?? "Celtics",
    opponent: opts.opponent ?? "Raptors",
  });

type SendOptions = [user: User, events: NonEmptyEvents];
type SendResult = Effect.Effect<void, NotifierError>;
type LoadTopicResult = Effect.Effect<Topic, DataReadError>;

type HarnessOptions = {
  users: readonly User[];
  subscriptions: readonly Subscription[];
  loadTopic: (topicId: Subscription["topicId"]) => LoadTopicResult;
  send?: (...options: SendOptions) => SendResult;
};

const makeTopic = (
  topicId: Subscription["topicId"],
  events: readonly SportsEvent[] = [],
) =>
  Topic.make({
    id: topicId,
    events,
  });

const makeHarness = (opts: HarnessOptions) => {
  const checks: {
    topicId: Subscription["topicId"];
  }[] = [];
  const updates: Subscription[] = [];
  const sends: { email: string; count: number }[] = [];

  const DatabaseLayerTest = Layer.succeed(
    Database,
    Database.make({
      loadUsers: () => Effect.succeed([...opts.users]),
      loadSubscriptions: () => Effect.succeed([...opts.subscriptions]),
      loadTopic: (topicId) =>
        Effect.sync(() => {
          checks.push({ topicId: topicId as Subscription["topicId"] });
        }).pipe(
          Effect.zipRight(opts.loadTopic(topicId as Subscription["topicId"])),
        ),
      updateSubscription: (subscription) =>
        Effect.sync(() => void updates.push(subscription)),
    }),
  );

  const NotifierLayerTest = Layer.succeed(
    Notifier,
    Notifier.of({
      send: (user, events) =>
        Effect.sync(() => {
          sends.push({ email: user.email, count: events.length });
        }).pipe(
          Effect.zipRight(opts.send ? opts.send(user, events) : Effect.void),
        ),
    }),
  );

  const NotifyJobLayerTest = Layer.mergeAll(
    DatabaseLayerTest,
    NotifierLayerTest,
  );

  return { checks, updates, sends, layer: NotifyJobLayerTest };
};

describe("notify orchestration", () => {
  it.effect(
    "should send due notifications and update lastSentAt on success",
    () => {
      const user = makeUser();
      const subscription = makeFixedSubscription();
      const event = makeEvent();

      const harness = makeHarness({
        users: [user],
        subscriptions: [subscription],
        loadTopic: (topicId) => Effect.succeed(makeTopic(topicId, [event])),
      });

      return Effect.gen(function* () {
        yield* runNotifyJob({ dryRun: false, now }).pipe(
          Effect.provide(harness.layer),
        );

        expect(harness.sends).toHaveLength(1);
        expect(harness.checks).toHaveLength(1);
        expect(harness.updates).toHaveLength(1);

        const [updated] = harness.updates;
        expect(updated?.id).toBe(subscription.id);
        expect(updated?.lastSentAt).not.toBeNull();
        if (updated?.lastSentAt) {
          expect(toIso(updated.lastSentAt)).toBe(toIso(now));
        }
      });
    },
  );

  it.effect("should sort due events before invoking the notifier", () => {
    const user = makeUser();
    const subscription = makeFixedSubscription();
    const earlyEvent = makeEvent({
      id: sampleIds.eventA,
      startUtc: "2026-02-10T19:30:00Z",
      opponent: "Raptors",
    });
    const lateEvent = makeEvent({
      id: sampleIds.eventB,
      startUtc: "2026-02-10T22:30:00Z",
      opponent: "Knicks",
    });

    const harness = makeHarness({
      users: [user],
      subscriptions: [subscription],
      loadTopic: (topicId) =>
        Effect.succeed(makeTopic(topicId, [lateEvent, earlyEvent])),
      send: (_user, events) =>
        Effect.sync(() => {
          expect(events[0].id).toBe(earlyEvent.id);
          expect(events[1]?.id).toBe(lateEvent.id);
        }),
    });

    return Effect.gen(function* () {
      yield* runNotifyJob({ dryRun: false, now }).pipe(
        Effect.provide(harness.layer),
      );

      expect(harness.sends).toHaveLength(1);
      expect(harness.updates).toHaveLength(1);
    });
  });

  it.effect("should only process subscriptions for the dev user", () => {
    const userA = makeUser({
      id: sampleIds.userA,
      email: "target@example.com",
    });
    const userB = makeUser({
      id: sampleIds.userB,
      email: "other@example.com",
    });
    const subscriptionA = makeFixedSubscription({
      id: sampleIds.subscriptionA,
      userId: sampleIds.userA,
      topicId: sampleIds.topicA,
    });
    const subscriptionB = makeFixedSubscription({
      id: sampleIds.subscriptionB,
      userId: sampleIds.userB,
      topicId: sampleIds.topicB,
    });
    const event = makeEvent();

    const harness = makeHarness({
      users: [userA, userB],
      subscriptions: [subscriptionA, subscriptionB],
      loadTopic: (topicId) => Effect.succeed(makeTopic(topicId, [event])),
    });

    return Effect.gen(function* () {
      yield* runNotifyJob({
        dryRun: false,
        now,
        devUserEmail: userA.email,
      }).pipe(Effect.provide(harness.layer));

      expect(harness.checks).toHaveLength(1);
      expect(harness.sends).toHaveLength(1);
      expect(harness.updates).toHaveLength(1);
      expect(harness.updates[0]?.id).toBe(subscriptionA.id);
    });
  });

  it.effect("should skip non-due subscriptions", () => {
    const user = makeUser();
    const subscription = makeFixedSubscription({
      sendAtSecondsLocal: 10 * 3600,
    });

    const harness = makeHarness({
      users: [user],
      subscriptions: [subscription],
      loadTopic: (topicId) => Effect.succeed(makeTopic(topicId)),
    });

    return Effect.gen(function* () {
      yield* runNotifyJob({ dryRun: false, now }).pipe(
        Effect.provide(harness.layer),
      );

      expect(harness.checks).toHaveLength(0);
      expect(harness.sends).toHaveLength(0);
      expect(harness.updates).toHaveLength(0);
    });
  });

  it.effect(
    "should allow non-due fixed subscriptions when ignoreSubscriptionTiming is enabled",
    () => {
      const user = makeUser();
      const subscription = makeFixedSubscription({
        sendAtSecondsLocal: 10 * 3600,
      });
      const event = makeEvent();

      const harness = makeHarness({
        users: [user],
        subscriptions: [subscription],
        loadTopic: (topicId) => Effect.succeed(makeTopic(topicId, [event])),
      });

      return Effect.gen(function* () {
        yield* runNotifyJob({
          dryRun: false,
          now,
          ignoreSubscriptionTiming: true,
        }).pipe(Effect.provide(harness.layer));

        expect(harness.checks).toHaveLength(1);
        expect(harness.sends).toHaveLength(1);
        expect(harness.updates).toHaveLength(1);
      });
    },
  );

  it.effect("should skip disabled subscriptions before due checks", () => {
    const user = makeUser();
    const subscription = makeFixedSubscription({ enabled: false });

    const harness = makeHarness({
      users: [user],
      subscriptions: [subscription],
      loadTopic: (topicId) => Effect.succeed(makeTopic(topicId)),
    });

    return Effect.gen(function* () {
      yield* runNotifyJob({ dryRun: false, now }).pipe(
        Effect.provide(harness.layer),
      );

      expect(harness.checks).toHaveLength(0);
      expect(harness.sends).toHaveLength(0);
      expect(harness.updates).toHaveLength(0);
    });
  });

  it.effect(
    "should skip subscriptions already sent for the same local date",
    () => {
      const user = makeUser();
      const subscription = makeFixedSubscription({
        lastSentAt: "2026-02-10T12:00:00Z",
      });

      const harness = makeHarness({
        users: [user],
        subscriptions: [subscription],
        loadTopic: (topicId) => Effect.succeed(makeTopic(topicId)),
      });

      return Effect.gen(function* () {
        yield* runNotifyJob({ dryRun: false, now }).pipe(
          Effect.provide(harness.layer),
        );

        expect(harness.checks).toHaveLength(0);
        expect(harness.sends).toHaveLength(0);
        expect(harness.updates).toHaveLength(0);
      });
    },
  );

  it.effect("should ignore already-sent guard when configured", () => {
    const user = makeUser();
    const subscription = makeFixedSubscription({
      lastSentAt: "2026-02-10T12:00:00Z",
    });
    const event = makeEvent();

    const harness = makeHarness({
      users: [user],
      subscriptions: [subscription],
      loadTopic: (topicId) => Effect.succeed(makeTopic(topicId, [event])),
    });

    return Effect.gen(function* () {
      yield* runNotifyJob({
        dryRun: false,
        now,
        ignoreAlreadySent: true,
      }).pipe(Effect.provide(harness.layer));

      expect(harness.checks).toHaveLength(1);
      expect(harness.sends).toHaveLength(1);
      expect(harness.updates).toHaveLength(1);
    });
  });

  it.effect("should skip relative schedules with no send attempt", () => {
    const user = makeUser();
    const subscription = makeRelativeSubscription();

    const harness = makeHarness({
      users: [user],
      subscriptions: [subscription],
      loadTopic: (topicId) => Effect.succeed(makeTopic(topicId)),
    });

    return Effect.gen(function* () {
      yield* runNotifyJob({ dryRun: false, now }).pipe(
        Effect.provide(harness.layer),
      );

      expect(harness.checks).toHaveLength(0);
      expect(harness.sends).toHaveLength(0);
      expect(harness.updates).toHaveLength(0);
    });
  });

  it.effect("should skip due subscriptions when no events are found", () => {
    const user = makeUser();
    const subscription = makeFixedSubscription();

    const harness = makeHarness({
      users: [user],
      subscriptions: [subscription],
      loadTopic: (topicId) => Effect.succeed(makeTopic(topicId)),
    });

    return Effect.gen(function* () {
      yield* runNotifyJob({ dryRun: false, now }).pipe(
        Effect.provide(harness.layer),
      );

      expect(harness.checks).toHaveLength(1);
      expect(harness.sends).toHaveLength(0);
      expect(harness.updates).toHaveLength(0);
    });
  });

  it.effect("should avoid sends and updates in dry-run mode", () => {
    const user = makeUser();
    const subscription = makeFixedSubscription();
    const event = makeEvent();

    const harness = makeHarness({
      users: [user],
      subscriptions: [subscription],
      loadTopic: (topicId) => Effect.succeed(makeTopic(topicId, [event])),
    });

    return Effect.gen(function* () {
      yield* runNotifyJob({ dryRun: true, now }).pipe(
        Effect.provide(harness.layer),
      );

      expect(harness.checks).toHaveLength(1);
      expect(harness.sends).toHaveLength(0);
      expect(harness.updates).toHaveLength(0);
    });
  });

  it.effect(
    "should continue processing after notifier response failures",
    () => {
      const user = makeUser();
      const first = makeFixedSubscription({ id: sampleIds.subscriptionA });
      const second = makeFixedSubscription({
        id: sampleIds.subscriptionB,
        topicId: sampleIds.topicB,
      });
      const eventA = makeEvent({ id: sampleIds.eventA });
      const eventB = makeEvent({
        id: sampleIds.eventB,
        opponent: "Knicks",
        startUtc: "2026-02-10T22:30:00Z",
      });

      const harness = makeHarness({
        users: [user],
        subscriptions: [first, second],
        loadTopic: (topicId) =>
          Effect.succeed(
            makeTopic(topicId, topicId === first.topicId ? [eventA] : [eventB]),
          ),
        send: (_user, events) => {
          if (events[0].id === eventA.id) {
            return Effect.fail(
              NotifierResponseError.make({
                channel: "email",
                message: "temporary provider failure",
                code: "application_error",
                statusCode: 500,
              }),
            );
          }

          return Effect.void;
        },
      });

      return Effect.gen(function* () {
        yield* runNotifyJob({ dryRun: false, now }).pipe(
          Effect.provide(harness.layer),
        );

        expect(harness.sends).toHaveLength(2);
        expect(harness.checks).toHaveLength(2);
        expect(harness.updates).toHaveLength(1);
        const [updated] = harness.updates;
        expect(updated?.id).toBe(second.id);
      });
    },
  );

  it.effect(
    "should continue processing after notifier request failures",
    () => {
      const user = makeUser();
      const first = makeFixedSubscription({ id: sampleIds.subscriptionA });
      const second = makeFixedSubscription({
        id: sampleIds.subscriptionB,
        topicId: sampleIds.topicB,
      });
      const eventA = makeEvent({ id: sampleIds.eventA });
      const eventB = makeEvent({
        id: sampleIds.eventB,
        opponent: "Knicks",
        startUtc: "2026-02-10T22:30:00Z",
      });

      const harness = makeHarness({
        users: [user],
        subscriptions: [first, second],
        loadTopic: (topicId) =>
          Effect.succeed(
            makeTopic(topicId, topicId === first.topicId ? [eventA] : [eventB]),
          ),
        send: (_user, events) => {
          if (events[0].id === eventA.id) {
            return Effect.fail(
              NotifierRequestError.make({
                channel: "email",
                message: "network unavailable",
                cause: new Error("network unavailable"),
              }),
            );
          }

          return Effect.void;
        },
      });

      return Effect.gen(function* () {
        yield* runNotifyJob({ dryRun: false, now }).pipe(
          Effect.provide(harness.layer),
        );

        expect(harness.sends).toHaveLength(2);
        expect(harness.checks).toHaveLength(2);
        expect(harness.updates).toHaveLength(1);
        const [updated] = harness.updates;
        expect(updated?.id).toBe(second.id);
      });
    },
  );

  it.effect(
    "should continue when a subscription references a missing user",
    () => {
      const subscription = makeFixedSubscription();

      const harness = makeHarness({
        users: [],
        subscriptions: [subscription],
        loadTopic: (topicId) => Effect.succeed(makeTopic(topicId)),
      });

      return Effect.gen(function* () {
        const result = yield* Effect.either(
          runNotifyJob({ dryRun: false, now }).pipe(
            Effect.provide(harness.layer),
          ),
        );

        Either.match(result, {
          onLeft: (error) =>
            expect.fail(`Expected notify to continue, got ${error._tag}`),
          onRight: () => undefined,
        });
        expect(harness.checks).toHaveLength(0);
        expect(harness.sends).toHaveLength(0);
        expect(harness.updates).toHaveLength(0);
      });
    },
  );

  it.effect("should abort when checking a subscription fails", () => {
    const user = makeUser();
    const first = makeFixedSubscription({ id: sampleIds.subscriptionA });
    const second = makeFixedSubscription({
      id: sampleIds.subscriptionB,
      topicId: sampleIds.topicB,
    });

    const loadTopicError = DataReadError.make({
      path: "topic",
      message: "topic missing",
    });

    const harness = makeHarness({
      users: [user],
      subscriptions: [first, second],
      loadTopic: (topicId) => {
        if (topicId === first.topicId) {
          return Effect.fail(loadTopicError);
        }

        return Effect.succeed(makeTopic(topicId));
      },
    });

    return Effect.gen(function* () {
      const result = yield* Effect.either(
        runNotifyJob({ dryRun: false, now }).pipe(
          Effect.provide(harness.layer),
        ),
      );

      Either.match(result, {
        onLeft: (error) => {
          expect(error._tag).toBe("DataReadError");
        },
        onRight: () => expect.fail("Expected notify to abort on check failure"),
      });
      expect(harness.checks).toHaveLength(1);
      expect(harness.sends).toHaveLength(0);
      expect(harness.updates).toHaveLength(0);
    });
  });
});
