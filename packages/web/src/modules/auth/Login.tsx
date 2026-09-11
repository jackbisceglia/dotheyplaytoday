import { EmailAddressFromString } from "@dtpt/core/modules/users/schema";
import { useNavigate } from "@solidjs/router";
import { Result, Schema } from "effect";
import { createSignal, Show } from "solid-js";

import { auth } from "../../lib/auth.js";
import { useApplicationPath } from "../../lib/paths.js";

const decodeEmail = Schema.decodeUnknownResult(EmailAddressFromString);

export function Login() {
  const navigate = useNavigate();
  const landingHref = useApplicationPath("landing");
  const [email, setEmail] = createSignal("");
  const [error, setError] = createSignal<string>();
  const [isPending, setIsPending] = createSignal(false);
  const [isSent, setIsSent] = createSignal(false);

  const close = () => {
    navigate(landingHref(), { replace: true });
  };

  const submit = async (event: SubmitEvent) => {
    event.preventDefault();
    const decoded = decodeEmail(email());

    if (Result.isFailure(decoded)) {
      setError("Enter a valid email address.");
      return;
    }

    setError(undefined);
    setIsPending(true);
    const result = await auth.signIn.magicLink({ email: decoded.success });
    setIsPending(false);

    if (result.error) {
      setError("We couldn't send your sign-in link. Try again.");
      return;
    }

    setIsSent(true);
  };

  return (
    <div class="modal-backdrop" role="presentation" onClick={close}>
      <section
        aria-labelledby="login-title"
        aria-modal="true"
        class="login-modal"
        role="dialog"
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <button
          class="modal-close"
          type="button"
          aria-label="Close"
          onClick={close}
        >
          ×
        </button>
        <Show
          when={!isSent()}
          fallback={
            <>
              <h2 class="login-title" id="login-title">
                Check your email
              </h2>
              <p class="login-copy">We sent you a link to sign in.</p>
            </>
          }
        >
          <h2 class="login-title" id="login-title">
            Welcome back
          </h2>
          <p class="login-copy">
            Enter your email and we'll send you a sign-in link.
          </p>
          <form
            class="login-form"
            onSubmit={(event) => {
              void submit(event);
            }}
          >
            <label class="form-label" for="login-email">
              Email
            </label>
            <input
              class="form-input"
              id="login-email"
              type="email"
              autocomplete="email"
              value={email()}
              onInput={(event) => setEmail(event.currentTarget.value)}
              autofocus
            />
            <Show when={error()}>
              {(message) => (
                <p class="form-error" role="alert">
                  {message()}
                </p>
              )}
            </Show>
            <button
              class="btn btn-primary"
              type="submit"
              disabled={isPending()}
            >
              {isPending() ? "Sending…" : "Email me a sign-in link"}
            </button>
          </form>
        </Show>
      </section>
    </div>
  );
}
