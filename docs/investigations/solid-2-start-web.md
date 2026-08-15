# Solid 2 Start mode Web migration decision

Status: deployed; local and production browser gates passed
Last updated: 2026-08-15

## Implementation outcome

Implemented on 2026-08-15 with the accepted all-SSR fallback. Solid's SSR
Start mode emits the expected `client` and `ssr` environments, and Alchemy's
Vite resource adopts those environments without the official Cloudflare Vite
plugin. Mixed rendering was rejected because SSR Start mode has no supported
route-prerender hook; creating `/index.html` would require post-build output
mutation coupled to Alchemy's asset-finalization order.

The generated Solid Fetchable serves all page requests. Cloudflare asset-first
routing serves hashed client assets directly. The Web build receives the API
Worker's complete URL through the tracked `VITE_API_URL` Output, while API CORS
temporarily receives the exact Web `workers.dev` origin from
`PUBLIC_WEB_URL_BASE` deployment configuration.

## Handoff state

This section records the state of the implementation and validation at the end
of the initial migration session. It is the starting point for the next agent.

### What has been implemented

- Astro has been removed from `packages/web` and replaced by the exact pinned
  Solid 2 RC, Solid Web, Solid Router 2, Solid Vite plugin, and Vite versions
  selected above.
- `vite.config.ts` uses `solid({ start: true, ssr: true })`. There is no
  Cloudflare Vite plugin in application configuration; Alchemy injects its
  provider plugin.
- The explicit typed route table contains `/`, `/unsubscribe/:token`, and a
  catch-all route. Internal Home links derive from `Router.paths`.
- The layout, home, ticker, signup, signup success/edit flow, unsubscribe,
  invalid-unsubscribe, and unknown-route interfaces have been ported to Solid
  TSX while retaining the existing global CSS and class structure.
- Route components register title and description metadata through Solid's
  head registry. Invalid unsubscribe tokens and unknown routes declare HTTP
  404 through `httpStatus`.
- Home uses a query-backed subject preload. In all-SSR mode, subject-load
  failures are logged with error context and render the established unavailable
  state.
- Signup and unsubscribe use a shared Effect-backed 15-second request deadline.
  Timeout and generic failures retain form input and re-enable submission.
- Form state is reactive rather than imperative DOM scripting. Validation focus,
  success focus, team capacity, retained selections, and separate persistent
  alert/status regions are implemented.
- `Cloudflare.Website.Vite` is part of `alchemy.run.ts` with
  `rootDir: "packages/web"`. Alchemy passes the tracked `apiWorker.url` Output
  directly as `VITE_API_URL` and uses asset-first routing.
- Database seed runs before API, jobs, and Web creation in stack composition.
  Development uses fixed Web/API ports 4321 and 3001.
- Cloud deployment CORS uses the temporary exact `PUBLIC_WEB_URL_BASE` input.
  Local CORS permits `http://localhost:4321`. No wildcard or same-origin proxy
  was added.
- The service URL and architecture documents were updated, and a repeatable
  manual checklist was added at `docs/runbooks/solid-web-smoke.md`.
- Mixed rendering was investigated and rejected. SSR Start mode has no
  supported route-prerender hook, and generating `/index.html` would couple a
  post-build output mutation to Alchemy's asset finalization order. The
  accepted all-SSR fallback is implemented.

### What has been tested

- Exact dependencies install without peer overrides.
- `pnpm build`, `pnpm lint`, and `pnpm typecheck` pass.
- `pnpm test` passes 72 tests with the opt-in PostgreSQL infrastructure test
  skipped.
- The generated production server exports both `handleRequest` and a default
  Fetchable. Direct handler checks confirmed streamed HTML responses, metadata,
  `/` status 200, and HTTP 404 for invalid unsubscribe and unknown paths.
- A production client-output scan found no filesystem/dotenv imports, database
  credentials, provider tokens, or other known server-only secret markers.
- All-SSR degradation was exercised with the API unavailable: the server logged
  the transport error and returned the unavailable signup state with status
  200.
