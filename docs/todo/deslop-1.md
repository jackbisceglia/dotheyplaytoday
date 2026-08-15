# Fix inherited-key logo lookups

## Type

Bug

## Context

The MLB, NBA, and NFL logo helpers use `abbr in logos` before asserting that
`abbr` is a key of the logo object. The `in` operator also matches inherited
properties, so the assertion does not reflect the runtime check.

Affected locations:

- `packages/web/src/lib/catalog/sports/mlb.ts:36`
- `packages/web/src/lib/catalog/sports/nba.ts:36`
- `packages/web/src/lib/catalog/sports/nfl.ts:38`

`SportTeamSubject.abbreviation` accepts any non-empty string. Persisted subjects
are schema-decoded and passed to these helpers when the signup page renders, so
malformed catalog data can reach the lookup.

## Impact

Inherited names do not use the league fallback:

- `toString` returns a function.
- `__proto__` returns an object.

The signup page may therefore render function source or `[object Object]`
instead of a logo. Current checked-in catalog values do not trigger the bug.

## Suggested Direction

Use an own-property lookup that preserves a sound return type. Consider a
shared helper or `Map` if that avoids repeating an assertion across leagues.

## Acceptance Criteria

- Known abbreviations return their configured logos.
- Ordinary unknown abbreviations return the league fallback.
- Inherited names such as `toString` and `__proto__` return the league fallback.
- The lookup does not rely on an unchecked key assertion.
- Focused tests cover all three behaviors.

## Non-Goals

- Changing the catalog data model or supported leagues.
- Adopting Oxlint or adding persistent lint configuration.
