import { KeyValueStore } from "@effect/platform";
import type * as PlatformError from "@effect/platform/Error";
import { Effect, Option, ParseResult, Schema } from "effect";

const KvsErrorPayload = Schema.Struct({
  path: Schema.String,
  message: Schema.String,
});

const KvsPathErrorPayload = KvsErrorPayload.pick("path").fields;

const KvsValidationErrorPayload = {
  ...KvsErrorPayload.fields,
  issues: Schema.Array(Schema.ArrayFormatterIssue),
};

class DataFileNotFound extends Schema.TaggedError<DataFileNotFound>()(
  "DataFileNotFound",
  KvsPathErrorPayload,
) {}

class DataReadError extends Schema.TaggedError<DataReadError>()(
  "DataReadError",
  KvsErrorPayload.fields,
) {}

class DataValidationError extends Schema.TaggedError<DataValidationError>()(
  "DataValidationError",
  KvsValidationErrorPayload,
) {}

class DataWriteError extends Schema.TaggedError<DataWriteError>()(
  "DataWriteError",
  KvsErrorPayload.fields,
) {}

const formatParseError = (error: ParseResult.ParseError) => ({
  message: ParseResult.TreeFormatter.formatErrorSync(error),
  issues: ParseResult.ArrayFormatter.formatErrorSync(error),
});

const makeValidationError = (path: string, error: ParseResult.ParseError) => {
  const formatted = formatParseError(error);

  return DataValidationError.make({
    path,
    message: formatted.message,
    issues: formatted.issues,
  });
};

type Key<Name extends string, Params = never> = [Params] extends [never]
  ? { key: Name }
  : { key: Name } & Params;

export type DatabaseNewQuery =
  | Key<"users">
  | Key<"subscriptions">
  | Key<"topic", { id: string }>;

type GetWithSchemaOptions<A, I> = {
  query: DatabaseNewQuery;
  schema: Schema.Schema<A, I>;
};

type SetWithSchemaOptions<A, I> = {
  query: DatabaseNewQuery;
  schema: Schema.Schema<A, I>;
  value: A;
};

type WithDecodeOptions<A, I> = {
  key: string;
  schema: Schema.Schema<A, I>;
  run: () => Effect.Effect<Option.Option<string>, PlatformError.PlatformError>;
};

const resolveQuery = (query: DatabaseNewQuery) => {
  switch (query.key) {
    case "users":
      return "users";
    case "subscriptions":
      return "subscriptions";
    case "topic":
      return `topics/${query.id}`;
  }
};

export class DatabaseNew extends Effect.Service<DatabaseNew>()(
  "@dtpt/DatabaseNew",
  {
    effect: Effect.gen(function* () {
      const client = yield* KeyValueStore.KeyValueStore;

      const queries = {
        users: { key: "users" } as const,
        subscriptions: { key: "subscriptions" } as const,
        topic: (id: string) => ({ key: "topic", id }) as const,
      };

      const withDecode = Effect.fn("DatabaseNew.withDecode")(function* <A, I>(
        opts: WithDecodeOptions<A, I>,
      ) {
        const content = yield* opts
          .run()
          .pipe(
            Effect.mapError((error) =>
              DataReadError.make({ path: opts.key, message: error.message }),
            ),
          );

        if (Option.isNone(content)) {
          return yield* DataFileNotFound.make({ path: opts.key });
        }

        const fromJson = Schema.parseJson(opts.schema);

        return yield* Schema.decodeUnknown(fromJson)(content.value).pipe(
          Effect.mapError((error) => makeValidationError(opts.key, error)),
        );
      });

      const getWithSchema = Effect.fn("DatabaseNew.getWithSchema")(function* <
        A,
        I,
      >(opts: GetWithSchemaOptions<A, I>) {
        const key = resolveQuery(opts.query);

        return yield* withDecode({
          key,
          schema: opts.schema,
          run: () => client.get(key),
        });
      });

      const setWithSchema = Effect.fn("DatabaseNew.setWithSchema")(function* <
        A,
        I,
      >(opts: SetWithSchemaOptions<A, I>) {
        const key = resolveQuery(opts.query);
        const fromJson = Schema.parseJson(opts.schema);
        const encoded = yield* Schema.encode(fromJson)(opts.value).pipe(
          Effect.mapError((error) => makeValidationError(key, error)),
        );

        yield* client
          .set(key, encoded)
          .pipe(
            Effect.mapError((error) =>
              DataWriteError.make({ path: key, message: error.message }),
            ),
          );
      });

      return {
        client,
        queries,
        getWithSchema,
        setWithSchema,
      };
    }),
  },
) {}
