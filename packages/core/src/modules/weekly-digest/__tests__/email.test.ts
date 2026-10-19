import { describe, expect, it } from "@effect/vitest";
import { ConfigProvider, DateTime, Effect } from "effect";

import { renderWeeklyDigest } from "../email.js";
import { SportsScheduleRenderError } from "../sports.js";
import { type WeeklyDigest } from "../schema.js";
import { digest, makeGame, mets, knicks } from "./fixtures.js";

const config = ConfigProvider.layer(
  ConfigProvider.fromUnknown({ VITE_WEB_URL_BASE: "https://example.com" }),
);
const render = (input: WeeklyDigest) =>
  renderWeeklyDigest(input).pipe(Effect.provide(config));

describe("weekly digest email", () => {
  it.effect(
    "renders the agreed By team format with quiet teams and working links",
    () =>
      Effect.gen(function* () {
        const email = yield* render(digest);

        expect(email.subject).toBe("Your Weekly Update");
        expect(email.body.text).not.toContain("Oct 5 – Oct 11");
        expect(email.body.html).not.toContain("Oct 5 – Oct 11");
        expect(email.body.text).toContain("New York Mets");
        expect(email.body.text).toContain(
          "- New York Mets vs Atlanta Braves\n  Mon, Oct 5, 7:10 PM",
        );
        expect(email.body.text).toContain(
          "- New York Mets @ Philadelphia Phillies\n  Fri, Oct 9, 7:05 PM",
        );
        expect(email.body.text).toContain(
          "New York Rangers\nNo games this week.",
        );
        expect(email.body.text).not.toMatch(
          /All times|America\/New_York|EDT|EST|games across|\d+ games|Schedule as of|Your week, all in one place/,
        );
        expect(email.body.text).toContain(
          "Manage teams: https://example.com/home",
        );
        expect(email.metadata?.unsubscribe).toBe(
          `https://example.com/unsubscribe/${digest.user.unsubscribeToken}`,
        );
        expect(email.body.html).toContain("New York Mets vs Atlanta Braves");
        expect(email.body.html.match(/&bull;/g)).toHaveLength(6);
        expect(email.body.html).toContain(
          'src="https://example.com/email/headlines/your-teams-this-week.png"',
        );
        expect(email.body.html).toContain('alt="Your teams. This week."');
      }),
  );

  it.effect(
    "includes a quiet-week email rather than silently dropping it",
    () =>
      Effect.gen(function* () {
        const email = yield* render({
          ...digest,
          groups: [
            { ...digest.groups[0], events: [] },
            ...digest.groups.slice(1).map((team) => ({ ...team, events: [] })),
          ],
        });

        for (const team of digest.groups)
          expect(email.body.text).toContain(team.subject.details.display);
        expect(email.body.text.match(/No games this week\./g)).toHaveLength(4);
      }),
  );

  it.effect(
    "shows a shared fixture from each followed team’s home or away perspective",
    () =>
      Effect.gen(function* () {
        const game = makeGame(
          mets,
          knicks.details.display,
          "2026-10-05T23:10:00Z",
          716,
        );
        const email = yield* render({
          ...digest,
          groups: [
            { subject: mets, events: [game] },
            { subject: knicks, events: [game] },
          ],
        });

        for (const body of [email.body.text, email.body.html]) {
          expect(body).toContain("New York Mets vs New York Knicks");
          expect(body).toContain("New York Knicks @ New York Mets");
        }
      }),
  );

  it.effect(
    "sorts games chronologically and displays dates in the recipient timezone",
    () =>
      Effect.gen(function* () {
        const lateSunday = makeGame(
          mets,
          "Atlanta Braves",
          "2026-10-12T03:30:00Z",
          717,
        );
        const earlyMonday = makeGame(
          mets,
          "Philadelphia Phillies",
          "2026-10-05T04:30:00Z",
          718,
        );
        const email = yield* render({
          ...digest,
          groups: [{ subject: mets, events: [lateSunday, earlyMonday] }],
        });

        expect(email.body.text).toContain(
          "- New York Mets vs Atlanta Braves\n  Sun, Oct 11, 11:30 PM",
        );
        expect(email.body.text.indexOf("Mon, Oct 5")).toBeLessThan(
          email.body.text.indexOf("Sun, Oct 11"),
        );
      }),
  );

  it.effect("escapes team and opponent copy in HTML", () =>
    Effect.gen(function* () {
      const subject = {
        ...mets,
        details: { ...mets.details, display: "Mets <Home> & Fans" },
      };
      const event = makeGame(
        subject,
        "Braves <Away> & Friends",
        "2026-10-05T23:10:00Z",
        719,
      );
      const email = yield* render({
        ...digest,
        groups: [{ subject, events: [event] }],
      });
      expect(email.body.text).toContain("Mets <Home> & Fans");
      expect(email.body.html).toContain("Mets &lt;Home&gt; &amp; Fans");
      expect(email.body.html).toContain("Braves &lt;Away&gt; &amp; Friends");
      expect(email.body.html).not.toContain("Braves <Away>");
    }),
  );

  it.effect(
    "keeps local start times correct across DST without timezone labels",
    () =>
      Effect.gen(function* () {
        const email = yield* render({
          ...digest,
          from: DateTime.makeUnsafe("2026-10-26T04:00:00Z"),
          to: DateTime.makeUnsafe("2026-11-02T05:00:00Z"),
          groups: [
            {
              subject: mets,
              events: [
                makeGame(mets, "Braves", "2026-10-31T23:00:00Z", 720),
                makeGame(mets, "Braves", "2026-11-01T23:00:00Z", 721),
              ],
            },
          ],
        });

        expect(email.body.text).toContain("7:00 PM");
        expect(email.body.text).toContain("6:00 PM");
        expect(email.body.text).not.toContain("Oct 26 – Nov 1");
        expect(email.body.text).not.toMatch(/EDT|EST/);
      }),
  );

  it.effect(
    "rejects malformed participants or an unidentified subject rather than guessing home/away",
    () =>
      Effect.gen(function* () {
        const game = makeGame(mets, "Braves", "2026-10-05T23:10:00Z", 722);
        for (const event of [
          { ...game, participants: [] },
          {
            ...game,
            participants: [...game.participants, ...game.participants],
          },
        ]) {
          const error = yield* render({
            ...digest,
            groups: [{ subject: mets, events: [event] }],
          }).pipe(Effect.flip);
          expect(error).toBeInstanceOf(SportsScheduleRenderError);
        }

        const error = yield* render({
          ...digest,
          groups: [{ subject: knicks, events: [game] }],
        }).pipe(Effect.flip);
        expect(error.message).toContain("does not match");
      }),
  );
});
