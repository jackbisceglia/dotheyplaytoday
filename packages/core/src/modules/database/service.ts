import { FileSystem, Path } from "@effect/platform";
import { Effect, ParseResult, Schema } from "effect";

import { Subscription } from "../subscriptions/schema";
import { TopicData } from "../topics/schema";
import { User } from "../users/schema";

const FsErrorPath = Schema.String;
const FsErrorMessage = Schema.String;
const fsErrorPayload = { path: FsErrorPath, message: FsErrorMessage };
const validationErrorPayload = {
  path: FsErrorPath,
  message: FsErrorMessage,
  issues: Schema.Array(Schema.ArrayFormatterIssue),
};

class DataFileNotFound extends Schema.TaggedError<DataFileNotFound>()(
  "DataFileNotFound",
  { path: FsErrorPath },
) {}

class DataReadError extends Schema.TaggedError<DataReadError>()(
  "DataReadError",
  fsErrorPayload,
) {}

class DataValidationError extends Schema.TaggedError<DataValidationError>()(
  "DataValidationError",
  validationErrorPayload,
) {}

class DataWriteError extends Schema.TaggedError<DataWriteError>()(
  "DataWriteError",
  fsErrorPayload,
) {}

const formatParseError = (error: ParseResult.ParseError) => ({
  message: ParseResult.TreeFormatter.formatErrorSync(error),
  issues: ParseResult.ArrayFormatter.formatErrorSync(error),
});

export class Database extends Effect.Service<Database>()("@dtpt/Database", {
  effect: Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem;
    const path = yield* Path.Path;
    const dataRoot = path.join(process.cwd(), "packages", "core", "data");
    const usersPath = path.join(dataRoot, "users.json");
    const subscriptionsPath = path.join(dataRoot, "subscriptions.json");
    const topicsPath = path.join(dataRoot, "topics");

    const readJsonSchema = Effect.fn("readJsonSchema")(
      function* <A, I>(schema: Schema.Schema<A, I>, filePath: string) {
        const content = yield* fs.readFileString(filePath, "utf8");
        const fromJson = Schema.parseJson(schema);

        return yield* Schema.decodeUnknown(fromJson)(content).pipe(
          Effect.mapError((e) => {
            const parsed = formatParseError(e);
            return DataValidationError.make({
              path: filePath,
              message: parsed.message,
              issues: parsed.issues,
            });
          }),
        );
      },
      Effect.catchTags({
        SystemError: (e) => {
          const errorPath =
            typeof e.pathOrDescriptor === "string"
              ? e.pathOrDescriptor
              : String(e.pathOrDescriptor ?? "");
          return Effect.fail(
            e.reason === "NotFound"
              ? DataFileNotFound.make({ path: errorPath })
              : DataReadError.make({ path: errorPath, message: e.message }),
          );
        },
        BadArgument: (e) =>
          Effect.fail(DataReadError.make({ path: "", message: e.message })),
      }),
    );

    const writeJsonSchema = Effect.fn("Database.writeJsonSchema")(
      function* <A, I>(
        schema: Schema.Schema<A, I>,
        filePath: string,
        value: A,
      ) {
        const fromJson = Schema.parseJson(schema);

        const content = yield* Schema.encodeUnknown(fromJson)(value);

        return yield* fs.writeFileString(filePath, `${content}\n`);
      },
      (effect, _, filePath) =>
        Effect.catchTags(effect, {
          ParseError: (e) =>
            Effect.fail(
              DataValidationError.make({
                path: filePath,
                message: formatParseError(e).message,
                issues: formatParseError(e).issues,
              }),
            ),
          SystemError: (e) =>
            Effect.fail(
              DataWriteError.make({ path: filePath, message: e.message }),
            ),
          BadArgument: (e) =>
            Effect.fail(
              DataWriteError.make({ path: "unknown", message: e.message }),
            ),
        }),
    );

    const loadUsers = () => readJsonSchema(Schema.Array(User), usersPath);

    const loadSubscriptions = () =>
      readJsonSchema(Schema.Array(Subscription), subscriptionsPath);

    const loadTopic = (topicId: string) =>
      readJsonSchema(TopicData, path.join(topicsPath, `${topicId}.json`));

    const updateSubscription = (subscription: Subscription) => {
      const Subscriptions = Schema.Array(Subscription);

      const json = readJsonSchema(Subscriptions, subscriptionsPath);

      return json.pipe(
        Effect.flatMap((subscriptions) => {
          const hasExistingSubscription = subscriptions.some(
            (entry) => entry.id === subscription.id,
          );
          const nextSubscriptions = hasExistingSubscription
            ? subscriptions.map((entry) =>
                entry.id === subscription.id ? subscription : entry,
              )
            : [...subscriptions, subscription];

          return writeJsonSchema(
            Schema.Array(Subscription),
            subscriptionsPath,
            nextSubscriptions,
          );
        }),
      );
    };

    return { loadUsers, loadSubscriptions, loadTopic, updateSubscription };
  }),
}) {}
