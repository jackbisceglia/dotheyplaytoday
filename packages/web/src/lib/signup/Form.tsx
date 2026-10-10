import { toggleSubscriptionSelection } from "@dtpt/core/modules/subscriptions/selection";
import type { Subject } from "@dtpt/core/modules/subjects/schema";
import { SubscriptionPolicy } from "@dtpt/core/modules/subscriptions/policy";
import { EmailAddressFromString } from "@dtpt/core/modules/users/schema";
import { DateTime, Match, Option, Result, Schema } from "effect";
import { For, Show, createMemo, createSignal } from "solid-js";

import { withApiClient } from "../api.js";
import { getSubjectLogo, getSubjectAbbreviation } from "../catalog/index.js";
import {
  defaultTimezone,
  detectTimezone,
  isValidSendTime,
  sendTime,
  sendTimeIntervals,
} from "../time.js";
import { SubjectPicker } from "../ui/SubjectPicker.jsx";
import { Success } from "./Success.jsx";
import { useSelectionRejection } from "../ui/useSelectionRejection.js";

const decodeEmailAddress = Schema.decodeUnknownResult(EmailAddressFromString);
const subjectCapacity = SubscriptionPolicy.subject.constraints.max;
const capacityHint = `You can select up to ${subjectCapacity.toString()} picks. Remove one before selecting another.`;
type InvalidControl = "picks" | "email" | "sendTime" | undefined;

const getSubmitErrorMessage = (error: unknown) =>
  Match.value(error).pipe(
    Match.when(
      { _tag: "BadRequest" },
      () => "Check your email, timezone, send time, and picks, then try again.",
    ),
    Match.when(
      { _tag: "DuplicateSignup" },
      () =>
        "You already have an account. We’ve emailed you a link to sign in. Your existing picks and schedule haven’t changed.",
    ),
    Match.when(
      { _tag: "SignupRateLimited" },
      () => "Too many signup attempts. Wait a minute and try again.",
    ),
    Match.orElse(
      () =>
        "Something went wrong on our end. Your picks are still here; try submitting again.",
    ),
  );

const hasSelectedSubjects = <SubjectId,>(
  subjectIds: readonly SubjectId[],
): subjectIds is readonly [SubjectId, ...SubjectId[]] => subjectIds.length > 0;

type FormProps = {
  readonly subjects: readonly Subject[];
};

