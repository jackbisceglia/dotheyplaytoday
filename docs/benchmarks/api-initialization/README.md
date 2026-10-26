# API initialization CPU

Measured locally on 2026-10-26 against fresh main `c342341c`, Node 24.18.0,
workerd 2026-09-01, compatibility date `2026-06-02`, and `nodejs_compat`.
The change removes repeated router/endpoint construction, not database work or
client polling. No production requests, deployment, emails, or infrastructure
provisioning were used for these measurements.

## Lifecycle findings

The pinned implementations, rather than assumptions about older versions, drive
the design:

- Effect **4.0.0-rc.117**, `HttpRouter.toHttpEffect`, builds its application layer
  and router every time it is evaluated. `HttpApiBuilder.group` captures its
  build context, omitting `Scope`, and supplies that context to endpoint effects.
  Moving the old build into a first-request cache without controlling its input
  context would retain that request's services.
- Alchemy **2.0.0-beta.78**, `Workers/WorkerBridge`, shares one initialization
  build per entrypoint, supplies a fresh event scope and live execution context,
  and closes the event scope through `waitUntil` (except transferred streams).
  Init supplies a deferred execution context whose `.raw` getter cannot be used.
- Alchemy `Drizzle/Postgres` and `Runtime/ExecutionMemo` already defer connection
  acquisition until a query. Their memo and finalizer use the same execution
  `Scope`; a shared domain service therefore does not imply a shared connection.
  The pinned `@effect/sql-pg` uses its **native wire-protocol pool**, while auth
  uses Promise-native **pg 8.22.0**. They are separate database paths.
- Better Auth **1.7.2**, `auth/base`, eagerly creates endpoints and an async auth
  context. Its HTTP `handler` still constructs its internal router per call;
  this change does not replace that library behavior. The internal adapter uses
  Better Auth's async transaction context. Drizzle adapter **1.7.2** delegates
  `transaction`, `consumeOne`, and `incrementOne` to PostgreSQL transactions.
- Drizzle **1.0.0-rc.5-ab785fc** retains the same schemas, SQL generation, and
  transaction APIs. The new dispatch adapter forwards the complete required
  Better Auth adapter surface; it does not reimplement SQL or transactions.

`makeApiFetch` allocates a lazy compilation memo during Worker initialization.
Compilation uses that initialization context, with `WorkerExecutionContext`
removed, so request handlers resolve the live context. Memo evaluation is
uninterruptible: an aborted cold caller cannot cache an interrupted build and
break subsequent requests. No socket is acquired
when that short compilation scope closes. The reusable auth client holds only
configuration and an async-context dispatcher. `auth.use` obtains the current
execution's pool/adapter/email callback, enters its async context, and waits for
Promise-native auth work before allowing interruption cleanup. Every request
still owns and closes its resources; nothing caches sessions or HTTP responses.

The user-supplied telemetry (about 1,270 requests and 171 exceeded-CPU errors in
24 hours, CPU median 18.5 ms/P90 44.3 ms, failures predating October 26) motivates
this work. The eager setup is present in the checked-out source. We did not
access the laptop dashboard or map its Worker version UUID to a deployed Git
commit, and these experiments do not establish the cause of every failure or a
new regression. HomeOS behavior is unchanged.

## Reproduce

From this checkout, after installing the lockfile and building core:

```sh
pnpm install --frozen-lockfile
pnpm @core build
node scripts/api-benchmark/build.mjs c342341c
node scripts/api-benchmark/node.mjs before
node scripts/api-benchmark/node.mjs after
node scripts/api-benchmark/workerd.mjs before
node scripts/api-benchmark/workerd.mjs after
node scripts/api-benchmark/cold.mjs
```

Run sequentially on an otherwise quiet machine. The default output directory
is ignored `.api-benchmark/`. `build.mjs` reads the baseline auth and Worker
composition with `git show`; it does not modify another checkout or its dist.
Both variants use the same harness, inputs, dependencies, and driver substitutes.
The workerd runner uses the already installed Linux binary, localhost ports
8799/9231, and `/proc`; it stops its child on completion. It neither invokes
Alchemy provisioning nor contacts Cloudflare. Optional runner arguments are
variant, output directory, and warm sample count (default 300).

The harness includes Alchemy's installed `makeRequestEffect` HTTP adaptation,
Effect scopes, actual API handlers/domain services, Better Auth, cookie HMAC
verification, and Drizzle SQL generation. Only the two SQL drivers are replaced:
Promise pg returns fixed rows, and native Effect PostgreSQL uses the repository's
controlled SQL-connection fixture. Unexpected SQL fails. The authenticated user
has no subscriptions; `/api/user/events` returns `[]`, so this does **not** measure
large schedule decoding/serialization. Emails are not invoked. Each request
asserts status, and authenticated session requests assert a non-null session.
Fixture IPs rotate every 20 calls so the measurement does not become a 429 test.

These are mocked-persistence measurements, not a real Hyperdrive/PostgreSQL path.
The separate auth regression suite uses real in-memory PGlite persistence for
OTP, magic-link, session, and transaction behavior. No persistent dev database
was provisioned. Workerd runs the actual API fetch composition and HTTP adapter,
but excludes the generated Alchemy entrypoint's full telemetry/dispatch wrapper.

## Warm results

