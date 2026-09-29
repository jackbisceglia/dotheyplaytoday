# Update a league's schedule

Refresh one league's games in the checked-in production catalog
(`packages/data/src/sports/<league>/`). Do one league per PR so catalog changes
stay reviewable and revertable. The file layout below is described for MLB;
notes on other leagues are at the end.

## Rules

- Touch only the league's `events.ts` and `subjects.ts` plus `CatalogSeedVersion`
  in `packages/data/src/seed/config.ts`. Never mix leagues in one change.
- Add only games that are certain to happen: both teams known, date and time
  published. Skip "if necessary" games (for example a Game 3 in a best-of-three
  round) and games with placeholder teams (`ATL/PHI`, `AL Lower Seed`). Add them
  in a later pass, once they are decided.
- Never delete or rewrite an existing game's id. Correct the time in place. If a
  game will not be played, set `availability: "cancelled"` instead of removing it.
- Every added game must be referenced from both teams' `feedIds`. An event
  missing from a `feedIds` list never reaches subscribers.

## Steps

1. Search the web for the league's schedule over the window you are updating
   (for example the next few days, or the next playoff round). Prefer the
   league's official site or ESPN, and cross-check a second source for times.
   Collect for each game: home team, away team, start time in UTC, and whether
   it is scheduled, postponed, or cancelled. Also note any stable id the source
   publishes for the game; use it in the event id if the league's existing
   entries do.

2. Decide which games qualify under the rules above. Also compare the pulled
   window with what is already in the catalog: any catalog game whose state is
   cancelled or whose time changed at the source needs an in-place fix (the
   2026-09-27 Yankees-Orioles nor'easter cancellation was one).

3. Add each game to `events.ts`, before the closing
   `} as const satisfies ...`, copying an existing entry:
   - key: `_<sourceGameId>`
   - `id`: `00000000-0000-4000-8000-100000<sourceGameId>` (MLB uses the 6-digit
     game id; match the pattern of the league's existing entries)
   - `sourceId`: `sports_game:mlb:<id>`
   - `startsAt`: the UTC start time
   - `availability: "active"`
   - participants: one `home`, one `away`, `title` equal to the team's
     `display` value in `subjects.ts` .

4. In `subjects.ts`, append `Games._<sourceGameId>.sourceId,` to the end of `feedIds`
   for both the home and away team.

5. Bump `CatalogSeedVersion` in `packages/data/src/seed/config.ts` to today's
   date with a `.1` suffix (`.2` for a second change the same day). The seed
   only reruns when this changes.

6. Verify:

   ```sh
   pnpm --filter @dtpt/core build
   pnpm --filter @dtpt/data typecheck
   pnpm --filter @dtpt/data test
   pnpm lint && pnpm typecheck
   ```

   `git diff --stat` should show exactly the three files above.

7. Open a PR titled `feat(data): add MLB wild card series schedule` (or `fix(data)`
   for corrections) describing the source query and which games were
   deliberately left out.

## Other leagues

NBA and NHL events are generated from ESPN schedule entries and have
`schedule.test.ts` count checks (`announcedGameCount`); update those counts
alongside the data. NFL follows the same file layout as MLB. Keep the same id and `feedIds`
conventions already used in that league's files.

## Later postseason passes (MLB)

After each round is decided, rerun steps 1-6 for the newly known games:
division series once the wild card winners are set, then the LCS and World
Series. Later rounds show real team names once they are determined. Series games beyond the guaranteed minimum are added only once the
series is still alive.