export function Form(props: FormProps) {
  const [selectedSubjects, setSelectedSubjects] = createSignal<
    readonly Subject[]
  >([]);
  const selected = createMemo(
    () => new Set(selectedSubjects().map((subject) => subject.id)),
  );
  const [email, setEmail] = createSignal("");
  const [sendTimeSeconds, setSendTimeSeconds] = createSignal(sendTime.default);
  const [emailError, setEmailError] = createSignal<string>();
  const [sendTimeError, setSendTimeError] = createSignal<string>();
  const [timezoneError, setTimezoneError] = createSignal<string>();
  const [pickError, setPickError] = createSignal<string>();
  const {
    rejectedSelectionId,
    rejectionMessage,
    rejectSelection,
    clearRejection,
  } = useSelectionRejection(capacityHint);
  const [formError, setFormError] = createSignal<string>();
  const [isSubmitting, setSubmitting] = createSignal(false);
  const [isSucceeded, setSucceeded] = createSignal(false);

  let root: HTMLDivElement | undefined;
  let emailInput: HTMLInputElement | undefined;
  let sendTimeInput: HTMLSelectElement | undefined;
  let successTitle: HTMLHeadingElement | undefined;

  const toggleSubject = (subject: Subject) => {
    const next = toggleSubscriptionSelection(selectedSubjects(), subject);

    if (next.length > subjectCapacity) {
      rejectSelection(subject.id);
      return;
    }

    setSelectedSubjects(next);
    setPickError(undefined);
    clearRejection();
  };

  const validate = () => {
    const emailResult = decodeEmailAddress(email());
    const picksInvalid = selected().size === 0;
    const emailInvalid = Result.isFailure(emailResult);
    const sendTimeInvalid = !isValidSendTime(sendTimeSeconds());

    if (emailInvalid) {
      setEmailError("Enter a valid email address.");
    }

    if (picksInvalid) {
      setPickError("Make at least one pick.");
    }

    if (sendTimeInvalid) {
      setSendTimeError("Choose a send time.");
    }

    let firstInvalid: InvalidControl;
    if (picksInvalid) firstInvalid = "picks";
    else if (emailInvalid) firstInvalid = "email";
    else if (sendTimeInvalid) firstInvalid = "sendTime";

    return {
      email: Result.isSuccess(emailResult) ? emailResult.success : undefined,
      firstInvalid,
    };
  };

  const focusFirstInvalidControl = (invalid: InvalidControl) => {
    if (invalid === "picks") {
      root?.querySelector<HTMLButtonElement>(".team-grids button")?.focus();
      return;
    }

    if (invalid === "email") {
      emailInput?.focus();
      return;
    }

    if (invalid === "sendTime") sendTimeInput?.focus();
  };

  const submit = (event: SubmitEvent) => {
    event.preventDefault();
    setFormError(undefined);
    setTimezoneError(undefined);

    const validation = validate();
    const emailAddress = validation.email;
    if (validation.firstInvalid !== undefined || emailAddress === undefined) {
      focusFirstInvalidControl(validation.firstInvalid);
      return;
    }

    const subjectIds = selectedSubjects().map((subject) => subject.id);
    if (!hasSelectedSubjects(subjectIds)) return;

    const timezone = detectTimezone() ?? defaultTimezone;
    const timezoneValue = Option.getOrUndefined(
      DateTime.zoneMakeNamed(timezone),
    );
    if (timezoneValue === undefined) {
      setTimezoneError("Choose a valid timezone.");
      return;
    }

    setSubmitting(true);
    void withApiClient((client) =>
      client.user.create({
        payload: {
          email: emailAddress,
          timezone: timezoneValue,
          schedule: {
            _tag: "fixed_local_time",
            sendAtSecondsLocal: sendTimeSeconds(),
          },
          subjectIds,
        },
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

  return (
    <div class="signup-root" ref={root}>
      <Success
        hidden={!isSucceeded()}
        titleRef={(element) => (successTitle = element)}
      />

      <Show
        when={props.subjects.length > 0}
        fallback={
          <p class="form-error form-error-banner" role="status">
            Signup is temporarily unavailable. Check back soon.
          </p>
        }
      >
        <form
          class="signup-form"
          hidden={isSucceeded()}
          novalidate
          onSubmit={submit}
        >
          <SubjectPicker
            subjects={props.subjects}
            selected={selected()}
            rejectedSelectionId={rejectedSelectionId()}
            errorId="pick-error"
            onToggle={toggleSubject}
          >
            <div class="selection-summary" role="group" aria-label="Your picks">
              <div class="selection-summary-list">
                <Show
                  when={selectedSubjects().length > 0}
                  fallback={
                    <span class="selection-summary-empty">No picks yet</span>
                  }
                >
                  <For each={selectedSubjects()}>
                    {(subject) => (
                      <span
                        class="selection-summary-pick"
                        title={subject.details.display}
                      >
                        <span class="selection-summary-logo" aria-hidden="true">
                          {getSubjectLogo(subject.details)}
                        </span>
                        <strong aria-hidden="true">
                          {getSubjectAbbreviation(subject.details)}
                        </strong>
                        <span class="visually-hidden">
                          {subject.details.display}
                        </span>
                      </span>
                    )}
                  </For>
                </Show>
              </div>
              <span
                class="form-label selection-summary-count"
                aria-live="polite"
                aria-label={`${selected().size.toString()} of ${subjectCapacity.toString()} picks selected`}
              >
                {selected().size}/{subjectCapacity}
              </span>
            </div>
          </SubjectPicker>
          <p
            id="pick-error"
            class="form-error"
            role="alert"
            hidden={pickError() === undefined}
          >
            {pickError() ?? ""}
          </p>

          <fieldset class="form-section">
            <legend class="visually-hidden">Delivery</legend>
            <div class="form-fields">
              <div class="form-field">
                <label class="form-label" for="signup-email">
                  Email
                </label>
                <input
                  id="signup-email"
                  class="form-input"
                  type="email"
                  name="email"
                  autocomplete="email"
                  placeholder="you@example.com"
                  required
                  aria-describedby="signup-email-error"
                  aria-invalid={emailError() === undefined ? undefined : "true"}
                  ref={emailInput}
                  value={email()}
                  onInput={(event) => {
                    setEmail(event.currentTarget.value);
                    setEmailError(undefined);
                  }}
                />
                <span
                  id="signup-email-error"
                  class="form-error"
                  role="alert"
                  hidden={emailError() === undefined}
                >
                  {emailError() ?? ""}
                </span>
              </div>

              <div class="form-field">
                <label class="form-label" for="signup-send-time">
                  Send time
                </label>
                <select
                  id="signup-send-time"
                  class="form-input"
                  name="sendTime"
                  required
                  aria-describedby="signup-send-time-error"
                  aria-invalid={
                    sendTimeError() === undefined ? undefined : "true"
                  }
                  ref={sendTimeInput}
                  onChange={(event) => {
                    setSendTimeSeconds(Number(event.currentTarget.value));
                    setSendTimeError(undefined);
                  }}
                >
                  <For each={sendTimeIntervals}>
                    {(interval) => (
                      <option
                        value={interval.value}
                        selected={interval.value === sendTimeSeconds()}
                      >
                        {interval.label}
                      </option>
                    )}
                  </For>
                </select>
                <span
                  id="signup-send-time-error"
                  class="form-error"
                  role="alert"
                  hidden={sendTimeError() === undefined}
                >
                  {sendTimeError() ?? ""}
                </span>
              </div>
            </div>
            <p
              class="form-error"
              role="alert"
              hidden={timezoneError() === undefined}
            >
              {timezoneError() ?? ""}
            </p>
          </fieldset>

          <div class="form-submit-row">
            <button
              class="btn btn-primary"
              type="submit"
              disabled={isSubmitting()}
            >
              {isSubmitting() ? "Signing up..." : "Sign up"}
            </button>
          </div>

          <p
            class="form-error form-error-banner"
            role="alert"
            hidden={formError() === undefined}
          >
            {formError() ?? ""}
          </p>

          <Show when={rejectionMessage()}>
            {(message) => (
              <div class="app-toast" role="status" aria-live="polite">
                {message()}
              </div>
            )}
          </Show>
        </form>
      </Show>
    </div>
  );
}
