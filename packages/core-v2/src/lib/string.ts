import { Schema } from "effect";

/** A string value that may be absent and can be skipped by nullable add methods. */
export const StringPart = Schema.NullishOr(Schema.String);
export type StringPart = Schema.Schema.Type<typeof StringPart>;

const isStringPart = Schema.is(Schema.String);

const createBuilder = (parts: readonly string[]) => {
  const addParts = (...nextParts: readonly string[]) =>
    nextParts.length === 0 ? builder : createBuilder([...parts, ...nextParts]);
  const addPartsNullable = (...nextParts: readonly StringPart[]) => {
    const presentParts = nextParts.filter(isStringPart);

    return presentParts.length === 0
      ? builder
      : createBuilder([...parts, ...presentParts]);
  };
  const addPartsIf = (condition: boolean, ...nextParts: readonly string[]) =>
    condition ? addParts(...nextParts) : builder;

  const builder = {
    /** Adds one required string part. */
    add: (part: string) => addParts(part),
    /** Adds one string part when it is not null or undefined. */
    addNullable: (part: StringPart) => addPartsNullable(part),
    /** Adds one required string part when the condition is true. */
    addIf: (condition: boolean, part: string) => addPartsIf(condition, part),
    /** Adds zero or more required string parts. */
    addParts,
    /** Adds zero or more string parts, skipping null and undefined values. */
    addPartsNullable,
    /** Adds zero or more required string parts when the condition is true. */
    addPartsIf,
    /** Joins the collected parts with the provided delimiter, defaulting to a space. */
    make: (delimiter = " ") => parts.join(delimiter),
  };

  return builder;
};

/** Builds a string from ordered parts while keeping conditional and nullable additions explicit. */
export const StringParts = (parts: readonly string[] = []) =>
  createBuilder([...parts]);
