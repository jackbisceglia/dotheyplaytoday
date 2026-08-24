# Clarify notifier and email boundaries

## Type

Architecture refactor

## Status

The first-pass structural migration was implemented on 2026-08-23. Follow-up
review kept rendering and workflow functions intact while colocating the small
delivery/hash helpers with the notifier implementations that use them.

## Context

The current `Channel` abstraction is intentionally coupled to `Notification`.
That coupling makes notification delivery simple and pluggable: the notify
worker depends on one service, while email and console layers provide different
implementations. However, the generic name `Channel` suggests that unrelated
delivery workflows, such as signup confirmations and password resets, should
also use it.

The existing concepts are close to the desired boundaries, but their names and
locations obscure their roles:

| Current                         | Intended role                            |
| ------------------------------- | ---------------------------------------- |
| `Channel`                       | Notification-specific `Notifier` service |
| `EmailChannelLayer`             | Email implementation of `Notifier`       |
| `ConsoleChannelLayer`           | Console implementation of `Notifier`     |
| `EmailChannelClient`            | Provider-neutral `Email` service         |
| `EmailChannelClientLayerResend` | Resend implementation of `Email`         |

## Direction

Use three explicit kinds of boundary:

- `Notifier` is the domain-facing plugin contract for delivering a
  `Notification`.
- `Email` and future `Sms` services are provider-neutral transport contracts.
- Transactional email files are application-specific services that own their
  input, private template, and delivery orchestration.

Do not introduce a generic `Delivery<T>` framework or a `NotifierClient`.
Effect layers already provide interchangeable `Notifier` implementations. A
second service with the same `send(Notification)` contract would only forward
calls unless notification-level fan-out, fallback, or routing is introduced.

## Target Shape

```text
packages/core/src/modules/
  notifier/
    service.ts
    email.ts
    console.ts
    notification.ts
    schema.ts
    errors.ts

  email/
    service.ts
    errors.ts
    resend.ts
    config.ts
    render.ts
    transactional/
      confirmation.ts
```

Delivery metadata helpers live beside their notifier implementations. The
shared deterministic delivery-hash helper lives on `Notifier`; it is part of
notification delivery identity rather than the provider-neutral `Email`
transport.

Do not add a top-level `delivery/` directory unless a real shared delivery
domain emerges, such as cross-medium routing, fallback, auditing, status
tracking, or fan-out.

Transactional files should remain single files while small. For example,
`email/transactional/confirmation.ts` owns its input, private rendering
function, and send workflow. The workflow resolves its `Email` requirement
internally through its concrete provider layer. The caller provides only shared
runtime requirements before handing the effect to a background runtime. It may
become a directory with separate files only when its size or reuse justifies
that split.

## Notifier Contract

Consumers see only the one-step service:

```ts
Notifier.send(notification);
```

`Notifier.makeLayer` remains an implementation factory. It translates a typed
two-step definition into the public service:

```text
render: Notification     -> T
send:   Notification x T -> void

              Notifier.makeLayer
                       |
                       v

Notifier.send: Notification -> void
```

The shared `T` statically guarantees that `send` accepts exactly what `render`
produces. The factory is also the single place for shared rendering-error,
tracing, and instrumentation policy.

An email notifier renderer should produce only its rendered email content. Its
`send` step combines that content with recipient and deterministic delivery
identity from the original `Notification`, then delegates the delivery metadata
and rendered content to `Email.send` as distinct arguments. Console and SMS
implementations follow the same pattern with their own rendered output types.

Implementation errors are mapped to `NotifierError` at that boundary. Its
`layer` field is an open string, so adding a notifier layer does not require
registering it in a closed schema.

## Email Contract

`Email` is the provider-neutral capability for transmitting a complete email:

```ts
Email.send(
  { recipient, idempotencyKey },
  { subject, unsubscribeUrl, body: { text, html } },
);
```

`EmailDelivery` owns transport mechanics; `EmailRendered` owns content. They
remain separate through the provider adapter rather than being flattened into
one record.

Resend and SES are layers implementing `Email`. Provider SDK calls, credentials,
retries, and provider error mapping remain below this boundary.

Notification email flow:

```text
Notification
  -> Email Notifier implementation
  -> Email
  -> Resend or SES
```

Transactional email flow:

```text
Signup use case
  -> signup transactional service and private template
  -> Email
  -> Resend or SES
```

Transactional email bypasses `Notifier` because the use case has already chosen
email. It should not be represented as a `Notification` or forced through the
notification plugin contract.

## Migration completed in the first pass

1. Introduced the provider-neutral `Email` service from the former
   `EmailChannelClient` contract and moved the Resend layer beneath it without
   changing delivery behavior.
2. Renamed `Channel` to `Notifier`, retained `makeLayer`, and exposed the
   one-step `Notifier.send(notification)` service.
3. Moved the email and console notification implementations directly under
   `notifier/` and kept Worker layer selection unchanged.
4. Kept the signup-confirmation workflow intact in
   `email/transactional/confirmation.ts` and composed it with `Email` and the
   Resend layer.
5. Updated imports, tests, architecture documentation, and vocabulary with the
   structural moves.
6. Colocated delivery/hash helpers, kept rendered output separate from delivery
   metadata, and moved email transport errors under `email/` during review.

Prefer mechanical moves and renames before behavior changes so Git history and
review remain understandable.

## Acceptance Criteria

- The notification worker depends only on `Notifier`.
- Email and console layers remain interchangeable `Notifier` implementations.
- `Notifier.makeLayer` preserves the typed render-to-send pipeline.
- `Email` is independent of `Notification` and has provider-specific layers.
- Signup confirmation sends through its transactional email service without
  depending on `Notifier`.
- Notification idempotency, dry runs, `markSent` behavior, retries, and provider
  error mapping remain unchanged.
- Existing notification, email, signup-confirmation, lint, typecheck,
  build, and test coverage pass.

## Non-Goals

- Implementing this refactor in PR #94.
- Introducing SMS before a product requirement exists.
- Adding SES, Twilio, password reset, or email verification now.
- Creating a universal message dispatcher or generic delivery framework.
- Adding runtime fan-out, fallback, or routing between communication media.
- Changing signup-confirmation behavior or notification scheduling semantics.
