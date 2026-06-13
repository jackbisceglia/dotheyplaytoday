import { SUBJECT_CAP, api } from "../api.js";
import { defaultTimezone, detectTimezone, isValidSendTime } from "../time.js";

const emailPattern = /^\S+@\S+\.\S+$/;

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
      if (selected.size === SUBJECT_CAP) {
        setTeamMessage({
          kind: "hint",
          text: `Free tier users can subscribe to ${String(SUBJECT_CAP)} teams.`,
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

        if (!selected.has(teamId) && selected.size >= SUBJECT_CAP) {
          setTeamMessage({
            kind: "hint",
            text: `Free tier users can subscribe to ${String(SUBJECT_CAP)} teams.`,
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
      setHidden(formError, true);
      setError("timezone", undefined);

      if (!validate()) return;

      setSubmitting(true);
      void api.signup
        .submit({
          email: email.value.trim().toLowerCase(),
          timezone,
          schedule: {
            _tag: "fixed_local_time",
            sendAtSecondsLocal: Number(sendTime.value),
          },
          subjectIds: [...selected],
        })
        .then(() => {
          setHidden(form, true);
          setHidden(success, false);
        })
        .catch(() => {
          setHidden(formError, false);
        })
        .finally(() => {
          setSubmitting(false);
        });
    });
  }
}
