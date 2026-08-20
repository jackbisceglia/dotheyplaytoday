import {
  FeedbackRequestMaxLength,
  type FeedbackType,
} from "@dtpt/core/modules/feedback/schema";
import { Match } from "effect";
import { createSignal, Show } from "solid-js";

import { Layout } from "../layouts/Layout.jsx";
import { withApiClient } from "../lib/api.js";
import { usePageMetadata } from "../lib/metadata.js";

const getSubmitErrorMessage = (error: unknown) =>
  Match.value(error).pipe(
    Match.when(
      { _tag: "FeedbackRateLimited" },
      () => "Too many requests. Wait a minute and try again.",
    ),
    Match.orElse(
      () =>
        "Something went wrong on our end. Your request is still here; try submitting again.",
    ),
  );

export function Feedback(props: { readonly homeHref: string }) {
  usePageMetadata(
    "Feedback | dotheyplaytoday",
    "Request a league, team, or sport, or send general feedback.",
  );

  const [type, setType] = createSignal<FeedbackType>("new_subject");
  const [request, setRequest] = createSignal("");
  const [requestError, setRequestError] = createSignal<string>();
  const [formError, setFormError] = createSignal<string>();
  const [isSubmitting, setSubmitting] = createSignal(false);
  const [isSucceeded, setSucceeded] = createSignal(false);

  let requestInput: HTMLTextAreaElement | undefined;
  let successTitle: HTMLHeadingElement | undefined;

  const submit = (event: SubmitEvent) => {
    event.preventDefault();
    setFormError(undefined);

    const normalizedRequest = request().trim();
    if (normalizedRequest.length === 0) {
      setRequestError("Tell us what you would like to see.");
      requestInput?.focus();
      return;
    }

    setSubmitting(true);
    void withApiClient((client) =>
      client.feedback.submit({
        payload: { type: type(), request: normalizedRequest },
      }),
    )
      .then(() => {
        setSucceeded(true);
        queueMicrotask(() => successTitle?.focus());
      })
      .catch((error: unknown) => {
        setFormError(getSubmitErrorMessage(error));
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const submitAnother = () => {
    setRequest("");
    setRequestError(undefined);
    setFormError(undefined);
    setSucceeded(false);
    queueMicrotask(() => requestInput?.focus());
  };

  return (
    <Layout
      homeHref={props.homeHref}
      headerAction={{ href: props.homeHref, label: "Home" }}
    >
      <section class="feedback-page">
        <div class="feedback-heading">
          <h1 class="feedback-title">
            <span class="feedback-title-line">What should we</span>
            <span class="feedback-title-line">
              add <em>next</em>
              <span class="feedback-title-mark">?</span>
            </span>
          </h1>
          <p class="feedback-copy">
            Request a league, team, sport, or let us know if something is not
            working.
          </p>
        </div>

        <Show
          when={!isSucceeded()}
          fallback={
            <div class="signup-success feedback-success">
              <span class="signup-success-mark" aria-hidden="true">
                ✓
              </span>
              <h2 class="signup-success-title" tabindex="-1" ref={successTitle}>
                Request received
              </h2>
              <p class="signup-success-copy">
                Thanks for helping us decide what to build next.
              </p>
              <button
                class="btn btn-secondary"
                type="button"
                onClick={submitAnother}
              >
                Send another
              </button>
            </div>
          }
        >
          <form class="feedback-form" novalidate onSubmit={submit}>
            <div class="form-field">
              <label class="form-label" for="feedback-type">
                Type
              </label>
              <select
                id="feedback-type"
                class="form-input"
                name="type"
                value={type()}
                onChange={(event) =>
                  setType(event.currentTarget.value as FeedbackType)
                }
              >
                <option value="new_subject">New league, team, or sport</option>
                <option value="general">General feedback or support</option>
              </select>
            </div>

            <div class="form-field">
              <div class="feedback-request-label">
                <label class="form-label" for="feedback-request">
                  Request
                </label>
                <span class="feedback-count" aria-live="polite">
                  {request().length.toString()} /{" "}
                  {FeedbackRequestMaxLength.toString()}
                </span>
              </div>
              <textarea
                id="feedback-request"
                class="form-input feedback-request"
                name="request"
                maxlength={FeedbackRequestMaxLength}
                placeholder="Tell us what you would like to see..."
                required
                aria-describedby="feedback-request-error"
                aria-invalid={requestError() === undefined ? undefined : "true"}
                ref={requestInput}
                value={request()}
                onInput={(event) => {
                  setRequest(event.currentTarget.value);
                  setRequestError(undefined);
                }}
              />
              <span
                id="feedback-request-error"
                class="form-error"
                role="alert"
                hidden={requestError() === undefined}
              >
                {requestError() ?? ""}
              </span>
            </div>

            <button
              class="btn btn-primary feedback-submit"
              type="submit"
              disabled={isSubmitting()}
            >
              {isSubmitting() ? "Sending..." : "Send request"}
            </button>

            <p
              class="form-error form-error-banner"
              role="alert"
              hidden={formError() === undefined}
            >
              {formError() ?? ""}
            </p>
          </form>
        </Show>
      </section>
    </Layout>
  );
}
