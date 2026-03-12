// AI Gen'd, minorly reviewed for code quality
import { Command, Options } from "@effect/cli";
import { NodeContext } from "@effect/platform-node";
import { Database } from "@dtpt/core/modules/database/service";
import { makeKvsLayer } from "@dtpt/core/modules/kvs/service";
import { Delivery } from "@dtpt/core/modules/subscriptions/delivery";
import type { Subscription } from "@dtpt/core/modules/subscriptions/schema";
import type { User } from "@dtpt/core/modules/users/schema";
import {
  Console,
  DateTime,
  Duration,
  Effect,
  Either,
  Layer,
  Option,
  Schema,
} from "effect";

import type { KvsOption } from "../lib/kvs.js";

const placeholders = {
  unknownUser: "(unknown user)",
  unknownTimezone: "-",
  unknownTopic: "(unknown topic)",
  noSendAtLocal: "-",
} as const;

export type InspectOptions = {
  kvs: KvsOption;
  format: "table" | "json";
  verbose: boolean;
  user?: string;
};

export type InspectRow = {
  subscriptionId: Subscription["id"];
  userId: Subscription["userId"];
  email: User["email"];
  timezone: User["timezone"]["id"];
  topicId: Subscription["topicId"];
  teamName: string;
  schedule: string;
  sendAtLocal: string;
  enabled: Subscription["enabled"];
  lastSentAt: string | null;
};

const encodeJson = Schema.encodeUnknownSync(Schema.parseJson(Schema.Unknown));

const formatJsonPretty = (raw: string) => {
  let depth = 0;
  let inString = false;
  let escaping = false;
  let result = "";

  for (let index = 0; index < raw.length; index += 1) {
    const char = raw[index];
    if (char === undefined) {
      continue;
    }

    if (inString) {
      result += char;

      if (escaping) {
        escaping = false;
        continue;
      }

      if (char === "\\") {
        escaping = true;
        continue;
      }

      if (char === '"') {
        inString = false;
      }

      continue;
    }

    if (char === '"') {
      inString = true;
      result += char;
      continue;
    }

    if (char === "{" || char === "[") {
      const closing = char === "{" ? "}" : "]";
      const next = raw[index + 1];

      if (next === closing) {
        result += char;
        continue;
      }

      depth += 1;
      result += `${char}\n${"  ".repeat(depth)}`;
      continue;
    }

    if (char === "}" || char === "]") {
      const opening = char === "}" ? "{" : "[";
      const prev = raw[index - 1];

      if (prev === opening) {
        result += char;
        continue;
      }

      depth -= 1;
      result += `\n${"  ".repeat(depth)}${char}`;
      continue;
    }

    if (char === ",") {
      result += `,\n${"  ".repeat(depth)}`;
      continue;
    }

    if (char === ":") {
      result += ": ";
      continue;
    }

    if (char === " " || char === "\n" || char === "\r" || char === "\t") {
      continue;
    }

    result += char;
  }

  return result;
};

const padMeridiemSpacing = (value: string) => {
  const match = /^(\d{1,2}:\d{2})\s(AM|PM)\s(.+)$/.exec(value);
  if (!match) return value;

  const [, time, meridiem, timezone] = match;
  if (!time || !meridiem || !timezone) return value;

  return `${time.padStart(5, " ")} ${meridiem} ${timezone}`;
};

const toScheduleDisplay = (opts: {
  subscription: Subscription;
  timezone: User["timezone"] | undefined;
  now: DateTime.Utc;
}) => {
  if (opts.subscription.schedule.type === "fixed") {
    const parts = Duration.parts(
      Duration.seconds(opts.subscription.schedule.sendAtSecondsLocal),
    );
    const fixedLocalTime = `${parts.hours.toString().padStart(2, "0")}:${parts.minutes.toString().padStart(2, "0")}`;

    if (opts.timezone === undefined) {
      return {
        schedule: `fixed(${fixedLocalTime})`,
        sendAtLocal: fixedLocalTime,
      };
    }

    const scheduled = Delivery.getScheduledSend({
      sendAtSecondsLocal: opts.subscription.schedule.sendAtSecondsLocal,
      timezone: opts.timezone,
      now: opts.now,
    });

    const sendAtLocal = padMeridiemSpacing(
      DateTime.format(scheduled, {
        locale: "en-US",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZoneName: "short",
      }),
    );

    return {
      schedule: `fixed(${fixedLocalTime})`,
      sendAtLocal,
    };
  }

  return {
    schedule: `relative(${opts.subscription.schedule.timeOffsetSeconds.toString()})`,
    sendAtLocal: placeholders.noSendAtLocal,
  };
};

