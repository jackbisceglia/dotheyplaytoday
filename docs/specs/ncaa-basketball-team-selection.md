# Team selection UI for NCAA men's basketball

Status: Phase 1 is implemented on branch `t3/spec-team-selection-ui`, built on
the backend thread's schema. Phase 2 is not started.
Date: 2026-10-14.

Current behavior and backend ownership are documented in `docs/product.md`
and `docs/architecture.md`. This UI design relies on these decisions:

- The league ID is `ncaam`, with `ncaaw` reserved.
- Conferences are browse metadata only.
- The logo strategy is still open.

**Scope decisions:**

- The NCAAM pane looks like the other team sports: a `team-card` grid under
  the league pills.
- A dropdown with no visible label chooses **Top 25** or a conference.
- The pane has no search, and there is no search across the whole picker.
- The UFC pane has its own layout and is not a model for team leagues.

## 1. What exists today

| Surface                    | File                                                                         | Behavior that matters here                                                                                                                                                                                                                                                                                                                                                                      |
| -------------------------- | ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Shared picker              | `packages/web/src/lib/ui/SubjectPicker.tsx`                                  | A `fieldset` with a visually hidden "League" legend holds the pill row (`.league-row` of `.league-pill` toggles with `aria-pressed`): `NBA NFL MLB NHL UFC`, plus a disabled `EPL` "Coming soon" pill. Under it, team leagues render a `.team-grid` of `.team-card` buttons (emoji glyph, abbreviation, display name), sorted by `display`. Pills are hidden for leagues that have no subjects. |
| Signup                     | `packages/web/src/lib/signup/Form.tsx`, `pages/Landing.tsx`                  | The page goes picks, then email and send time, then submit. The `selection-summary` bar (emoji, abbreviation, `n/4`) sits between the pills and the grid. A fifth pick shakes that card and shows the toast "You can select up to 4 picks…".                                                                                                                                                    |
| Dashboard edit             | `packages/web/src/lib/dashboard/Form.tsx`, `Roster.tsx`, `CatalogPicker.tsx` | The four roster tiles stay in place and each has a ×. The same `SubjectPicker` opens below them. A full draft fades unselected `.team-card`s to 0.45. A fixed bottom bar holds Cancel and Save. The draft saves with `POST /api/subscription`.                                                                                                                                                  |
| Limit                      | `core/modules/subscriptions/policy.ts`                                       | `subject: { min: 1, max: 4 }`, read through `SubscriptionPolicy`.                                                                                                                                                                                                                                                                                                                               |
| Schedule and roster labels | `Roster.tsx`, `Schedule.tsx`                                                 | The league tag is `leagueId.toUpperCase()`, which renders `NCAAM`. The `?team=` key is `${leagueId}-${abbreviation}`. Schedule rows bold the subscribed side by matching `normalizeName(team.display)` to `participant.title`.                                                                                                                                                                  |
| Catalog API                | `core/contracts/subjects.ts`                                                 | `GET /api/subjects` returns every subject as one array.                                                                                                                                                                                                                                                                                                                                         |

The live catalog (`api.dotheyplay.today/api/subjects`, measured 2026-10-13)
has **386 subjects**. The response is **79 KB raw and 12.5 KB gzipped**.

### 1.1 Scale check (verified)

These 2026–27 counts come from ESPN's season-2027 group rosters
(`sports.core.api.espn.com/.../seasons/2027/types/1/groups/{id}/teams`,
retrieved 2026-10-13). They match the backend spec.

| ACC | American | A-10 | Big 12 | Big East | Big Ten | MAC | MVC | Mountain West | SEC | WCC | **Total** |
| --: | -------: | ---: | -----: | -------: | ------: | --: | --: | ------------: | --: | --: | --------: |
|  18 |       13 |   14 |     16 |       11 |      18 |  12 |  11 |            10 |  16 |  10 |   **149** |

These counts reflect the 2026 realignment:

- Mountain West adds Hawai'i, UC Davis, and UTEP. It loses Boise State,
  Colorado State, Fresno State, San Diego State, and Utah State to the Pac-12.
- WCC adds Denver and loses Gonzaga to the Pac-12.
- MAC includes UMass. Northern Illinois left the MAC for non-football sports.

All of men's D-I is 366 teams in 32 conferences. Adding NCAAM brings the
catalog to about 535 subjects, roughly 18 KB gzipped.

**AP poll timing.** As of 2026-10-14, the 2026–27 AP preseason poll doesn't
appear to be out. Past preseason polls came out in mid-October (2025-10-13,
2023-10-16). The pane has to work before any rankings exist (§5).

