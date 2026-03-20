import { KeyValueStore } from "@effect/platform";
import { Effect, Option, ParseResult, Schema } from "effect";

import {
  createDatabaseRegistry,
  type RegistrySelectors,
} from "../database-new/registry.js";

const KeyPath = Schema.String;
const ErrorMessage = Schema.String;

const ioErrorPayload = {
  path: KeyPath,
  message: ErrorMessage,
};

export class DataFileNotFound extends Schema.TaggedError<DataFileNotFound>()(
  "DataFileNotFound",
  { path: KeyPath },
) {}

export class DataReadError extends Schema.TaggedError<DataReadError>()(
  "DataReadError",
  ioErrorPayload,
) {}

export class DataValidationError extends Schema.TaggedError<DataValidationError>()(
  "DataValidationError",
  {
    ...ioErrorPayload,
    issues: Schema.Array(Schema.ArrayFormatterIssue),
  },
) {}

export class DataWriteError extends Schema.TaggedError<DataWriteError>()(
  "DataWriteError",
  ioErrorPayload,
) {}

export const makeDataValidationError = (
  path: string,
  error: ParseResult.ParseError,
) =>
  DataValidationError.make({
    path,
    message: ParseResult.TreeFormatter.formatErrorSync(error),
    issues: ParseResult.ArrayFormatter.formatErrorSync(error),
  });

export class Database extends Effect.Service<Database>()("@dtpt/Database", {
  effect: Effect.gen(function* () {
    const client = yield* KeyValueStore.KeyValueStore;
    const registry = createDatabaseRegistry();

    type GetKeyFunction = (
      selectors: RegistrySelectors,
    ) => ReturnType<RegistrySelectors[keyof RegistrySelectors]>;

    const getWithSchema = Effect.fn("Database.getWithSchema")(function* <A, I>(
      getKey: GetKeyFunction,
      schema: Schema.Schema<A, I>,
    ) {
      const key = getKey(registry.selectors);
      const content = yield* client
        .get(key)
        .pipe(
          Effect.mapError((error) =>
            DataReadError.make({ path: key, message: error.message }),
          ),
        );

      if (Option.isNone(content)) {
        return yield* DataFileNotFound.make({ path: key });
      }

      const fromJson = Schema.parseJson(schema);

      return yield* Schema.decodeUnknown(fromJson)(content.value).pipe(
        Effect.mapError((error) => makeDataValidationError(key, error)),
      );
    });

    const setWithSchema = Effect.fn("Database.setWithSchema")(function* <A, I>(
      getKey: GetKeyFunction,
      schema: Schema.Schema<A, I>,
      value: A,
    ) {
      const key = getKey(registry.selectors);
      const fromJson = Schema.parseJson(schema);
      const encoded = yield* Schema.encode(fromJson)(value).pipe(
        Effect.mapError((error) => makeDataValidationError(key, error)),
      );

      return yield* client
        .set(key, encoded)
        .pipe(
          Effect.mapError((error) =>
            DataWriteError.make({ path: key, message: error.message }),
          ),
        );
    });

    return { client, getWithSchema, setWithSchema };
  }),
}) {}
