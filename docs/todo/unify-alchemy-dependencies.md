# Unify Alchemy dependency versions

## Type

Bug

## Context

Alchemy `2.0.0-beta.63` pins its provider packages to `0.29.1`, while the
PlanetScale PostgreSQL integration requires `@distilled.cloud/planetscale`
`0.30.1`. The root override consequently installs both `0.29.1` and `0.30.1`
of `@distilled.cloud/core`.

The Effect language service currently allows this known duplicate package.

## Impact

Duplicate Effect-based package versions can produce diagnostics and risk
runtime identity mismatches across Alchemy resources.

## Suggested Direction

Upgrade Alchemy, Effect, and the Cloudflare tooling as one compatible set. Do
not force individual Alchemy provider packages onto undeclared core versions.

## Acceptance Criteria

- Alchemy and all `@distilled.cloud/*` packages resolve to compatible versions.
- The PlanetScale package override is removed.
- The `allowedDuplicatedPackages` exception is removed.
- Infrastructure deployment and Solid SSR smoke tests pass.

## Non-Goals

- Changing the database provider.
- Reworking the Solid rendering architecture.
