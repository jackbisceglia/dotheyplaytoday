import { Subject } from "@dtpt/core-v2/modules/subjects/schema";
import { SubscriptionPolicy } from "@dtpt/core-v2/modules/subscriptions/policy";
import { EmailAddressFromString } from "@dtpt/core-v2/modules/users/schema";
import { DateTime, Match, Option } from "effect";

import { withApiClient } from "../../lib/api.js";
import {
  defaultTimezone,
  detectTimezone,
  isValidSendTime,
} from "../../lib/time.js";

const emailPattern = /^\S+@\S+\.\S+$/;
const subjectCapacity = SubscriptionPolicy.subject.constraints.max;

const getSubmitErrorMessage = (error: unknown) =>
  Match.value(error).pipe(
    Match.when(
      { _tag: "BadRequest" },
      () => "Check your email, timezone, send time, and teams, then try again.",
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

const root = document.querySelector("[data-signup-root]");

const hasSelectedSubjects = <SubjectId>(
  subjectIds: readonly SubjectId[],
): subjectIds is readonly [SubjectId, ...SubjectId[]] => subjectIds.length > 0;

const setHidden = (element: HTMLElement, isHidden: boolean) => {
  element.hidden = isHidden;
  element.style.display = isHidden ? "none" : "";
};

if (root instanceof HTMLElement) {
  const form = root.querySelector<HTMLFormElement>("[data-form]");
  const success = root.querySelector<HTMLElement>("[data-success]");
  const successTitle = root.querySelector<HTMLElement>("[data-success-title]");
  const edit = root.querySelector<HTMLButtonElement>("[data-edit]");
  const email = root.querySelector<HTMLInputElement>("[data-email]");
  const sendTime = root.querySelector<HTMLSelectElement>("[data-send-time]");
  const submit = root.querySelector<HTMLButtonElement>("[data-submit]");
  const formError = root.querySelector<HTMLElement>("[data-form-error]");
  const teamMessage = root.querySelector<HTMLElement>("[data-team-message]");
  const leagueButtons = [
    ...root.querySelectorAll<HTMLButtonElement>("[data-league-id]"),
  ];
  const teamGrids = [...root.querySelectorAll<HTMLElement>("[data-team-grid]")];
  const teamButtons = [
    ...root.querySelectorAll<HTMLButtonElement>("[data-team-id]"),
  ];

  const selected = new Set<string>();
  let activeLeague = leagueButtons[0]?.dataset.leagueId ?? "";
  const timezone = detectTimezone() ?? defaultTimezone;

  if (
    form !== null &&
    success !== null &&
    successTitle !== null &&
    edit !== null &&
    email !== null &&
    sendTime !== null &&
    submit !== null &&
    formError !== null &&
    teamMessage !== null
  ) {
    const getFieldError = (field: string) =>
      root.querySelector<HTMLElement>(`[data-error-for="${field}"]`);

    const setError = (field: string, message: string | undefined) => {
      const element = getFieldError(field);
      if (element === null) return;

      const control =
        field === "email" ? email : field === "sendTime" ? sendTime : undefined;
      if (control !== undefined) {
        if (message === undefined) {
          control.removeAttribute("aria-invalid");
        } else {
          control.setAttribute("aria-invalid", "true");
        }
      }

      element.textContent = message ?? "";
      setHidden(element, message === undefined);
    };

    const setFormError = (message: string | undefined) => {
      if (message !== undefined) {
        formError.textContent = message;
      }
      setHidden(formError, message === undefined);
    };

    const setTeamMessage = (
      message:
        | { readonly kind: "error"; readonly text: string }
        | { readonly kind: "hint"; readonly text: string }
        | undefined,
    ) => {
      setHidden(teamMessage, message === undefined);
      teamMessage.textContent = message?.text ?? "";
      teamMessage.className =
        message?.kind === "error" ? "form-error" : "form-hint";
      if (message === undefined) {
        teamMessage.removeAttribute("role");
      } else {
        teamMessage.setAttribute(
          "role",
          message.kind === "error" ? "alert" : "status",
        );
      }
    };

    const syncTeamMessage = () => {
      if (selected.size === subjectCapacity) {
        setTeamMessage({
          kind: "hint",
          text: `Free tier users can subscribe to ${subjectCapacity.toString()} teams.`,
        });
        return;
      }
      setTeamMessage(undefined);
    };

    const setSubmitting = (isSubmitting: boolean) => {
      submit.disabled = isSubmitting;
      submit.textContent = isSubmitting ? "Signing up..." : "Sign up";
    };

    const setLeague = (leagueId: string) => {
      activeLeague = leagueId;

      leagueButtons.forEach((button) => {
        button.setAttribute(
          "aria-pressed",
          button.dataset.leagueId === activeLeague ? "true" : "false",
        );
      });

      teamGrids.forEach((grid) => {
        setHidden(grid, grid.dataset.teamGrid !== activeLeague);
      });
    };

    const validate = () => {
      let valid = true;

      if (!emailPattern.test(email.value.trim())) {
        setError("email", "Enter a valid email address.");
        valid = false;
      }

      if (selected.size === 0) {
        setTeamMessage({ kind: "error", text: "Pick at least one team." });
        valid = false;
      }

      if (timezone === "") {
        setError(
          "timezone",
          "We couldn't detect your timezone. Refresh and try again.",
        );
        valid = false;
      }

      if (!isValidSendTime(Number(sendTime.value))) {
        setError("sendTime", "Choose a send time.");
        valid = false;
      }

      return valid;
    };

    const focusFirstInvalidControl = () => {
      const invalid = root.querySelector<HTMLElement>('[aria-invalid="true"]');
      if (invalid !== null) {
        invalid.focus();
        return;
      }

      if (selected.size === 0) {
        teamButtons[0]?.focus();
      }
    };

    leagueButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const leagueId = button.dataset.leagueId;
        if (leagueId === undefined) return;

        setLeague(leagueId);
      });
    });

    teamButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const teamId = button.dataset.teamId;
        if (teamId === undefined) return;

        if (!selected.has(teamId) && selected.size >= subjectCapacity) {
          setTeamMessage({
            kind: "hint",
            text: `Free tier users can subscribe to ${subjectCapacity.toString()} teams.`,
          });
          return;
        }

        if (selected.has(teamId)) {
          selected.delete(teamId);
          button.setAttribute("aria-pressed", "false");
        } else {
          selected.add(teamId);
          button.setAttribute("aria-pressed", "true");
        }

        syncTeamMessage();
      });
    });

    email.addEventListener("input", () => {
      setError("email", undefined);
    });

    sendTime.addEventListener("change", () => {
      setError("sendTime", undefined);
    });

    edit.addEventListener("click", () => {
      setHidden(success, true);
      setHidden(form, false);
      email.focus();
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      setFormError(undefined);
      setError("timezone", undefined);

      if (!validate()) {
        focusFirstInvalidControl();
        return;
      }

      const subjectIds = [...selected].map((subjectId) =>
        Subject.fields.id.make(subjectId),
      );
      if (!hasSelectedSubjects(subjectIds)) return;

      const timezoneValue = Option.getOrUndefined(
        DateTime.zoneMakeNamed(timezone),
      );
      if (timezoneValue === undefined) {
        setError("timezone", "Choose a valid timezone.");
        return;
      }

      setSubmitting(true);
      void withApiClient((client) =>
        client.signup.submit({
          payload: {
            email: EmailAddressFromString.make(email.value.trim()),
            timezone: timezoneValue,
            schedule: {
              _tag: "fixed_local_time",
              sendAtSecondsLocal: Number(sendTime.value),
            },
            subjectIds,
          },
        }),
      )
        .then(() => {
          setHidden(form, true);
          setHidden(success, false);
          successTitle.focus();
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
