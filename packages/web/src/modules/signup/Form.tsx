import { Subject } from "@dtpt/core/modules/subjects/schema";
import { SubscriptionPolicy } from "@dtpt/core/modules/subscriptions/policy";
import { EmailAddressFromString } from "@dtpt/core/modules/users/schema";
import { DateTime, Match, Option, Result, Schema } from "effect";
import { For, Show, createMemo, createSignal } from "solid-js";

import { withApiClient } from "../../lib/api.js";
import {
  getSportsLogo,
  getTeams,
  leagues as sportsLeagues,
} from "../../lib/catalog/sports/index.js";
import {
  defaultTimezone,
  detectTimezone,
  isValidSendTime,
  sendTime,
  sendTimeIntervals,
} from "../../lib/time.js";
import { Success } from "./Success.jsx";

const decodeEmailAddress = Schema.decodeUnknownResult(EmailAddressFromString);
const subjectCapacity = SubscriptionPolicy.subject.constraints.max;
const capacityHint = `Free tier users can subscribe to ${subjectCapacity.toString()} teams.`;
type InvalidControl = "teams" | "email" | "sendTime" | undefined;

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

const hasSelectedSubjects = <SubjectId,>(
  subjectIds: readonly SubjectId[],
): subjectIds is readonly [SubjectId, ...SubjectId[]] => subjectIds.length > 0;

type FormProps = {
  readonly subjects: readonly Subject[];
};

