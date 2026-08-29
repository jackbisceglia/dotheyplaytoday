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
