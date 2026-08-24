# Evaluate the Resend test seam

## Type

Testing architecture investigation

## Context

Two suites replace the complete `resend` module with `vi.mock`:

- `packages/core/src/modules/notifier/__tests__/email.test.ts:16`
- `packages/core/src/modules/email/__tests__/resend.test.ts:28`

The rendering suite then asserts mock call tuples at lines 70 and 128. These
tests pass and exercise useful behavior, but global module replacement makes the
test contract less explicit and causes call arguments to lose their vendor
types.

The application already uses Effect service layers for the notifier and email
boundaries. Investigate whether the remaining direct Resend SDK
construction needs a smaller injectable seam.

## Investigation

- Determine whether injecting SDK construction or the narrow `emails.send`
  capability simplifies these tests.
- Preserve a test of the real adapter's request and response mapping.
- Compare the added production abstraction against the current module mock's
  cost and reliability.
- Avoid introducing an interface that merely duplicates the complete vendor
  SDK.

## Acceptance Criteria

- The investigation records whether to retain module mocking or introduce a
  narrower seam, with rationale.
- If a seam is introduced, tests use typed fakes without tuple assertions.
- Provider error mapping, retries, request payloads, and render integration
  remain covered.
- The resulting design remains compatible with Effect layer composition.

## Non-Goals

- Replacing Vitest.
- Mocking production behavior less faithfully just to satisfy a lint rule.
- Adding a broad wrapper around the entire Resend package.
