# Clarify notifier and email boundaries

## Type

Deferred architecture refactor

## Status

Documented during signup-confirmation work. Do not implement as part of PR #94.
The current notification channels and direct signup-confirmation email delivery
work correctly and should remain stable until this refactor is taken on
separately.

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
    implementations/
      email.ts
      console.ts
      sms.ts

  email/
    service.ts
    clients/
      resend.ts
      ses.ts
    transactional/
      signup-confirmation.ts
      forgot-password.ts

  sms/
    service.ts
    clients/
      twilio.ts
```

Do not add a top-level `delivery/` directory unless a real shared delivery
domain emerges, such as cross-medium routing, fallback, auditing, status
tracking, or fan-out.

Transactional files should remain single files while small. For example,
`email/transactional/signup-confirmation.ts` owns its input, private rendering
function, and send workflow. The workflow resolves its `Email` requirement
internally; the caller provides that requirement before handing the effect to a
background runtime. It may become a directory with separate files only when its
size or reuse justifies that split.

## Notifier Contract

Consumers see only the one-step service:

```ts
Notifier.send(notification);
```

`Notifier.makeLayer` remains an implementation factory. It translates a typed
two-step definition into the public service:

```text
render: Notification -> T
send:   T -> void

              Notifier.makeLayer
                       |
                       v

Notifier.send: Notification -> void
```

The shared `T` statically guarantees that `send` accepts exactly what `render`
produces. The factory is also the single place for shared rendering-error,
tracing, and instrumentation policy.

An email notifier renderer should produce a complete provider-neutral outbound
email, including recipient, content, and deterministic notification delivery
identity. Its `send` step delegates that value to `Email.send`. Console and SMS
implementations follow the same pattern with their own rendered output types.

## Email Contract

`Email` is the provider-neutral capability for transmitting a complete email:

```ts
Email.send({
  recipient,
  idempotencyKey,
  subject,
  body: { text, html },
});
```

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

## Migration

1. Introduce the provider-neutral `Email` service using the current
   `EmailChannelClient` contract and move the Resend layer beneath it without
   changing behavior.
2. Rename `Channel` to `Notifier` and preserve its public one-step service and
   `makeLayer` implementation factory.
3. Move the email and console notification implementations under `notifier/`
   and keep Worker layer selection unchanged.
4. Keep signup-confirmation email code in
   `email/transactional/signup-confirmation.ts`. Replace its temporary
   `EmailChannelClient` requirement with `Email`.
5. Update imports, tests, architecture documentation, and vocabulary after the
   structural moves are complete.

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
- Existing notification, email-client, signup-confirmation, lint, typecheck,
  build, and test coverage pass.

## Non-Goals

- Implementing this refactor in PR #94.
- Introducing SMS before a product requirement exists.
- Adding SES, Twilio, password reset, or email verification now.
- Creating a universal message dispatcher or generic delivery framework.
- Adding runtime fan-out, fallback, or routing between communication media.
- Changing signup-confirmation behavior or notification scheduling semantics.
