import {
  type EmailAddress,
  EmailAddressFromString,
} from "@dtpt/core/modules/users/schema";
import { useNavigate, useSearchParams } from "@solidjs/router";
import { Option, Result, Schema } from "effect";
import { createEffect, createSignal, Show } from "solid-js";

import { auth } from "../auth.js";
import { useApplicationPath } from "../paths.js";

const decodeEmail = Schema.decodeUnknownResult(EmailAddressFromString);
// Present only after a code that confirmed the address was redeemed.
const decodeConfirmation = Schema.decodeUnknownOption(
  Schema.Struct({ confirmation: Schema.Literal(true) }),
);
const codeLength = 6;

function codeError(code: string | undefined) {
  switch (code) {
    case "INVALID_OTP":
      return "That code isn't right. Check it and try again.";
    case "OTP_EXPIRED":
    case "TOO_MANY_ATTEMPTS":
      return "That code has expired. Send a new one.";
    default:
      return "We couldn't sign you in. Try again.";
  }
}

function FormError(props: { readonly message: string | undefined }) {
  return (
    <Show when={props.message}>
      {(message) => (
        <p class="form-error" role="alert">
          {message()}
        </p>
      )}
    </Show>
  );
}

export function Login() {
  const navigate = useNavigate();
  const [, setSearch] = useSearchParams();
  const landingHref = useApplicationPath("landing");
  const [email, setEmail] = createSignal("");
  const [sentTo, setSentTo] = createSignal<EmailAddress>();
  const [code, setCode] = createSignal("");
  const [error, setError] = createSignal<string>();
  const [status, setStatus] = createSignal<string>();
  const [isPending, setIsPending] = createSignal(false);
  const [dialog, setDialog] = createSignal<HTMLDialogElement>();

  const close = () => {
    dialog()?.close();
    navigate(landingHref(), { replace: true });
  };

  createEffect(dialog, (element) => {
    element?.showModal();
    return () => {
      if (element?.open) element.close();
    };
  });

  const sendCode = async (address: EmailAddress) => {
    setError(undefined);
    setStatus(undefined);
    setIsPending(true);
    const result = await auth.emailOtp.sendVerificationOtp({
      email: address,
      type: "sign-in",
    });
    setIsPending(false);

    if (result.error) {
      setError("We couldn't send your code. Try again.");
      return false;
    }

    return true;
  };

  const submitEmail = async (event: SubmitEvent) => {
    event.preventDefault();
    const decoded = decodeEmail(email());

    if (Result.isFailure(decoded)) {
      setError("Enter a valid email address.");
      return;
    }

    if (await sendCode(decoded.success)) {
      setCode("");
      setSentTo(decoded.success);
    }
  };

  const resend = async (address: EmailAddress) => {
    setCode("");
    if (await sendCode(address)) setStatus("We sent a new code.");
  };

  const submitCode = async (event: SubmitEvent, address: EmailAddress) => {
    event.preventDefault();
    const otp = code().replace(/\D/g, "");

    if (otp.length !== codeLength) {
      setError("Enter the 6-digit code from your email.");
      return;
    }

    setError(undefined);
    setStatus(undefined);
    setIsPending(true);
    const result = await auth.signIn.emailOtp(
      { email: address, otp },
      {
        // Better Auth runs onSuccess before notifying session listeners. Set the
        // marker before Landing can redirect after the session refresh.
        onSuccess: ({ data }) => {
          setSearch(
            {
              confirmation: Option.isSome(decodeConfirmation(data))
                ? "1"
                : undefined,
            },
            { replace: true },
          );
        },
      },
    );

    // Success keeps the pending state; Landing moves to /home with the session.
    if (!result.error) return;

    setIsPending(false);
    setError(codeError(result.error.code));
  };

  const reset = () => {
    setSentTo(undefined);
    setCode("");
    setError(undefined);
    setStatus(undefined);
  };

  return (
    <dialog
      aria-labelledby="login-title"
      class="modal-backdrop"
      ref={setDialog}
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <section class="login-modal">
        <button
          class="modal-close"
          type="button"
          aria-label="Close"
          onClick={close}
        >
          ×
        </button>
        <Show
          when={sentTo()}
          fallback={
            <>
              <h2 class="login-title" id="login-title">
                Welcome <em>back.</em>
              </h2>
              <p class="login-copy">We'll email you a code to sign in.</p>
              <form
                class="login-form"
                onSubmit={(event) => {
                  void submitEmail(event);
                }}
              >
                <label class="visually-hidden" for="login-email">
                  Email
                </label>
                <input
                  class="form-input"
                  id="login-email"
                  type="email"
                  autocomplete="email"
                  placeholder="you@example.com"
                  value={email()}
                  onInput={(event) => setEmail(event.currentTarget.value)}
                  autofocus
                />
                <button
                  class="btn btn-primary"
                  type="submit"
                  disabled={isPending()}
                >
                  {isPending() ? "Sending…" : "Send code"}
                </button>
                <FormError message={error()} />
              </form>
            </>
          }
        >
          {(address) => (
            <>
              <h2 class="login-title" id="login-title">
                Check your <em>inbox.</em>
              </h2>
              <p class="login-copy">
                Enter the code we sent to <strong>{address()}</strong>.
              </p>
              <form
                class="login-form"
                onSubmit={(event) => {
                  void submitCode(event, address());
                }}
              >
                <label class="visually-hidden" for="login-code">
                  Sign-in code
                </label>
                <input
                  class="form-input login-code"
                  id="login-code"
                  type="text"
                  inputmode="numeric"
                  autocomplete="one-time-code"
                  maxlength={codeLength}
                  placeholder="000000"
                  value={code()}
                  onInput={(event) => setCode(event.currentTarget.value)}
                  autofocus
                />
                <button
                  class="btn btn-primary"
                  type="submit"
                  disabled={isPending()}
                >
                  {isPending() ? "Signing in…" : "Sign in"}
                </button>
                <FormError message={error()} />
                <Show when={status()}>
                  {(message) => (
                    <p class="form-hint" role="status">
                      {message()}
                    </p>
                  )}
                </Show>
              </form>
              <div class="login-actions">
                <button
                  class="login-reset"
                  type="button"
                  disabled={isPending()}
                  onClick={() => {
                    void resend(address());
                  }}
                >
                  Send a new code
                </button>
                <button
                  class="login-reset"
                  type="button"
                  disabled={isPending()}
                  onClick={reset}
                >
                  Use a different email
                </button>
              </div>
            </>
          )}
        </Show>
      </section>
    </dialog>
  );
}