export function Form(props: FormProps) {
  const leagues = createMemo(() => {
    const teams = getTeams(props.subjects);
    const teamsByLeague = Object.groupBy(
      teams,
      (team) => team.details.leagueId,
    );

    return sportsLeagues
      .map((league) => ({
        ...league,
        teams: teamsByLeague[league.id] ?? [],
      }))
      .filter((league) => league.teams.length > 0);
  });

  const [selectedLeague, setSelectedLeague] = createSignal<string>();
  const activeLeague = createMemo(() => {
    const selected = selectedLeague();
    const available = leagues();

    return available.some((league) => league.id === selected)
      ? selected
      : (available[0]?.id ?? "");
  });
  const [selected, setSelected] = createSignal<ReadonlySet<string>>(new Set());
  const teamsById = createMemo(
    () =>
      new Map(
        leagues().flatMap((league) =>
          league.teams.map((team) => [team.id as string, team] as const),
        ),
      ),
  );
  const selectedTeams = createMemo(() =>
    [...selected()].flatMap((teamId) => {
      const team = teamsById().get(teamId);
      return team === undefined ? [] : [team];
    }),
  );
  const [email, setEmail] = createSignal("");
  const [sendTimeSeconds, setSendTimeSeconds] = createSignal(sendTime.default);
  const [emailError, setEmailError] = createSignal<string>();
  const [sendTimeError, setSendTimeError] = createSignal<string>();
  const [timezoneError, setTimezoneError] = createSignal<string>();
  const [teamError, setTeamError] = createSignal<string>();
  const [teamHint, setTeamHint] = createSignal<string>();
  const [formError, setFormError] = createSignal<string>();
  const [isSubmitting, setSubmitting] = createSignal(false);
  const [isSucceeded, setSucceeded] = createSignal(false);

  let root: HTMLDivElement | undefined;
  let emailInput: HTMLInputElement | undefined;
  let sendTimeInput: HTMLSelectElement | undefined;
  let successTitle: HTMLHeadingElement | undefined;

  const toggleTeam = (teamId: string) => {
    const current = selected();

    if (!current.has(teamId) && current.size >= subjectCapacity) {
      setTeamHint(capacityHint);
      return;
    }

    const next = new Set(current);
    if (next.has(teamId)) next.delete(teamId);
    else next.add(teamId);

    setSelected(next);
    setTeamError(undefined);
    setTeamHint(next.size === subjectCapacity ? capacityHint : undefined);
  };

  const validate = () => {
    const emailResult = decodeEmailAddress(email());
    const teamsInvalid = selected().size === 0;
    const emailInvalid = Result.isFailure(emailResult);
    const sendTimeInvalid = !isValidSendTime(sendTimeSeconds());

    if (emailInvalid) {
      setEmailError("Enter a valid email address.");
    }

    if (teamsInvalid) {
      setTeamError("Pick at least one team.");
    }

    if (sendTimeInvalid) {
      setSendTimeError("Choose a send time.");
    }

    let firstInvalid: InvalidControl;
    if (teamsInvalid) firstInvalid = "teams";
    else if (emailInvalid) firstInvalid = "email";
    else if (sendTimeInvalid) firstInvalid = "sendTime";

    return {
      email: Result.isSuccess(emailResult) ? emailResult.success : undefined,
      firstInvalid,
    };
  };

  const focusFirstInvalidControl = (invalid: InvalidControl) => {
    if (invalid === "teams") {
      root
        ?.querySelector<HTMLButtonElement>(
          ".team-grid:not([hidden]) .team-card",
        )
        ?.focus();
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

    const subjectIds = [...selected()].map((subjectId) =>
      Subject.fields.id.make(subjectId),
    );
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
      client.signup.submit({
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

  const edit = () => {
    setSucceeded(false);
    queueMicrotask(() => emailInput?.focus());
  };

  return (
    <div class="signup-root" ref={root}>
      <Success
        hidden={!isSucceeded()}
        onEdit={edit}
        titleRef={(element) => (successTitle = element)}
      />

      <Show
        when={leagues().length > 0}
        fallback={
          <p class="form-error form-error-banner" role="status">
            Team signup is temporarily unavailable. Check back soon.
          </p>
        }
      >
        <form
          class="signup-form"
          hidden={isSucceeded()}
          novalidate
          onSubmit={submit}
        >
          <fieldset class="form-section">
            <legend class="visually-hidden">League</legend>
            <div class="league-row">
              <For each={leagues()}>
                {(league) => (
                  <button
                    class="league-pill"
                    type="button"
                    aria-pressed={
                      activeLeague() === league.id ? "true" : "false"
                    }
                    onClick={() => setSelectedLeague(league.id)}
                  >
                    {league.label}
                  </button>
                )}
              </For>
              <button class="league-pill" type="button" disabled>
                NHL<span class="visually-hidden"> coming soon</span>
              </button>
            </div>
          </fieldset>

          <div class="selection-summary">
            <span class="form-label selection-summary-label">Your picks</span>
            <div class="selection-summary-list">
              <Show
                when={selectedTeams().length > 0}
                fallback={
                  <span class="selection-summary-empty">None selected yet</span>
                }
              >
                <For each={selectedTeams()}>
                  {(team) => (
                    <span
                      class="selection-summary-pick"
                      aria-label={team.details.display}
                      title={team.details.display}
                    >
                      <span aria-hidden="true">
                        {getSportsLogo(team.details)}
                      </span>
                      <strong aria-hidden="true">
                        {team.details.abbreviation}
                      </strong>
                    </span>
                  )}
                </For>
              </Show>
            </div>
            <span
              class="form-label selection-summary-count"
              aria-live="polite"
              aria-label={`${selected().size.toString()} of ${subjectCapacity.toString()} teams selected`}
            >
              {selected().size}/{subjectCapacity}
            </span>
          </div>

          <fieldset
            class="form-section"
            aria-describedby="team-error team-hint"
          >
            <legend class="visually-hidden">Teams</legend>
            <For each={leagues()}>
              {(league) => (
                <div class="team-grid" hidden={activeLeague() !== league.id}>
                  <For each={league.teams}>
                    {(team) => (
                      <button
                        type="button"
                        class="team-card"
                        aria-pressed={
                          selected().has(team.id) ? "true" : "false"
                        }
                        onClick={() => {
                          toggleTeam(team.id);
                        }}
                      >
                        <span class="team-glyph" aria-hidden="true">
                          {getSportsLogo(team.details)}
                        </span>
                        <span class="team-abbr">
                          {team.details.abbreviation}
                        </span>
                        <span class="team-name">{team.details.display}</span>
                      </button>
                    )}
                  </For>
                </div>
              )}
            </For>
            <div class="team-message-slot">
              <p
                id="team-error"
                class="form-error"
                role="alert"
                hidden={teamError() === undefined}
              >
                {teamError() ?? ""}
              </p>
              <p
                id="team-hint"
                class="form-hint"
                role="status"
                hidden={teamHint() === undefined}
              >
                {teamHint() ?? ""}
              </p>
            </div>
          </fieldset>

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
        </form>
      </Show>
    </div>
  );
}
