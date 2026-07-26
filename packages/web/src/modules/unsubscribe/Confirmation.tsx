import { Link } from "@tanstack/solid-router";
import { Match } from "effect";
import { createSignal } from "solid-js";

import { withApiClient } from "../../lib/api.js";
import type { UnsubscribeTokenSuccess } from "./token.js";

const getSubmitErrorMessage = (error: unknown) =>
  Match.value(error).pipe(
    Match.when(
      { _tag: "UnsubscribeRateLimited" },
      () => "Too many unsubscribe attempts. Wait a minute and try again.",
    ),
    Match.orElse(
      () => "We couldn't finish that request. Wait a moment and try again.",
    ),
  );

type ConfirmationProps = {
  readonly token: UnsubscribeTokenSuccess;
};

export function Confirmation(props: ConfirmationProps) {
  const [formError, setFormError] = createSignal<string>();
  const [isSubmitting, setSubmitting] = createSignal(false);
  const [isSucceeded, setSucceeded] = createSignal(false);

  let successTitle: HTMLHeadingElement | undefined;

  const submit = (event: SubmitEvent) => {
    event.preventDefault();
    setFormError(undefined);
    setSubmitting(true);

    void withApiClient((client) =>
      client.unsubscribe.submit({ payload: { token: props.token } }),
    )
      .then(() => {
        setSucceeded(true);
        successTitle?.focus();
      })
      .catch((error: unknown) => {
        setFormError(getSubmitErrorMessage(error));
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <section class="unsubscribe">
      <div class="unsubscribe-confirm" hidden={isSucceeded()}>
        <h1 class="unsubscribe-title">
          Take yourself
          <br />
          <em>off the roster.</em>
        </h1>
        <p class="unsubscribe-copy">
          This stops every dotheyplaytoday email for this address. Sign up again
          any time with a fresh set of teams.
        </p>

        <form class="unsubscribe-actions" onSubmit={submit}>
          <button
            class="btn btn-primary"
            type="submit"
            disabled={isSubmitting()}
          >
            {isSubmitting() ? "Stopping..." : "Stop receiving emails"}
          </button>
        </form>

        <p
          class="form-error unsubscribe-error"
          role="alert"
          hidden={formError() === undefined}
        >
          {formError() ??
            "We couldn't finish that request. Wait a moment and try again."}
        </p>
      </div>

      <div
        class="unsubscribe-success"
        role="status"
        aria-atomic="true"
        hidden={!isSucceeded()}
      >
        <p class="unsubscribe-success-mark" aria-hidden="true">
          ✓
        </p>
        <h2 class="unsubscribe-title" tabindex="-1" ref={successTitle}>
          You're off
          <br />
          <em>the roster.</em>
        </h2>
        <p class="unsubscribe-copy">
          We processed this unsubscribe. If the link had already been used,
          nothing else needed to happen.
        </p>
        <Link class="btn btn-secondary" to="/">
          Back home
        </Link>
      </div>
    </section>
  );
}
