# Hosted MLB catalog agent prototype

This is a deployable **GitHub-hosted Linux job**, not a local T3 task and not
the notification cron. Everything needed to execute lives in GitHub Actions:
the scheduler, disposable VMs/containers, model secret, browser, git/pnpm,
status/artifacts, publisher and remote rerun controls. No VM to maintain and
no new Alchemy/Effect dependencies. The separate infrastructure entrypoint is
`.github/workflows/prototype-mlb-catalog.yml`; `alchemy.run.ts` is untouched.

**Disabled by default. Nothing has been deployed, enabled or run against a
model.** Adding this file does not enable paid research. Existing T3 tasks
are unchanged. Coordinate their eventual retirement before enabling publishing
here; an existing T3 PR can still cover the same games under another branch.

## Why this option

Real GitHub code/repository searches on 2026-10-21 found usable agent and
infrastructure patterns, but no complete version-compatible MLB maintenance
application to import. These were inspected, not executed:

| Source                                                                                                                                                                                                                                                                                                                           | Finding and decision                                                                                                                                                                                                                                                                                                                                                                                     |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Brendonovich/alchemy-opencode example](https://github.com/Brendonovich/alchemy-opencode/blob/cb709b3c6f2fa617bae154a5641a4baf0950b0bb/example/src/Agent.ts), [manifest](https://github.com/Brendonovich/alchemy-opencode/blob/cb709b3c6f2fa617bae154a5641a4baf0950b0bb/package.json)                                            | Direct match exists! Updated Oct 7. Embeds OpenCode in a DO, persists sessions and exposes ask/reply/events. Requires Alchemy beta.81, Effect 4 stable, SDK 2.0.24; this repo uses beta.78/rc.117. No license declared. Did not copy code or add it as a dependency. Still needs Linux tools and scheduling.                                                                                             |
| [Alchemy Fly Sprite example](https://github.com/alchemy-run/alchemy/blob/b13d4c5682d21af9d9c08071a113a4cabc96835f/examples/fly-sprite/src/box.ts), [integration tests](https://github.com/alchemy-run/alchemy/blob/b13d4c5682d21af9d9c08071a113a4cabc96835f/packages/integration-tests/test/Fly/Sprite.test.ts)                  | Apache-2.0; active Oct 21. Real create/serve/exec/checkpoint/delete tests. Current examples use split `@alchemy.run/fly` packages and newer Effect API. The **published beta.78 tarball also contains `src/Fly/Sprite.ts`, Machine, Railway Sandbox and AWS ECS**; these providers are not missing. A Sprite is viable, but adds provider auth/state and scheduler wiring that Actions already supplies. |
| [Cloudflare Sandbox Claude runner](https://github.com/cloudflare/sandbox-sdk/blob/b4c74c90c02cc3fd9bab963e35ac1ef3c36a8b80/examples/coding-agents/claude-code/src/index.ts), [Dockerfile](https://github.com/cloudflare/sandbox-sdk/blob/b4c74c90c02cc3fd9bab963e35ac1ef3c36a8b80/examples/coding-agents/claude-code/Dockerfile) | Apache-2.0; active Oct 21. Informed the CLI-in-Linux architecture, explicit API authentication, pinned Claude 2.1.280 and checking `is_error`, not just process exit. Their Sandbox 1.0.2 shim/gateway/outbound controller is not needed on an Actions VM. Our code is independently written, not vendored.                                                                                              |
| [OpenCode2 Workerd docs](https://dev.opencode.ai/v2/docs/build/sdk/cloudflare/), [Cloudflare example](https://github.com/cloudflare/agents/blob/main/examples/next/harnesses/opencode/src/server.ts)                                                                                                                             | Verified embedded agent with DO SQLite recovery, not a client to an OpenCode container server. OpenCode SDK source is MIT, current source 2.1.2. The example's Worker JavaScript backend is not a native pnpm/Chromium environment; an additional Linux backend is needed for this task. Useful later for persistent conversations, unnecessary for a daily fresh run.                                   |
| [Anthropic Actions example](https://github.com/anthropics/claude-code-action/blob/main/examples/issue-triage.yml)                                                                                                                                                                                                                | MIT; active Oct 21. Demonstrates noninteractive Claude with an API key on hosted Ubuntu. We use the CLI directly, keeping GitHub write authority out of the agent environment rather than passing a publisher token to the harness.                                                                                                                                                                      |

Searches included `gh search repos 'alchemy opencode'`, `alchemy sandbox`,
`alchemy sprites`, `alchemy agent cloudflare`, code searches for
`"@opencode/sdk/workerd"` and `"alchemy/Fly"`, and recursive upstream trees
for Alchemy, Sandbox and OpenCode. Search results are not exhaustive. No
untrusted setup scripts were imported. No framework/dependency upgrades were
needed. Python's standard library is sufficient for this small process/git
controller; adding an Effect service graph here would not simplify the job.

## Execution and authority

1. Daily **04:00 America/New_York**, with explicit weekdays and native DST
   handling, or a manual dispatch. [GitHub supports schedule timezones](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#onschedule).
   Scheduling is best effort: queued/delayed/dropped runs are possible. This is
   a daily maintenance target, not a precise delivery SLA.
2. Check out current `main`, read open PRs/recent history. Serialize all MLB
   executions. An existing `automation/mlb-catalog` branch/PR blocks a new
   publisher; never silently replace reviewed work.
3. Build the pinned tool image: Node 24.18.0, pnpm 10.11.0, Claude Code
   2.1.280, Playwright 1.56.1/Chromium, git, Python and ripgrep. Run a fresh
   agent with the adapted live `[MLB] catalog` prompt from this machine's
   daily 04:00 task. Linux shell, WebSearch/WebFetch and headless browser are
   available. No cached browser login, local callback or personal OAuth token.
4. The container gets **only** the model key/model name and two mounts: its
   writable checkout and read-only instructions/context. No Docker socket,
   GitHub token, host home, T3 state or production secrets. CPU 2, RAM 6 GiB,
   PIDs 512, dropped capabilities, no privilege escalation. Claude runs as
   the hosted runner's non-root UID; this is not a hardened multi-tenant
   sandbox. The outer hosted VM is also discarded.
5. Parse a structured `changed`, `no_change` or `blocked` result. Extract only
   the two MLB catalog files and seed config into a **fresh** baseline clone.
   Reject symlinks/oversized files and any seed-config change except the
   version. Other agent edits are discarded. Changed outcomes require MLB
   and independent source links; their factual accuracy still needs review.
6. Install unchanged locked dependencies in a new container without model or
   GitHub credentials. Run the runbook's build/data tests/root lint/typecheck
   with networking disabled. No database or production integration tests.
7. Save status, JSON result, exact patch/files and validation logs as a
   14-day artifact. A **separate VM job** receives the GitHub write token,
   checks main has not moved, stages only the allowed files and opens a normal
   reviewable PR. It never installs dependencies or executes candidate code.
8. Stop/discard compute. Humans review and merge through the existing policy.
   No merge, production deploy, seed execution or notification send is added.

The live prompt's research and exclusion rules are retained. Its publication
and validation duties move to the controller. Its automatic follow-up on CI
and updates to an existing PR are intentionally deferred: this MVP stops for
human review. Current repository CI only deploys on `main`, not PR events.
`GITHUB_TOKEN` PR creation also does not automatically trigger most downstream
workflows. Do not mistake absent CI for passing checks.

## Modes, activation and bounds

| Mode              | Model/API use                                                                                                                                                                | Publishing                                                                                             |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `smoke` (default) | None. Fake agent edits fixture comments/version. Hosted mode also builds the image and checks native tools/Chromium offline. No source research or catalog validation claim. | Refused by workflow **and** publisher code.                                                            |
| `dry-run`         | Real research, browser/tools and validation; incurs API/Actions usage.                                                                                                       | Publisher job skipped, no write credential supplied to agent/controller. Produces patch artifact only. |
| `publish`         | Same real research/validation.                                                                                                                                               | Separate trusted publisher; requires explicit enable variable.                                         |

After this PR is reviewed/merged, a separately authorized operator can:

1. Run the **smoke** mode from Actions → Prototype MLB catalog agent → Run
   workflow. This checks the image, Linux tools, Chromium and extraction with a
   fixture, not the real model or source research. No model key is needed.
2. Create a dedicated Anthropic API key with provider-side spend controls in
   the GitHub secret `MLB_CATALOG_ANTHROPIC_API_KEY`. Set repository variable
   `MLB_CATALOG_MODEL` to an API model ID the account can use. Subscription/T3
   credentials are neither required nor reused. Set `MLB_CATALOG_ENABLED=true`.
3. Explicitly dispatch `dry-run` and inspect the artifact, source quality,
   browser access and validation logs. This is the first **billable** test;
   it has not been authorized or performed during prototype development.
4. Only when satisfied, enable Actions' permission to create PRs, set
   `MLB_CATALOG_PUBLISH_ENABLED=true`, and coordinate the old T3 schedule's
   retirement. Both variables enable the daily publishing schedule. Changing
   these settings and the old task is **not part of this PR**.

Manual CLI equivalent after activation:

```sh
gh workflow run prototype-mlb-catalog.yml --ref main -f mode=smoke
# dry-run and publish require the separate authorization/settings above.
```

Each container invocation has a 30-minute hard wall timeout; research job
75 minutes including image build/install/validation; publisher 10 minutes.
Claude is limited to 80 turns and an estimated $5 budget. The CLI budget is
**not a billing guarantee** (it may overshoot); use provider-side limits too.
Because Bash can see the model key, the CLI cap is not an adversarial boundary
against direct API calls. [CLI flags and budget semantics](https://code.claude.com/docs/en/cli-reference).
Outbound networking is enabled for research/install, disabled for validation.
No secrets should be put in prompts: agent results/logs are retained artifacts
and a public repository may expose run outputs. Dedicated-key use and artifact
access/retention must be reviewed before activation.

## Recovery and remote intervention

Use GitHub's run logs, summary, artifacts and Cancel/Rerun controls from any
browser. Disable `MLB_CATALOG_ENABLED` to stop future real runs; cancel an
active run separately. Nothing depends on T3 being online.

- Before publication: crash/timeout/contradictory sources fail the run; no PR.
  Read artifacts, resolve the blocker, dispatch fresh research against main.
  A hard VM/job kill may prevent artifact upload; GitHub's step logs remain
  the fallback. There is no automatic model replay or preserved conversation.
- After push / uncertain PR response: **rerun failed jobs**, not the whole
  workflow. The publisher downloads the original successful research artifact,
  compares the remote branch's exact tree, reuses an existing PR or creates the
  missing one. It never force-pushes. Tests simulate a successful PR creation
  followed by timeout. A divergent remote branch stops for human inspection.
- Main advanced before first push: fail rather than apply stale validation.
  Dispatch new research. A successfully pushed branch can be reconciled after
  main advances, because the same validated tree is preserved.
- An open agent PR stops new publishing runs. Make review corrections manually
  and revalidate, or close/delete the branch after resolving it and dispatch
  fresh research. Delete the agent branch after merge/closure before the next
  published run. Artifacts expire after 14 days; do not attempt recovery from
  a missing artifact or reuse a stale patch.

## Local checks and remaining cloud proof

```sh
python3 -m unittest discover -s prototypes/mlb-catalog -p 'test_*.py' -v
python3 prototypes/mlb-catalog/runner.py run --mode smoke --state /tmp/mlb-smoke-unique
pnpm lint
pnpm --filter @dtpt/core build
pnpm --filter @dtpt/api --filter @dtpt/data --filter @dtpt/jobs build
pnpm typecheck
```

Tests cover real temporary git repositories, extraction and symlink boundaries,
no-change/blocking, fake subprocess plumbing, dry-run refusal, stale baseline
and publication-timeout reconciliation with a fake GitHub API. No test calls a
model, creates a real PR, or writes catalog data to the source checkout.

Local smoke defaults to a fake subprocess without Docker. On a Docker-enabled
machine, build the image with the workflow command and add `--container-smoke`
to exercise the same offline browser/tool fixture as hosted smoke.

Development machine has no Docker: image build, Chromium launch, CLI schema/
budget behavior, container dependency installation, offline validation, GitHub
workflow acceptance, artifact retry download and real PR creation remain
**unverified in the deployed environment**. Package existence and upstream CLI
contracts and the pinned CLI's local `--help` were checked without a model
call; local mocks are not cloud proof. Repository lint and
typecheck cover existing TypeScript packages; Python uses the tests above and
the browser helper has a separate Node syntax check.

Verified locally: 12 controller tests, standalone fake smoke, `pnpm lint`,
`pnpm typecheck` after the prerequisite builds, and 63 data tests (two database
tests skipped). The first clean-checkout typecheck failed on missing compiled
workers; the controller now builds core/API/data/jobs before typechecking.
Workflow YAML and its Bash steps parse locally; that is not GitHub acceptance.

Deferred hardening: prebuilt digest-pinned image/cache, tighter egress and a
model gateway that hides provider credentials from tools, durable per-step
state/resumable conversations, PR review-comment follow-up, CI monitoring,
catch-up scheduling, stale-branch automation, stronger static validation of
data-only TypeScript, and alerts beyond GitHub failure notifications. Move to
Alchemy + Sprite/Sandbox when these needs justify a persistent coordinator;
the prompt and isolated agent command can move without redesigning research.