- `alchemy dev` successfully created/reused the development PlanetScale branch,
  role, Hyperdrive, API Worker, notification Worker, Web Worker, and tracked
  `Web/VITE_API_URL` binding.
- Development seed completed with 3 collections, 92 subjects, 1,257 events,
  2,514 feed edges, 2,514 participants, and one seed user.
- Live Web and API endpoints were available at `http://localhost:4321/` and
  `http://localhost:3001/`.
- Live Home returned status 200 with Solid head metadata.
- Live invalid-unsubscribe and unknown routes returned HTTP 404 with their
  expected interfaces and metadata.
- The generated development client module loaded successfully.
- Live `/api/subjects` returned 92 subjects.
- Live CORS always emitted the one configured Web origin; a foreign requesting
  origin was not reflected and received neither itself nor `*`.
- A real browser signup completed successfully. Direct inspection of the
  development branch confirmed that San Francisco Giants and Toronto Blue Jays
  were persisted with a 4:00 AM fixed-local-time schedule and the browser's
  `America/New_York` timezone.
- Production deployed to
  `https://dotheyplaytoday-web-production.jackbisceglia2000.workers.dev`.
  Direct SSR returned 200 for Home and 404 for invalid unsubscribe and unknown
  routes; hashed assets were served directly.
- Production SSR initially rendered the unavailable signup state because a
  same-account Web Worker fetch to the API Worker's `workers.dev` URL is blocked
  by Cloudflare error 1042. The scoped `global_fetch_strictly_public`
  compatibility flag fixed the initial public-URL route. Web now uses an `API`
  service binding for SSR and retains the public URL only for browser calls, so
  the compatibility flag is no longer required.
- The complete production browser checklist passed at desktop and mobile
  widths, including real signup/edit, focus behavior, failure and 15-second
  deadline recovery, unsubscribe, direct navigation, and client history. The
  disposable production signup user was removed after verification.

### Resolved blocker

The implementation is functionally usable, production builds pass, API
mutations persist correctly, and the SSR environment is now stable under a cold
`alchemy dev` dependency-optimization pass.

Vite discovers Effect subpaths in multiple waves, reloads the SSR program, and
can leave the optimized `effect/unstable/httpapi` module referring to an
invalidated `SchemaTransformation-*.js` chunk. The resulting error is
`ERR_FILE_NOT_FOUND_IN_OPTIMIZED_DEP_DIR`; Solid's generated SSR handler then
fails to evaluate and workerd reports an uncaught Worker exception. This is a
real development integration failure, not one of the harmless route-not-found
logs. Restarting or allowing optimization to settle can make the application
usable, but cold startup and rebuild stability have not passed the gate.

Normal `dependencies optimized` and `program reload` messages are not failures.
`GET /favicon.ico` and the manually requested misspelled `/api/piong` are also
irrelevant route-not-found logs.

A broad `optimizeDeps.include` workaround was briefly investigated and then
removed. It was brittle, pulled transitive Drizzle implementation details into
Web configuration, and did not establish the correct ownership boundary.

The resolution is an SSR-only, post-enforced Vite `configEnvironment` hook that
sets `optimizeDeps.noDiscovery` to `true`. Alchemy's injected
`@distilled.cloud/cloudflare-rolldown-plugin` sets this value to `false` after
ordinary user environment configuration, so a post hook is required. The
server dependencies in this application are native ESM and do not require
prebundling. Disabling runtime discovery prevents dependency waves from
changing optimized module identities and reloading workerd during an in-flight
request; production builds are unaffected.

This was validated from an empty Web Vite cache without restarting the Alchemy
stack. The first ready Home request returned a complete status-200 SSR document,
subsequent Home requests remained healthy, unknown and invalid-unsubscribe
routes returned 404, and a source-triggered program reload returned Home with
status 200. No SSR dependency optimization or missing-chunk messages occurred
after the fix. Uncached native-ESM Home transforms took about five to eight
seconds; subsequent requests completed in milliseconds.