Each case gets a new handler, one first request, 50 warmup requests, then 300
measured requests. Modules/JIT remain warm across cases in the warm run. Node
CPU is `process.cpuUsage()` user + system, measured per request; wall time uses
`performance.now()`. Workerd CPU is its process user + system CPU from `/proc`,
with 10 ms tick resolution, divided by the batch's request count. It includes
runtime/HTTP/inspector overhead and **is not Cloudflare's billed per-request CPU**.
Workerd wall time includes the localhost HTTP round trip and response body.

| Route            | Session | Node median CPU ms before → after | Workerd mean process CPU ms before → after | Workerd median wall ms before → after |
| ---------------- | ------- | --------------------------------: | -----------------------------------------: | ------------------------------------: |
| ping             | absent  |                     1.261 → 0.220 |                              2.133 → 0.533 |                         2.654 → 1.661 |
| ping             | present |                     0.852 → 0.131 |                              1.933 → 0.433 |                         2.430 → 1.553 |
| auth/get-session | absent  |                     1.228 → 0.941 |                              2.733 → 1.433 |                         2.848 → 2.180 |
| auth/get-session | present |                     1.514 → 0.884 |                              2.967 → 1.767 |                         3.086 → 2.235 |
| user             | absent  |                     0.888 → 0.316 |                              2.333 → 0.667 |                         2.477 → 1.726 |
| user             | present |                     1.393 → 0.761 |                              2.433 → 1.333 |                         2.913 → 2.221 |
| user/events      | absent  |                     0.878 → 0.271 |                              2.733 → 0.700 |                         2.547 → 1.776 |
| user/events      | present |                     1.514 → 0.872 |                              2.633 → 1.700 |                         3.062 → 2.271 |

All route paths have the `/api/` prefix. Pool counters fall from 300 to zero for
300 ping requests. Protected requests retain one auth pool per request; the
nonempty-session user/events cases also retain one application SQL resource per
request. Open/close counts match, and SQL counts are unchanged between variants.
Unauthenticated auth/session reads still create a lazy pg pool object, but do not
open a socket or query. Avoiding that remaining allocation was not necessary to
remove the dominant repeated initialization.

Raw results: [Node before](node-before.json), [Node after](node-after.json),
[workerd before](workerd-before.json), [workerd after](workerd-after.json).
They include CPU/wall distributions, initialization/first-request costs,
responses, and resource/query counters.

## Cold behavior and profiles

[Cold results](cold.json) restart the Node or workerd process for **each** route
and session state. These are single samples, not percentiles. Handler
initialization is separate from the first fetch. Node module-import CPU/wall is
also recorded separately; workerd's module-load CPU is not measured. Workerd
initialization wall includes the fixture cookie preparation and HTTP round trip.

Cold authenticated user/events first-request CPU in Node was **48.45 → 48.14 ms**;
workerd first-request wall was **40.70 → 39.78 ms**. Cold unauthenticated ping
Node CPU was **22.69 → 20.32 ms**, and workerd wall was **17.78 → 15.04 ms**.
Thus this is chiefly a warm-request improvement: first use still pays for
compilation, auth initialization, and lazy application database setup. Node
module import itself was approximately 182–191 ms wall in the warm-run processes
and is excluded from request measurements.

The workerd inspector recorded actual V8 CPU profiles at a 1 ms requested
sampling interval during initialization and all warm cases. Compressed artifacts:
[before](workerd-before.cpuprofile.gz), [after](workerd-after.cpuprofile.gz).
Decompress with `gzip -dk` and load the `.cpuprofile` in DevTools. Profiles include
idle time between incoming requests; sample counts and summed sample intervals
must not be interpreted as precise request CPU. Aggregate top-function counts
are included in the JSON. GC samples fell from 272 to 78 in these equal-request
runs. Better Auth's `createInternalContext` remains visible (70 vs 100 samples),
consistent with its retained per-HTTP-call work. We did not bypass that handler
or change normal HTTP semantics merely to improve a benchmark.

The 300-request local batches have no confidence intervals and are sensitive to
JIT, GC, host scheduling, and the attached inspector. They demonstrate avoidable
setup and its removal, not production Free-tier compliance or an explanation of
all supplied telemetry. Rollout still needs ordinary authorized deployment and
passive production observation of CPU/errors, including cold starts and real
authenticated/database traffic. This PR does not deploy or authorize load tests.

## Validation

Final checks ran sequentially in this isolated worktree:

- `pnpm @core build`, `pnpm @api build`, `pnpm @data build`, `pnpm @jobs build`: passed. The fresh checkout needs these dist outputs before workspace typechecking because an infrastructure test imports the stack. No other worktree's output was used or changed.
- `pnpm lint`: passed across all packages.
- `pnpm typecheck`: passed across all packages (Effect suggestions remain informational).
- `pnpm exec vitest run packages/api/src`: 55 passed, including PGlite auth behavior, concurrent resource ownership, failure/interruption cleanup, and request-specific email registration. The final full run also includes cold-caller cancellation, init-config isolation, HEAD, preflight, and 404 assertions.
- `pnpm test`: 367 passed, 3 skipped; 62 files passed, 2 skipped. Existing opt-in infrastructure/PostgreSQL tests remain disabled (`RUN_INFRA_TESTS` and `UFC_TEST_DATABASE_URL` were not supplied).
- The Node/workerd before/after and fresh-process cold commands above completed with expected HTTP statuses, unchanged SQL counts, and matching pool acquire/release counts.
