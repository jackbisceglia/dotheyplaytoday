export const getMlbEventId = (gamePk: number) =>
  `00000000-0000-4000-8000-1${String(gamePk).padStart(11, "0")}` as const;

export const getMlbSourceId = (gamePk: number) =>
  `sports_game:mlb:${getMlbEventId(gamePk)}` as const;

export const getMlbSubjectId = (teamId: number) =>
  `00000000-0000-4000-8000-2${String(teamId).padStart(11, "0")}` as const;
