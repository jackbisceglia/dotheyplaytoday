---
id: "09"
title: Channel-first notifier architecture
description: Introduce channel-specific notifier services (email and sms) with swappable transport providers and runtime channel routing
status: TODO
priority: P1
prereqs:
  - 04-notification-service.md
  - 05-notify-command.md
---

**Acceptance:**

- [ ] Add a channel-aware notification model so delivery can target `email` or `sms` without leaking provider-specific fields into top-level orchestration.
- [ ] Remove `NotifierContext` indirection and expose a single public `Notifier` contract with one `send(...)` entrypoint (implemented by a live routing layer).
- [ ] Implement an email notifier module under `packages/core/src/modules/notifier/providers/email/index.ts` that exports a `Layer<Notifier, ...>` implementation.
- [ ] Implement an sms notifier module under `packages/core/src/modules/notifier/providers/sms/index.ts` that exports a `Layer<Notifier, ...>` implementation.
- [ ] Keep one top-level `Notifier` contract; caller wiring (for example jobs) selects which notifier layer to provide for a run.
- [ ] Add a small typed selection utility (for example a record map from `"email" | "sms"` to layer factories) to keep provider selection simple and explicit.
- [ ] Introduce transport contracts (`EmailTransport`, `SmsTransport`) so concrete providers are swappable via Layer wiring only.
- [ ] Move or reshape the current Resend implementation under `packages/core/src/modules/notifier/providers/email/resend/` to implement the email transport contract.
- [ ] Email formatting (subject/text/html) is owned by email-channel code, not by top-level orchestration and not by transport client internals.
- [ ] Missing or unsupported channel selection is handled with typed errors (for example `NotifierChannelUnavailable`) rather than defects.
- [ ] Default runtime wiring preserves current behavior for existing email users and requires no breaking data migration.
- [ ] Tests cover layer selection behavior, missing-channel failures, and provider payload mapping.

**Verify:**

- [ ] `pnpm test -- packages/core/src/tests/notification-service.test.ts`
- [ ] `pnpm test -- packages/core/src/tests/notification-resend-provider.test.ts`
- [ ] Add and run tests for notifier layer selection (`email` vs `sms`) and missing-channel errors.
- [ ] `pnpm @jobs start:notify -- --dry-run` works with email-only channel wiring.
- [ ] `pnpm typecheck`
- [ ] `pnpm lint`
- [ ] `pnpm format`

**Notes:**

- Target module layout:
- `packages/core/src/modules/notifier/service.ts` remains orchestration entrypoint.
- Prefer a single top-level notifier contract (no separate provider context tag); select provider at composition time in the caller.
- `packages/core/src/modules/notifier/providers/email/index.ts` defines an email-backed `Notifier` layer.
- `packages/core/src/modules/notifier/providers/email/resend/{client,config,service}.ts` implements email transport.
- `packages/core/src/modules/notifier/providers/sms/index.ts` defines an sms-backed `Notifier` layer.
- `packages/core/src/modules/notifier/providers/sms/imessage/{client,config,service}.ts` is the initial sms transport target.
- If we later support mixed channels within one process run (per-user routing), prefer caller-level fan-out (or a small shared helper) over per-invocation layer re-provisioning; a dedicated router layer is optional and can be a follow-up.
- Scope for this item is architecture and interface separation; full sms transport delivery can be a follow-up as long as contracts and routing seams are in place.
- Keep backward compatibility: when no explicit channel preference exists, default behavior remains email delivery.
- Effect pattern alignment references:
- Swappable protocol layers: `reference/effect/packages/rpc/src/RpcClient.ts`.
- Runtime protocol routing by config: `reference/effect/packages/rpc/src/RpcServer.ts`.
- Shared service tag with backend substitution: `reference/effect/packages/sql-sqlite-node/src/SqliteClient.ts`, `reference/effect/packages/sql-d1/src/D1Client.ts`, `reference/effect/packages/sql-libsql/src/LibsqlClient.ts`.
