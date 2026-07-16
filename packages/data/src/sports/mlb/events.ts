import type { SportsSeedEncoded } from "../../schema/sports.js";
import { MlbGames, MlbTeams } from "./data.js";
import { getMlbEventId, getMlbSourceId } from "./ids.js";

const teamDisplays = new Map<number, string>(
  MlbTeams.map(([id, _location, _name, display]) => [id, display]),
);

const getTeamDisplay = (teamId: number) => {
  const display = teamDisplays.get(teamId);

  if (!display) {
    throw new Error(`Missing MLB team ${teamId.toString()}`);
  }

  return display;
};

export const events: SportsSeedEncoded["events"] = MlbGames.map(
  ([gamePk, startsAt, homeTeamId, awayTeamId]) => ({
    id: getMlbEventId(gamePk),
    _tag: "sports_game",
    sourceId: getMlbSourceId(gamePk),
    startsAt,
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "mlb",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: getTeamDisplay(homeTeamId),
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: getTeamDisplay(awayTeamId),
        },
      },
    ],
  }),
);