The dependency upgrade path was tested on 2026-08-15. The newest release that
retains the repository's Drizzle RC4 contract, `alchemy@2.0.0-beta.70`, was
tested with its required Effect `beta.102` packages and `vite@8.2.1`, without
the hook and from an empty cache. Its newer Cloudflare runtime sets
`optimizeDeps.ignoreOutdatedRequests` to `true`, but the first request still ran
through successive Solid, Effect, and Drizzle optimization waves before failing
with the same split Solid router context and status 500. Alchemy `beta.71` and
`beta.72` require Effect `beta.105` and Drizzle RC5; that combination also
removes APIs used throughout the current application and is a separate runtime
migration, not a narrow SSR fix. The repository therefore remains on
`alchemy@2.0.0-beta.63` and the verified hook.

### What remains

1. Complete the browser runbook: responsive screenshots, league switching,
   selection capacity, validation/focus order, signup edit and retained-error
   flows, both 15-second timeouts, valid unsubscribe success, invalid
   unsubscribe, client navigation, and browser back/forward behavior.
2. Inspect browser console and network activity for hydration warnings, dead
   interactions, duplicate subject requests, missing metadata/CSS, and asset
   routing behavior.
3. Supply the exact generated production Web `workers.dev` origin as
   `PUBLIC_WEB_URL_BASE`, deploy only after the local gate passes, and repeat
   the smoke runbook against production. Production has not been deployed from
   this branch.

## Decision

Replace Astro in `packages/web` with Solid 2 RC using the built-in Start mode
from `@solidjs/vite-plugin`. Use Solid Router 2 with an explicit typed route
table. Do not use TanStack Start, SolidStart, `filesystem-routing`, Solid server
functions, or server components.

The migration will first attempt mixed rendering:

- `/` is prerendered as true static HTML using the catalog available during
  deployment.
- `/unsubscribe/:token` remains request-time SSR.
- Unknown and invalid unsubscribe URLs return the appropriate HTTP 404 status.

Solid does not document route-level prerendering in Start mode. Mixed rendering
is therefore conditional on a small Vite-integrated prerender and Alchemy asset
routing working without unsupported output rewriting. If that proof fails, the
accepted fallback is all-SSR. All-SSR matches the current Astro request-time
rendering behavior and does not block the Solid migration on an optimization.

The Web application remains a client of the separate public API Worker. This
migration does not move API endpoints into Web.

## Why this direction

Solid 2 Start mode is the selected destination rather than one option in an
open framework comparison. It provides the Vite development, entry generation,
SSR, hydration, and Fetch handler seams this small application needs without
adding TanStack Start's metaframework layer.

The choice is gated because Solid 2 and the relevant Alchemy release line are
prerelease software, and Alchemy does not currently list Solid 2 built-in Start
mode as a verified framework integration. Failure of a gate below means fixing
or narrowly upgrading the integration where practical, then falling back to
all-SSR, and finally retaining Astro if Start mode is technically infeasible.

## Product compatibility contract

Preserve:

- The visible design, global CSS, responsive behavior, and current URLs.
- The home signup and unsubscribe user journeys.
- Validation, selected-team capacity, form states, error messages, success and
  edit flows, and retained inputs after a failed request.
- Keyboard behavior, established semantic HTML, live-region behavior, and
  focus movement to the first invalid control and success headings.
- `/unsubscribe/:token` token decoding, not-found UI, and HTTP 404 behavior.
- The existing public API contracts and separate API Worker topology.

Do not require:

- Byte-identical HTML or an Astro-shaped component tree.
- Preservation of imperative DOM scripts or Astro's no-hydration mechanics.
- TanStack routing, data-loading, or generated-route conventions from PR #84.
- An exhaustive WCAG audit during this early migration.

The accessibility goal is good behavior by default where established patterns
are clear: semantic controls, labels, keyboard support, persistent live
regions, and predictable focus. Subjective or extensive compliance work is a
separate effort.

## Current baseline

