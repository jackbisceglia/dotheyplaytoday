import type { MmaImportInput } from "./schema.js";

// Initial curated coverage: verified headliners only, not a complete UFC roster.
// See docs/runbooks/update-ufc-catalog.md before changing identities or authority.
const fighters = [
  {
    id: "c759cf80-2526-432b-8010-000000000001",
    name: "Natalia Silva",
    slug: "natalia-silva",
  },
  {
    id: "c759cf80-2526-432b-8010-000000000002",
    name: "Wang Cong",
    slug: "wang-cong",
  },
  {
    id: "c759cf80-2526-432b-8010-000000000003",
    name: "Brendan Allen",
    slug: "brendan-allen",
  },
  {
    id: "c759cf80-2526-432b-8010-000000000004",
    name: "Christian Leroy Duncan",
    slug: "christian-leroy-duncan",
  },
] as const;

export const ufcCatalog = {
  fighters: fighters.map((fighter) => ({
    id: fighter.id,
    details: {
      _tag: "mma_fighter",
      leagueId: "ufc",
      display: fighter.name,
      profileUrl: `https://www.ufc.com/athlete/${fighter.slug}`,
    },
  })),
  cards: [
    {
      id: "b51165b6-7428-4620-a02e-000000000001",
      sourceId: "mma_card:ufc:b51165b6-7428-4620-a02e-000000000001",
      availability: "active",
      startsAt: "2026-10-03T20:00:00.000Z",
      boutsComplete: false,
      details: {
        _tag: "mma_card",
        leagueId: "ufc",
        title: "UFC 332: Silva vs Wang",
        kind: "numbered",
        sourceUrl: "https://www.ufc.com/event/ufc-332",
        reviewedAt: "2026-10-03T12:00:00.000Z",

        venue: "Delta Center, Salt Lake City",
        timings: {
          earlyPrelims: "2026-10-03T20:00:00.000Z",
          prelims: "2026-10-03T22:00:00.000Z",
          mainCard: "2026-10-04T00:00:00.000Z",
        },
        bouts: [
          {
            id: "94f93873-805a-44e0-a08d-000000000001",
            status: "scheduled",
            segment: "main",
            fighters: fighters.slice(0, 2).map((fighter) => ({
              subjectId: fighter.id,
              title: fighter.name,
            })),
          },
        ],
      },
    },
    {
      id: "b51165b6-7428-4620-a02e-000000000002",
      sourceId: "mma_card:ufc:b51165b6-7428-4620-a02e-000000000002",
      availability: "active",
      startsAt: "2026-10-10T21:00:00.000Z",
      boutsComplete: false,
      details: {
        _tag: "mma_card",
        leagueId: "ufc",
        title: "UFC Fight Night: Allen vs Duncan",
        kind: "fight_night",
        sourceUrl:
          "https://www.ufc.com/news/tickets-sale-october-10-october-31-and-november-7-ufc-fight-night-events-meta-apex",
        reviewedAt: "2026-10-03T12:00:00.000Z",

        venue: "Meta APEX, Las Vegas",
        timings: {
          prelims: "2026-10-10T21:00:00.000Z",
          mainCard: "2026-10-11T00:00:00.000Z",
        },
        bouts: [
          {
            id: "94f93873-805a-44e0-a08d-000000000002",
            status: "scheduled",
            segment: "main",
            fighters: fighters.slice(2, 4).map((fighter) => ({
              subjectId: fighter.id,
              title: fighter.name,
            })),
          },
        ],
      },
    },
  ],
} satisfies MmaImportInput;
