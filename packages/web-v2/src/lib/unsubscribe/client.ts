import { UnsubscribeToken } from "@dtpt/core-v2/modules/users/schema";
import { Match } from "effect";

import { withApiClient } from "../api.js";

const getSubmitErrorMessage = (error: unknown) =>
  Match.value(error).pipe(
    Match.when(
      { _tag: "UnsubscribeRateLimited" },
      () => "Too many unsubscribe attempts. Wait a minute and try again.",
    ),
    Match.orElse(
      () => "Something went wrong on our end. Try unsubscribing again.",
    ),
  );

const root = document.querySelector("[data-unsubscribe-root]");

if (root instanceof HTMLElement) {
  const confirmView = root.querySelector<HTMLElement>("[data-confirm]");
  const successView = root.querySelector<HTMLElement>("[data-success]");
  const submit = root.querySelector<HTMLButtonElement>("[data-submit]");
  const errorBanner = root.querySelector<HTMLElement>("[data-error]");
  const token = root.dataset.token;

  if (
    confirmView !== null &&
    successView !== null &&
    submit !== null &&
    errorBanner !== null &&
    token !== undefined
  ) {
    const unsubscribeToken = UnsubscribeToken.make(token);

    const setSubmitting = (isSubmitting: boolean) => {
      submit.disabled = isSubmitting;
      submit.textContent = isSubmitting ? "Unsubscribing..." : "Unsubscribe";
    };

    const setError = (message: string | undefined) => {
      if (message !== undefined) {
        errorBanner.textContent = message;
      }
      errorBanner.hidden = message === undefined;
    };

    submit.addEventListener("click", () => {
      setError(undefined);
      setSubmitting(true);

      void withApiClient((client) =>
        client.unsubscribe.submit({ payload: { token: unsubscribeToken } }),
      )
        .then(() => {
          confirmView.hidden = true;
          successView.hidden = false;
        })
        .catch((error: unknown) => {
          setError(getSubmitErrorMessage(error));
        })
        .finally(() => {
          setSubmitting(false);
        });
    });
  }
}
