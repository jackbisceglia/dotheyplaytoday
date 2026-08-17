# Alchemy service URL wiring

## Status

Alchemy manages the public API Worker, notification Worker, and Solid Web
Worker, including their Cloudflare custom domains. Cloud deployments do not
depend on hardcoded `workers.dev` origins in `.env.production`.

The canonical production hostnames are:

- Web: `dotheyplay.today`
- API: `api.dotheyplay.today`
- Jobs: `jobs.dotheyplay.today`

The exact `production` stage owns those hostnames. Other non-development stages
prepend their normalized stage, for example `staging.dotheyplay.today`,
`staging.api.dotheyplay.today`, and `staging.jobs.dotheyplay.today`. `dev_*`
stages do not attach custom domains and keep Alchemy's local/generated
development URLs.

## Source of truth

`packages/core/src/lib/alchemy/domain.ts` defines every public service hostname.
`getManagedServiceDomain` applies the development-stage exception before each
resource passes its hostname to Alchemy's `domain` property. The existing
`dotheyplay.today` Cloudflare zone is a prerequisite and is not adopted as a
whole by this stack.

The Web public identity is needed by both the Web resource and API CORS. Both
derive it from the same domain helper rather than from each other's resource
outputs:

```text
Declared Web endpoint ─┬─> API Worker (CORS)
                       └─> Web Worker (domain)

API Worker URL ─────────────> Web Worker (browser runtime config)
API service binding ─────────> Web Worker (SSR transport)
```

This avoids a resource cycle while keeping the public identity authoritative in
one place.

## Runtime wiring

`WebConfigAlchemy` injects the declared Web base URL into `VITE_WEB_URL_BASE`.
The API and jobs Workers consume that value through ordinary Effect `Config`;
the API uses it as the exact allowed Web origin.

`packages/web/resource.ts` passes the API Worker to Web in two forms:

- `API` is a Cloudflare service binding used by SSR, avoiding same-account
  public Worker fetches and Cloudflare error 1042.
- `VITE_API_URL_BASE` is the API Worker's resolved public `url`, used by the
  browser client. With a custom domain attached, Alchemy resolves this to the
  stage's custom-domain URL.

Local integrated development runs through `alchemy dev`. Standalone
`pnpm dev:web` remains outside Alchemy and reads local `VITE_WEB_URL_*` and
`VITE_API_URL_*` values from `.env`.

## Deployment

Before deploying a new custom hostname, verify it has no conflicting DNS record
or binding to another Worker. Do not use broad zone adoption to resolve a
conflict.

Production deploys use:

```sh
pnpm run deploy --stage production --env-file .env.production
```

Do not set deployed `VITE_WEB_URL_BASE` or `VITE_API_URL_BASE` to generated
`workers.dev` URLs. Alchemy supplies both values at the infrastructure boundary.
After deployment, verify the returned `webWorkerUrl`, `apiWorkerUrl`, and
`notifyJobWorkerUrl`, then run the Solid Web smoke checklist.
