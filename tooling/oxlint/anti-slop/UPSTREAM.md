# Vendored anti-slop

Source: https://github.com/dmmulroy/anti-slop
Revision: `c44ef22ca116d0ba62a3ff663a0bd13a3f3fa40b`

This directory contains the upstream `src/` tree and root MIT license, copied
with the local customization listed below. The bundled ESLint Stylistic
implementation retains its own license and provenance under `vendor/eslint-stylistic/`.

Repository policy lives in the root `oxlint.config.ts`; it is intentionally a
subset of upstream's opinionated rules. Keep `oxlint` and `@oxlint/plugins` at
the same exact version. When updating, compare against this upstream revision,
preserve local policy, and rerun lint, typecheck, tests, and build. Vendored
RuleTester suites are upstream reference material, outside the application
Vitest suite.

## Local customization

`rules/no-conditional-empty-object-spread.ts` directs callers to the repository's
`exactOptional` helper rather than imperative field assignment, and recognizes
parenthesized empty branches. Its tests cover the helper and preserve the absence
of an autofix: the helper omits only `undefined`, so arbitrary conditions need
manual review. Keep this behavior when updating upstream source.
