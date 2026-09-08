# Production deployment

Registration confirmation must not deploy independently. Before merging it to
`main` (which automatically deploys), include notification eligibility filtering
and the grandfathering migration for existing recipients. This feature branch
includes both; preserve them as one deployment unit and follow the cutover
requirements below.

Production deploys run automatically after a push lands on `main`. The workflow
has no manual dispatch trigger, so a branch or tag cannot use it to deploy
unreviewed code with production credentials. GitHub serializes production
deploys so two Alchemy applies cannot modify the production stage concurrently.

The workflow builds first because the root stack imports compiled package
outputs, then runs the repository checks before applying:

```sh
pnpm run deploy --stage production --yes
```

`--yes` is required in CI because Alchemy cannot prompt for plan approval or a
remote state-store upgrade. The exact `production` stage name is an application
invariant; do not shorten it to `prod`.

## GitHub environment configuration

The workflow uses the GitHub Actions environment named `production`. Configure
these environment secrets before enabling the workflow:

- `CLOUDFLARE_API_TOKEN`
- `PLANETSCALE_API_TOKEN_ID`
- `PLANETSCALE_API_TOKEN`
- `RESEND_API_KEY`
- `BETTER_AUTH_SECRET` (at least 32 cryptographically random characters; for
  example, generate it with `openssl rand -base64 32`)

Configure these environment variables:

- `CLOUDFLARE_ACCOUNT_ID`
- `PLANETSCALE_ORGANIZATION`
- `EMAIL_FROM_ADDRESS`
- `EMAIL_FROM_NAME`
- `ADMIN_EMAIL`

As defense in depth, configure the environment's deployment branches and tags
policy to allow only the `main` branch. Do not use the broader "protected
branches only" policy: it allows every protected branch, and it allows every
branch when the repository has no branch protection rules.

Protect `main` with a branch rule or ruleset that requires changes to arrive
through a pull request. GitHub's `push` event cannot distinguish a reviewed
merge from a direct push; branch protection is what makes this a deploy-on-merge
workflow rather than a deploy-on-any-main-push workflow.

Use the same values as the corresponding entries in the local ignored
`.env.production`. GitHub injects them directly into the deploy process, so CI
does not create `.env.production` or pass `--env-file`. This is equivalent to
the local environment-file command without writing the production secrets to
the runner filesystem.

The Cloudflare token must be able to deploy the Workers, Hyperdrive, custom
domains, DNS and zone settings in this stack. Because the stack uses
`Cloudflare.state()`, it must also be able to access and bind the account's
Alchemy Secrets Store state credentials. The PlanetScale service token must be
able to manage the existing production database, branch, roles, and migrations.

The API derives Better Auth's base URL from the existing resolved API URL and
its trusted browser origin from the resolved Web URL. There are no additional
origin variables. Keep `BETTER_AUTH_SECRET` stable across deploys or existing
signed session cookies will be invalidated. The `0004_better_auth.sql`
migration is forward-only: it extends `users`, backfills existing rows as
unverified, and creates `auth_sessions`, `auth_accounts`, and
`auth_verifications` before the updated Worker starts.

Alchemy can manage credentials with `GitHub.Secret` and `GitHub.Variable`. Its
current CI guide recommends a separate, locally applied bootstrap stack that
can also mint a scoped Cloudflare API token. The repository's pinned Alchemy
`2.0.0-beta.63` does not export `GitHub.Workflow` or `GitHub.Environment`, so the
workflow remains a checked-in GitHub Actions file and the `production`
environment must be created outside this stack. A credential bootstrap stack
is an optional follow-up here: PlanetScale and Resend credentials still
originate outside Alchemy, it needs an elevated Cloudflare token-management
credential, and the direct environment configuration above is enough to make
deploy-on-main operational.

## Local deployment

The existing local command remains:

```sh
pnpm run deploy --stage production --env-file .env.production
```

Run `pnpm build` first from a fresh checkout because `alchemy.run.ts` imports
the packages' compiled `dist` entry points.

## Verification and rollback

After Alchemy applies, the workflow makes bounded HTTP requests to the Web root
and the API's `/api/ping` health endpoint, including validation of the API
health response. A failed check fails the workflow but does not automatically
roll back the applied infrastructure. For higher-risk changes, also confirm
that Alchemy reports the expected Worker URLs and run the [Solid Web smoke
checklist](./solid-web-smoke.md) against
`https://dotheyplay.today`.

Alchemy deploys desired state rather than producing a standalone release
artifact. Roll back by reverting the faulty change through the normal review
path and landing that revert on `main`; its push triggers a new production
deployment. Database migrations must remain forward-compatible because
deploying older application code does not reverse an applied migration.

## Notification eligibility and grandfathering rollout

