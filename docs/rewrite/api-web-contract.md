# API And Web Contract Notes

This document captures API/web decisions for the rewrite without implying the web or API scaffolding must be redesigned.

## Rewrite Boundary

Only change the internals of `packages/api` and `packages/web` when needed for the rewrite. Existing scaffolding, package shape, and app/server surfaces do not need to change unless a core contract decision requires consumers to update.

When core public contracts change, update their consumers:

- `packages/api` implements the core Effect `HttpApi` contract.
- `packages/web` consumes the core API contract through the generated/typesafe client.

Avoid API/web churn that does not change behavior or contract consumption.

## Accepted Decisions

### Shared Contract Ownership

Shared request/response schemas live in `packages/core/src/contracts/` as the Effect `HttpApi` contract. The API package implements that contract, and the web package consumes it through the generated/typesafe client.

Do not define route-local request/response shapes in the API package unless they are private implementation details.

### Signup Success Response

`POST /api/signup` returns `{ ok: true }` on success.

V1 has no dashboard or preference readback flow, so returning saved users/subscriptions would create public API shape that the product does not need yet.

### Unsubscribe Success Response

`POST /api/unsubscribe` returns `{ ok: true }` for any well-shaped token submission, whether the token matched an active user, was already consumed, or was unknown.

Malformed request bodies or malformed token shapes may return validation errors. Valid-looking tokens must not produce public responses that reveal whether the token matched a user. Internal logs may record whether a user was deleted.

### HTTP Error Boundary

Use Effect domain/service errors internally and translate them to Effect `HttpApiError` values at the route boundary.

Endpoint contracts should declare the public error cases the web client can meaningfully handle. Pick the exact built-in or custom `HttpApi` error schemas during implementation from the pinned Effect API. Domain errors collapse onto substantive public messages; infrastructure errors collapse to generic unexpected failures and keep operational detail in logs.

Do not expose raw domain error classes as the public HTTP contract unless a future endpoint needs a stable SDK-visible domain error shape.

### Rate Limiting

Public write endpoints require rate limiting at the API boundary. The exact policy, identity key, storage, and provider are runtime/config decisions, not part of the public API contract.

### Signup HttpApi Handler Pattern

Use a semantic endpoint name and a thin API-owned group layer:

- Core owns the signup group and public request/response schemas in `packages/core/src/contracts/signup.ts`.
- API implements `packages/api/src/routes.signup.ts`.
- The handler is a named `Effect.fn("SignupHttpApi.submit")`.
- The handler performs API concerns first, then orchestrates domain services inside one transaction.
- The route boundary maps domain/infrastructure errors to public HTTP errors chosen during implementation.

Recommended contract shape, without locking exact I/O schema or error declarations:

- The route is `POST /api/signup`.
- The client-facing operation name should read semantically rather than mechanically, for example submit signup instead of generic create/update language.
- The request carries the V1 signup inputs: email, timezone, fixed local schedule, and selected subject ids.
- The success response remains `{ ok: true }`.
- Public validation, cap, rate-limit, and unexpected-failure errors are declared in the contract at implementation time, based on the pinned Effect API and the web states being built.
- Email normalization and timezone validation happen at the API/request boundary. The route passes decoded domain values into `Users.upsertForSignup(email, timezone)`.

Recommended handler flow, without locking exact Effect syntax:

- Decode through the shared `HttpApi` contract, then normalize/validate request scalars into domain values before calling core services.
- Apply public write rate limiting before opening the database transaction.
- In one transaction, call `Users.upsertForSignup(email, timezone)`, then `Subscriptions.replaceForUser({ user, subjectIds, schedule })`.
- Return `{ ok: true }` after both writes succeed.
- Map validation/cap errors to user-fixable public failures and infrastructure failures to generic unexpected failures.
- Keep error mapping local to the route file until repetition justifies a shared helper.
- Do not expose raw service error classes as the HTTP contract.

### Signup Page States

The web contract defines required behavior states, not UI layout or final copy.

Required states:

- Initial: user can enter email, timezone, fixed send time, and selected teams.
- Client validation: show fixable errors before submit where possible.
- Submitting: prevent duplicate submit while preserving visible selections.
- Success: explain signup worked and resubmitting the same email replaces previous preferences.
- Failure: show user-fixable validation/cap messages when available, and a generic retry message for unexpected errors.

### Unsubscribe Confirmation Route

`GET /unsubscribe/:token` renders a confirmation screen for token-shaped path params without looking up the token in the database and without mutating state.

Malformed token-shaped path params return `404`.
