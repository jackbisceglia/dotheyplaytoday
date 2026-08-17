# Alchemy service URL wiring

## Status

Web is managed by Alchemy. Service URL wiring remains transitional until the
generated `workers.dev` endpoints are replaced by declared custom domains.

Alchemy manages the API Worker, notification Worker, and Solid Web Worker. Web
consumes the API Worker's resolved URL directly. The API-to-Web CORS direction
still uses temporary deployment configuration to avoid a resource cycle.

The Workers temporarily use their generated `workers.dev` endpoints. Their
custom domains will be restored after the `dotheyplay.today` DNS zone moves to
Cloudflare.

## Current implementation

The intended deployed Worker hostnames are derived by `getServiceDomain`:

- Production API: `api.dotheyplay.today`
- Production jobs: `jobs.dotheyplay.today`
- Non-production Workers: the normalized stage is prepended to the production
  hostname.

These hostnames are not currently attached to the Workers.

The Workers consume `WebConfig`, which remains an ordinary Effect `Config`
definition backed by:

- `PUBLIC_WEB_URL_BASE`
- The optional `PUBLIC_WEB_URL_PORT`

At the Alchemy composition boundary, `WebConfigAlchemy` currently contributes
an empty primary provider, so both local and cloud runs use the exact
`PUBLIC_WEB_URL_BASE` supplied by environment configuration. While `workers.dev`
endpoints are in use, production must receive the deployed Web Worker's origin.
The Web Worker has the stable stage-qualified name
`dotheyplaytoday-web-${stage}` so that origin is known before deployment.

`packages/web/resource.ts` passes `apiWorker` to Web as the `API` service binding
and derives `VITE_API_URL` from `apiWorker.url`. Alchemy tracks both resource
dependencies and resolves the public URL before the Vite build. The browser API
client consumes that complete URL directly. The SSR API client adapts the
service binding to Effect's `HttpClient`, avoiding a same-account public
`workers.dev` fetch and Cloudflare error 1042. Local SSR therefore runs through
`alchemy dev`; the browser transport remains an ordinary public HTTP client.

This bridge preserves the application's existing configuration structure, but
it is not intended to be the final source of the Web public endpoint.

## Current limitation

The configured CORS origin and the Web resource's generated URL are sibling
values. They can drift until a declared custom-domain endpoint becomes their
single upstream value.

This limitation is accepted temporarily for the generated-URL rollout. The
deploy operator must set `PUBLIC_WEB_URL_BASE` to the exact Web Worker origin;
wildcard CORS is not allowed.

## Target model

A resource URL passed between services should be a complete URL supplied by the
producer's Alchemy output:

```ts
const stack = Effect.gen(function* () {
  const api = yield* ApiWorker;
  const web = yield* Web({
    env: {
      PUBLIC_API_URL: api.url,
    },
  });

  return { api, web };
});
```

Alchemy resolves the same output according to the active provider:

- Local development: `http://localhost:<port>/`
- Cloud deployment: the attached custom-domain URL

Consumers should receive that full value and must not reconstruct it from a
domain, protocol, or separate port. Ports are already part of local resource
URLs and are normally absent from HTTPS custom-domain URLs.

Runtime application code should continue to use ordinary Effect `Config`.
Alchemy-specific code owns injecting resource outputs into environment
variables at the infrastructure boundary.

The intended environment-variable shape is consequently one complete URL per
dependency, for example:

- `PUBLIC_API_URL`
- `PUBLIC_WEB_URL`
- `JOBS_URL`, if another runtime eventually needs to call the jobs Worker

The current `PUBLIC_WEB_URL_BASE` plus `PUBLIC_WEB_URL_PORT` representation can
be replaced by `PUBLIC_WEB_URL` when Web becomes an Alchemy resource.

## Dependency direction and cycles

Resource-output injection works directly for one-way dependencies. A Web
resource can depend on `api.url`, and Alchemy will provision the API before
resolving the Web resource input.

The current application also has a reverse logical dependency: the API needs
the Web origin for CORS. Making both resources consume each other's `url`
outputs would create a cycle:

```text
ApiWorker.url -> Web
Web.url       -> ApiWorker
```

Do not solve this cycle by independently rebuilding both URLs.

When Web is migrated, define its public endpoint once as an upstream
infrastructure value. Use that same declaration to configure the Web resource's
domain and the API's allowed Web origin. The resulting dependency direction is:

```text
Declared Web endpoint ─┬─> ApiWorker (CORS)
                       └─> Web (domain)

ApiWorker.url ─────────────> Web (runtime config)
```

This keeps the cyclic public identity authoritative in one place while still
using actual resource `url` outputs for one-way runtime dependencies.

## Remaining migration steps

When the DNS zone is available in Cloudflare:

1. Define the Web public endpoint once and use it for both the Web domain and
   API CORS configuration.
2. Replace `PUBLIC_WEB_URL_BASE` and `PUBLIC_WEB_URL_PORT` with a complete
   `PUBLIC_WEB_URL`.
3. Restore Alchemy-owned Web URL configuration in `WebConfigAlchemy`.
4. Verify local URLs through `alchemy dev` and deployed URLs through a
   provider-level plan test before the first production deployment.

Until then, `WebConfigAlchemy` and `VITE_API_URL` remain explicit public-identity
compatibility bridges for CORS and browser requests; do not expand them into a
second shared URL model. The SSR `API` binding is independent of that future
custom-domain work.
