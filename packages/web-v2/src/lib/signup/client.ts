import type { SignupRequest as SignupRequestSchema } from "@dtpt/core-v2/contracts/signup";
import { SubjectId } from "@dtpt/core-v2/modules/subjects/schema";
import { SubscriptionConstraints } from "@dtpt/core-v2/modules/subscriptions/policy";
import { EmailAddress } from "@dtpt/core-v2/modules/users/schema";
import { Array, DateTime, Match, Predicate } from "effect";

import { withApiClient } from "../api.js";
import { defaultTimezone, detectTimezone, isValidSendTime } from "../time.js";

const emailPattern = /^\S+@\S+\.\S+$/;
const subjectCap = SubscriptionConstraints.subject.max;

type SignupRequest = typeof SignupRequestSchema.Type;

const isTagged = (error: unknown): error is { readonly _tag: string } =>
  Predicate.hasProperty(error, "_tag") && typeof error._tag === "string";

const getSignupErrorMessage = (error: unknown) => {
  if (!isTagged(error)) {
    return "Something went wrong on our end. Your picks are still here; try submitting again.";
  }

  return Match.value(error).pipe(
    Match.tag(
      "BadRequest",
      "SchemaError",
      () =>
        "That signup did not pass validation. Check your fields and team picks, then try again.",
    ),
    Match.tag("SignupRateLimited", () =>
      "Too many signup attempts. Give it a minute, then try again.",
    ),
    Match.orElse(
      () =>
        "Something went wrong on our end. Your picks are still here; try submitting again.",
    ),
  );
};

const root = document.querySelector("[data-signup-root]");

const setHidden = (element: HTMLElement, isHidden: boolean) => {
  element.hidden = isHidden;
  element.style.display = isHidden ? "none" : "";
};

if (root instanceof HTMLElement) {
  const form = root.querySelector<HTMLFormElement>("[data-form]");
  const success = root.querySelector<HTMLElement>("[data-success]");
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
      element.textContent = message ?? "";
      setHidden(element, message === undefined);
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
      teamMessage.setAttribute(
        "role",
        message?.kind === "error" ? "alert" : "status",
      );
    };

    const syncTeamMessage = () => {
      if (selected.size === subjectCap) {
        setTeamMessage({
          kind: "hint",
          text: `Free tier users can subscribe to ${String(subjectCap)} teams.`,
        });
        return;
      }
      setTeamMessage(undefined);
    };

    let isSubmitting = false;

    const setSubmitting = (nextSubmitting: boolean) => {
      isSubmitting = nextSubmitting;
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

        if (!selected.has(teamId) && selected.size >= subjectCap) {
          setTeamMessage({
            kind: "hint",
            text: `Free tier users can subscribe to ${String(subjectCap)} teams.`,
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
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (isSubmitting) return;

      setHidden(formError, true);
      setError("timezone", undefined);

      if (!validate()) return;

      const subjectIds = [...selected].map((id) =>
        SubjectId.make(id),
      );

      if (!Array.isArrayNonEmpty(subjectIds)) return;

      setSubmitting(true);
      const payload = {
        email: EmailAddress.make(email.value.trim().toLowerCase()),
        timezone: DateTime.zoneMakeNamedUnsafe(timezone),
        schedule: {
          _tag: "fixed_local_time",
          sendAtSecondsLocal: Number(sendTime.value),
        },
        subjectIds,
      } satisfies SignupRequest;

      void withApiClient((client) =>
        client.signup.submit({
          payload,
        }),
      )
        .then(() => {
          setHidden(form, true);
          setHidden(success, false);
        })
        .catch((error: unknown) => {
          formError.textContent = getSignupErrorMessage(error);
          setHidden(formError, false);
        })
        .finally(() => {
          setSubmitting(false);
        });
    });
  }
}
