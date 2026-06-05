Notify Email Renderer Decisions

The email is subject-scoped as a notification and delivery unit, but
event-centric as visible content.

Subject scope still matters because the notification is produced for one
subscription, lastSentAt is tracked per subscription, unsubscribe context comes
from the user/subscription, and the email should be able to explain why the user
is receiving it. The body copy is mostly about the same-day events.

Preferred V1 rendering shape:

Notification
  -> channel render
    -> email renderer matches and handles the V1 sports-team/sports-game shape directly
    -> email view assembles subject plus text/html body
  -> channel/provider send(to, rendered)

Key decisions:

- Notification should carry native domain data, especially EventWithParticipants,
  rather than a pre-rendered NotificationEvent { title, startsAt }.
- Email rendering stays channel-owned. For V1, match the single supported
  sports-team/sports-game shape directly instead of introducing a generic
  variant registry or broad match matrix.
- Email render cases should represent accepted subject/event combinations. For
  V1, the case is sports_team with all sports_game events, so the case body
  renders sports games directly instead of matching each event again.
- The top-level renderer should not parse previously rendered strings. It may
  compose strings, but if it needs more domain context it should use the native
  notification data directly.
- A subject-scoped notification can contain mixed event variants later. When
  that exists, the email renderer should make the accepted combinations explicit
  in that later slice.
- The email view renderer owns assembling matched email copy into subject, text,
  and html.
- render() should return only rendered/view content, not delivery metadata.
- render() is effectful so channel rendering can read runtime config without
  pushing config-derived values into the channel service constructor.
- Render/data-shape failures should be returned as typed channel render errors
  first. For V1 delivery, Notifier.deliver collapses email render errors to
  defects instead of sending a fallback email.
- send(to, rendered) is simple enough for now. Do not introduce an Envelope
  abstraction until a concrete second need appears.
- Provider clients map rendered channel content plus recipient into
  vendor-specific payloads. They should not own domain rendering.

Likely file ownership:

channel/email/service.ts
  Effect service/layer wiring
  yield client
  render(notification) matches and owns the supported sports-team/sports-game email copy
  send(to, rendered) delegates to client
  return EmailChannel.of({ render, send })

channel/email/render.ts
  pure subject plus text/html body assembly

lib/url.ts
  shared URL construction helpers

Implementation notes:

- WebConfig follows the V1 shape: url plus defaulted port.
- URL construction lives in lib/url.ts. WebUrl reads WebConfig and
  buildUnsubscribeUrl(token) composes the unsubscribe route from that base URL.

Open questions:

- Whether Channel.send should stay send(to, rendered) or become object-shaped
  later.
- How much mixed-event support V1 should implement versus simply preserving a
  shape that does not block it.