## 2. Design

### 2.1 Structure

```
SubjectPicker
├─ Picker header row
│  ├─ League pills       NBA NFL MLB NHL NCAAM UFC [EPL soon]   (left, scrolls)
│  └─ Group dropdown     [Top 25 ▾]                             (right; new, NCAAM only)
├─ (children slot)       signup: selection summary
└─ Pane
   ├─ league=ufc   → UfcPicker (unchanged)
   └─ otherwise    → team-card grid (unchanged; NCAAM filtered by group)
```

- **NCAAM pill.** `NCAAM` goes after `NHL` and before `UFC`, following the
  existing `leagues = [...sportsLeagues, ufc]` order. The default league pill
  (NBA) doesn't change.
- **Group dropdown.** A native `<select>` that renders only while NCAAM is
  active. Where it goes depends on the viewport, and was checked against the
  real `global.css`:
  - **900px and wider:** on the league-pill line, right-aligned. A new
    wrapper holds the existing `.league-row` (`flex: 1; min-width: 0`, still
    scrolling) and the select (`flex: none`). The select is as tall as a
    pill, so showing or hiding it doesn't move the grid.
  - **561–899px:** on its own line under the pills, left-aligned at its
    natural width. Below 900px the seven pills plus the select no longer fit
    on one line: the pills are about 565px wide, the select about 205px, plus
    a gap.
  - **560px and narrower (phones):** on its own line at full width. A small
    right-aligned select on its own line looked orphaned. Full width reads as
    deliberate and gives a larger tap target.
  - The 900px breakpoint depends on how wide the pill row is. Recheck it
    whenever a league pill is added, since each pill adds about 80px.
  - Options: `Top 25`, then an `<optgroup label="Conferences">` with each
    conference's label from web's `lib/catalog/sports/ncaam.ts`, sorted by
    `localeCompare`: `ACC, American, Atlantic 10, Big 12, Big East, Big Ten,
MAC, Missouri Valley, Mountain West, SEC, WCC`.
  - Only conferences that have subjects get an option, so the list grows on
    its own to 32 without layout changes.
  - Default: `Top 25`. If no team has a ranking yet, the `Top 25` option is
    absent and the first conference (ACC) is selected.
  - The selection is local state. It resets when the user leaves the NCAAM
    pill and isn't written to the URL.
- **No visible label.** The selected value ("Top 25", "ACC") describes the
  grid by itself. The accessible name comes from `aria-label="Teams"`.
- **Style.** Use the `.league-pill` type, border, padding, and line height
  (condensed, heavy, uppercase, 2px ink, paper fill) with `appearance: none`
  and a trailing ▾ chevron. That way its height matches the pills it sits
  beside. Leave the width at the native default (the longest option, `Mountain
West`), so it doesn't resize when the selection changes. It reads as part of
  the pill system, not as a form field. The browser's native picker handles
  the open state, including the sheet on phones.

### 2.2 NCAAM cards

NCAAM cards use the same `.team-card` and `.team-grid` as the pro leagues:
glyph, abbreviation, name, and the same pressed, rejected, and faded states.

- **Glyph.** 🏀 comes from a new `ncaam` branch in `getSportsLogo`. School
  logos are a later decision.
- **Abbreviation.** The catalog `abbreviation`: `DUKE`, `M-OH`, `TA&M`,
  `CONN`.
- **Name line.** `display`, which follows the pro convention of school plus
  nickname: "Duke Blue Devils", "Miami Hurricanes", "Miami (OH) RedHawks". It
  matches ESPN's team `displayName` and the participant titles in game data,
  so schedule bolding works unchanged (§4).
- **Top 25 view.**
  - Cards appear in rank order, filling rows left to right like every other
    grid. Teams tied on rank sort by `display`.
  - Each card shows its rank as a small muted numeral in the top-right corner
    (tabular figures). The rank sits outside the text column, so the card's
    layout and size match the conference view.
  - Ranked teams outside our coverage, such as Gonzaga, are skipped. Rank
    numbers stay real, so gaps (…6, 8…) are expected and get no explanatory
    copy.
- **Conference view.** Cards are sorted by `display`, as in the pro grids,
  with no rank badge.
- **Grid sizes.** Desktop shows up to 25 cards (Top 25), or 10–18 for a
  conference. Phones use the existing 2-column grid.

### 2.3 Selected summary and four-pick limit

- **Signup summary.** The `.selection-summary` bar becomes
  `position: sticky; top: 0` inside the signup section. Each pick in it
  becomes a button named "Remove Duke Blue Devils" that removes the pick on
  tap. This lets users free a slot at 4/4 without switching views.
