import { expect } from "@effect/vitest";
import { Either, Schema } from "effect";
import type { Schema as SchemaType } from "effect/Schema";

export const expectSuccess = <A, I>(
  schema: SchemaType<A, I>,
  value: unknown,
) => {
  const result = Schema.decodeUnknownEither(schema)(value);
  expect(Either.isRight(result)).toBe(true);
};

export const expectFailure = <A, I>(
  schema: SchemaType<A, I>,
  value: unknown,
) => {
  const result = Schema.decodeUnknownEither(schema)(value);
  expect(Either.isLeft(result)).toBe(true);
};
