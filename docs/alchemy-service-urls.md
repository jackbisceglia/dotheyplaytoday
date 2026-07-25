# Alchemy service URL wiring

## Status

Service URL wiring is transitional until the Web application is managed by
Alchemy.

Alchemy currently manages the API Worker and notification Worker, but it does
not manage the Astro Web application. The Workers therefore have Alchemy
resource outputs, while the Web application does not have a corresponding
resource or resolved `url` output.

## Current implementation

Deployed Worker hostnames are derived by `getServiceDomain`:

- Production API: `api.dotheyplay.today`
- Production jobs: `jobs.dotheyplay.today`
- Non-production Workers: the normalized stage is prepended to the production
  hostname.

The Workers consume `WebConfig`, which remains an ordinary Effect `Config`
definition backed by:

- `PUBLIC_WEB_URL_BASE`
- The optional `PUBLIC_WEB_URL_PORT`

At the Alchemy composition boundary, `WebConfigAlchemy` overrides the base URL.
It selects localhost for a development-named stage and otherwise derives the
deployed Web URL from `getServiceDomain`. The port continues to come from the
ordinary configuration provider.

This bridge preserves the application's existing configuration structure while
Web remains outside Alchemy, but it is not intended to be the final source of
service URLs.

## Current limitation

The configured Web URL and a future Web resource URL would be sibling values:
neither would derive from the other. Their implementations could therefore
drift.

The current localhost decision also uses the stage name, while Alchemy's actual
execution mode is independent of the stage:

- `alchemy dev --stage staging` still runs Workers locally.
- `alchemy deploy --stage dev_jack` still performs a cloud deployment.

The local Web port is another external input until Alchemy owns the Web
development process.

This limitation is accepted temporarily because there is no Web resource whose
resolved URL can be injected. Removing it depends on migrating Web to Alchemy.

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

## Migration steps

When Web is ready to move under Alchemy:

1. Add the Web resource with its custom domain and strict local development
   port.
2. Define the Web public endpoint once and use it for both the Web domain and
   API CORS configuration.
3. Inject `api.url` into the Web resource as a complete `PUBLIC_API_URL`.
4. Replace `PUBLIC_WEB_URL_BASE` and `PUBLIC_WEB_URL_PORT` with a complete
   `PUBLIC_WEB_URL`.
5. Remove the stage-based URL decision from `WebConfigAlchemy`.
6. Verify local URLs through `alchemy dev` and deployed URLs through a
   provider-level plan test before the first production deployment.

Until then, `WebConfigAlchemy` is the explicit compatibility bridge for the
unmanaged Web process.