const sendAtSortKey = (row: InspectRow) => {
  const fixedSchedule = /^fixed\((\d{2}:\d{2})\)$/.exec(row.schedule);
  return fixedSchedule?.[1] ?? "99:99";
};

export const buildInspectRows = (opts: {
  users: readonly User[];
  subscriptions: readonly Subscription[];
  teamByTopicId: ReadonlyMap<Subscription["topicId"], string>;
  now: DateTime.Utc;
}): readonly InspectRow[] => {
  const usersById = new Map(opts.users.map((user) => [user.id, user]));

  return opts.subscriptions.map((subscription) => {
    const user = usersById.get(subscription.userId);
    const schedule = toScheduleDisplay({
      subscription,
      timezone: user?.timezone,
      now: opts.now,
    });

    return {
      subscriptionId: subscription.id,
      userId: subscription.userId,
      email: user?.email ?? placeholders.unknownUser,
      timezone: user?.timezone.id ?? placeholders.unknownTimezone,
      topicId: subscription.topicId,
      teamName:
        opts.teamByTopicId.get(subscription.topicId) ??
        placeholders.unknownTopic,
      schedule: schedule.schedule,
      sendAtLocal: schedule.sendAtLocal,
      enabled: subscription.enabled,
      lastSentAt: subscription.lastSentAt
        ? DateTime.formatIso(subscription.lastSentAt)
        : null,
    };
  });
};

export const applyUserFilter = (
  rows: readonly InspectRow[],
  user: string | undefined,
) => {
  if (user === undefined) return rows;

  return rows.filter((row) => row.userId === user || row.email === user);
};

export const sortInspectRows = (rows: readonly InspectRow[]) =>
  [...rows].sort(
    (a, b) =>
      a.email.localeCompare(b.email) ||
      sendAtSortKey(a).localeCompare(sendAtSortKey(b)) ||
      a.teamName.localeCompare(b.teamName),
  );

type InspectOutputRow = {
  index?: number;
  email: InspectRow["email"];
  teamName: InspectRow["teamName"];
  schedule: InspectRow["schedule"];
  sendAtLocal: InspectRow["sendAtLocal"];
  lastSentAt: InspectRow["lastSentAt"];
  enabled?: InspectRow["enabled"];
  timezone?: InspectRow["timezone"];
  topicId?: InspectRow["topicId"];
  subscriptionId?: InspectRow["subscriptionId"];
  userId?: InspectRow["userId"];
};

const toOutputRows = (rows: readonly InspectRow[], verbose: boolean) =>
  rows.map((row, index): InspectOutputRow => {
    const base = {
      email: row.email,
      teamName: row.teamName,
      schedule: row.schedule,
      sendAtLocal: row.sendAtLocal,
      lastSentAt: row.lastSentAt,
    };

    if (!verbose) {
      return base;
    }

    return {
      ...base,
      index,
      enabled: row.enabled,
      timezone: row.timezone,
      topicId: row.topicId,
      subscriptionId: row.subscriptionId,
      userId: row.userId,
    };
  });

const toTableCell = (value: InspectOutputRow[keyof InspectOutputRow]) => {
  if (value === null || value === undefined) {
    return "-";
  }

  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }

  return value.toString();
};