- `packages/web` is an Astro 6 application using `@astrojs/cloudflare`.
- `/` and `/unsubscribe/[token]` both set `prerender = false` and render at
  request time.
- Home SSR loads subjects from the public API and renders an unavailable state
  when that request fails.
- Signup and unsubscribe are browser calls to the public API.
- Alchemy manages the API and notification Workers but not Web.
- API CORS permits one origin obtained from `WebConfig`.
- The repository pins `alchemy@2.0.0-beta.63`.

## Solid 2 RC position

Verified against the 2026-08-15 package and documentation state:

- `solid-js@2.0.0-rc.0` is the first Solid 2 release candidate. The Solid team
  describes the public API as frozen while still expecting bugs before stable.
- `@solidjs/web@2.0.0-rc.0` is a separate direct dependency.
- `@solidjs/vite-plugin@3.0.0-next.28` supports Solid 2 RC and Vite 6, 7, or 8.
- `@solidjs/router@2.0.0-next.16` peers on Solid 2 RC. The earlier claim that
  this release still declared Solid 1 peer metadata was incorrect.
- The Vite plugin README and the newer Solid documentation do not use entirely
  consistent maturity language for client Start mode. Treat Start mode as a
  new RC integration even though the Solid release describes it as the forward
  replacement for SolidStart.
- SolidStart 2 is a separate Solid 1 product. It is not the mechanism selected
  here.

Pin the exact Solid prerelease package versions during this migration. Do not
adopt experimental server components or add server functions without a product
need.

## Start mode contract

- `solid({ start: true })` creates a client-rendered application, owns generated
  entries, and emits a static document shell plus browser assets in
  `dist/client`.
- `solid({ start: true, ssr: true })` adds streaming SSR and emits
  `dist/client` plus `dist/server/server.js`.
- The generated server module exports `handleRequest(Request)` and a default
  Fetchable object with `fetch`.
- A deployment adapter must serve client assets before unmatched requests reach
  the Fetch handler and must preserve status, headers, cookies, and streaming
  response bodies.
- Start mode does not select a router or provide Astro-style route prerender
  flags.
- Server functions are optional and remain disabled for this application.

## Routing

Use `@solidjs/router` with an explicit literal route table built with
`defineRoutes`/`createRouter`. Use the inferred `Router.paths` values for
internal anchors and programmatic navigation.

This choice remains type-safe without generated route files. Solid's separate
`filesystem-routing` package can generate a file manifest and preserve typed
paths through a generated declaration, but that adds a new Vite plugin,
generated artifact, and route-emission adapter for only two route shapes. It
does not provide useful capability for the current application.

The route table must include a catch-all not-found route and preserve HTTP
status metadata during SSR. Direct navigation, client navigation, back/forward
navigation, hash links, and invalid unsubscribe tokens are part of the smoke
runbook.

## Rendering and data

### Preferred mixed build

The home subject catalog changes only as part of deployment, so loading it
during a home-page prerender is acceptable. Deployment must order:

1. Database migration and catalog seed.
2. API availability with the updated catalog.
3. Web prerender/build.
4. Web publication.

A failed build-time subject request fails the Web deployment. Do not publish a
new static home page with a transient unavailable catalog; leave the prior
healthy deployment in place.

The proof must establish that:

- Prerendering runs inside the Vite/Alchemy build lifecycle.
- The rendered home document becomes the `/` static asset recognized by
  Alchemy.
- Asset-first routing serves `/` and hashed browser assets without invoking the
  Worker.
- `/unsubscribe/:token` and unknown paths reach the SSR Worker.
- SSR responses preserve 404 statuses and hydrate without warnings or duplicate
  initial data requests.

### Accepted fallback

If any mixed-build condition requires unreliable deploy ordering, unsupported
output mutation, or custom asset behavior that conflicts with Alchemy, use
all-SSR. In all-SSR mode, retain graceful subject-load degradation and log the
failure with its error context before rendering the unavailable state.

## Alchemy and Cloudflare

### Known compatibility

