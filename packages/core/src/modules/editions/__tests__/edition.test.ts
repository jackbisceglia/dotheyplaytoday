import { describe, expect, it } from "@effect/vitest";
import { ConfigProvider, DateTime, Effect } from "effect";

import { notification } from "../../notifier/__tests__/fixtures.js";
import { SubjectId } from "../../subjects/schema.js";
import { NotificationRecipient } from "../../subscriptions/service.js";
import { SubscriptionId } from "../../subscriptions/schema.js";
import { EmailAddress, UserId } from "../../users/schema.js";
import { college, mets } from "../../weekly-digest/__tests__/fixtures.js";
import { ThanksgivingFootball2026 as edition } from "../catalog.js";
import {
  editionGate,
  editionIdempotencyKey,
  editionRange,
  isEditionCronTick,
  selectEditionGames,
  selectEditionRecipients,
} from "../edition.js";
import { renderEdition } from "../email.js";
import { fan, nflTeam, slate, thanksgiving } from "./fixtures.js";

const at = (iso: string) => DateTime.makeUnsafe(iso);

const pick = (
  user: NotificationRecipient["user"],
  subject: NotificationRecipient["subscription"]["subject"],
  index: number,
) =>
  NotificationRecipient.make({
    user,
    subscription: {
      ...notification.subscription,
      id: SubscriptionId.make(
        `00000000-0000-4000-8000-${(950 + index).toString().padStart(12, "0")}`,
      ),
      userId: user.id,
      subject,
      subjectId: subject.id,
    },
  });

const other = {
  ...fan,
  id: UserId.make("00000000-0000-4000-8000-000000000102"),
  email: EmailAddress.make("other@example.com"),
};
const otherNfl = {
  ...nflTeam,
  id: SubjectId.make("00000000-0000-4000-8000-000000000399"),
};

describe("edition selection", () => {
  it("covers the Eastern calendar day", () => {
    const range = editionRange(edition);

    expect(DateTime.formatIso(range.from)).toBe("2026-11-26T05:00:00.000Z");
    expect(DateTime.formatIso(range.to)).toBe("2026-11-27T05:00:00.000Z");
  });

  it("features only Thanksgiving NFL games, in kickoff order", () => {
    expect(selectEditionGames(edition, slate)).toEqual([
      thanksgiving.bearsAtLions,
      thanksgiving.eaglesAtCowboys,
      thanksgiving.chiefsAtBills,
    ]);
    expect(
      selectEditionGames(edition, [
        { ...thanksgiving.bearsAtLions, availability: "cancelled" },
      ]),
    ).toEqual([]);
  });

  it("selects each verified NFL follower once", () => {
    const users = selectEditionRecipients(edition, [
      pick(fan, nflTeam, 0),
      pick(fan, otherNfl, 1),
      pick(fan, mets, 2),
      pick(other, mets, 3),
      pick(other, college, 4),
      pick(
        {
          ...other,
          id: UserId.make("00000000-0000-4000-8000-000000000103"),
          emailVerified: false,
        },
        nflTeam,
        5,
      ),
    ]);

    expect(users.map((user) => user.id)).toEqual([fan.id]);
  });

  it("keys delivery by edition and user only", () => {
    expect(editionIdempotencyKey(edition, fan)).toBe(
      `edition:thanksgiving-football-2026:${fan.id}`,
    );
  });
});

describe("edition send window", () => {
  it("opens at 2 PM ET and closes at the 4:30 PM ET kickoff", () => {
    expect(editionGate(edition, at("2026-11-26T18:59:59Z"))._tag).toBe(
      "not-yet-open",
    );
    expect(editionGate(edition, at("2026-11-26T19:00:00Z"))._tag).toBe("open");
    expect(editionGate(edition, at("2026-11-26T21:29:59Z"))._tag).toBe("open");
    expect(editionGate(edition, at("2026-11-26T21:30:00Z"))._tag).toBe(
      "closed",
    );
  });

  it("matches exactly one quarter-hour cron tick", () => {
    const ticks = Array.from({ length: 24 * 4 }, (_, index) =>
      DateTime.add(at("2026-11-26T00:00:00Z"), { minutes: index * 15 }),
    ).filter((tick) => isEditionCronTick(edition, tick));

    expect(ticks.map(DateTime.formatIso)).toEqual(["2026-11-26T19:00:00.000Z"]);
  });

  it("ships with the cron off", () => {
    expect(edition.send.cron).toBe("off");
  });
});

describe("edition email", () => {
  it.effect("renders the slate in the recipient's timezone", () =>
    Effect.gen(function* () {
      const games = selectEditionGames(edition, slate);
      const eastern = yield* renderEdition(edition, fan, games);
      const pacific = yield* renderEdition(
        edition,
        {
          ...fan,
          timezone: DateTime.zoneMakeNamedUnsafe("America/Los_Angeles"),
        },
        games,
      );

      expect(eastern.subject).toBe("Thanksgiving football is on");
      expect(eastern.body.text).toBe(
        [
          "Thanksgiving football.",
          "",
          "1:00 PM EST - Chicago Bears @ Detroit Lions",
          "4:30 PM EST - Philadelphia Eagles @ Dallas Cowboys",
          "8:20 PM EST - Kansas City Chiefs @ Buffalo Bills",
          "",
          "Manage teams: https://example.com/home",
          `Unsubscribe: https://example.com/unsubscribe/${fan.unsubscribeToken}`,
        ].join("\n"),
      );
      expect(eastern.body.html).toContain(
        'src="https://example.com/email/headlines/thanksgiving-football.png"',
      );
      expect(eastern.body.html).toContain('alt="Thanksgiving football."');
      expect(eastern.metadata?.unsubscribe).toContain(fan.unsubscribeToken);
      expect(pacific.body.text).toContain(
        "10:00 AM PST - Chicago Bears @ Detroit Lions",
      );
    }).pipe(
      Effect.provide(
        ConfigProvider.layer(
          ConfigProvider.fromUnknown({
            VITE_WEB_URL_BASE: "https://example.com",
          }),
        ),
      ),
    ),
  );
});
