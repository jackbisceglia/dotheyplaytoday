# Test Amendments

Date: 2026-02-13

## Scope Reviewed

- `packages/jobs/src/notify/index.test.ts`
- `packages/core/src/tests/subscriptions.test.ts`
- `packages/core/src/tests/notification-resend-provider.test.ts`

## Current Coverage Assessment

### `packages/jobs/src/notify/index.test.ts`

What is covered well:

- successful due-send path updates `lastSentAt`
- non-due fixed schedule is skipped
- already-sent-today is skipped
- relative schedule is skipped
- dry-run checks due events but does not send/update
- `NotifierResponseError` does not stop subsequent subscriptions
- missing-user path is non-fatal in current behavior
- failure from `getDueEvents` is fatal and aborts run

Gaps:

- no explicit disabled-subscription skip case
- no explicit due-with-no-events skip case
- no explicit `NotifierRequestError` continuation case
- one test title is misleading: "aborts when a subscription references a missing user" currently asserts non-abort behavior

Risk if not addressed:

- branch behavior regressions in orchestration skip/continue logic may go uncaught

---

### `packages/core/src/tests/subscriptions.test.ts`

What is covered well:

- local-date matching logic across timezone boundary
- chronological sorting of due events
- empty result when no matches

Gaps:

- no failure-path assertion for upstream `Database.loadTopic` errors

Risk if not addressed:

- error-propagation behavior may drift silently when service wiring changes

---

### `packages/core/src/tests/notification-resend-provider.test.ts`

What is covered well:

- transient response errors are retried and can succeed
- request-layer failures are retried and can succeed
- non-transient response errors do not retry

Gaps:

- shallow assertion for mapped response errors (only `_tag`)
- no assertion that message fields map correctly to Resend payload (`from`, `to`, `subject`, `text`)
- no retry-exhaustion coverage for persistent transient response errors
- no retry-exhaustion coverage for persistent request failures

Risk if not addressed:

- retry policy or field-mapping regressions may pass tests while breaking runtime behavior

## Recommended Amendments (Priority)

1. Add missing orchestration branch tests in `packages/jobs/src/notify/index.test.ts`.
2. Rename the missing-user test title to match current non-fatal behavior.
3. Strengthen Resend provider mapping assertions and add retry-exhaustion tests.
4. Add `Database.loadTopic` failure propagation test in `packages/core/src/tests/subscriptions.test.ts`.

## Questions To Confirm Before Implementing Test Changes

1. Missing user in notify flow: should it remain skip-and-continue (current behavior), or be fatal?
2. Disabled subscriptions: should they be silently skipped or always logged as an explicit skip event?
3. For Resend retry exhaustion, should tests assert only attempt count + final tag, or also assert exact mapped error fields on final failure?

## Suggested Execution Plan For Next Session

1. Confirm answers to the three questions above.
2. Update tests only (no production code changes unless a behavior decision changes).
3. Run: `pnpm typecheck`, `pnpm lint`, `pnpm test`.
4. Commit test amendments separately from non-test changes.