- Solid's documented Cloudflare recipe uses `@cloudflare/vite-plugin`, adopts
  Vite environment `ssr`, points at Solid's generated virtual handler, and
  serves `dist/client` as assets.
- `Cloudflare.Website.Vite` injects Alchemy's Cloudflare runtime plugin, invokes
  the Vite builder, deploys the client environment as assets, and uses `ssr` as
  the default server entry environment.
- Alchemy is incompatible with also configuring the official Cloudflare Vite
  plugin. Do not copy Solid's documented recipe unchanged.
- Alchemy's default asset-first routing matches Solid's host contract. Do not
  copy the older SolidStart example's worker-first setting without a reproduced
  need.

These contracts are architecturally compatible, but Alchemy has no documented
Solid 2 Start-mode fixture. Exact support remains a proof obligation.

### Migration scope

Add Web to `alchemy.run.ts` with `Cloudflare.Website.Vite` and an explicit
`rootDir` for `packages/web`. Test the repository's pinned Alchemy beta first.
Upgrade Alchemy only if a reproduced beta.63 incompatibility is fixed by a
newer beta, and keep that upgrade narrowly justified.

`alchemy dev` is the provider-level integration proof. There is no staging
deployment. After all local gates pass, deploy production directly to the
generated `workers.dev` endpoint and run the production smoke checklist.

The `dotheyplay.today` custom domain is not part of this migration because its
DNS zone has not moved to Cloudflare.

### Temporary URL bridge

The complete service-URL model documented in `docs/alchemy-service-urls.md`
remains a separate fast-follow PR. This migration may add only the Vite-specific
bridge needed to make the current split API URL configuration work:

- Local development uses fixed localhost API host/port values.
- Deployment passes `apiWorker.url` directly to a `VITE_`-prefixed Web build
  input. Passing the Output directly preserves the API-to-Web dependency and
  lets Alchemy resolve it before Vite builds.
- Do not use `Stack.useSync` to read a resource Output. It is for deriving
  module-scope props from stack context and would not replace the tracked
  resource dependency.
- The bridge may adapt the build value into the current
  `PUBLIC_API_URL_BASE`/optional-port shape inside Web, but must not perform the
  wider shared-config migration.

API CORS must continue to permit one explicit origin. For the production
rollout, supply the exact generated Web `workers.dev` origin as temporary
deployment configuration. Do not use wildcard CORS and do not add a same-origin
API proxy. The follow-up URL PR will replace this temporary input with one
authoritative complete Web URL.

## Functional deviations from PR #84

PR #84 (`38f9e22`) is a useful manual reference, not a commit to apply. It is
based on the pre-#83 repository and is not cleanly mergeable with current main.

Reuse or re-create where still appropriate:

- Solid TSX markup and reactive form-state translation.
- The unchanged global CSS and established class structure.
- Runtime-neutral API, time, and catalog helpers.
- The server/browser configuration-boundary lesson.
- The fix for passing header action data rather than caller-created JSX that
  produced mismatched hydration keys in the Solid 1 port.

Deliberate differences from PR #84:

- Solid 2 RC and built-in Start mode replace Solid 1 and TanStack Start.
- Explicit Solid Router routes replace TanStack file routes and its generated
  route tree.
- Mixed home SSG plus unsubscribe SSR is attempted; PR #84 used all-SSR.
- The Alchemy Web resource is in scope; PR #84 deferred it.
- A build-time catalog failure fails a mixed-render deployment.
- Checked-in automated browser tests are deferred as a fast-follow.

Apply PR review findings according to the selected architecture:

- Use Solid Router's typed paths for internal navigation. Solid Router 2
  intercepts same-origin anchors, so no TanStack-specific internal/external
  link component is required.
- Use persistent, separate alert and status regions where messages have
  different semantics. Do not dynamically change an existing element's role.
- Apply a 15-second deadline to both signup and unsubscribe requests, not only
  signup. On timeout, preserve user input, re-enable the button, and show the
  existing generic retry message.
