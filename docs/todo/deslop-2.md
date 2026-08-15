# Document necessary type assertions

## Type

Maintenance

## Context

Two production assertions encode invariants that TypeScript cannot express but
do not explain those invariants locally:

- `packages/core/src/lib/utils.ts:10`
- `packages/core/src/lib/effect/index.ts:61`

`JSON.stringify` is declared by TypeScript as returning `string`, although it
returns `undefined` for values such as `undefined`, functions, and symbols. The
serializer widens that inaccurate library type to match runtime behavior.

The tagged-union helper defaults a generic discriminator key to `_tag`. Its
public overloads only permit the discriminator argument to be omitted for the
conventional `_tag` case.

## Suggested Direction

Add concise `SAFETY:` comments immediately before the assertions. Each comment
should state the checked invariant rather than restating the syntax.

Before adding a comment, confirm that removing the assertion or expressing the
invariant without one would not be simpler.

## Acceptance Criteria

- Each remaining non-const assertion has an adjacent `SAFETY:` comment.
- The `JSON.stringify` comment explains the mismatch between TypeScript's
  declaration and runtime `undefined` results.
- The tagged-union comment explains how the public overloads constrain the
  omitted discriminator case.
- Existing serializer and tagged-union behavior remains unchanged.

## Non-Goals

- Requiring safety comments for `as const`.
- Adding comments to assertions that should instead be removed.
- Adopting the anti-slop plugin as a permanent lint dependency.
