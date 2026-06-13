import type { SportsSeedEncoded } from "../../schema/sports.js";

type NflSportEventSeed = SportsSeedEncoded["events"][number];

export const Games = {
  Week1: {
    PatriotsAtSeahawks: {
      id: "00000000-0000-4000-8000-000401872656",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401872656",
      startsAt: "2026-09-10T00:20:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Seattle Seahawks",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "New England Patriots",
          },
        },
      ],
    },
    _49ersAtRams: {
      id: "00000000-0000-4000-8000-000401872657",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401872657",
      startsAt: "2026-09-11T00:35:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Los Angeles Rams",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "San Francisco 49ers",
          },
        },
      ],
    },
    FalconsAtSteelers: {
      id: "00000000-0000-4000-8000-000401872658",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401872658",
      startsAt: "2026-09-13T17:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Pittsburgh Steelers",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Atlanta Falcons",
          },
        },
      ],
    },
    RavensAtColts: {
      id: "00000000-0000-4000-8000-000401872659",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401872659",
      startsAt: "2026-09-13T17:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Indianapolis Colts",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Baltimore Ravens",
          },
        },
      ],
    },
    BillsAtTexans: {
      id: "00000000-0000-4000-8000-000401872660",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401872660",
      startsAt: "2026-09-13T17:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Houston Texans",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Buffalo Bills",
          },
        },
      ],
    },
    BearsAtPanthers: {
      id: "00000000-0000-4000-8000-000401872661",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401872661",
      startsAt: "2026-09-13T17:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Carolina Panthers",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Chicago Bears",
          },
        },
      ],
    },
    BrownsAtJaguars: {
      id: "00000000-0000-4000-8000-000401872922",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401872922",
      startsAt: "2026-09-13T17:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Jacksonville Jaguars",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Cleveland Browns",
          },
        },
      ],
    },
    SaintsAtLions: {
      id: "00000000-0000-4000-8000-000401872923",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401872923",
      startsAt: "2026-09-13T17:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Detroit Lions",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "New Orleans Saints",
          },
        },
      ],
    },
    JetsAtTitans: {
      id: "00000000-0000-4000-8000-000401872924",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401872924",
      startsAt: "2026-09-13T17:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Tennessee Titans",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "New York Jets",
          },
        },
      ],
    },
    BuccaneersAtBengals: {
      id: "00000000-0000-4000-8000-000401872925",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401872925",
      startsAt: "2026-09-13T17:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Cincinnati Bengals",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Tampa Bay Buccaneers",
          },
        },
      ],
    },
    CardinalsAtChargers: {
      id: "00000000-0000-4000-8000-000401872926",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401872926",
      startsAt: "2026-09-13T20:25:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Los Angeles Chargers",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Arizona Cardinals",
          },
        },
      ],
    },
    PackersAtVikings: {
      id: "00000000-0000-4000-8000-000401872927",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401872927",
      startsAt: "2026-09-13T20:25:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Minnesota Vikings",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Green Bay Packers",
          },
        },
      ],
    },
    DolphinsAtRaiders: {
      id: "00000000-0000-4000-8000-000401872928",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401872928",
      startsAt: "2026-09-13T20:25:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Las Vegas Raiders",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Miami Dolphins",
          },
        },
      ],
    },
    CommandersAtEagles: {
      id: "00000000-0000-4000-8000-000401872929",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401872929",
      startsAt: "2026-09-13T20:25:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Philadelphia Eagles",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Washington Commanders",
          },
        },
      ],
    },
    CowboysAtGiants: {
      id: "00000000-0000-4000-8000-000401872930",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401872930",
      startsAt: "2026-09-14T00:20:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "New York Giants",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Dallas Cowboys",
          },
        },
      ],
    },
    BroncosAtChiefs: {
      id: "00000000-0000-4000-8000-000401872931",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401872931",
      startsAt: "2026-09-15T00:15:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Kansas City Chiefs",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Denver Broncos",
          },
        },
      ],
    },
  },
  Week2: {
    LionsAtBills: {
      id: "00000000-0000-4000-8000-000401872932",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401872932",
      startsAt: "2026-09-18T00:15:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Buffalo Bills",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Detroit Lions",
          },
        },
      ],
    },
    PanthersAtFalcons: {
      id: "00000000-0000-4000-8000-000401872933",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401872933",
      startsAt: "2026-09-20T17:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Atlanta Falcons",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Carolina Panthers",
          },
        },
      ],
    },
    BengalsAtTexans: {
      id: "00000000-0000-4000-8000-000401872934",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401872934",
      startsAt: "2026-09-20T17:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Houston Texans",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Cincinnati Bengals",
          },
        },
      ],
    },
    BrownsAtBuccaneers: {
      id: "00000000-0000-4000-8000-000401872935",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401872935",
      startsAt: "2026-09-20T17:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Tampa Bay Buccaneers",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Cleveland Browns",
          },
        },
      ],
    },
    PackersAtJets: {
      id: "00000000-0000-4000-8000-000401872936",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401872936",
      startsAt: "2026-09-20T17:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "New York Jets",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Green Bay Packers",
          },
        },
      ],
    },
    VikingsAtBears: {
      id: "00000000-0000-4000-8000-000401872937",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401872937",
      startsAt: "2026-09-20T17:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Chicago Bears",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Minnesota Vikings",
          },
        },
      ],
    },
    SaintsAtRavens: {
      id: "00000000-0000-4000-8000-000401872938",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401872938",
      startsAt: "2026-09-20T17:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Baltimore Ravens",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "New Orleans Saints",
          },
        },
      ],
    },
    EaglesAtTitans: {
      id: "00000000-0000-4000-8000-000401872939",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401872939",
      startsAt: "2026-09-20T17:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Tennessee Titans",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Philadelphia Eagles",
          },
        },
      ],
    },
    SteelersAtPatriots: {
      id: "00000000-0000-4000-8000-000401872946",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401872946",
      startsAt: "2026-09-20T17:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "New England Patriots",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Pittsburgh Steelers",
          },
        },
      ],
    },
    JaguarsAtBroncos: {
      id: "00000000-0000-4000-8000-000401872940",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401872940",
      startsAt: "2026-09-20T20:05:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Denver Broncos",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Jacksonville Jaguars",
          },
        },
      ],
    },
    RaidersAtChargers: {
      id: "00000000-0000-4000-8000-000401872941",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401872941",
      startsAt: "2026-09-20T20:05:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Los Angeles Chargers",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Las Vegas Raiders",
          },
        },
      ],
    },
    DolphinsAt49ers: {
      id: "00000000-0000-4000-8000-000401872942",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401872942",
      startsAt: "2026-09-20T20:25:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "San Francisco 49ers",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Miami Dolphins",
          },
        },
      ],
    },
    SeahawksAtCardinals: {
      id: "00000000-0000-4000-8000-000401872943",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401872943",
      startsAt: "2026-09-20T20:25:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Arizona Cardinals",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Seattle Seahawks",
          },
        },
      ],
    },
    CommandersAtCowboys: {
      id: "00000000-0000-4000-8000-000401872944",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401872944",
      startsAt: "2026-09-20T20:25:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Dallas Cowboys",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Washington Commanders",
          },
        },
      ],
    },
    ColtsAtChiefs: {
      id: "00000000-0000-4000-8000-000401872945",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401872945",
      startsAt: "2026-09-21T00:20:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Kansas City Chiefs",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Indianapolis Colts",
          },
        },
      ],
    },
    GiantsAtRams: {
      id: "00000000-0000-4000-8000-000401872947",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401872947",
      startsAt: "2026-09-22T00:15:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Los Angeles Rams",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "New York Giants",
          },
        },
      ],
    },
  },
  Week3: {
    FalconsAtPackers: {
      id: "00000000-0000-4000-8000-000401872948",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401872948",
      startsAt: "2026-09-25T00:15:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Green Bay Packers",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Atlanta Falcons",
          },
        },
      ],
    },
    PanthersAtBrowns: {
      id: "00000000-0000-4000-8000-000401872949",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401872949",
      startsAt: "2026-09-27T17:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Cleveland Browns",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Carolina Panthers",
          },
        },
      ],
    },
    BengalsAtSteelers: {
      id: "00000000-0000-4000-8000-000401872950",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401872950",
      startsAt: "2026-09-27T17:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Pittsburgh Steelers",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Cincinnati Bengals",
          },
        },
      ],
    },
    TexansAtColts: {
      id: "00000000-0000-4000-8000-000401872951",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401872951",
      startsAt: "2026-09-27T17:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Indianapolis Colts",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Houston Texans",
          },
        },
      ],
    },
    ChiefsAtDolphins: {
      id: "00000000-0000-4000-8000-000401872952",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401872952",
      startsAt: "2026-09-27T17:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Miami Dolphins",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Kansas City Chiefs",
          },
        },
      ],
    },
    ChargersAtBills: {
      id: "00000000-0000-4000-8000-000401872953",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401872953",
      startsAt: "2026-09-27T17:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Buffalo Bills",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Los Angeles Chargers",
          },
        },
      ],
    },
    JetsAtLions: {
      id: "00000000-0000-4000-8000-000401872954",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401872954",
      startsAt: "2026-09-27T17:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Detroit Lions",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "New York Jets",
          },
        },
      ],
    },
    SeahawksAtCommanders: {
      id: "00000000-0000-4000-8000-000401872955",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401872955",
      startsAt: "2026-09-27T17:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Washington Commanders",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Seattle Seahawks",
          },
        },
      ],
    },
    TitansAtGiants: {
      id: "00000000-0000-4000-8000-000401872956",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401872956",
      startsAt: "2026-09-27T17:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "New York Giants",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Tennessee Titans",
          },
        },
      ],
    },
    PatriotsAtJaguars: {
      id: "00000000-0000-4000-8000-000401872957",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401872957",
      startsAt: "2026-09-27T17:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Jacksonville Jaguars",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "New England Patriots",
          },
        },
      ],
    },
    CardinalsAt49ers: {
      id: "00000000-0000-4000-8000-000401872958",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401872958",
      startsAt: "2026-09-27T20:05:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "San Francisco 49ers",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Arizona Cardinals",
          },
        },
      ],
    },
    VikingsAtBuccaneers: {
      id: "00000000-0000-4000-8000-000401872959",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401872959",
      startsAt: "2026-09-27T20:05:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Tampa Bay Buccaneers",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Minnesota Vikings",
          },
        },
      ],
    },
    RavensAtCowboys: {
      id: "00000000-0000-4000-8000-000401872960",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401872960",
      startsAt: "2026-09-27T20:25:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Dallas Cowboys",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Baltimore Ravens",
          },
        },
      ],
    },
    RaidersAtSaints: {
      id: "00000000-0000-4000-8000-000401872961",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401872961",
      startsAt: "2026-09-27T20:25:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "New Orleans Saints",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Las Vegas Raiders",
          },
        },
      ],
    },
    RamsAtBroncos: {
      id: "00000000-0000-4000-8000-000401872962",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401872962",
      startsAt: "2026-09-28T00:20:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Denver Broncos",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Los Angeles Rams",
          },
        },
      ],
    },
    EaglesAtBears: {
      id: "00000000-0000-4000-8000-000401872963",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401872963",
      startsAt: "2026-09-29T00:15:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Chicago Bears",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Philadelphia Eagles",
          },
        },
      ],
    },
  },
  Week4: {
    SteelersAtBrowns: {
      id: "00000000-0000-4000-8000-000401872964",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401872964",
      startsAt: "2026-10-02T00:15:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Cleveland Browns",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Pittsburgh Steelers",
          },
        },
      ],
    },
    ColtsAtCommanders: {
      id: "00000000-0000-4000-8000-000401872965",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401872965",
      startsAt: "2026-10-04T13:30:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Washington Commanders",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Indianapolis Colts",
          },
        },
      ],
    },
    CardinalsAtGiants: {
      id: "00000000-0000-4000-8000-000401872966",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401872966",
      startsAt: "2026-10-04T17:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "New York Giants",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Arizona Cardinals",
          },
        },
      ],
    },
    CowboysAtTexans: {
      id: "00000000-0000-4000-8000-000401872967",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401872967",
      startsAt: "2026-10-04T17:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Houston Texans",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Dallas Cowboys",
          },
        },
      ],
    },
    PackersAtBuccaneers: {
      id: "00000000-0000-4000-8000-000401872968",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401872968",
      startsAt: "2026-10-04T17:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Tampa Bay Buccaneers",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Green Bay Packers",
          },
        },
      ],
    },
    JaguarsAtBengals: {
      id: "00000000-0000-4000-8000-000401872969",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401872969",
      startsAt: "2026-10-04T17:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Cincinnati Bengals",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Jacksonville Jaguars",
          },
        },
      ],
    },
    RamsAtEagles: {
      id: "00000000-0000-4000-8000-000401872970",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401872970",
      startsAt: "2026-10-04T17:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Philadelphia Eagles",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Los Angeles Rams",
          },
        },
      ],
    },
    PatriotsAtBills: {
      id: "00000000-0000-4000-8000-000401872971",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401872971",
      startsAt: "2026-10-04T17:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Buffalo Bills",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "New England Patriots",
          },
        },
      ],
    },
    JetsAtBears: {
      id: "00000000-0000-4000-8000-000401872972",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401872972",
      startsAt: "2026-10-04T17:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Chicago Bears",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "New York Jets",
          },
        },
      ],
    },
    TitansAtRavens: {
      id: "00000000-0000-4000-8000-000401872973",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401872973",
      startsAt: "2026-10-04T17:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Baltimore Ravens",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Tennessee Titans",
          },
        },
      ],
    },
    DolphinsAtVikings: {
      id: "00000000-0000-4000-8000-000401872974",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401872974",
      startsAt: "2026-10-04T20:05:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Minnesota Vikings",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Miami Dolphins",
          },
        },
      ],
    },
    BroncosAt49ers: {
      id: "00000000-0000-4000-8000-000401872975",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401872975",
      startsAt: "2026-10-04T20:25:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "San Francisco 49ers",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Denver Broncos",
          },
        },
      ],
    },
    ChiefsAtRaiders: {
      id: "00000000-0000-4000-8000-000401872976",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401872976",
      startsAt: "2026-10-04T20:25:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Las Vegas Raiders",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Kansas City Chiefs",
          },
        },
      ],
    },
    ChargersAtSeahawks: {
      id: "00000000-0000-4000-8000-000401872977",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401872977",
      startsAt: "2026-10-04T20:25:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Seattle Seahawks",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Los Angeles Chargers",
          },
        },
      ],
    },
    LionsAtPanthers: {
      id: "00000000-0000-4000-8000-000401872978",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401872978",
      startsAt: "2026-10-05T00:20:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Carolina Panthers",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Detroit Lions",
          },
        },
      ],
    },
    FalconsAtSaints: {
      id: "00000000-0000-4000-8000-000401872979",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401872979",
      startsAt: "2026-10-06T00:15:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "New Orleans Saints",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Atlanta Falcons",
          },
        },
      ],
    },
  },
  Week5: {
    BuccaneersAtCowboys: {
      id: "00000000-0000-4000-8000-000401872980",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401872980",
      startsAt: "2026-10-09T00:15:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Dallas Cowboys",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Tampa Bay Buccaneers",
          },
        },
      ],
    },
    EaglesAtJaguars: {
      id: "00000000-0000-4000-8000-000401872981",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401872981",
      startsAt: "2026-10-11T13:30:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Jacksonville Jaguars",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Philadelphia Eagles",
          },
        },
      ],
    },
    BengalsAtDolphins: {
      id: "00000000-0000-4000-8000-000401872982",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401872982",
      startsAt: "2026-10-11T17:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Miami Dolphins",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Cincinnati Bengals",
          },
        },
      ],
    },
    BrownsAtJets: {
      id: "00000000-0000-4000-8000-000401872983",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401872983",
      startsAt: "2026-10-11T17:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "New York Jets",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Cleveland Browns",
          },
        },
      ],
    },
    TexansAtTitans: {
      id: "00000000-0000-4000-8000-000401872984",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401872984",
      startsAt: "2026-10-11T17:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Tennessee Titans",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Houston Texans",
          },
        },
      ],
    },
    ColtsAtSteelers: {
      id: "00000000-0000-4000-8000-000401872985",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401872985",
      startsAt: "2026-10-11T17:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Pittsburgh Steelers",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Indianapolis Colts",
          },
        },
      ],
    },
    RaidersAtPatriots: {
      id: "00000000-0000-4000-8000-000401872986",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401872986",
      startsAt: "2026-10-11T17:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "New England Patriots",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Las Vegas Raiders",
          },
        },
      ],
    },
    VikingsAtSaints: {
      id: "00000000-0000-4000-8000-000401872987",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401872987",
      startsAt: "2026-10-11T17:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "New Orleans Saints",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Minnesota Vikings",
          },
        },
      ],
    },
    GiantsAtCommanders: {
      id: "00000000-0000-4000-8000-000401872988",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401872988",
      startsAt: "2026-10-11T17:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Washington Commanders",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "New York Giants",
          },
        },
      ],
    },
    BroncosAtChargers: {
      id: "00000000-0000-4000-8000-000401872989",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401872989",
      startsAt: "2026-10-11T20:05:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Los Angeles Chargers",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Denver Broncos",
          },
        },
      ],
    },
    BearsAtPackers: {
      id: "00000000-0000-4000-8000-000401872990",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401872990",
      startsAt: "2026-10-11T20:25:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Green Bay Packers",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Chicago Bears",
          },
        },
      ],
    },
    LionsAtCardinals: {
      id: "00000000-0000-4000-8000-000401872991",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401872991",
      startsAt: "2026-10-11T20:25:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Arizona Cardinals",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Detroit Lions",
          },
        },
      ],
    },
    _49ersAtSeahawks: {
      id: "00000000-0000-4000-8000-000401872992",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401872992",
      startsAt: "2026-10-11T20:25:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Seattle Seahawks",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "San Francisco 49ers",
          },
        },
      ],
    },
    RavensAtFalcons: {
      id: "00000000-0000-4000-8000-000401872993",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401872993",
      startsAt: "2026-10-12T00:20:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Atlanta Falcons",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Baltimore Ravens",
          },
        },
      ],
    },
    BillsAtRams: {
      id: "00000000-0000-4000-8000-000401872994",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401872994",
      startsAt: "2026-10-13T00:15:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Los Angeles Rams",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Buffalo Bills",
          },
        },
      ],
    },
  },
  Week6: {
    SeahawksAtBroncos: {
      id: "00000000-0000-4000-8000-000401872995",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401872995",
      startsAt: "2026-10-16T00:15:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Denver Broncos",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Seattle Seahawks",
          },
        },
      ],
    },
    TexansAtJaguars: {
      id: "00000000-0000-4000-8000-000401872996",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401872996",
      startsAt: "2026-10-18T13:30:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Jacksonville Jaguars",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Houston Texans",
          },
        },
      ],
    },
    RavensAtBrowns: {
      id: "00000000-0000-4000-8000-000401872997",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401872997",
      startsAt: "2026-10-18T17:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Cleveland Browns",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Baltimore Ravens",
          },
        },
      ],
    },
    PanthersAtEagles: {
      id: "00000000-0000-4000-8000-000401872998",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401872998",
      startsAt: "2026-10-18T17:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Philadelphia Eagles",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Carolina Panthers",
          },
        },
      ],
    },
    BearsAtFalcons: {
      id: "00000000-0000-4000-8000-000401872999",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401872999",
      startsAt: "2026-10-18T17:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Atlanta Falcons",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Chicago Bears",
          },
        },
      ],
    },
    SaintsAtGiants: {
      id: "00000000-0000-4000-8000-000401873000",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873000",
      startsAt: "2026-10-18T17:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "New York Giants",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "New Orleans Saints",
          },
        },
      ],
    },
    JetsAtPatriots: {
      id: "00000000-0000-4000-8000-000401873001",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873001",
      startsAt: "2026-10-18T17:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "New England Patriots",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "New York Jets",
          },
        },
      ],
    },
    SteelersAtBuccaneers: {
      id: "00000000-0000-4000-8000-000401873002",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873002",
      startsAt: "2026-10-18T17:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Tampa Bay Buccaneers",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Pittsburgh Steelers",
          },
        },
      ],
    },
    TitansAtColts: {
      id: "00000000-0000-4000-8000-000401873003",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873003",
      startsAt: "2026-10-18T17:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Indianapolis Colts",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Tennessee Titans",
          },
        },
      ],
    },
    CardinalsAtRams: {
      id: "00000000-0000-4000-8000-000401873004",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873004",
      startsAt: "2026-10-18T20:05:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Los Angeles Rams",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Arizona Cardinals",
          },
        },
      ],
    },
    BillsAtRaiders: {
      id: "00000000-0000-4000-8000-000401873005",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873005",
      startsAt: "2026-10-18T20:25:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Las Vegas Raiders",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Buffalo Bills",
          },
        },
      ],
    },
    ChargersAtChiefs: {
      id: "00000000-0000-4000-8000-000401873006",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873006",
      startsAt: "2026-10-18T20:25:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Kansas City Chiefs",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Los Angeles Chargers",
          },
        },
      ],
    },
    CowboysAtPackers: {
      id: "00000000-0000-4000-8000-000401873007",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873007",
      startsAt: "2026-10-19T00:20:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Green Bay Packers",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Dallas Cowboys",
          },
        },
      ],
    },
    CommandersAt49ers: {
      id: "00000000-0000-4000-8000-000401873008",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873008",
      startsAt: "2026-10-20T00:15:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "San Francisco 49ers",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Washington Commanders",
          },
        },
      ],
    },
  },
  Week7: {
    PatriotsAtBears: {
      id: "00000000-0000-4000-8000-000401873010",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873010",
      startsAt: "2026-10-23T00:15:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Chicago Bears",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "New England Patriots",
          },
        },
      ],
    },
    SteelersAtSaints: {
      id: "00000000-0000-4000-8000-000401873011",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873011",
      startsAt: "2026-10-25T13:30:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "New Orleans Saints",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Pittsburgh Steelers",
          },
        },
      ],
    },
    BengalsAtRavens: {
      id: "00000000-0000-4000-8000-000401873012",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873012",
      startsAt: "2026-10-25T17:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Baltimore Ravens",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Cincinnati Bengals",
          },
        },
      ],
    },
    BrownsAtTitans: {
      id: "00000000-0000-4000-8000-000401873013",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873013",
      startsAt: "2026-10-25T17:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Tennessee Titans",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Cleveland Browns",
          },
        },
      ],
    },
    ColtsAtVikings: {
      id: "00000000-0000-4000-8000-000401873014",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873014",
      startsAt: "2026-10-25T17:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Minnesota Vikings",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Indianapolis Colts",
          },
        },
      ],
    },
    DolphinsAtJets: {
      id: "00000000-0000-4000-8000-000401873015",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873015",
      startsAt: "2026-10-25T17:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "New York Jets",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Miami Dolphins",
          },
        },
      ],
    },
    GiantsAtTexans: {
      id: "00000000-0000-4000-8000-000401873016",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873016",
      startsAt: "2026-10-25T17:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Houston Texans",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "New York Giants",
          },
        },
      ],
    },
    _49ersAtFalcons: {
      id: "00000000-0000-4000-8000-000401873017",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873017",
      startsAt: "2026-10-25T17:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Atlanta Falcons",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "San Francisco 49ers",
          },
        },
      ],
    },
    BuccaneersAtPanthers: {
      id: "00000000-0000-4000-8000-000401873018",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873018",
      startsAt: "2026-10-25T17:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Carolina Panthers",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Tampa Bay Buccaneers",
          },
        },
      ],
    },
    BroncosAtCardinals: {
      id: "00000000-0000-4000-8000-000401873019",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873019",
      startsAt: "2026-10-25T20:05:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Arizona Cardinals",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Denver Broncos",
          },
        },
      ],
    },
    PackersAtLions: {
      id: "00000000-0000-4000-8000-000401873020",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873020",
      startsAt: "2026-10-25T20:25:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Detroit Lions",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Green Bay Packers",
          },
        },
      ],
    },
    RamsAtRaiders: {
      id: "00000000-0000-4000-8000-000401873021",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873021",
      startsAt: "2026-10-25T20:25:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Las Vegas Raiders",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Los Angeles Rams",
          },
        },
      ],
    },
    ChiefsAtSeahawks: {
      id: "00000000-0000-4000-8000-000401873022",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873022",
      startsAt: "2026-10-26T00:20:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Seattle Seahawks",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Kansas City Chiefs",
          },
        },
      ],
    },
    CowboysAtEagles: {
      id: "00000000-0000-4000-8000-000401873009",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873009",
      startsAt: "2026-10-27T00:15:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Philadelphia Eagles",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Dallas Cowboys",
          },
        },
      ],
    },
  },
  Week8: {
    PanthersAtPackers: {
      id: "00000000-0000-4000-8000-000401873023",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873023",
      startsAt: "2026-10-30T00:15:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Green Bay Packers",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Carolina Panthers",
          },
        },
      ],
    },
    CardinalsAtCowboys: {
      id: "00000000-0000-4000-8000-000401873024",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873024",
      startsAt: "2026-11-01T18:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Dallas Cowboys",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Arizona Cardinals",
          },
        },
      ],
    },
    FalconsAtBuccaneers: {
      id: "00000000-0000-4000-8000-000401873025",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873025",
      startsAt: "2026-11-01T18:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Tampa Bay Buccaneers",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Atlanta Falcons",
          },
        },
      ],
    },
    RavensAtBills: {
      id: "00000000-0000-4000-8000-000401873026",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873026",
      startsAt: "2026-11-01T18:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Buffalo Bills",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Baltimore Ravens",
          },
        },
      ],
    },
    BrownsAtSteelers: {
      id: "00000000-0000-4000-8000-000401873027",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873027",
      startsAt: "2026-11-01T18:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Pittsburgh Steelers",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Cleveland Browns",
          },
        },
      ],
    },
    ColtsAtJaguars: {
      id: "00000000-0000-4000-8000-000401873028",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873028",
      startsAt: "2026-11-01T18:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Jacksonville Jaguars",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Indianapolis Colts",
          },
        },
      ],
    },
    RaidersAtJets: {
      id: "00000000-0000-4000-8000-000401873029",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873029",
      startsAt: "2026-11-01T18:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "New York Jets",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Las Vegas Raiders",
          },
        },
      ],
    },
    VikingsAtLions: {
      id: "00000000-0000-4000-8000-000401873030",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873030",
      startsAt: "2026-11-01T18:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Detroit Lions",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Minnesota Vikings",
          },
        },
      ],
    },
    TitansAtBengals: {
      id: "00000000-0000-4000-8000-000401873031",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873031",
      startsAt: "2026-11-01T18:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Cincinnati Bengals",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Tennessee Titans",
          },
        },
      ],
    },
    ChargersAtRams: {
      id: "00000000-0000-4000-8000-000401873032",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873032",
      startsAt: "2026-11-01T21:05:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Los Angeles Rams",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Los Angeles Chargers",
          },
        },
      ],
    },
    ChiefsAtBroncos: {
      id: "00000000-0000-4000-8000-000401873033",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873033",
      startsAt: "2026-11-01T21:25:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Denver Broncos",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Kansas City Chiefs",
          },
        },
      ],
    },
    PatriotsAtDolphins: {
      id: "00000000-0000-4000-8000-000401873034",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873034",
      startsAt: "2026-11-01T21:25:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Miami Dolphins",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "New England Patriots",
          },
        },
      ],
    },
    EaglesAtCommanders: {
      id: "00000000-0000-4000-8000-000401873035",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873035",
      startsAt: "2026-11-02T01:20:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Washington Commanders",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Philadelphia Eagles",
          },
        },
      ],
    },
    BearsAtSeahawks: {
      id: "00000000-0000-4000-8000-000401873036",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873036",
      startsAt: "2026-11-03T01:15:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Seattle Seahawks",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Chicago Bears",
          },
        },
      ],
    },
  },
  Week9: {
    JaguarsAtRavens: {
      id: "00000000-0000-4000-8000-000401873037",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873037",
      startsAt: "2026-11-06T01:15:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Baltimore Ravens",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Jacksonville Jaguars",
          },
        },
      ],
    },
    BengalsAtFalcons: {
      id: "00000000-0000-4000-8000-000401873038",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873038",
      startsAt: "2026-11-08T14:30:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Atlanta Falcons",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Cincinnati Bengals",
          },
        },
      ],
    },
    BrownsAtSaints: {
      id: "00000000-0000-4000-8000-000401873039",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873039",
      startsAt: "2026-11-08T18:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "New Orleans Saints",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Cleveland Browns",
          },
        },
      ],
    },
    CowboysAtColts: {
      id: "00000000-0000-4000-8000-000401873040",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873040",
      startsAt: "2026-11-08T18:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Indianapolis Colts",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Dallas Cowboys",
          },
        },
      ],
    },
    BroncosAtPanthers: {
      id: "00000000-0000-4000-8000-000401873041",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873041",
      startsAt: "2026-11-08T18:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Carolina Panthers",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Denver Broncos",
          },
        },
      ],
    },
    LionsAtDolphins: {
      id: "00000000-0000-4000-8000-000401873042",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873042",
      startsAt: "2026-11-08T18:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Miami Dolphins",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Detroit Lions",
          },
        },
      ],
    },
    RamsAtCommanders: {
      id: "00000000-0000-4000-8000-000401873043",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873043",
      startsAt: "2026-11-08T18:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Washington Commanders",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Los Angeles Rams",
          },
        },
      ],
    },
    GiantsAtEagles: {
      id: "00000000-0000-4000-8000-000401873044",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873044",
      startsAt: "2026-11-08T18:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Philadelphia Eagles",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "New York Giants",
          },
        },
      ],
    },
    JetsAtChiefs: {
      id: "00000000-0000-4000-8000-000401873045",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873045",
      startsAt: "2026-11-08T18:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Kansas City Chiefs",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "New York Jets",
          },
        },
      ],
    },
    TexansAtChargers: {
      id: "00000000-0000-4000-8000-000401873046",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873046",
      startsAt: "2026-11-08T21:05:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Los Angeles Chargers",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Houston Texans",
          },
        },
      ],
    },
    RaidersAt49ers: {
      id: "00000000-0000-4000-8000-000401873047",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873047",
      startsAt: "2026-11-08T21:05:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "San Francisco 49ers",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Las Vegas Raiders",
          },
        },
      ],
    },
    CardinalsAtSeahawks: {
      id: "00000000-0000-4000-8000-000401873048",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873048",
      startsAt: "2026-11-08T21:25:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Seattle Seahawks",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Arizona Cardinals",
          },
        },
      ],
    },
    PackersAtPatriots: {
      id: "00000000-0000-4000-8000-000401873049",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873049",
      startsAt: "2026-11-08T21:25:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "New England Patriots",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Green Bay Packers",
          },
        },
      ],
    },
    BuccaneersAtBears: {
      id: "00000000-0000-4000-8000-000401873050",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873050",
      startsAt: "2026-11-09T01:20:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Chicago Bears",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Tampa Bay Buccaneers",
          },
        },
      ],
    },
    BillsAtVikings: {
      id: "00000000-0000-4000-8000-000401873051",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873051",
      startsAt: "2026-11-10T01:15:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Minnesota Vikings",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Buffalo Bills",
          },
        },
      ],
    },
  },
  Week10: {
    CommandersAtGiants: {
      id: "00000000-0000-4000-8000-000401873052",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873052",
      startsAt: "2026-11-13T01:15:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "New York Giants",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Washington Commanders",
          },
        },
      ],
    },
    PatriotsAtLions: {
      id: "00000000-0000-4000-8000-000401873053",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873053",
      startsAt: "2026-11-15T14:30:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Detroit Lions",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "New England Patriots",
          },
        },
      ],
    },
    BillsAtJets: {
      id: "00000000-0000-4000-8000-000401873054",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873054",
      startsAt: "2026-11-15T18:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "New York Jets",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Buffalo Bills",
          },
        },
      ],
    },
    PanthersAtSaints: {
      id: "00000000-0000-4000-8000-000401873055",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873055",
      startsAt: "2026-11-15T18:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "New Orleans Saints",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Carolina Panthers",
          },
        },
      ],
    },
    TexansAtBrowns: {
      id: "00000000-0000-4000-8000-000401873056",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873056",
      startsAt: "2026-11-15T18:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Cleveland Browns",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Houston Texans",
          },
        },
      ],
    },
    JaguarsAtTitans: {
      id: "00000000-0000-4000-8000-000401873057",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873057",
      startsAt: "2026-11-15T18:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Tennessee Titans",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Jacksonville Jaguars",
          },
        },
      ],
    },
    ChiefsAtFalcons: {
      id: "00000000-0000-4000-8000-000401873058",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873058",
      startsAt: "2026-11-15T18:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Atlanta Falcons",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Kansas City Chiefs",
          },
        },
      ],
    },
    DolphinsAtColts: {
      id: "00000000-0000-4000-8000-000401873059",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873059",
      startsAt: "2026-11-15T18:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Indianapolis Colts",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Miami Dolphins",
          },
        },
      ],
    },
    VikingsAtPackers: {
      id: "00000000-0000-4000-8000-000401873060",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873060",
      startsAt: "2026-11-15T18:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Green Bay Packers",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Minnesota Vikings",
          },
        },
      ],
    },
    RamsAtCardinals: {
      id: "00000000-0000-4000-8000-000401873061",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873061",
      startsAt: "2026-11-15T21:05:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Arizona Cardinals",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Los Angeles Rams",
          },
        },
      ],
    },
    SeahawksAtRaiders: {
      id: "00000000-0000-4000-8000-000401873062",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873062",
      startsAt: "2026-11-15T21:05:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Las Vegas Raiders",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Seattle Seahawks",
          },
        },
      ],
    },
    _49ersAtCowboys: {
      id: "00000000-0000-4000-8000-000401873063",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873063",
      startsAt: "2026-11-15T21:25:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Dallas Cowboys",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "San Francisco 49ers",
          },
        },
      ],
    },
    SteelersAtBengals: {
      id: "00000000-0000-4000-8000-000401873064",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873064",
      startsAt: "2026-11-16T01:20:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Cincinnati Bengals",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Pittsburgh Steelers",
          },
        },
      ],
    },
    ChargersAtRavens: {
      id: "00000000-0000-4000-8000-000401873065",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873065",
      startsAt: "2026-11-17T01:15:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Baltimore Ravens",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Los Angeles Chargers",
          },
        },
      ],
    },
  },
  Week11: {
    ColtsAtTexans: {
      id: "00000000-0000-4000-8000-000401873066",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873066",
      startsAt: "2026-11-20T01:15:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Houston Texans",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Indianapolis Colts",
          },
        },
      ],
    },
    CardinalsAtChiefs: {
      id: "00000000-0000-4000-8000-000401873067",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873067",
      startsAt: "2026-11-22T18:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Kansas City Chiefs",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Arizona Cardinals",
          },
        },
      ],
    },
    RavensAtPanthers: {
      id: "00000000-0000-4000-8000-000401873068",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873068",
      startsAt: "2026-11-22T18:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Carolina Panthers",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Baltimore Ravens",
          },
        },
      ],
    },
    JaguarsAtGiants: {
      id: "00000000-0000-4000-8000-000401873069",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873069",
      startsAt: "2026-11-22T18:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "New York Giants",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Jacksonville Jaguars",
          },
        },
      ],
    },
    DolphinsAtBills: {
      id: "00000000-0000-4000-8000-000401873070",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873070",
      startsAt: "2026-11-22T18:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Buffalo Bills",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Miami Dolphins",
          },
        },
      ],
    },
    SaintsAtBears: {
      id: "00000000-0000-4000-8000-000401873071",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873071",
      startsAt: "2026-11-22T18:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Chicago Bears",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "New Orleans Saints",
          },
        },
      ],
    },
    BuccaneersAtLions: {
      id: "00000000-0000-4000-8000-000401873072",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873072",
      startsAt: "2026-11-22T18:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Detroit Lions",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Tampa Bay Buccaneers",
          },
        },
      ],
    },
    TitansAtCowboys: {
      id: "00000000-0000-4000-8000-000401873073",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873073",
      startsAt: "2026-11-22T18:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Dallas Cowboys",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Tennessee Titans",
          },
        },
      ],
    },
    JetsAtChargers: {
      id: "00000000-0000-4000-8000-000401873074",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873074",
      startsAt: "2026-11-22T21:05:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Los Angeles Chargers",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "New York Jets",
          },
        },
      ],
    },
    RaidersAtBroncos: {
      id: "00000000-0000-4000-8000-000401873075",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873075",
      startsAt: "2026-11-22T21:25:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Denver Broncos",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Las Vegas Raiders",
          },
        },
      ],
    },
    SteelersAtEagles: {
      id: "00000000-0000-4000-8000-000401873076",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873076",
      startsAt: "2026-11-22T21:25:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Philadelphia Eagles",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Pittsburgh Steelers",
          },
        },
      ],
    },
    VikingsAt49ers: {
      id: "00000000-0000-4000-8000-000401873077",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873077",
      startsAt: "2026-11-23T01:20:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "San Francisco 49ers",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Minnesota Vikings",
          },
        },
      ],
    },
    BengalsAtCommanders: {
      id: "00000000-0000-4000-8000-000401873078",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873078",
      startsAt: "2026-11-24T01:15:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Washington Commanders",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Cincinnati Bengals",
          },
        },
      ],
    },
  },
  Week12: {
    PackersAtRams: {
      id: "00000000-0000-4000-8000-000401873079",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873079",
      startsAt: "2026-11-26T01:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Los Angeles Rams",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Green Bay Packers",
          },
        },
      ],
    },
    BearsAtLions: {
      id: "00000000-0000-4000-8000-000401873081",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873081",
      startsAt: "2026-11-26T18:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Detroit Lions",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Chicago Bears",
          },
        },
      ],
    },
    EaglesAtCowboys: {
      id: "00000000-0000-4000-8000-000401873080",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873080",
      startsAt: "2026-11-26T21:30:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Dallas Cowboys",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Philadelphia Eagles",
          },
        },
      ],
    },
    ChiefsAtBills: {
      id: "00000000-0000-4000-8000-000401873082",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873082",
      startsAt: "2026-11-27T01:20:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Buffalo Bills",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Kansas City Chiefs",
          },
        },
      ],
    },
    BroncosAtSteelers: {
      id: "00000000-0000-4000-8000-000401873083",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873083",
      startsAt: "2026-11-27T20:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Pittsburgh Steelers",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Denver Broncos",
          },
        },
      ],
    },
    FalconsAtVikings: {
      id: "00000000-0000-4000-8000-000401873084",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873084",
      startsAt: "2026-11-29T18:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Minnesota Vikings",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Atlanta Falcons",
          },
        },
      ],
    },
    RavensAtTexans: {
      id: "00000000-0000-4000-8000-000401873085",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873085",
      startsAt: "2026-11-29T18:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Houston Texans",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Baltimore Ravens",
          },
        },
      ],
    },
    RaidersAtBrowns: {
      id: "00000000-0000-4000-8000-000401873086",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873086",
      startsAt: "2026-11-29T18:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Cleveland Browns",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Las Vegas Raiders",
          },
        },
      ],
    },
    SaintsAtBengals: {
      id: "00000000-0000-4000-8000-000401873087",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873087",
      startsAt: "2026-11-29T18:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Cincinnati Bengals",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "New Orleans Saints",
          },
        },
      ],
    },
    GiantsAtColts: {
      id: "00000000-0000-4000-8000-000401873088",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873088",
      startsAt: "2026-11-29T18:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Indianapolis Colts",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "New York Giants",
          },
        },
      ],
    },
    JetsAtDolphins: {
      id: "00000000-0000-4000-8000-000401873089",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873089",
      startsAt: "2026-11-29T18:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Miami Dolphins",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "New York Jets",
          },
        },
      ],
    },
    TitansAtJaguars: {
      id: "00000000-0000-4000-8000-000401873090",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873090",
      startsAt: "2026-11-29T21:05:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Jacksonville Jaguars",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Tennessee Titans",
          },
        },
      ],
    },
    SeahawksAt49ers: {
      id: "00000000-0000-4000-8000-000401873091",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873091",
      startsAt: "2026-11-29T21:25:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "San Francisco 49ers",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Seattle Seahawks",
          },
        },
      ],
    },
    CommandersAtCardinals: {
      id: "00000000-0000-4000-8000-000401873092",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873092",
      startsAt: "2026-11-29T21:25:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Arizona Cardinals",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Washington Commanders",
          },
        },
      ],
    },
    PatriotsAtChargers: {
      id: "00000000-0000-4000-8000-000401873093",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873093",
      startsAt: "2026-11-30T01:20:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Los Angeles Chargers",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "New England Patriots",
          },
        },
      ],
    },
    PanthersAtBuccaneers: {
      id: "00000000-0000-4000-8000-000401873094",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873094",
      startsAt: "2026-12-01T01:15:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Tampa Bay Buccaneers",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Carolina Panthers",
          },
        },
      ],
    },
  },
  Week13: {
    ChiefsAtRams: {
      id: "00000000-0000-4000-8000-000401873096",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873096",
      startsAt: "2026-12-04T01:15:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Los Angeles Rams",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Kansas City Chiefs",
          },
        },
      ],
    },
    _49ersAtGiants: {
      id: "00000000-0000-4000-8000-000401873095",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873095",
      startsAt: "2026-12-06T18:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "New York Giants",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "San Francisco 49ers",
          },
        },
      ],
    },
    BengalsAtBrowns: {
      id: "00000000-0000-4000-8000-000401873097",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873097",
      startsAt: "2026-12-06T18:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Cleveland Browns",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Cincinnati Bengals",
          },
        },
      ],
    },
    LionsAtFalcons: {
      id: "00000000-0000-4000-8000-000401873098",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873098",
      startsAt: "2026-12-06T18:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Atlanta Falcons",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Detroit Lions",
          },
        },
      ],
    },
    PackersAtSaints: {
      id: "00000000-0000-4000-8000-000401873099",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873099",
      startsAt: "2026-12-06T18:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "New Orleans Saints",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Green Bay Packers",
          },
        },
      ],
    },
    JaguarsAtBears: {
      id: "00000000-0000-4000-8000-000401873100",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873100",
      startsAt: "2026-12-06T18:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Chicago Bears",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Jacksonville Jaguars",
          },
        },
      ],
    },
    ChargersAtBuccaneers: {
      id: "00000000-0000-4000-8000-000401873101",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873101",
      startsAt: "2026-12-06T18:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Tampa Bay Buccaneers",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Los Angeles Chargers",
          },
        },
      ],
    },
    CommandersAtTitans: {
      id: "00000000-0000-4000-8000-000401873102",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873102",
      startsAt: "2026-12-06T18:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Tennessee Titans",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Washington Commanders",
          },
        },
      ],
    },
    DolphinsAtBroncos: {
      id: "00000000-0000-4000-8000-000401873103",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873103",
      startsAt: "2026-12-06T21:05:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Denver Broncos",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Miami Dolphins",
          },
        },
      ],
    },
    EaglesAtCardinals: {
      id: "00000000-0000-4000-8000-000401873104",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873104",
      startsAt: "2026-12-06T21:05:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Arizona Cardinals",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Philadelphia Eagles",
          },
        },
      ],
    },
    BillsAtPatriots: {
      id: "00000000-0000-4000-8000-000401873105",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873105",
      startsAt: "2026-12-06T21:25:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "New England Patriots",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Buffalo Bills",
          },
        },
      ],
    },
    PanthersAtVikings: {
      id: "00000000-0000-4000-8000-000401873106",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873106",
      startsAt: "2026-12-06T21:25:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Minnesota Vikings",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Carolina Panthers",
          },
        },
      ],
    },
    TexansAtSteelers: {
      id: "00000000-0000-4000-8000-000401873107",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873107",
      startsAt: "2026-12-07T01:20:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Pittsburgh Steelers",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Houston Texans",
          },
        },
      ],
    },
    CowboysAtSeahawks: {
      id: "00000000-0000-4000-8000-000401873108",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873108",
      startsAt: "2026-12-08T01:15:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Seattle Seahawks",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Dallas Cowboys",
          },
        },
      ],
    },
  },
  Week14: {
    VikingsAtPatriots: {
      id: "00000000-0000-4000-8000-000401873109",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873109",
      startsAt: "2026-12-11T01:15:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "New England Patriots",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Minnesota Vikings",
          },
        },
      ],
    },
    FalconsAtBrowns: {
      id: "00000000-0000-4000-8000-000401873110",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873110",
      startsAt: "2026-12-13T18:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Cleveland Browns",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Atlanta Falcons",
          },
        },
      ],
    },
    BearsAtDolphins: {
      id: "00000000-0000-4000-8000-000401873111",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873111",
      startsAt: "2026-12-13T18:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Miami Dolphins",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Chicago Bears",
          },
        },
      ],
    },
    BroncosAtJets: {
      id: "00000000-0000-4000-8000-000401873112",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873112",
      startsAt: "2026-12-13T18:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "New York Jets",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Denver Broncos",
          },
        },
      ],
    },
    TexansAtCommanders: {
      id: "00000000-0000-4000-8000-000401873113",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873113",
      startsAt: "2026-12-13T18:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Washington Commanders",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Houston Texans",
          },
        },
      ],
    },
    ColtsAtEagles: {
      id: "00000000-0000-4000-8000-000401873114",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873114",
      startsAt: "2026-12-13T18:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Philadelphia Eagles",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Indianapolis Colts",
          },
        },
      ],
    },
    SaintsAtPanthers: {
      id: "00000000-0000-4000-8000-000401873115",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873115",
      startsAt: "2026-12-13T18:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Carolina Panthers",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "New Orleans Saints",
          },
        },
      ],
    },
    BuccaneersAtRavens: {
      id: "00000000-0000-4000-8000-000401873116",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873116",
      startsAt: "2026-12-13T18:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Baltimore Ravens",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Tampa Bay Buccaneers",
          },
        },
      ],
    },
    TitansAtLions: {
      id: "00000000-0000-4000-8000-000401873117",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873117",
      startsAt: "2026-12-13T18:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Detroit Lions",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Tennessee Titans",
          },
        },
      ],
    },
    ChargersAtRaiders: {
      id: "00000000-0000-4000-8000-000401873118",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873118",
      startsAt: "2026-12-13T21:05:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Las Vegas Raiders",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Los Angeles Chargers",
          },
        },
      ],
    },
    ChiefsAtBengals: {
      id: "00000000-0000-4000-8000-000401873119",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873119",
      startsAt: "2026-12-13T21:25:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Cincinnati Bengals",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Kansas City Chiefs",
          },
        },
      ],
    },
    RamsAt49ers: {
      id: "00000000-0000-4000-8000-000401873120",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873120",
      startsAt: "2026-12-13T21:25:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "San Francisco 49ers",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Los Angeles Rams",
          },
        },
      ],
    },
    GiantsAtSeahawks: {
      id: "00000000-0000-4000-8000-000401873121",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873121",
      startsAt: "2026-12-13T21:25:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Seattle Seahawks",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "New York Giants",
          },
        },
      ],
    },
    BillsAtPackers: {
      id: "00000000-0000-4000-8000-000401873122",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873122",
      startsAt: "2026-12-14T01:20:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Green Bay Packers",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Buffalo Bills",
          },
        },
      ],
    },
    SteelersAtJaguars: {
      id: "00000000-0000-4000-8000-000401873123",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873123",
      startsAt: "2026-12-15T01:15:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Jacksonville Jaguars",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Pittsburgh Steelers",
          },
        },
      ],
    },
  },
  Week15: {
    _49ersAtChargers: {
      id: "00000000-0000-4000-8000-000401873124",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873124",
      startsAt: "2026-12-18T01:15:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Los Angeles Chargers",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "San Francisco 49ers",
          },
        },
      ],
    },
    SeahawksAtEagles: {
      id: "00000000-0000-4000-8000-000401873125",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873125",
      startsAt: "2026-12-19T22:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Philadelphia Eagles",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Seattle Seahawks",
          },
        },
      ],
    },
    BearsAtBills: {
      id: "00000000-0000-4000-8000-000401873126",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873126",
      startsAt: "2026-12-20T01:20:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Buffalo Bills",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Chicago Bears",
          },
        },
      ],
    },
    FalconsAtCommanders: {
      id: "00000000-0000-4000-8000-000401873127",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873127",
      startsAt: "2026-12-20T18:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Washington Commanders",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Atlanta Falcons",
          },
        },
      ],
    },
    RavensAtSteelers: {
      id: "00000000-0000-4000-8000-000401873128",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873128",
      startsAt: "2026-12-20T18:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Pittsburgh Steelers",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Baltimore Ravens",
          },
        },
      ],
    },
    BengalsAtPanthers: {
      id: "00000000-0000-4000-8000-000401873129",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873129",
      startsAt: "2026-12-20T18:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Carolina Panthers",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Cincinnati Bengals",
          },
        },
      ],
    },
    BrownsAtGiants: {
      id: "00000000-0000-4000-8000-000401873130",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873130",
      startsAt: "2026-12-20T18:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "New York Giants",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Cleveland Browns",
          },
        },
      ],
    },
    ColtsAtTitans: {
      id: "00000000-0000-4000-8000-000401873131",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873131",
      startsAt: "2026-12-20T18:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Tennessee Titans",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Indianapolis Colts",
          },
        },
      ],
    },
    JaguarsAtTexans: {
      id: "00000000-0000-4000-8000-000401873132",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873132",
      startsAt: "2026-12-20T18:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Houston Texans",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Jacksonville Jaguars",
          },
        },
      ],
    },
    DolphinsAtPackers: {
      id: "00000000-0000-4000-8000-000401873133",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873133",
      startsAt: "2026-12-20T18:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Green Bay Packers",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Miami Dolphins",
          },
        },
      ],
    },
    SaintsAtBuccaneers: {
      id: "00000000-0000-4000-8000-000401873134",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873134",
      startsAt: "2026-12-20T18:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Tampa Bay Buccaneers",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "New Orleans Saints",
          },
        },
      ],
    },
    JetsAtCardinals: {
      id: "00000000-0000-4000-8000-000401873135",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873135",
      startsAt: "2026-12-20T21:05:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Arizona Cardinals",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "New York Jets",
          },
        },
      ],
    },
    CowboysAtRams: {
      id: "00000000-0000-4000-8000-000401873136",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873136",
      startsAt: "2026-12-20T21:25:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Los Angeles Rams",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Dallas Cowboys",
          },
        },
      ],
    },
    BroncosAtRaiders: {
      id: "00000000-0000-4000-8000-000401873137",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873137",
      startsAt: "2026-12-20T21:25:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Las Vegas Raiders",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Denver Broncos",
          },
        },
      ],
    },
    LionsAtVikings: {
      id: "00000000-0000-4000-8000-000401873138",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873138",
      startsAt: "2026-12-21T01:20:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Minnesota Vikings",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Detroit Lions",
          },
        },
      ],
    },
    PatriotsAtChiefs: {
      id: "00000000-0000-4000-8000-000401873139",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873139",
      startsAt: "2026-12-22T01:15:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Kansas City Chiefs",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "New England Patriots",
          },
        },
      ],
    },
  },
  Week16: {
    TexansAtEagles: {
      id: "00000000-0000-4000-8000-000401873140",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873140",
      startsAt: "2026-12-25T01:15:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Philadelphia Eagles",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Houston Texans",
          },
        },
      ],
    },
    PackersAtBears: {
      id: "00000000-0000-4000-8000-000401873141",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873141",
      startsAt: "2026-12-25T18:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Chicago Bears",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Green Bay Packers",
          },
        },
      ],
    },
    BillsAtBroncos: {
      id: "00000000-0000-4000-8000-000401873142",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873142",
      startsAt: "2026-12-25T21:30:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Denver Broncos",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Buffalo Bills",
          },
        },
      ],
    },
    RamsAtSeahawks: {
      id: "00000000-0000-4000-8000-000401873143",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873143",
      startsAt: "2026-12-26T01:15:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Seattle Seahawks",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Los Angeles Rams",
          },
        },
      ],
    },
    PanthersAtSteelers: {
      id: "00000000-0000-4000-8000-000401873144",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873144",
      startsAt: "2026-12-27T05:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Pittsburgh Steelers",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Carolina Panthers",
          },
        },
      ],
    },
    BengalsAtColts: {
      id: "00000000-0000-4000-8000-000401873145",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873145",
      startsAt: "2026-12-27T05:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Indianapolis Colts",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Cincinnati Bengals",
          },
        },
      ],
    },
    BuccaneersAtFalcons: {
      id: "00000000-0000-4000-8000-000401873146",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873146",
      startsAt: "2026-12-27T05:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Atlanta Falcons",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Tampa Bay Buccaneers",
          },
        },
      ],
    },
    CommandersAtVikings: {
      id: "00000000-0000-4000-8000-000401873147",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873147",
      startsAt: "2026-12-27T05:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Minnesota Vikings",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Washington Commanders",
          },
        },
      ],
    },
    CardinalsAtSaints: {
      id: "00000000-0000-4000-8000-000401873148",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873148",
      startsAt: "2026-12-27T18:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "New Orleans Saints",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Arizona Cardinals",
          },
        },
      ],
    },
    BrownsAtRavens: {
      id: "00000000-0000-4000-8000-000401873149",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873149",
      startsAt: "2026-12-27T18:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Baltimore Ravens",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Cleveland Browns",
          },
        },
      ],
    },
    ChargersAtDolphins: {
      id: "00000000-0000-4000-8000-000401873150",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873150",
      startsAt: "2026-12-27T18:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Miami Dolphins",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Los Angeles Chargers",
          },
        },
      ],
    },
    PatriotsAtJets: {
      id: "00000000-0000-4000-8000-000401873151",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873151",
      startsAt: "2026-12-27T18:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "New York Jets",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "New England Patriots",
          },
        },
      ],
    },
    TitansAtRaiders: {
      id: "00000000-0000-4000-8000-000401873152",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873152",
      startsAt: "2026-12-27T21:05:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Las Vegas Raiders",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Tennessee Titans",
          },
        },
      ],
    },
    _49ersAtChiefs: {
      id: "00000000-0000-4000-8000-000401873153",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873153",
      startsAt: "2026-12-27T21:25:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Kansas City Chiefs",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "San Francisco 49ers",
          },
        },
      ],
    },
    JaguarsAtCowboys: {
      id: "00000000-0000-4000-8000-000401873154",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873154",
      startsAt: "2026-12-28T01:20:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Dallas Cowboys",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Jacksonville Jaguars",
          },
        },
      ],
    },
    GiantsAtLions: {
      id: "00000000-0000-4000-8000-000401873155",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873155",
      startsAt: "2026-12-29T01:15:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Detroit Lions",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "New York Giants",
          },
        },
      ],
    },
  },
  Week17: {
    RavensAtBengals: {
      id: "00000000-0000-4000-8000-000401873156",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873156",
      startsAt: "2027-01-01T01:15:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Cincinnati Bengals",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Baltimore Ravens",
          },
        },
      ],
    },
    BroncosAtPatriots: {
      id: "00000000-0000-4000-8000-000401873157",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873157",
      startsAt: "2027-01-03T05:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "New England Patriots",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Denver Broncos",
          },
        },
      ],
    },
    ChiefsAtChargers: {
      id: "00000000-0000-4000-8000-000401873158",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873158",
      startsAt: "2027-01-03T05:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Los Angeles Chargers",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Kansas City Chiefs",
          },
        },
      ],
    },
    RamsAtBuccaneers: {
      id: "00000000-0000-4000-8000-000401873159",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873159",
      startsAt: "2027-01-03T05:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Tampa Bay Buccaneers",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Los Angeles Rams",
          },
        },
      ],
    },
    CommandersAtJaguars: {
      id: "00000000-0000-4000-8000-000401873160",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873160",
      startsAt: "2027-01-03T05:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Jacksonville Jaguars",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Washington Commanders",
          },
        },
      ],
    },
    BillsAtDolphins: {
      id: "00000000-0000-4000-8000-000401873161",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873161",
      startsAt: "2027-01-03T18:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Miami Dolphins",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Buffalo Bills",
          },
        },
      ],
    },
    ColtsAtBrowns: {
      id: "00000000-0000-4000-8000-000401873162",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873162",
      startsAt: "2027-01-03T18:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Cleveland Browns",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Indianapolis Colts",
          },
        },
      ],
    },
    VikingsAtJets: {
      id: "00000000-0000-4000-8000-000401873163",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873163",
      startsAt: "2027-01-03T18:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "New York Jets",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Minnesota Vikings",
          },
        },
      ],
    },
    SaintsAtFalcons: {
      id: "00000000-0000-4000-8000-000401873164",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873164",
      startsAt: "2027-01-03T18:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Atlanta Falcons",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "New Orleans Saints",
          },
        },
      ],
    },
    GiantsAtCowboys: {
      id: "00000000-0000-4000-8000-000401873165",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873165",
      startsAt: "2027-01-03T18:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Dallas Cowboys",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "New York Giants",
          },
        },
      ],
    },
    SteelersAtTitans: {
      id: "00000000-0000-4000-8000-000401873166",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873166",
      startsAt: "2027-01-03T18:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Tennessee Titans",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Pittsburgh Steelers",
          },
        },
      ],
    },
    SeahawksAtPanthers: {
      id: "00000000-0000-4000-8000-000401873167",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873167",
      startsAt: "2027-01-03T18:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Carolina Panthers",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Seattle Seahawks",
          },
        },
      ],
    },
    RaidersAtCardinals: {
      id: "00000000-0000-4000-8000-000401873168",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873168",
      startsAt: "2027-01-03T21:05:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Arizona Cardinals",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Las Vegas Raiders",
          },
        },
      ],
    },
    LionsAtBears: {
      id: "00000000-0000-4000-8000-000401873169",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873169",
      startsAt: "2027-01-03T21:25:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Chicago Bears",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Detroit Lions",
          },
        },
      ],
    },
    EaglesAt49ers: {
      id: "00000000-0000-4000-8000-000401873170",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873170",
      startsAt: "2027-01-04T01:20:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "San Francisco 49ers",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Philadelphia Eagles",
          },
        },
      ],
    },
    TexansAtPackers: {
      id: "00000000-0000-4000-8000-000401873171",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873171",
      startsAt: "2027-01-05T01:15:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Green Bay Packers",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Houston Texans",
          },
        },
      ],
    },
  },
  Week18: {
    FalconsAtPanthers: {
      id: "00000000-0000-4000-8000-000401873172",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873172",
      startsAt: "2027-01-10T05:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Carolina Panthers",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Atlanta Falcons",
          },
        },
      ],
    },
    BearsAtVikings: {
      id: "00000000-0000-4000-8000-000401873173",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873173",
      startsAt: "2027-01-10T05:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Minnesota Vikings",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Chicago Bears",
          },
        },
      ],
    },
    BrownsAtBengals: {
      id: "00000000-0000-4000-8000-000401873174",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873174",
      startsAt: "2027-01-10T05:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Cincinnati Bengals",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Cleveland Browns",
          },
        },
      ],
    },
    CowboysAtCommanders: {
      id: "00000000-0000-4000-8000-000401873175",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873175",
      startsAt: "2027-01-10T05:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Washington Commanders",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Dallas Cowboys",
          },
        },
      ],
    },
    LionsAtPackers: {
      id: "00000000-0000-4000-8000-000401873176",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873176",
      startsAt: "2027-01-10T05:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Green Bay Packers",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Detroit Lions",
          },
        },
      ],
    },
    JaguarsAtColts: {
      id: "00000000-0000-4000-8000-000401873177",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873177",
      startsAt: "2027-01-10T05:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Indianapolis Colts",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Jacksonville Jaguars",
          },
        },
      ],
    },
    RaidersAtChiefs: {
      id: "00000000-0000-4000-8000-000401873178",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873178",
      startsAt: "2027-01-10T05:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Kansas City Chiefs",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Las Vegas Raiders",
          },
        },
      ],
    },
    ChargersAtBroncos: {
      id: "00000000-0000-4000-8000-000401873179",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873179",
      startsAt: "2027-01-10T05:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Denver Broncos",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Los Angeles Chargers",
          },
        },
      ],
    },
    DolphinsAtPatriots: {
      id: "00000000-0000-4000-8000-000401873180",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873180",
      startsAt: "2027-01-10T05:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "New England Patriots",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Miami Dolphins",
          },
        },
      ],
    },
    JetsAtBills: {
      id: "00000000-0000-4000-8000-000401873181",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873181",
      startsAt: "2027-01-10T05:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Buffalo Bills",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "New York Jets",
          },
        },
      ],
    },
    EaglesAtGiants: {
      id: "00000000-0000-4000-8000-000401873182",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873182",
      startsAt: "2027-01-10T05:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "New York Giants",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Philadelphia Eagles",
          },
        },
      ],
    },
    SteelersAtRavens: {
      id: "00000000-0000-4000-8000-000401873183",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873183",
      startsAt: "2027-01-10T05:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Baltimore Ravens",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Pittsburgh Steelers",
          },
        },
      ],
    },
    _49ersAtCardinals: {
      id: "00000000-0000-4000-8000-000401873184",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873184",
      startsAt: "2027-01-10T05:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Arizona Cardinals",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "San Francisco 49ers",
          },
        },
      ],
    },
    SeahawksAtRams: {
      id: "00000000-0000-4000-8000-000401873185",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873185",
      startsAt: "2027-01-10T05:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Los Angeles Rams",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Seattle Seahawks",
          },
        },
      ],
    },
    BuccaneersAtSaints: {
      id: "00000000-0000-4000-8000-000401873186",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873186",
      startsAt: "2027-01-10T05:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "New Orleans Saints",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Tampa Bay Buccaneers",
          },
        },
      ],
    },
    TitansAtTexans: {
      id: "00000000-0000-4000-8000-000401873187",
      _tag: "sports_game",
      sourceId: "sports_game:espn:00000000-0000-4000-8000-000401873187",
      startsAt: "2027-01-10T05:00:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nfl",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Houston Texans",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "Tennessee Titans",
          },
        },
      ],
    },
  },
} as const satisfies Record<string, Record<string, NflSportEventSeed>>;

export const events = [
  ...Object.values(Games.Week1),
  ...Object.values(Games.Week2),
  ...Object.values(Games.Week3),
  ...Object.values(Games.Week4),
  ...Object.values(Games.Week5),
  ...Object.values(Games.Week6),
  ...Object.values(Games.Week7),
  ...Object.values(Games.Week8),
  ...Object.values(Games.Week9),
  ...Object.values(Games.Week10),
  ...Object.values(Games.Week11),
  ...Object.values(Games.Week12),
  ...Object.values(Games.Week13),
  ...Object.values(Games.Week14),
  ...Object.values(Games.Week15),
  ...Object.values(Games.Week16),
  ...Object.values(Games.Week17),
  ...Object.values(Games.Week18),
] satisfies readonly NflSportEventSeed[];