- **Dashboard count.** Show `3/4` (in `form-label` style, with the same
  `aria-label` as signup) on the left of the fixed `dashboard-actions` bar.
  The roster tiles scroll away on phones, so the count needs a place that
  stays visible.
- **At 4/4.** Signup adopts the dashboard's existing `data-full` fade on
  `.team-card`. Faded cards stay focusable and pressable. Pressing one shakes
  it and shows the existing toast. Nothing gets `disabled` or `aria-disabled`.
- **Order.** Picks keep insertion order, as they do today.

### 2.4 Keyboard and screen reader

- The dropdown is a native `<select aria-label="Teams">`, so arrow keys,
  type-ahead, and screen-reader option lists work without custom code. The
  optgroup is announced as "Conferences".
- Changing the selection announces the card count ("25 teams", "18 teams")
  through a `visually-hidden` polite live region. Focus stays on the select.
- A card's accessible name is its visible text. Top 25 cards add the rank
  through a visually hidden prefix ("Rank 3"), following UFC's
  `<span class="visually-hidden">P4P rank </span>` pattern.
- Focus rings, target sizes, and the reduced-motion handling all
  come from the existing `.team-card` and `.league-pill` styles. The select
  reuses the existing `:focus-visible` outline.

## 3. Wireframes

### 3.1 Desktop, NCAAM, Top 25 (default)

```
 [NBA] [NFL] [MLB] [NHL] [■NCAAM■] [UFC] (EPL)                       [ TOP 25 ▾ ]   ← ≥900px: same line, right
┃ 🏀 DUKE │ 🐻 CHI                                               2/4 ┃  ← sticky (signup)
┌─────────1┐┌─────────2┐┌─────────3┐┌─────────4┐┌─────────6┐┌─────────7┐
│🏀 DUKE   ││🏀 FLA    ││🏀 CONN   ││🏀 HOU    ││🏀 PUR    ││🏀 UK     │
│Duke Blue ││Florida   ││UConn     ││Houston   ││Purdue    ││Kentucky  │
│Devils  ✓ ││Gators    ││Huskies   ││Cougars   ││Boilermak…││Wildcats  │
└──────────┘└──────────┘└──────────┘└──────────┘└──────────┘└──────────┘
  … through 25. #5 here is an uncovered team (e.g. Pac-12), skipped. Ranks are placeholders.
```

### 3.2 Desktop, conference

```
 [NBA] [NFL] [MLB] [NHL] [■NCAAM■] [UFC] (EPL)                          [ ACC ▾ ]
┌──────────┐┌──────────┐┌──────────┐┌──────────┐┌──────────┐┌──────────┐
│🏀 BC     ││🏀 CAL    ││🏀 CLEM   ││🏀 DUKE   ││🏀 FSU    ││🏀 GT     │
│Boston    ││California││Clemson   ││Duke Blue ││Florida   ││Georgia   │
│College … ││Golden B… ││Tigers    ││Devils    ││State …   ││Tech …    │
└──────────┘└──────────┘└──────────┘└──────────┘└──────────┘└──────────┘
```

### 3.3 Mobile (375px)

```
[NHL][■NCAAM■][UFC][EPL→        ← existing scroll
[ BIG EAST               ▾ ]     ← own line, full width on phones; opens the native sheet
┃DUKE│CONN│CHI │M-OH       4/4┃  ← sticky; tap a pick to remove
┌─────────────┐┌─────────────┐
│🏀 BTLR      ││🏀 CREI      │  ← faded at 4/4; tapping shakes + toast
│Butler       ││Creighton    │
│Bulldogs     ││Bluejays     │
└─────────────┘└─────────────┘
┌─────────────┐┌─────────────┐
│🏀 CONN    ✓ ││🏀 DEP       │  ← selected keeps full strength
│UConn Huskies││DePaul Blue… │
└─────────────┘└─────────────┘
```

The dashboard edit layout is unchanged apart from the group dropdown and the `n/4`
count in the action bar.

## 4. Required catalog and API metadata

Every sports team uses required `league: { id, conferenceId }` membership,
including pro teams. Core validates each league's conference IDs; web owns
their labels. NCAAM alone has nullable `league.apRank`; a missing encoded
rank defaults to null on decoding. The versioned catalog seed updates records.
The legacy-row migration must also be satisfied before rollout. In the table
below, `leagueId` means `league.id` and `conferenceId` means
`league.conferenceId` for sports-team subjects.

