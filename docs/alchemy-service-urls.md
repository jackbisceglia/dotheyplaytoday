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

## Domains and resource URLs

`packages/core/src/lib/alchemy/domain.ts` defines each resource's desired custom
hostname. `getManagedServiceDomain` applies the development-stage exception
before the resource passes its hostname to Alchemy's `domain` property. The
existing `dotheyplay.today` Cloudflare zone is a prerequisite and is not adopted
as a whole by this stack.

Services consume each other's resolved resource URLs rather than reconstructing
them from the hostname policy:

```text
API Worker URL ─────────> Web Worker (browser runtime config)
API service binding ────> Web Worker (SSR transport)
Web Worker URL ─────────> API Worker (CORS, late binding)
Web Worker URL ─────────> jobs Worker (generated links, late binding)
```

Web keeps its API dependencies in its initial Vite props because
`VITE_API_URL_BASE` must be available while Vite builds the browser bundle and
the service binding must be present while the SSR Worker initializes. The
reverse dependencies are attached with Alchemy resource bindings after the
resources are declared. This avoids a props-level cycle while retaining direct
resource outputs on both sides.

## Runtime wiring

The Stack binds the Web Worker's resolved `url` to the API and jobs Workers as
`VITE_WEB_URL_BASE`. They consume it through ordinary Effect `Config`; the API
uses it as the exact allowed Web origin.

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

Alchemy `2.0.0-beta.63` may plan redundant Worker and URL-binding updates after
this graph has converged. The deployed outputs remain stable and were verified
in staging and production. Recheck this behavior when upgrading Alchemy or when
`Website.Vite` supports separate definition and implementation layers.
