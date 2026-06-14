import { api } from "../api.js";

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
    const setSubmitting = (isSubmitting: boolean) => {
      submit.disabled = isSubmitting;
      submit.textContent = isSubmitting ? "Unsubscribing..." : "Unsubscribe";
    };

    submit.addEventListener("click", () => {
      errorBanner.hidden = true;
      setSubmitting(true);

      void api.unsubscribe
        .submit({ token })
        .then(() => {
          confirmView.hidden = true;
          successView.hidden = false;
        })
        .catch(() => {
          errorBanner.hidden = false;
        })
        .finally(() => {
          setSubmitting(false);
        });
    });
  }
}