| Field                                  | Need                                                                                                                    | Example                                                              | Used by                                  |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- | ---------------------------------------- |
| `leagueId`                             | `"ncaam"` (with `"ncaaw"` reserved)                                                                                     | `ncaam`                                                              | Pill, league tag, `getSportsLogo` branch |
| `display`                              | School plus nickname, matching ESPN `displayName` and the participant titles in game data. **Unique within the league** | `Miami Hurricanes`, `Miami (OH) RedHawks`, `Loyola Chicago Ramblers` | Card name line, schedule matching        |
| `location`                             | School name                                                                                                             | `Miami (OH)`                                                         | Reserved for future use                  |
| `name`                                 | Nickname                                                                                                                | `RedHawks`                                                           | Roster tile line (`RedHawks · NCAAM`)    |
| `abbreviation`                         | ≤5 characters and **unique within the league**, enforced by a data test                                                 | `M-OH`, `TA&M`, `CONN`                                               | Card, summary, roster, `?team=` key      |
| `conferenceId` _(new, backend thread)_ | Required conference ID validated by core; display labels live in web's `lib/catalog/sports/ncaam.ts`                   | `"mac"` → "MAC"                                                      | Dropdown options and grouping            |
| `league.apRank` _(NCAAM only)_         | Integer 1–25 from the latest AP poll, or null for unranked/unavailable. Missing encoded keys decode to null.             | `3`                                                                  | Top 25 option, order, and badge          |

Constraints for the data spec:

- **Unique identifiers already hold in ESPN's data.** ESPN's 362-team men's
  D-I roster has no duplicate abbreviations and no duplicate display names
  (checked 2026-10-13), so the existing `?team=` key keeps working. `TA&M`
  relies on the router's existing URL encoding.
- **Ranking refreshes are catalog imports.** The AP poll publishes weekly from
  the preseason poll through the final poll after the NCAA tournament. Each
  refresh sets `apRank` on the newly ranked teams and clears it on the rest.
  - Record the poll date in the source, the same way `ufc/subjects.ts` does.
  - A stale poll only affects browse order, never notifications.
- **League label.** `lib/catalog/sports/index.ts` labels the pill `NCAAM`.
  The backend thread's `NCAA MBB` is replaced so the pill matches the roster
  and schedule tags.

