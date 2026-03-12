---
id: "12"
title: Public signup server MVP
description: Implement the minimal user and subscription domain flows plus public api handlers for email-based signup overwrite behavior
status: DONE
priority: P0
prereqs:
  - 01-domain-models-and-schemas.md
  - 02-json-data-access.md
  - 11-web-and-api-scaffold.md
---

**Acceptance:**

- [x] Add a `Users` service in `packages/core` with `getByEmail` and `upsert` for normalized email-based lookup and create-or-update behavior.
- [x] Add a `Subscriptions` service with `getAllByUserId`, `replaceForUser`, and `removeAllByUserId` as the public preference-management surface, while keeping notify-job scheduling logic outside that write-side service.
- [x] Keep `Subscription` as the preference model; do not add a separate `Preferences` entity for this workflow.
- [x] Add a shared subscription policy module in core that defines the free-tier team cap and can be imported by both api and web.
- [x] Add an explicit team catalog module in the web package keyed by the existing topic ids already present in `packages/core/data/kv/topics%2F...`, including stable display metadata for all 30 NBA teams.
- [x] Update fixed schedule validation so send times are constrained to 15-minute intervals instead of the current 5-minute alignment.
- [x] Implement `Subscriptions.replaceForUser` so the submitted topic set becomes the stored source of truth for that user: dedupe topic ids, enforce cap, preserve retained rows where possible, create new rows for new topics, and delete rows for removed topics.
- [x] Add the minimal database helpers needed to support user upsert and full per-user subscription replacement while keeping the current job-facing database reads working.
- [x] Add a public HttpApi contract and handler for signup submission with thin handler structure: request decode, rate limit, domain call, error mapping.
- [x] Add a basic in-memory write rate limiter for the public endpoint using Effect-native building blocks.
- [x] Do not add a public read-by-email endpoint in this item; resubmission is the overwrite path for v1.
- [x] Keep the current notify job loading directly from `Database`; moving jobs to the new domain surface is explicitly out of scope for this item.

**Verify:**

- [x] Add service tests covering user upsert, first signup, overwrite signup, cap rejection, invalid topic ids, idempotent repeat submission, and remove-all behavior.
- [x] Add api tests or handler-level tests covering success, validation failure, and rate-limit failure paths.
- [x] `pnpm typecheck`
- [x] `pnpm lint`
- [x] `pnpm format`

**Notes:**

- Keep domain naming mostly CRUD-like, but retain `replaceForUser` because the main command is a true set-replacement operation rather than ordinary row-level update.
- Internal relation operations should key on `userId`; only the boundary flow should start from email.
- Keep unsubscribe semantics delete-based for this work. If `enabled` remains in the schema for job compatibility, treat it as legacy compatibility rather than the primary user-facing control.
- Preserve `lastSentAt` when a retained subscription row survives a replace operation.
- Keep backend KVS selection policy and backend runtime env parsing in core, while leaving package-specific override precedence local.
- Keep signup orchestration in `packages/api`, but extract it out of the HttpApi group handler so the route stays thin.