- In all-SSR mode, log a degraded subject load before returning the existing
  empty fallback. In preferred SSG mode, fail the build instead.

## Acceptance gates

The migration is technically feasible only when all applicable gates pass:

### Repository

- Exact RC dependencies install without peer overrides.
- `pnpm lint`, `pnpm typecheck`, and the repository build pass.
- The client output contains no server-only modules, filesystem/dotenv code,
  database credentials, or other secrets.

### Vite and Solid

- Development and production builds start through the package scripts.
- SSR output exports the expected Fetch handler and preserves streamed bodies,
  headers, and statuses.
- Production output hydrates without warnings or dead interactions.
- Static assets, metadata, and global CSS load from direct and client
  navigations.

### Alchemy dev

- Alchemy's plugin adopts Solid's `client` and `ssr` environments without the
  official Cloudflare Vite plugin.
- Asset-first routing, the generated Fetchable, bindings, HMR, and rebuilds
  work under `alchemy dev`.
- The API URL is correct in both server and browser bundles.
- Home, unsubscribe, unknown paths, API mutations, CORS, and 404 statuses work.
- Mixed rendering passes every proof above or is replaced by all-SSR.

### UX and rollout

- Desktop and mobile screenshots match the current visual design.
- The manual runbook covers league switching, team selection/capacity,
  validation, focus behavior, signup success/edit, unsubscribe success,
  timeout recovery, direct navigation, client navigation, and not-found pages.
- Production deploys to its generated `workers.dev` URL only after local gates
  pass, then receives the same smoke runbook.
- Rollback is redeploying the last known-good Astro revision if production
  behavior fails.

## Testing decision

This migration includes repository checks, build inspection, `alchemy dev`
proof, desktop/mobile screenshots, a repeatable manual E2E runbook, and final
production smoke testing. It does not add a checked-in browser automation suite.

A fast-follow should add automated critical-flow and screenshot tests against
production output and `alchemy dev`.

## Implementation checklist

1. Pin Solid 2 RC, Solid Web, Solid Router 2, the Solid Vite plugin, and a
   compatible Vite release.
2. Replace Astro configuration and package scripts with Start-mode Vite
   configuration.
3. Port the layout, home, signup, ticker, unsubscribe, and not-found UI to
   Solid while preserving CSS and the compatibility contract.
4. Add the explicit typed route table, head metadata, SSR 404 handling, and
   route-aware navigation.
5. Add shared 15-second mutation timeout behavior and straightforward
   accessibility fixes.
6. Implement and inspect the mixed-render proof; select all-SSR if any gate
   fails.
7. Add the Alchemy Vite resource, temporary API URL build bridge, explicit CORS
   origin, and required deployment ordering.
8. Run repository checks, build audits, `alchemy dev`, screenshots, and the
   manual runbook.
9. Update current architecture and service-URL documentation to describe the
   implemented result and remaining fast-follow work.
10. Deploy to the generated production `workers.dev` URL and run the production
    smoke checklist.

## Sources

- [Solid 2.0 RC release](https://github.com/solidjs/solid/releases/tag/v2.0.0-rc.0)
- [Solid 2 Start options](https://v2.solidjs.com/reference/vite-plugin-solid/start)
- [Solid 2 deployment guide](https://v2.solidjs.com/building-apps/deployment)
- [Solid Router](https://v2.solidjs.com/routing/solid-router)
- [Solid Router route definitions](https://v2.solidjs.com/routing/solid-router/route-definitions)
- [Solid Router navigation and typed paths](https://v2.solidjs.com/routing/solid-router/navigation)
- [`filesystem-routing`](https://github.com/solidjs/filesystem-routing)
- [Alchemy Vite frontend resource](https://alchemy.run/providers/cloudflare/website/vite/)
- [Alchemy inputs and outputs](https://alchemy.run/infrastructure-as-code/outputs)
- [PR #84](https://github.com/jackbisceglia/dotheyplaytoday/pull/84)
- npm registry metadata for the exact Solid, router, Vite, and Alchemy versions
