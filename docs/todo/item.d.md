# Investigate vague shape naming

## Type

Naming and API design investigation

## Context

Several names describe a value as a structural "shape" rather than by its
domain role:

- `packages/core/src/modules/subscriptions/service.ts:143` uses `shaped`.
- `packages/api/src/rate-limit/service.ts:14` imports `RateLimitConfigShape`.
- `packages/core/src/index.ts:22` exports `ApiConfigShape`.
- `packages/core/src/index.ts:24` exports `WebConfigShape`.
- `packages/core/src/index.ts:88` exports `EmailDeliveryShape`.
- `packages/core/src/index.ts:93` exports `ResendConfigShape`.

The local `shaped` variable can likely be named for the recipient rows it
contains. The exported aliases may exist to avoid collisions between same-named
type and value exports, so they should not be renamed independently without
reviewing consumers and nearby conventions.

## Investigation

- Identify why each `*Shape` alias exists and whether it is part of a consumed
  package API.
- Review how this repository distinguishes schemas, values, services, config
  results, and their TypeScript types.
- Choose domain names that remain clear at import sites.
- Determine whether direct type exports, namespace imports, or a consistent
  suffix provide the smallest coherent convention.

## Acceptance Criteria

- `shaped` is replaced with a name describing the data's role.
- Each `*Shape` alias is either renamed under a documented convention or kept
  with a concrete rationale.
- All internal consumers use the selected convention consistently.
- Public or cross-package rename impact is identified before implementation.
- Typecheck and focused tests pass after any renames.

## Non-Goals

- A repository-wide naming rewrite unrelated to these symbols.
- Renaming generated or upstream types.
- Treating naming findings as runtime defects.
