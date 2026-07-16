import type { SportsSeedEncoded } from "../../schema/sports.js";
import { MlbGames, MlbTeams } from "./data.js";
import { getMlbSourceId, getMlbSubjectId } from "./ids.js";

const feedIdsByTeam = new Map<number, ReturnType<typeof getMlbSourceId>[]>();

for (const [gamePk, _startsAt, homeTeamId, awayTeamId] of MlbGames) {
  const sourceId = getMlbSourceId(gamePk);

  for (const teamId of [homeTeamId, awayTeamId]) {
    const feedIds = feedIdsByTeam.get(teamId) ?? [];
    feedIds.push(sourceId);
    feedIdsByTeam.set(teamId, feedIds);
  }
}

export const subjects: SportsSeedEncoded["subjects"] = MlbTeams.map(
  ([teamId, location, name, display, abbreviation, slug]) => ({
    id: getMlbSubjectId(teamId),
    _tag: "sports_team",
    details: {
      _tag: "sports_team",
      leagueId: "mlb",
      location,
      name,
      display,
      abbreviation,
      slug,
    },
    feedIds: feedIdsByTeam.get(teamId) ?? [],
  }),
);