const renderTable = (rows: readonly InspectOutputRow[]) => {
  const defaultColumns = [
    "email",
    "teamName",
    "schedule",
    "sendAtLocal",
    "lastSentAt",
  ] as const;

  const columns: readonly (keyof InspectOutputRow)[] = (() => {
    const firstRow = rows[0];

    if (!firstRow) {
      return defaultColumns;
    }

    return Object.keys(firstRow) as (keyof InspectOutputRow)[];
  })();

  const widths = columns.map((column) => {
    const headerWidth = column.length;
    const maxValueWidth = rows.reduce((maxWidth, row) => {
      const width = toTableCell(row[column]).length;
      return Math.max(maxWidth, width);
    }, 0);

    return Math.max(headerWidth, maxValueWidth);
  });

  const header = columns
    .map((column, index) => column.padEnd(widths[index] ?? column.length))
    .join(" | ");

  const separator = widths.map((width) => "-".repeat(width)).join("-+-");

  const body: string[] = [];
  let previousEmail: string | undefined;

  for (const row of rows) {
    if (previousEmail !== undefined && row.email !== previousEmail) {
      body.push(separator);
    }

    body.push(
      columns
        .map((column, index) =>
          toTableCell(row[column]).padEnd(widths[index] ?? column.length),
        )
        .join(" | "),
    );

    previousEmail = row.email;
  }

  return [header, separator, ...body].join("\n");
};

export type InspectResult = {
  userCount: number;
  subscriptionCount: number;
  rowCount: number;
  topicsMissing: number;
};

export const inspect = Effect.fn("tools.inspect")(function* (
  opts: InspectOptions,
) {
  const database = yield* Database;
  const now = yield* DateTime.now;

  const [users, subscriptions] = yield* Effect.all([
    database.loadUsers(),
    database.loadSubscriptions(),
  ]);

  const topicIds = [
    ...new Set(subscriptions.map((subscription) => subscription.topicId)),
  ];
  const topicLookup = yield* Effect.forEach(topicIds, (topicId) =>
    Effect.either(database.loadTopic(topicId)).pipe(
      Effect.map((result) => ({ topicId, result })),
    ),
  );

  const teamByTopicId = new Map<Subscription["topicId"], string>();
  let topicsMissing = 0;

  for (const topic of topicLookup) {
    if (Either.isLeft(topic.result)) {
      topicsMissing += 1;
      continue;
    }

    teamByTopicId.set(
      topic.topicId,
      topic.result.right.events[0]?.teamName ?? placeholders.unknownTopic,
    );
  }

  const rows = sortInspectRows(
    applyUserFilter(
      buildInspectRows({ users, subscriptions, teamByTopicId, now }),
      opts.user,
    ),
  );

  const outputRows = toOutputRows(rows, opts.verbose);

  if (opts.format === "json") {
    yield* Console.log(formatJsonPretty(encodeJson(outputRows)));
  }

  if (opts.format === "table") {
    yield* Console.log("");
    yield* Console.log(renderTable(outputRows));
    yield* Console.log("");
    yield* Console.log(
      `inspect: users=${users.length.toString()} subscriptions=${subscriptions.length.toString()} rows=${rows.length.toString()} topicsMissing=${topicsMissing.toString()}`,
    );
    yield* Console.log("");
  }

  return {
    userCount: users.length,
    subscriptionCount: subscriptions.length,
    rowCount: rows.length,
    topicsMissing,
  } satisfies InspectResult;
});

export const InspectCommand = Command.make(
  "inspect",
  {
    kvs: Options.choice("kvs", ["redis", "fs"] as const).pipe(
      Options.withDefault("fs"),
      Options.withDescription("Key-value backend to inspect"),
    ),
    format: Options.choice("format", ["table", "json"] as const).pipe(
      Options.withDefault("table"),
      Options.withDescription("Output format"),
    ),
    verbose: Options.boolean("verbose").pipe(
      Options.withDescription(
        "Include internal columns (index, enabled, timezone, ids)",
      ),
    ),
    user: Options.text("user").pipe(
      Options.optional,
      Options.withDescription("Filter by user email or user id"),
    ),
  },
  (opts) => {
    const user = Option.getOrUndefined(opts.user);
    const relative = "../../../core/data/kv".split("/");
    const ProgramLayer = Layer.mergeAll(Database.Default).pipe(
      Layer.provideMerge(
        makeKvsLayer(opts.kvs, import.meta.dirname, ...relative),
      ),
      Layer.provideMerge(NodeContext.layer),
    );

    return inspect({
      kvs: opts.kvs,
      format: opts.format,
      verbose: opts.verbose,
      ...(user === undefined ? {} : { user }),
    }).pipe(Effect.provide(ProgramLayer));
  },
);