Pending registration, the verified-only recipient query, and migration
`0005_grandfather_subscribers.sql` are one deployment unit. Do not release this
slice or pending registration independently: the filter without grandfathering
stops trusted subscribers' delivery, and pending registration without the filter
allows unconfirmed users into notification processing. Registration is integrated
in this feature branch. API route restructuring is independent of the recipient
query.

Migration 0005 names exactly ten subscriber IDs, preserving the fixed cohort
audited on 2026-09-06 in the earlier combined worktree. A fresh read-only audit
on 2026-09-07 independently confirmed:

- Latest successful production workflow: run `34003426410`, commit
  `ffebfceee911328c4b571c812b1979982bda19c6` (PR #115).
- PlanetScale database `dotheyplaytoday`, branch `production`, branch ID
  `owc7rj5x6bk3`.
- Deployed Hyperdrive `bfd798977aa44ab5a41619efbf9ba431`, origin
  `us-east-3.pg.psdb.cloud:5432/postgres`, role
  `pscale_api_uc9jongwj9i0.owc7rj5x6bk3`. PlanetScale role metadata independently
  matched that host and branch. Both API and notification Worker settings bind
  this Hyperdrive ID. The production API and notification Workers
  were last modified during the #115 deployment on 2026-09-06.
- The database migration ledger contains 0001–0004 only; 0004 was applied at
  `2026-09-06T01:17:55.851Z`. Migration 0005 has not been applied.
- Exactly the ten IDs in migration 0005 exist, with 21 saved subscriptions in
  total. All ten remain unverified, each has at least one subscription, and
  `auth_sessions` is empty. No additional users were present.

The audit used a temporary `pg_read_all_data` role, verified its branch and
connection host before connecting, checked the actual database user, and read
inside a read-only transaction. The role was revoked afterwards. Production
data was not modified and no production deploy was performed.

Every cohort row has `created_at = 2026-09-06T01:17:55.851Z` because migration
0004 added that column with `CURRENT_TIMESTAMP`. These are migration-time
timestamps, not original signup dates. The owner-trusted, explicitly audited ID
list is the boundary; neither a timestamp cutoff nor all users present when a
migration runs is an acceptable substitute. Do not automatically expand the
list if production changes before release; inspect the specific change first.

Grandfathering deliberately preserves notification delivery. It does not prove
mailbox ownership or create sessions. Grandfathered users still request and
redeem a magic link to sign in. Keep `email_verified` false by default for new
users, and never rewrite shipped migrations.

`Subscriptions.listNotificationRecipients()` selects only users with
`emailVerified: true`, including forced and dry runs. Force cannot bypass this
restriction. Confirmation makes saved subscriptions eligible under ordinary
scheduling and last-sent rules; it must not send an immediate notification or
reset delivery state.

Before release, recheck the production target, migration ledger, fixed cohort,
and deployed registration behavior. Alchemy applies migrations before runtime
resources, but Worker updates are not an atomic cutover: ensure the verified-only
notification Worker is active before the API begins accepting pending
registrations. If the normal apply cannot guarantee that ordering, coordinate
the cutover with notification cron paused until both Workers are updated.
After any failed partial apply, establish which behaviors are active before
resuming scheduling. A rollback must also keep pending users excluded; reverting
only the recipient filter is unsafe once pending registration has been exposed.

Disposable verification must compare provider branch metadata, the role's branch
ID and host, and the actual database user before any data mutation. The stage
helper's output alone does not prove isolation.

The 2026-09-07 implementation checks used synthetic users and saved subscriptions
on a dedicated PS-DEV branch, `dev-eligibility-cf1b4796`; the completed run used
branch ID `fdawy9mvuxty` on `us-east-3.pg.psdb.cloud`. The fixed-cohort SQL excluded
an unrelated user with the same timestamp, preserved preferences and last-sent
state, retained the false default, and created no sessions. Real Effect/Drizzle
recipient and event queries with a capture-only notifier confirmed pending-user
exclusion in normal, forced, targeted, and dry runs, ordinary scheduling after a
persisted verification change, and unchanged last-sent behavior for dry runs and
failed delivery. No emails were sent. Temporary roles and all disposable branches
created for these checks were removed.

Changing a disposable user's verification field represents confirmation's
persisted outcome only; these checks do not validate Better Auth redemption,
session creation, or deployed Worker/Hyperdrive execution. `pnpm lint`,
`pnpm typecheck` (after building the imported package outputs), and 26 existing
focused tests passed. No test files or test plans are changed in this slice.

## API route restructure

Registration and token deletion now use `POST /api/user` and
`POST /api/user/unsubscribe`. Release the Web callers with the API changes.
Existing emailed links still land on Web `/unsubscribe/:token`, so no old API
alias is retained. Authenticated reads use `GET /api/user` and
`GET /api/user/subscription`. This restructure adds no migration or change to
signup, confirmation-email, or notification behavior.
