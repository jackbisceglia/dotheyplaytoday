import type { EsportsSeedEncoded } from "../../schema/esports.js";

type CodEsportsEventSeed = EsportsSeedEncoded["events"][number];
type CdlScheduleEntry = readonly [
  matchId: string,
  startsAt: string,
  firstTeam: string,
  secondTeam: string,
];

// The 2027 season's Major 1 qualifier schedule has not been announced; the
// previous two seasons opened in early December. Matches are added once both
// teams and the start time are published.
// prettier-ignore
const Schedule: readonly CdlScheduleEntry[] = [];

export const events: readonly CodEsportsEventSeed[] = Schedule.map(
  ([matchId, startsAt, firstTeam, secondTeam]) => {
    const id = `00000000-0000-4000-8000-${matchId.padStart(12, "0")}`;

    return {
      id,
      _tag: "esports_match",
      sourceId: `esports_match:cdl:${id}`,
      startsAt,
      availability: "active",
      details: {
        _tag: "esports_match",
        gameId: "cod",
      },
      participants: [
        {
          _tag: "esports_match",
          details: {
            _tag: "esports_match",
            title: firstTeam,
          },
        },
        {
          _tag: "esports_match",
          details: {
            _tag: "esports_match",
            title: secondTeam,
          },
        },
      ],
    };
  },
);

export const getTeamFeedIds = (team: string) =>
  events
    .filter((event) =>
      event.participants.some(
        (participant) => participant.details.title === team,
      ),
    )
    .map((event) => event.sourceId);
