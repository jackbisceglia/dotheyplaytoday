# tsrs evaluation — 2026-10-20

Historical result. The [October 30 Effect-enabled retest](./tsrs-effect-evaluation.md)
supersedes this recommendation using the newly supported integration.

Recommendation: keep TypeScript 7.0.2 with `@effect/tsgo` 0.51.1. The released
Rust compiler can check this source and build it, but it does not preserve the
repository's Effect diagnostics. A direct replacement therefore fails the
semantic acceptance gate. No migration PR is proposed. Application source,
package manifests, lockfile and CI are unchanged after the experiment.

## Sources and scope

Read the actual [Cloudflare announcement](https://blog.cloudflare.com/typescript-rust-port/),
then the linked project's README, compatibility, defaults, usage, emit and
benchmark docs. Upstream was inspected at
[`280b426b89cd4ecd6153cf48228826bd60a99c61`](https://github.com/oxc-project/tsrs/tree/280b426b89cd4ecd6153cf48228826bd60a99c61).
The article describes an experimental Rust port of TypeScript, with performance
comparisons against native TypeScript 7, not the old JavaScript compiler. Its
future integration plans are not evidence that this project's plugins work.

[Compatibility](https://github.com/oxc-project/tsrs/blob/280b426b89cd4ecd6153cf48228826bd60a99c61/docs/COMPATIBILITY.md)
and [emit docs](https://github.com/oxc-project/tsrs/blob/280b426b89cd4ecd6153cf48228826bd60a99c61/docs/EMIT.md)
confirm checking, JavaScript/declaration/maps emit, incremental compilation,
project references and Linux/macOS watch support. This is more than a
transpiler. It does not replace Vite, Solid's JSX/SSR transform, or deployment.
`--init` and `--showConfig` are unsupported; locale is ignored; tracing is
unsupported. Released 0.18.0 lacks Windows and Intel macOS binaries. Windows
watch and LSP content mappers remain gaps. These are upstream statements, not
features all retested here.

[Defaults](https://github.com/oxc-project/tsrs/blob/280b426b89cd4ecd6153cf48228826bd60a99c61/docs/DEFAULTS.md)
document different checker assignment, lazy members and thread selection,
including diagnostic differences near instantiation limits. The release targets
TypeScript 7.1 development commit `b85298b6a81f`, not this repo's 7.0.2.
`--checkerAssignment go --noLazyMembers` can improve comparison with its pinned
upstream; it cannot supply Effect diagnostics or make library versions equal.

## Current pipeline

Baseline is freshly fetched `origin/main` and checkout HEAD
`65a000247066c87a59ee5e325701bc70a9cefc07`. Working tree was clean initially.
Only this isolated worktree's outputs were used.

- Install: `pnpm install --frozen-lockfile`; prepare patches the native TypeScript
  binary with `effect-tsgo patch --typescript`.
- Typecheck: `pnpm typecheck` recursively invokes `tsc --noEmit` in five packages,
  including tests. The root infrastructure tsconfig is not separately invoked
  by that command; the experiment preserves this scope.
- Build: `pnpm build` recursively runs checked JS/source-map emit for core, API,
  jobs and data, and `vite build` for web. Build configs exclude tests. Package
  runtime exports point to `dist`, while type exports point to `src`.
- Declaration emit: none configured or required. Resolved base config does not
  enable declaration/composite/incremental. There is no declaration speed claim.
- Solid: `jsx: preserve`, `jsxImportSource: @solidjs/web`, and Vite's Solid plugin
  with `start: true, ssr: true`. Vite builds client and server assets with the
  Alchemy Cloudflare runtime plugin. It remains unchanged in both builds.
- Lint: Oxlint 1.87.0 with type-aware `oxlint-tsgolint` 7.0.2003 and local rules.
  This separate checker is not replaced by tsrs and is not an Effect check
  substitute in the current configuration.
- CI: `.github/workflows/deploy-production.yml` installs, builds, lints,
  typechecks, tests, then deploys on main. `pnpm test` builds core again. The
  local full-build measurement is `pnpm build`, not the whole CI job or deploy.

[Effect's documentation](https://github.com/Effect-TS/tsgo/tree/main)
(the installed 0.51.1 README was also inspected) explains that Effect diagnostics
are integrated into its patched native compiler and affect its exit status.
Its supported TypeScript versions are 7.0.2 and 7.1.0-dev.20261006.1. Retaining a
plugin name in tsconfig does not load those diagnostics into a different binary.

## Compatibility probes

Temporarily added `packages/core/src/tsrs-compatibility-probe.ts`, ran each
compiler against the existing core tsconfig with `--noEmit --pretty false`,
and removed it in a `finally` block. Full commands, source and exits are in
[probes.json](./tsrs-benchmarks/probes.json); logs accompany it.

```ts
import { Effect } from "effect";
Effect.succeed(1);
```

The baseline fails (exit 1) with TS377001, `effect(floatingEffect)`. tsrs succeeds
(exit 0) without diagnostics. The baseline's ordinary Effect suggestions also
vanish. This demonstrates skipped checks even though unchanged-source checks
succeed in both compilers.

A separate ordinary type-error probe, `export const mismatch: string = 123;`,
is rejected by both with TS2322 at the same location/message. Baseline exits 1;
tsrs exits 2. Both nonzero results fail a CI step, but tools interpreting exact
exit values must account for the difference. One probe does not prove general
TypeScript diagnostic equivalence, especially across 7.0/7.1.

## Reproduction and measurements

Raw evidence is in [tsrs-benchmarks](./tsrs-benchmarks/), including
[run.py](./tsrs-benchmarks/run.py), [runs.json](./tsrs-benchmarks/runs.json),
[summary.json](./tsrs-benchmarks/summary.json), individual stdout/stderr logs,
[environment.json](./tsrs-benchmarks/environment.json), and output SHA-256s.

Setup, excluded from timing:

```sh
pnpm install --frozen-lockfile
npm install --prefix /tmp/dtpt-tsrs-research/candidate --save-exact tsrs@0.18.0-ts7.1.0-dev.20260929
python3 docs/investigations/tsrs-benchmarks/run.py /tmp/dtpt-tsrs-research/candidate/node_modules/.bin/tsrs
```

The script temporarily replaces only `tsc` command names in package scripts,
using the absolute candidate launcher, and restores manifest bytes on exit.
This keeps pnpm's dependency scheduling and Vite identical. Neither install
nor downloads, dependency setup, source cloning, cleanup or hash comparison
is inside the timed subprocess. Each run is a fresh process; no profiling or
`--extendedDiagnostics` overhead is added. All exit codes are recorded.

Machine: AMD Ryzen 7 7800X3D, 8 cores/16 logical CPUs, approximately 15 GiB RAM,
WSL2 Linux 6.6.87.2, x86_64, ext4 workspace. Node 24.18.0, pnpm 10.11.0,
Vite 8.2.1; baseline reports `7.0.2+effect-tsgo.0.51.1`; candidate reports
`7.1.0-dev.20260930.4 (tsrs 0.18.0-ts7.1.0-dev.20260929)`.
Default compiler threading is retained (Go normally four checkers; Rust adapts
to machine/program size). These are workflow timings, not controlled
same-thread compiler comparisons. Other desktop activity was not controlled;
baseline and candidate batches are sequential rather than randomized.

Typecheck gets one warmup and five measured fresh-process runs. No compiler
incremental cache exists in the current configuration, so repeated typecheck
is OS/filesystem-warm full checking. Clean builds remove all five package
`dist` directories and root/web `node_modules/.vite` before each of three
runs; warm builds retain outputs for five runs. OS page caches, dependency
files and pnpm's store remain warm throughout. “Clean” means artifact-clean,
not a cold machine. No global caches or other worktrees are cleared.
Incremental/watch performance is not claimed: enabling it would be an extra
integration change, and the direct swap already fails the semantic gate.

Observed wall times (seconds; median and min–max):

- Baseline typecheck, five runs: **5.374**, 5.281–5.499.
- Rust-only typecheck, five runs: **1.542**, 1.533–1.550.
- Baseline full clean build, three runs: **3.991**, 3.971–4.115.
- Rust-only full clean build, three runs: **2.032**, 2.007–2.060.
- Baseline full warm build, five runs: **3.988**, 3.921–4.122.
- Rust-only full warm build, five runs: **2.025**, 2.009–2.044.

All timed runs exited zero on unchanged source. **The Rust-only results omit
Effect validation and are not equivalent-work speedups.** There is no accepted
replacement benchmark or claimed percentage improvement. These exploratory
numbers measure the candidate's cost, not a safe reduction in CI time.
No separate transpile-only timing was taken: package build commands perform
checking and emit together. Vite is included in full-build timings but its
reported internal phase times are not treated as a standalone benchmark.

[Output comparison](./tsrs-benchmarks/output-comparison.json) found all **419
files byte-identical** after the final clean build: 150 JS, 140 maps, 1 JSON,
2 CSS, 125 PNG and 1 SVG. This includes client and SSR output. No `.d.ts` files
are emitted. Matching emitted artifacts does not prove matching diagnostics,
general compiler correctness, runtime coverage, or declaration parity on other
projects.

## Adoption costs and next steps

Do not replace the five typecheck commands or four compiler build commands
with this release. Preserve the Effect prepare hook and editor setup. Revisit
when tsrs has a supported Effect diagnostic integration and the negative probe
fails as expected, plus a compatible TypeScript/library version baseline.

A hybrid could retain Effect's compiler or run separate Effect diagnostics,
but would retain or duplicate compiler work and require verifying severity,
exit-status and file-scope parity. It was not promoted as a candidate or
benchmarked as an equivalent solution. Replacing only emit while retaining all
checks is a separate experiment, not established by these measurements.
Given the roughly four-second full build here, that complexity needs evidence
of a meaningful net benefit before adoption. Oxlint integration mentioned in
the article is future work, not a substitute available in this configuration.

No deployment, infrastructure provisioning, production access, or operations
against another worktree were performed. CI installation used the existing
prepare hook; candidate installation was outside the repository dependency
graph. The temporary manifest integration and probe source have been removed.

## Validation

After restoring manifests, `pnpm lint` and `pnpm typecheck` both passed.
`RUN_INFRA_TESTS=0 pnpm exec vitest run` passed against the candidate-generated
outputs: 59 test files passed, 2 skipped; 359 tests passed, 3 skipped. Direct
Vitest intentionally avoided `pnpm test` rebuilding core with the baseline
compiler before testing the candidate outputs. Infrastructure tests remained
opt-out; no infrastructure was created. Validation logs are retained alongside
benchmark logs. These test results do not erase the demonstrated diagnostic gap.
