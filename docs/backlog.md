# Engineering backlog

## Unify Alchemy dependency versions

Type: Bug

Alchemy `2.0.0-beta.63` pins its provider packages to `0.29.1`, while the
PlanetScale PostgreSQL integration requires `@distilled.cloud/planetscale`
`0.30.1`. The root override therefore installs both `0.29.1` and `0.30.1` of
`@distilled.cloud/core`, which can produce duplicate-package diagnostics and
risks runtime identity mismatches across Alchemy resources.

Upgrade Alchemy, Effect, and the Cloudflare tooling as one compatible set. Then
remove the PlanetScale override and the `allowedDuplicatedPackages` exception,
and verify the infrastructure deployment and Solid SSR smoke tests.
