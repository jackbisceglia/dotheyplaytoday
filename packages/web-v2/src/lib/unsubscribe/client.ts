import { UnsubscribeToken } from "@dtpt/core-v2/modules/users/schema";
import { Match, Schema } from "effect";

import { withApiClient } from "../api.js";

const decodeToken = Schema.decodeUnknownSync(UnsubscribeToken);

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

const setHidden = (element: HTMLElement, isHidden: boolean) => {
  element.hidden = isHidden;
  element.style.display = isHidden ? "none" : "";
};

const submitUnsubscribe = (token: UnsubscribeToken) =>
  withApiClient((client) =>
    client.unsubscribe.submit({
      payload: { token },
    }),
  );

const root = document.querySelector("[data-unsubscribe-root]");

if (root instanceof HTMLElement) {
  const form = root.querySelector<HTMLFormElement>("[data-form]");
  const confirmPanel = root.querySelector<HTMLElement>("[data-confirm-panel]");
  const success = root.querySelector<HTMLElement>("[data-success]");
  const submit = root.querySelector<HTMLButtonElement>("[data-submit]");
  const formError = root.querySelector<HTMLElement>("[data-form-error]");
  const token = root.dataset.token;
  let decodedToken: UnsubscribeToken | undefined;

  if (token !== undefined) {
    try {
      decodedToken = decodeToken(token);
    } catch {
      decodedToken = undefined;
    }
  }

  if (
    form !== null &&
    confirmPanel !== null &&
    success !== null &&
    submit !== null &&
    formError !== null &&
    decodedToken !== undefined
  ) {
    const setFormError = (message: string | undefined) => {
      if (message !== undefined) {
        formError.textContent = message;
      }
      setHidden(formError, message === undefined);
    };

    const setSubmitting = (isSubmitting: boolean) => {
      submit.disabled = isSubmitting;
      submit.textContent = isSubmitting ? "Stopping..." : "Stop emails";
    };

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      setFormError(undefined);
      setSubmitting(true);

      void submitUnsubscribe(decodedToken)
        .then(() => {
          setHidden(confirmPanel, true);
          setHidden(success, false);
        })
        .catch((error: unknown) => {
          setFormError(getSubmitErrorMessage(error));
        })
        .finally(() => {
          setSubmitting(false);
        });
    });
  }
}
