# Effect-enabled tsrs retest — 2026-10-30

This retests the [October 20 investigation](./tsrs-build-evaluation.md) after
Effect added an officially supported Rust compiler build. The previous failure
was real for unpatched tsrs 0.18.0; it is no longer a reason to reject the new
integration.

## Baseline and candidate

Fetched `origin/main` at `67e62438d6022172909fc912ac42d475f4ecc410` and merged it
into the clean, isolated research branch, retaining the historical report.
Application source and configuration for measurements match that SHA. All
build output and compiler cache operations were confined to this worktree.

Three variants run the same package scripts and tsconfigs:

- **Baseline:** native TypeScript 7.0.2, patched by `@effect/tsgo` 0.51.1, exactly
  as current main configures it.
- **Go control:** `@effect/tsgo` 0.63.0 running `effect-tsgo tsc@7.1.0-beta`.
- **Rust candidate:** that same 0.63.0 package running
  `effect-tsgo tsrs@0.20.1-ts7.1.0-beta`.

The control distinguishes the Rust implementation from the simultaneous
TypeScript and Effect-tooling upgrade. Both control and candidate report
TypeScript 7.1 beta; Rust identifies TypeScript source `3e9236361fa9`.
No separate Effect check, disabled diagnostics, `noCheck`, or fast preset is
used. The wrapper invokes its bundled Effect-enabled compiler directly.

Primary sources checked again:

- [Effect's supported versions and direct invocation](https://github.com/Effect-TS/tsgo#run-the-patched-tools-without-patching).
  Installed 0.63.0 supports the pinned Rust version and TypeScript 7.0.2,
  7.1 beta and 7.1.0-dev.20261028.1. Explicit version selection avoids choosing
  a different build from ambient installations.
- [tsrs compatibility](https://github.com/oxc-project/tsrs/blob/main/docs/COMPATIBILITY.md)
  and [defaults](https://github.com/oxc-project/tsrs/blob/main/docs/DEFAULTS.md).
  0.20.1 defaults to Go-compatible checker assignment, four checker threads,
  and eager members. Its opt-in `--fast` preset has documented differences
  near instantiation depth limits; this experiment leaves it off.
- [The maintainer's announcement](https://x.com/MattiaManzati/status/2115936314788896848).

The checked source HEADs and host environment are recorded in
[environment.json](./tsrs-effect-benchmarks/environment.json). Published package
versions and integrity hashes are preserved in the candidate's external
[package lock](./tsrs-effect-benchmarks/candidate-package-lock.json).

## Semantic checks

Re-ran the original `Effect.succeed(1)` expression probe in core's existing
project. Baseline fails with exit 1; both updated compilers fail with exit 2.
All three report TS377001 `effect(floatingEffect)`. All three also reject an
ordinary string/number assignment with TS2322. Both nonzero conventions fail
CI; consumers parsing exact exit values must account for the change.

On unchanged core source, baseline has 37 diagnostics; both updated compilers
have 60, all suggestions. None of the 37 disappeared. The 23 additions are
TS377141 `schemaClassMissingBrand` suggestions introduced by the Effect update.
Sorted diagnostics match exactly between updated Go and Rust, including their
messages, locations and severity, for unchanged source and both negative
probes. Evidence: [probes](./tsrs-effect-benchmarks/probes.json) and
[comparison](./tsrs-effect-benchmarks/probe-comparison.json).

The first preflight failed because existing `dist` modules referenced by
`alchemy.run.ts` were absent. Running the ordinary baseline build, as CI does
before typecheck, resolved this. The failed preflight is retained as evidence
and excluded from performance measurements.

## Measurement method

[run.py](./tsrs-effect-benchmarks/run.py) records every command, exit, wall time
and stdout/stderr log. Dependency installation, download, warmup, cleanup and
hashing are excluded. No statistics/profiling flags are passed to timed runs.
Heavy commands run sequentially, per current AGENTS.md; variant order rotates
between repetitions to reduce order bias. It temporarily changes only compiler
command prefixes, then restores manifests byte-for-byte.

Host: Ryzen 7 7800X3D, 8 cores/16 threads, WSL2 Linux, approximately 15 GiB RAM.
Exact Node/pnpm/kernel, memory, filesystem, tuning variables and a load sample
are in the environment artifact. This is a shared desktop, not an isolated CI
runner; results characterize this machine, not guaranteed CI latency. No
memory-use speedup is claimed.

- Package typecheck: one warmup per variant, five measured invocations of
  `pnpm typecheck`. Same five projects and tests; no emit. The root tsconfig is
  not independently checked by this script, preserving baseline scope.
- Full clean build: three runs, removing five package `dist` directories and
  root/web Vite caches before each run. OS page cache and dependencies stay
  warm. This is artifact-clean, not a reboot/cold-disk measurement.
- Full warm build: five runs retaining outputs. There is no persistent compiler
  incremental cache in the production configuration, so this still performs
  full checking/emit. Vite client/SSR bundling stays unchanged.
- Non-web emit workflow: five runs of
  `pnpm --filter '!@dtpt/web' -r run build`. This includes normal semantic/Effect
  checking and JS/source-map emit in core, API, data and jobs, not transpile-only.
- Incremental experiment: core `--noEmit --incremental` with separate
  `--tsBuildInfoFile` paths per compiler; three cache-empty runs and five
  no-change warm runs. No cache is shared across variants. This is an opt-in
  experiment, not a proposed change to project configuration.

No declaration emit is configured or required: package type exports target
source. Thus no declaration timing or equivalence claim is made. Full build
means `pnpm build`, including Vite's Solid client/SSR build, not the entire CI
job (which also runs lint, typecheck, tests and deploy). Deployment and
infrastructure operations are excluded entirely.

## Results

All 81 measured/warmup invocations exited zero (78 measured, three warmups).
Wall time in seconds, median (min–max); values come from
[raw results](./tsrs-effect-benchmarks/runs.json) and
[summary](./tsrs-effect-benchmarks/summary.json).

- Five-package typecheck — baseline: **6.652** (6.560–6.674); go-control: **6.231** (6.174–6.256); rust: **3.199** (3.095–3.292).
- Full clean build — baseline: **4.119** (4.097–4.148); go-control: **3.776** (3.775–3.780); rust: **2.566** (2.557–2.636).
- Full warm build — baseline: **4.062** (3.931–4.477); go-control: **3.825** (3.697–4.077); rust: **2.581** (2.539–2.616).
- Checked non-web JS/map emit — baseline: **2.773** (2.763–2.887); go-control: **2.555** (2.416–2.564); rust: **1.317** (1.287–1.341).
- Core incremental, empty cache — baseline: **1.599** (1.597–1.623); go-control: **1.495** (1.460–1.499); rust: **0.653** (0.649–0.678).
- Core incremental, unchanged warm cache — baseline: **0.610** (0.603–0.620); go-control: **0.737** (0.722–0.759); rust: **0.389** (0.381–0.396).

Against current main, Rust reduces median typecheck wall time by **51.9%**,
clean full build by **37.7%**, and warm full build by **36.5%**. Against updated
Go with matching TypeScript/Effect versions, typecheck is **48.7%** lower and
clean full build is **32.0%** lower. These percentages describe measured local
commands with checks retained, not a forecast for whole-CI or deployment time.

Across all five typecheck repetitions, baseline emits 71 suggestions; updated
Go and Rust emit the same 99 suggestions, with stable location/message/severity
sets. None of the original diagnostics disappears. The 28 additions are from
the tooling update, also present in Go. See the
[whole-workspace diagnostic comparison](./tsrs-effect-benchmarks/diagnostic-comparison.json).

All **419 output files** from Rust match the same-version Go control byte for
byte. Against current main, all JavaScript, client/SSR assets and other outputs
match; the only differences are 140 compiler source maps. Parsing all 140 maps
shows exactly one change: TypeScript 7.1 omits the empty `sourceRoot: ""` field.
All source paths, mapping segments, names and other fields are identical. See
[hashes](./tsrs-effect-benchmarks/output-hashes.json),
[comparison](./tsrs-effect-benchmarks/output-comparison.json), and
[parsed map comparison](./tsrs-effect-benchmarks/source-map-comparison.json).

Additional acceptance probes verify warning failures, non-failing suggestions,
suggestions configured to fail, explicitly disabled diagnostics, and incremental
clean → Effect error → fixed transitions. Both new compilers match the baseline
success/failure decisions for all seven cases; nonzero exits change from 1 to 2.
The fixtures and isolated cache are removed afterward.
[Commands and exits](./tsrs-effect-benchmarks/acceptance.json),
[reproduction script](./tsrs-effect-benchmarks/verify.py).

## Candidate integration and adoption limits

The candidate upgrades only the `@effect/tsgo` catalog pin/lock entries and
changes the five typecheck/four compiler build commands to explicitly invoke
the bundled, version-pinned Rust compiler. It retains the TypeScript package
and existing prepare hook for editor/tool consumers. No application source,
tsconfig checking options, CI job ordering, Vite configuration, or lint engine
changes are needed. Normal CI commands pick up the package scripts. There is
no extra `tsrs` dependency or second compiler check in the candidate pipeline.

Recommendation: adopt this scoped CLI integration after review. The October 20
missing-Effect blocker is resolved in the supported release; this repo's
negative checks, existing diagnostics and required outputs are preserved in
the tested cases. This does not establish universal compiler/plugin parity.
The main adoption costs are using a TypeScript **7.1 beta** implementation,
28 new non-failing suggestions, and keeping the pinned tool/engine versions
aligned for future upgrades. Stock-editor TypeScript remains 7.0.2 with the
new Effect diagnostics, so compiler-version-sensitive editor/CI differences
are possible. A separate editor migration is not included.

Effect's packaged Rust build does not support Linux musl. This experiment
covers Linux x64 glibc under WSL2; other operating systems/editor integrations
were not exercised. Unsupported tsrs commands such as `--showConfig`/`--init`
and tracing remain limitations; these are not used by package build/check
scripts. Incremental results are encouraging, but enabling project-wide
incremental caching is deliberately outside this candidate.

To reproduce, use a separate isolated checkout of the recorded baseline SHA,
install with `pnpm install --frozen-lockfile`, and build once. Copy the research
scripts into that checkout. Install `@effect/tsgo@0.63.0` into an external prefix
using `npm install --prefix /tmp/tsrs-retest-candidate --save-exact @effect/tsgo@0.63.0`.
Run `python3 docs/investigations/tsrs-effect-benchmarks/run.py /tmp/tsrs-retest-candidate/node_modules/.bin/effect-tsgo`.
The benchmark asserts the old baseline version to prevent accidentally timing
the upgraded compiler as the original baseline. `probes.py` and `verify.py`
use that same external prefix and must also run before upgrading the baseline.
All source probes are removed in `finally` blocks. Installs and setup are not
part of any reported timing.

## Final validation

After installing the actual workspace candidate, all sequential checks passed:
`pnpm install --frozen-lockfile`, `pnpm build`, `pnpm lint`, `pnpm typecheck`,
and `RUN_INFRA_TESTS=0 pnpm test` (364 passed, 3 skipped). The installed
candidate's 419 outputs match the external benchmark candidate exactly.
Infrastructure tests stayed disabled; no infrastructure or production action
was performed.

[Validation status](./tsrs-effect-benchmarks/validation.json) records these
results. All unedited stdout/stderr logs, including failed setup and negative
probes, are preserved in [logs.tar.gz](./tsrs-effect-benchmarks/logs.tar.gz)
to keep the review diff manageable. Extract with
`tar -xzf docs/investigations/tsrs-effect-benchmarks/logs.tar.gz -C <scratch-directory>`.
Timing arrays, hashes, diagnostics, fixtures, environment and commands remain
plain JSON/Python files beside the archive.
