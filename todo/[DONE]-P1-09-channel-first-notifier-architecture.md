---
id: "09"
title: Channel-first notifier architecture
description: Introduce channel-specific notifier services with an email provider seam and explicit caller-side wiring
status: DONE
priority: P1
prereqs:
  - 04-notification-service.md
  - 05-notify-command.md
---

**Acceptance:**

- [x] Keep a single top-level `Notifier` contract in `packages/core/src/modules/notifier/index.ts` with one `send(...)` entrypoint.
- [x] Remove `NotifierContext` indirection and move channel-specific behavior behind explicit notifier layers.
- [x] Implement `NotifierLayerEmail` under `packages/core/src/modules/notifier/email/index.ts`.
- [x] Implement `EmailProvider` under `packages/core/src/modules/notifier/email/providers.ts` so concrete email vendors stay swappable via Layer wiring.
- [x] Reshape the Resend implementation under `packages/core/src/modules/notifier/email/resend/{client,config,index}.ts` as `EmailProviderLayerResend`.
- [x] Keep email formatting owned by the email channel layer, not top-level orchestration and not the Resend provider layer.
- [x] Implement `NotifierLayerSms` under `packages/core/src/modules/notifier/sms/index.ts` as a typed unavailable layer for future expansion.
- [x] Preserve explicit caller-side wiring: `packages/jobs/src/notify/index.ts` manually provides the email notifier stack for the run and preserves current email-default behavior.
- [x] Keep provider-specific fields out of top-level orchestration; the notify job depends only on `Notifier`.
- [x] Use `NotifierChannelUnavailable` for the current SMS unavailable path.
- [x] Tests cover email rendering, SMS unavailable behavior, Resend provider payload mapping/retries, and notify-job sorting before notification.

**Verify:**

- [x] `pnpm exec vitest run packages/core/src/tests/notification-service.test.ts packages/core/src/tests/notification-resend-provider.test.ts packages/core/src/tests/notification-sms-layer.test.ts packages/jobs/src/notify/index.test.ts`
- [x] `pnpm @jobs start:notify --dry-run`
- [x] `pnpm typecheck`
- [x] `pnpm lint`
- [x] `pnpm format`

**Notes:**

- Landed module layout:
- `packages/core/src/modules/notifier/index.ts` defines the `Notifier` contract.
- `packages/core/src/modules/notifier/email/index.ts` exports `NotifierLayerEmail`.
- `packages/core/src/modules/notifier/email/providers.ts` defines `EmailProvider` and the rendered `EmailMessage` payload.
- `packages/core/src/modules/notifier/email/resend/{client,config,index}.ts` implements `EmailProviderLayerResend`.
- `packages/core/src/modules/notifier/sms/index.ts` exports `NotifierLayerSms` with a typed unavailable error for now.
- The notify job manually satisfies `Notifier` with `NotifierLayerEmail` + `EmailProviderLayerResend`; no generic layer-selection helper was kept for this iteration.
- Event sorting is now caller-owned in `packages/jobs/src/notify/index.ts`, so notifier implementations can assume sorted `NonEmptyEvents` input.
- Scope stayed focused on architecture separation and provider seams; full SMS delivery remains a follow-up.
- Existing behavior stays email-default with no schema or data migration.
- Effect pattern alignment references:
- Swappable protocol layers: `reference/effect/packages/rpc/src/RpcClient.ts`.
- Runtime protocol routing by config: `reference/effect/packages/rpc/src/RpcServer.ts`.
- Shared service tag with backend substitution: `reference/effect/packages/sql-sqlite-node/src/SqliteClient.ts`, `reference/effect/packages/sql-d1/src/D1Client.ts`, `reference/effect/packages/sql-libsql/src/LibsqlClient.ts`.
