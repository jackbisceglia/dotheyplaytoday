# Vendored anti-slop

Source: https://github.com/dmmulroy/anti-slop
Revision: `c44ef22ca116d0ba62a3ff663a0bd13a3f3fa40b`

This directory contains the upstream `src/` tree and root MIT license, copied
with the local customization listed below. The bundled ESLint Stylistic
implementation retains its own license and provenance under `vendor/eslint-stylistic/`.

Repository policy lives in the root `oxlint.config.ts`; it is intentionally a
subset of upstream's opinionated rules. Keep `oxlint` and `@oxlint/plugins` at
the same exact version. When updating, compare against this upstream revision,
preserve local policy, and rerun lint, typecheck, tests, and build. Run
`pnpm test:oxlint` when changing or updating the vendored rules. It runs all
vendored rule suites through Vitest, including the local customization,
separately from the application suite. This command is opt-in and is not part
of `pnpm test` or CI.

## Local customization

`rules/no-conditional-empty-object-spread.ts` directs callers to the repository's
`exactOptional` helper rather than imperative field assignment, and recognizes
parenthesized empty branches. Its tests cover the helper and preserve the absence
of an autofix: the helper omits only `undefined`, so arbitrary conditions need
manual review. Keep this behavior when updating upstream source.

`rules/require-readable-spacing-cli.test.ts` wraps the upstream CLI checks in a
Vitest test. The shared setup outside this directory connects RuleTester to
Vitest so each rule example is collected as a test.
