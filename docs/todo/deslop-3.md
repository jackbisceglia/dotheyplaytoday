# Constrain database error metadata

## Type

Type-safety improvement

## Context

The database error helpers accept metadata as
`Readonly<Record<string, unknown>>`:

- `packages/core/src/lib/database/errors.ts:64`
- `packages/core/src/lib/database/errors.ts:69`
- `packages/core/src/lib/database/errors.ts:78`
- `packages/core/src/lib/database/errors.ts:83`

This gives callers no guidance about useful values and permits functions,
services, Effects, arbitrary class instances, and other values that may not
produce stable diagnostics. The error schema repeats the broad contract with
`Schema.Record(Schema.String, Schema.Unknown)`.

Metadata is currently only serialized by `DatabaseError.format`; no consumer
reads it structurally.

## Investigation

Compare at least these designs:

1. Define a recursive diagnostic value made from primitives, arrays, and
   string-keyed records.
2. Serialize metadata when constructing the error and store only a string.
3. Define operation-specific metadata contracts keyed by the operation name.

Prefer the smallest design that prevents accidental type widening without
creating a large operation registry or repetitive call-site ceremony.

Review complex current values, particularly event query options and Effect
timezone values. Record explicit primitive fields where serializing the whole
object would produce unclear output.

## Acceptance Criteria

- Database error metadata no longer uses `unknown` or `any` as its dictionary
  value contract.
- Callers cannot attach functions, Effects, or arbitrary opaque objects without
  deliberately converting them to diagnostic data.
- Existing useful fields such as entity IDs, counts, lookup names, and ranges
  remain representable.
- Complex values are converted to stable, meaningful diagnostic fields.
- Error formatting and relevant tests cover the chosen representation.
- The chosen tradeoff is documented in the implementation or architecture
  documentation if structured metadata is retained for future consumers.

## Non-Goals

- Parsing external request data through the metadata type.
- Turning diagnostic metadata into a general application data container.
- Preserving arbitrary values solely for backward compatibility; errors are not
  persisted or exposed as a documented public contract today.
