---
id: "12"
title: Public signup server MVP
description: Implement the minimal user and subscription domain flows plus public api handlers for email-based signup overwrite behavior
status: TODO
priority: P0
prereqs:
  - 01-domain-models-and-schemas.md
  - 02-json-data-access.md
  - 11-web-and-api-scaffold.md
---

**Acceptance:**

- [ ] Add a `Users` service in `packages/core` with `getByEmail` and `upsert` for normalized email-based lookup and create-or-update behavior.
- [ ] Expand the existing `Subscriptions` service with `getAllByUserId`, `replaceForUser`, and `removeAllByUserId` as the public preference-management surface.
- [ ] Keep `Subscription` as the preference model; do not add a separate `Preferences` entity or service for this workflow.
- [ ] Add a shared subscription policy module in core that defines the free-tier team cap and can be imported by both api and web.
- [ ] Add an explicit team catalog module in core keyed by the existing topic ids already present in `packages/core/data/kv/topics%2F...`, including stable display metadata for all 30 NBA teams.
- [ ] Update fixed schedule validation so send times are constrained to 15-minute intervals instead of the current 5-minute alignment.
- [ ] Implement `Subscriptions.replaceForUser` so the submitted topic set becomes the stored source of truth for that user: dedupe topic ids, enforce cap, preserve retained rows where possible, create new rows for new topics, and delete rows for removed topics.
- [ ] Add the minimal database helpers needed to support user upsert and full per-user subscription replacement while keeping the current job-facing database reads working.
- [ ] Add a public HttpApi contract and handler for signup submission with thin handler structure: request decode, rate limit, domain call, error mapping.
- [ ] Add a basic in-memory write rate limiter for the public endpoint using Effect-native building blocks.
- [ ] Do not add a public read-by-email endpoint in this item; resubmission is the overwrite path for v1.
- [ ] Keep the current notify job loading directly from `Database`; moving jobs to the new domain surface is explicitly out of scope for this item.

**Verify:**

- [ ] Add service tests covering user upsert, first signup, overwrite signup, cap rejection, invalid topic ids, idempotent repeat submission, and remove-all behavior.
- [ ] Add api tests or handler-level tests covering success, validation failure, and rate-limit failure paths.
- [ ] `pnpm typecheck`
- [ ] `pnpm lint`
- [ ] `pnpm format`

**Notes:**

- Keep domain naming mostly CRUD-like, but retain `replaceForUser` because the main command is a true set-replacement operation rather than ordinary row-level update.
- Internal relation operations should key on `userId`; only the boundary flow should start from email.
- Keep unsubscribe semantics delete-based for this work. If `enabled` remains in the schema for job compatibility, treat it as legacy compatibility rather than the primary user-facing control.
- Preserve `lastSentAt` when a retained subscription row survives a replace operation.