**API:** no new endpoint. Every subject exposes `details.league.id`;
sports teams additionally require `details.league.conferenceId`. MMA fighter
and tracking subjects use `league: { id: "ufc" }` without conferences.
Shared UI labels read `details.league.id` directly. Event details retain
their existing `leagueId` fields. A broader CombatSports model is deferred
to [#185](https://github.com/jackbisceglia/dotheyplaytoday/issues/185).

## 5. States

- **Loading and catalog errors:** unchanged. Landing shows "Loading teams…" or
  "We couldn't load the team list. [Try again]". The dashboard shows the shell
  splash or "We couldn't load the available picks. [Try again]".
- **No AP poll yet, or no covered team is ranked:** there is no `Top 25`
  option, and the first conference is selected. The option appears once a
  poll is imported.
- **NCAAM not deployed:** no NCAAM pill, and so no dropdown.
- **Conference with no subjects:** no option for that conference.
- **Save and submit errors:** unchanged.

## 6. Performance

The largest grid has 25 cards. Switching groups filters and sorts about 149
subjects in memory. Nothing here needs virtualization, pagination, or
server-side filtering. The payload stays small: about 18 KB gzipped, and about
40 KB even with all of D-I for both men and women.

## 7. Signup vs. subscription management

I checked the editing APIs in the source; they already exist.

- `GET` and `POST /api/subscription` take
  `{ subjectIds: NonEmpty, max 4, schedule }`. Both require a session, and
  `POST` **replaces** the whole set atomically. The dashboard's draft, Cancel,
  and Save already use them.
- There is no per-pick add or remove endpoint, and none is needed. Both
  surfaces share `SubjectPicker`, so they get the NCAAM pane and the limit
  behavior together.
- `DuplicateSignup` still leaves existing picks untouched.
- Conferences and the Top 25 are views, never subscriptions.
- Every limit check reads `SubscriptionPolicy.subject.constraints.max`.
  Changing the limit is out of scope.

## 8. Component responsibilities

| Component / module                            | Responsibility                                                                                                                                                                                                                                             | Change |
| --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| `lib/ui/SubjectPicker.tsx`                    | Renders the group dropdown while NCAAM is active, and feeds the existing grid the group's teams. Each Top 25 card gets the rank badge.                                                                                                                     | Modify |
| `lib/catalog/college.ts` _(new)_              | `isCollegeTeam` uses the generated league guard to narrow teams at the picker boundary. `getCollegeGroups(teams, labels)` returns Top 25 availability and sorted conferences; `getCollegeTeams(teams, group)` returns ordered teams. Labels are owned by the league's web catalog module. | New    |
| `lib/catalog/sports/index.ts`                 | Adds the `ncaam` entry `{ id, label: "NCAAM", name }` and a `getSportsLogo` branch returning 🏀.                                                                                                                                                           | Modify |
| `lib/signup/Form.tsx`                         | Phase 2: sticky, removable summary and `data-full`.                                                                                                                                                                                                        | Modify |
| `lib/dashboard/Form.tsx`                      | Phase 2: count in `dashboard-actions`.                                                                                                                                                                                                                     | Modify |
| `styles/global.css`                           | Phase 1: the pill-styled select and the card rank badge. Phase 2: sticky summary, signup fade, action-bar count.                                                                                                                                           | Modify |
| `Roster.tsx`, `Schedule.tsx`, `UfcPicker.tsx` | No change.                                                                                                                                                                                                                                                 | —      |

If the dropdown grows past a few lines in `SubjectPicker`, extract it into
`lib/ui/GroupSelect.tsx`. Don't do this up front.

## 9. Acceptance criteria

1. Pro panes, the UFC pane, and the default league pill behave exactly as
   they do today.
2. The `NCAAM` pill appears between `NHL` and `UFC`, and only when `ncaam`
   subjects exist.
3. With NCAAM active, a native dropdown with no visible label (accessible
   name "Teams") appears. At 900px and wider it sits right-aligned on the
   league-pill line, and showing it doesn't shift the grid. From 561 to
   899px it sits on its own line, left-aligned. At 560px and narrower it sits
   on its own line at full width. The pills and select never overlap or clip
   each other at any width. It lists `Top 25`, then a
   "Conferences" optgroup with the 11 conferences sorted by short label. It's
   hidden for every other league.
4. With a poll imported, `Top 25` is the default. Covered ranked teams render
   as standard `.team-card`s in rank order, each with its real rank badge.
   Uncovered ranked teams are skipped without renumbering.
5. With no `apRank` values, there is no `Top 25` option and the first
   conference is selected.
6. Choosing a conference shows its teams as standard cards sorted by
   `display`, and the count is announced.
7. NCAAM cards share size, states, and spacing with the pro cards. A fifth
   pick shakes the card and shows the existing toast.
8. (Phase 2) The signup summary stays visible while scrolling, and each pick
   in it removes itself. The dashboard action bar shows `n/4`.
9. `?team=ncaam-m-oh` filters the dashboard schedule to Miami (OH), and the
   subscribed side is bolded in NCAAM schedule rows.
10. `pnpm lint` and `pnpm typecheck` pass. Unit tests cover group discovery
    and sort, Top 25 order (ties and gaps), Top 25 absence, and conference
    sort.

Browser checks cover criteria 3–8, in the style of
`docs/runbooks/solid-web-smoke.md`. Reactive behavior isn't unit-testable as
configured.

## 10. Phased plan

**Phase 0: data dependency (backend spec).** Add `ncaam` and the 149 subjects
with `conference` and the ESPN-style `display`. Enforce unique `display` and
`abbreviation`. Add the nullable `apRank`, and import the preseason AP poll
once it's published.

**Phase 1: NCAAM grid (one PR).** This covers:

- `lib/catalog/college.ts` and its tests.
- The `ncaam` league entry and logo branch.
- The group dropdown and rank badge in `SubjectPicker.tsx`.
- The select and badge CSS.
- An NCAAM paragraph in `docs/product.md`.
- A weekly poll-refresh step in a catalog runbook.

**Phase 2: selection ergonomics (small PR, optional).** The sticky, removable
signup summary; the signup `data-full` fade; and the action-bar count.

**Phase 3: later, separate decisions.**

- **`ncaaw`:** reuses the dropdown and helpers with `leagueId="ncaaw"`.
- **More conferences:** start with the Pac-12 decision. The dropdown takes
  32 conferences without layout changes.
- **School logos:** they replace 🏀 in the existing glyph slot.
- **Search:** only if people can't find their school by conference.

## 11. Open questions for the owner

1. Is `NCAAM` the right label for the pill and tag, or would "College" or
   "CBB" be better?
2. Should the Top 25 use the AP poll or the Coaches poll? This spec assumes
   AP.
3. Should the Pac-12 be prioritized? It likely holds several ranked teams that
   would otherwise show up as gaps in the Top 25.

Unrelated issue found during review: pressing Enter in the UFC fighter search
submits the signup form.
