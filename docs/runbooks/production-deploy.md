# Production deployment

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

## Passwordless account rollout

Migration `0005_grandfather_subscribers.sql` is forward-only and names exactly
ten subscriber IDs. A read-only production audit on 2026-09-06 verified branch
`production` (`owc7rj5x6bk3`), the deployed Hyperdrive role's matching branch ID,
and migration 0004 applied at `2026-09-06T01:17:55.851Z`. All ten users had that
same migration-assigned `created_at` and active saved subscriptions. The #115
production workflow (run `34003426410`) completed successfully before the audit.
The fixed ID list is the eligibility boundary; this is not a rolling timestamp
cutoff or “everyone present at migration time” backfill. Do not expand it to
include subsequent pending signups. Keep the database default false.

Grandfathering preserves delivery for the owner's trusted subscribers. It does
not establish mailbox verification or create sessions. Existing subscribers still
request and redeem a magic link to sign in. Apply migrations before deploying
the pending-signup/recipient-filter behavior through the normal release workflow.
Do not rewrite migration 0004 or 0005 after shipping.

The signup transaction saves new preferences but preserves existing accounts,
including concurrent and pending signups. The API sends one background magic-link
email with confirmation or sign-in copy. Failed delivery is recoverable at
`/sign-in`; it requires no preference restoration. Redemption enables ordinary
scheduled delivery, without an immediate notification. `/account` is read-only;
preference editing is a separate follow-up.

For isolated validation, first compare the PlanetScale branch ID with the actual
role username suffix and connection host. `pnpm -s alchemy:stage` alone is not
evidence of isolation. Never send test emails to the production cohort. Use a
unique Resend test recipient for a real delivery smoke test.

The implementation smoke run used stage `dev_jackb_t3code-5fcfe034`, branch
`dotheyplaytoday-dtptpostgresbranch-dev-jackb-t3jtq355gdg3vbuigz`
(`1ydd0xdo0rh8`), on `us-east-4.pg.psdb.cloud`. Provider role metadata and a
`current_user` database query confirmed the target independently of the stage
helper. The local API Worker used the branch's pooled connection, as expected
for `alchemy dev`. The real Chromium/Resend flow covered pending and verified
repeat signup, replacement links, verification, account reads, and sign-out;
loading, failure/retry, reused-link UI and narrow-screen layout were also checked.
Production was not deployed, and the separate deployed Worker/Hyperdrive
infrastructure suite was not run for this change. The temporary test role and
dedicated dev stage were removed after validation.

After the service-boundary refactor, validation was repeated on a fresh branch
`dotheyplaytoday-dtptpostgresbranch-dev-jackb-t3rp7rx7nowkcf6lgk`
(`mmpucshbk7j8`, `us-east-5.pg.psdb.cloud`) in the same dedicated stage.
Provider branch/role metadata and the actual database user confirmed isolation.
Lint, typecheck, and the real Chromium/Resend flow passed. Browser checks also
covered loading, failure/retry, signed-out access, and mobile width. The temporary
role was revoked and the dedicated stage removed again after validation.

Implementation-time auth/account tests have been removed from this review.
After the code is agreed, a separate testing pass will outline the program
surface, identify changed areas, and define targeted cases before adding tests.
