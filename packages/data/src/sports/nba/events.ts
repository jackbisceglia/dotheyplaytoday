import type { SportsSeedEncoded } from "../../schema/sports.js";

type NbaSportEventSeed = SportsSeedEncoded["events"][number];

// NBA's August 13 release defines 80 games per team. The 30 NBA Cup flex
// games will be added once their matchups and tipoff times are announced.
export const Games = {
  _401909088: {
    id: "00000000-0000-4000-8000-000401909088",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909088",
    startsAt: "2026-10-20T19:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Detroit Pistons",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Boston Celtics",
        },
      },
    ],
  },
  _401909089: {
    id: "00000000-0000-4000-8000-000401909089",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909089",
    startsAt: "2026-10-20T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "New York Knicks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Philadelphia 76ers",
        },
      },
    ],
  },
  _401909090: {
    id: "00000000-0000-4000-8000-000401909090",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909090",
    startsAt: "2026-10-21T01:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "San Antonio Spurs",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Oklahoma City Thunder",
        },
      },
    ],
  },
  _401909834: {
    id: "00000000-0000-4000-8000-000401909834",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909834",
    startsAt: "2026-10-21T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Orlando Magic",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Atlanta Hawks",
        },
      },
    ],
  },
  _401909835: {
    id: "00000000-0000-4000-8000-000401909835",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909835",
    startsAt: "2026-10-21T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Washington Wizards",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Milwaukee Bucks",
        },
      },
    ],
  },
  _401909091: {
    id: "00000000-0000-4000-8000-000401909091",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909091",
    startsAt: "2026-10-21T23:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Miami Heat",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Minnesota Timberwolves",
        },
      },
    ],
  },
  _401909836: {
    id: "00000000-0000-4000-8000-000401909836",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909836",
    startsAt: "2026-10-21T23:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Brooklyn Nets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Charlotte Hornets",
        },
      },
    ],
  },
  _401909837: {
    id: "00000000-0000-4000-8000-000401909837",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909837",
    startsAt: "2026-10-21T23:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Toronto Raptors",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Chicago Bulls",
        },
      },
    ],
  },
  _401909838: {
    id: "00000000-0000-4000-8000-000401909838",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909838",
    startsAt: "2026-10-22T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Memphis Grizzlies",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Utah Jazz",
        },
      },
    ],
  },
  _401909839: {
    id: "00000000-0000-4000-8000-000401909839",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909839",
    startsAt: "2026-10-22T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "New Orleans Pelicans",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Indiana Pacers",
        },
      },
    ],
  },
  _401909840: {
    id: "00000000-0000-4000-8000-000401909840",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909840",
    startsAt: "2026-10-22T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Houston Rockets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Dallas Mavericks",
        },
      },
    ],
  },
  _401909092: {
    id: "00000000-0000-4000-8000-000401909092",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909092",
    startsAt: "2026-10-22T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Los Angeles Lakers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Golden State Warriors",
        },
      },
    ],
  },
  _401909841: {
    id: "00000000-0000-4000-8000-000401909841",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909841",
    startsAt: "2026-10-22T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Portland Trail Blazers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Phoenix Suns",
        },
      },
    ],
  },
  _401909842: {
    id: "00000000-0000-4000-8000-000401909842",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909842",
    startsAt: "2026-10-22T02:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "LA Clippers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Sacramento Kings",
        },
      },
    ],
  },
  _401909093: {
    id: "00000000-0000-4000-8000-000401909093",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909093",
    startsAt: "2026-10-22T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Philadelphia 76ers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Cleveland Cavaliers",
        },
      },
    ],
  },
  _401909094: {
    id: "00000000-0000-4000-8000-000401909094",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909094",
    startsAt: "2026-10-23T01:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Oklahoma City Thunder",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Denver Nuggets",
        },
      },
    ],
  },
  _401909095: {
    id: "00000000-0000-4000-8000-000401909095",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909095",
    startsAt: "2026-10-23T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Boston Celtics",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "New York Knicks",
        },
      },
    ],
  },
  _401909843: {
    id: "00000000-0000-4000-8000-000401909843",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909843",
    startsAt: "2026-10-23T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Charlotte Hornets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Atlanta Hawks",
        },
      },
    ],
  },
  _401909844: {
    id: "00000000-0000-4000-8000-000401909844",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909844",
    startsAt: "2026-10-23T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Indiana Pacers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Dallas Mavericks",
        },
      },
    ],
  },
  _401909845: {
    id: "00000000-0000-4000-8000-000401909845",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909845",
    startsAt: "2026-10-23T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Orlando Magic",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Minnesota Timberwolves",
        },
      },
    ],
  },
  _401909846: {
    id: "00000000-0000-4000-8000-000401909846",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909846",
    startsAt: "2026-10-23T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Washington Wizards",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Toronto Raptors",
        },
      },
    ],
  },
  _401909847: {
    id: "00000000-0000-4000-8000-000401909847",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909847",
    startsAt: "2026-10-24T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Miami Heat",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Detroit Pistons",
        },
      },
    ],
  },
  _401909848: {
    id: "00000000-0000-4000-8000-000401909848",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909848",
    startsAt: "2026-10-24T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Milwaukee Bucks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Chicago Bulls",
        },
      },
    ],
  },
  _401909096: {
    id: "00000000-0000-4000-8000-000401909096",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909096",
    startsAt: "2026-10-24T01:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "San Antonio Spurs",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Houston Rockets",
        },
      },
    ],
  },
  _401909849: {
    id: "00000000-0000-4000-8000-000401909849",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909849",
    startsAt: "2026-10-24T01:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Utah Jazz",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "New Orleans Pelicans",
        },
      },
    ],
  },
  _401909850: {
    id: "00000000-0000-4000-8000-000401909850",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909850",
    startsAt: "2026-10-24T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Golden State Warriors",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Memphis Grizzlies",
        },
      },
    ],
  },
  _401909851: {
    id: "00000000-0000-4000-8000-000401909851",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909851",
    startsAt: "2026-10-24T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Los Angeles Lakers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "LA Clippers",
        },
      },
    ],
  },
  _401909852: {
    id: "00000000-0000-4000-8000-000401909852",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909852",
    startsAt: "2026-10-24T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Sacramento Kings",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Portland Trail Blazers",
        },
      },
    ],
  },
  _401909853: {
    id: "00000000-0000-4000-8000-000401909853",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909853",
    startsAt: "2026-10-24T22:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Charlotte Hornets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Miami Heat",
        },
      },
    ],
  },
  _401909854: {
    id: "00000000-0000-4000-8000-000401909854",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909854",
    startsAt: "2026-10-24T23:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Cleveland Cavaliers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Brooklyn Nets",
        },
      },
    ],
  },
  _401909855: {
    id: "00000000-0000-4000-8000-000401909855",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909855",
    startsAt: "2026-10-24T23:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Philadelphia 76ers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Milwaukee Bucks",
        },
      },
    ],
  },
  _401909856: {
    id: "00000000-0000-4000-8000-000401909856",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909856",
    startsAt: "2026-10-25T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Atlanta Hawks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Houston Rockets",
        },
      },
    ],
  },
  _401909857: {
    id: "00000000-0000-4000-8000-000401909857",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909857",
    startsAt: "2026-10-25T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Chicago Bulls",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Washington Wizards",
        },
      },
    ],
  },
  _401909858: {
    id: "00000000-0000-4000-8000-000401909858",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909858",
    startsAt: "2026-10-25T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Dallas Mavericks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "San Antonio Spurs",
        },
      },
    ],
  },
  _401909859: {
    id: "00000000-0000-4000-8000-000401909859",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909859",
    startsAt: "2026-10-25T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Denver Nuggets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "New Orleans Pelicans",
        },
      },
    ],
  },
  _401909860: {
    id: "00000000-0000-4000-8000-000401909860",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909860",
    startsAt: "2026-10-25T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Phoenix Suns",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Golden State Warriors",
        },
      },
    ],
  },
  _401909861: {
    id: "00000000-0000-4000-8000-000401909861",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909861",
    startsAt: "2026-10-25T21:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Utah Jazz",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Los Angeles Lakers",
        },
      },
    ],
  },
  _401909862: {
    id: "00000000-0000-4000-8000-000401909862",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909862",
    startsAt: "2026-10-25T22:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Brooklyn Nets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Indiana Pacers",
        },
      },
    ],
  },
  _401909863: {
    id: "00000000-0000-4000-8000-000401909863",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909863",
    startsAt: "2026-10-25T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "New York Knicks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Orlando Magic",
        },
      },
    ],
  },
  _401909864: {
    id: "00000000-0000-4000-8000-000401909864",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909864",
    startsAt: "2026-10-25T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Minnesota Timberwolves",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Toronto Raptors",
        },
      },
    ],
  },
  _401909865: {
    id: "00000000-0000-4000-8000-000401909865",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909865",
    startsAt: "2026-10-25T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Oklahoma City Thunder",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "LA Clippers",
        },
      },
    ],
  },
  _401909866: {
    id: "00000000-0000-4000-8000-000401909866",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909866",
    startsAt: "2026-10-25T23:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Philadelphia 76ers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Detroit Pistons",
        },
      },
    ],
  },
  _401909867: {
    id: "00000000-0000-4000-8000-000401909867",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909867",
    startsAt: "2026-10-26T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Sacramento Kings",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Memphis Grizzlies",
        },
      },
    ],
  },
  _401909868: {
    id: "00000000-0000-4000-8000-000401909868",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909868",
    startsAt: "2026-10-26T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Charlotte Hornets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Washington Wizards",
        },
      },
    ],
  },
  _401909869: {
    id: "00000000-0000-4000-8000-000401909869",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909869",
    startsAt: "2026-10-26T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Cleveland Cavaliers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Minnesota Timberwolves",
        },
      },
    ],
  },
  _401909870: {
    id: "00000000-0000-4000-8000-000401909870",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909870",
    startsAt: "2026-10-26T23:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Boston Celtics",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Chicago Bulls",
        },
      },
    ],
  },
  _401909871: {
    id: "00000000-0000-4000-8000-000401909871",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909871",
    startsAt: "2026-10-26T23:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Miami Heat",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Dallas Mavericks",
        },
      },
    ],
  },
  _401909872: {
    id: "00000000-0000-4000-8000-000401909872",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909872",
    startsAt: "2026-10-27T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Milwaukee Bucks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Indiana Pacers",
        },
      },
    ],
  },
  _401909873: {
    id: "00000000-0000-4000-8000-000401909873",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909873",
    startsAt: "2026-10-27T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Oklahoma City Thunder",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Phoenix Suns",
        },
      },
    ],
  },
  _401909874: {
    id: "00000000-0000-4000-8000-000401909874",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909874",
    startsAt: "2026-10-27T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Houston Rockets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Atlanta Hawks",
        },
      },
    ],
  },
  _401909875: {
    id: "00000000-0000-4000-8000-000401909875",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909875",
    startsAt: "2026-10-27T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Utah Jazz",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Memphis Grizzlies",
        },
      },
    ],
  },
  _401909876: {
    id: "00000000-0000-4000-8000-000401909876",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909876",
    startsAt: "2026-10-27T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Denver Nuggets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Golden State Warriors",
        },
      },
    ],
  },
  _401909877: {
    id: "00000000-0000-4000-8000-000401909877",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909877",
    startsAt: "2026-10-27T23:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Boston Celtics",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Brooklyn Nets",
        },
      },
    ],
  },
  _401909878: {
    id: "00000000-0000-4000-8000-000401909878",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909878",
    startsAt: "2026-10-28T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "New York Knicks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Detroit Pistons",
        },
      },
    ],
  },
  _401909879: {
    id: "00000000-0000-4000-8000-000401909879",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909879",
    startsAt: "2026-10-28T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "San Antonio Spurs",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Sacramento Kings",
        },
      },
    ],
  },
  _401909880: {
    id: "00000000-0000-4000-8000-000401909880",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909880",
    startsAt: "2026-10-28T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Los Angeles Lakers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Portland Trail Blazers",
        },
      },
    ],
  },
  _401909881: {
    id: "00000000-0000-4000-8000-000401909881",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909881",
    startsAt: "2026-10-28T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Atlanta Hawks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Miami Heat",
        },
      },
    ],
  },
  _401909882: {
    id: "00000000-0000-4000-8000-000401909882",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909882",
    startsAt: "2026-10-28T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Cleveland Cavaliers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Washington Wizards",
        },
      },
    ],
  },
  _401909883: {
    id: "00000000-0000-4000-8000-000401909883",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909883",
    startsAt: "2026-10-28T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Detroit Pistons",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Charlotte Hornets",
        },
      },
    ],
  },
  _401909884: {
    id: "00000000-0000-4000-8000-000401909884",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909884",
    startsAt: "2026-10-28T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Indiana Pacers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Philadelphia 76ers",
        },
      },
    ],
  },
  _401909885: {
    id: "00000000-0000-4000-8000-000401909885",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909885",
    startsAt: "2026-10-28T23:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Toronto Raptors",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Orlando Magic",
        },
      },
    ],
  },
  _401909886: {
    id: "00000000-0000-4000-8000-000401909886",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909886",
    startsAt: "2026-10-29T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Chicago Bulls",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "New York Knicks",
        },
      },
    ],
  },
  _401909887: {
    id: "00000000-0000-4000-8000-000401909887",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909887",
    startsAt: "2026-10-29T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Milwaukee Bucks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Houston Rockets",
        },
      },
    ],
  },
  _401909888: {
    id: "00000000-0000-4000-8000-000401909888",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909888",
    startsAt: "2026-10-29T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Minnesota Timberwolves",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Golden State Warriors",
        },
      },
    ],
  },
  _401909889: {
    id: "00000000-0000-4000-8000-000401909889",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909889",
    startsAt: "2026-10-29T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "New Orleans Pelicans",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Denver Nuggets",
        },
      },
    ],
  },
  _401909890: {
    id: "00000000-0000-4000-8000-000401909890",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909890",
    startsAt: "2026-10-29T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Utah Jazz",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "San Antonio Spurs",
        },
      },
    ],
  },
  _401909891: {
    id: "00000000-0000-4000-8000-000401909891",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909891",
    startsAt: "2026-10-29T01:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Dallas Mavericks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Oklahoma City Thunder",
        },
      },
    ],
  },
  _401909892: {
    id: "00000000-0000-4000-8000-000401909892",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909892",
    startsAt: "2026-10-29T02:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "LA Clippers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Los Angeles Lakers",
        },
      },
    ],
  },
  _401909893: {
    id: "00000000-0000-4000-8000-000401909893",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909893",
    startsAt: "2026-10-29T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Atlanta Hawks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Cleveland Cavaliers",
        },
      },
    ],
  },
  _401909894: {
    id: "00000000-0000-4000-8000-000401909894",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909894",
    startsAt: "2026-10-30T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "New Orleans Pelicans",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Sacramento Kings",
        },
      },
    ],
  },
  _401909895: {
    id: "00000000-0000-4000-8000-000401909895",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909895",
    startsAt: "2026-10-30T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Portland Trail Blazers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Memphis Grizzlies",
        },
      },
    ],
  },
  _401909277: {
    id: "00000000-0000-4000-8000-000401909277",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909277",
    startsAt: "2026-10-30T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Washington Wizards",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Charlotte Hornets",
        },
      },
    ],
  },
  _401909278: {
    id: "00000000-0000-4000-8000-000401909278",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909278",
    startsAt: "2026-10-30T23:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Boston Celtics",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Chicago Bulls",
        },
      },
    ],
  },
  _401909279: {
    id: "00000000-0000-4000-8000-000401909279",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909279",
    startsAt: "2026-10-30T23:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Brooklyn Nets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Detroit Pistons",
        },
      },
    ],
  },
  _401909280: {
    id: "00000000-0000-4000-8000-000401909280",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909280",
    startsAt: "2026-10-30T23:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Philadelphia 76ers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "New York Knicks",
        },
      },
    ],
  },
  _401909281: {
    id: "00000000-0000-4000-8000-000401909281",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909281",
    startsAt: "2026-10-30T23:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Toronto Raptors",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Orlando Magic",
        },
      },
    ],
  },
  _401909282: {
    id: "00000000-0000-4000-8000-000401909282",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909282",
    startsAt: "2026-10-31T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Miami Heat",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Indiana Pacers",
        },
      },
    ],
  },
  _401909283: {
    id: "00000000-0000-4000-8000-000401909283",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909283",
    startsAt: "2026-10-31T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Dallas Mavericks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Houston Rockets",
        },
      },
    ],
  },
  _401909284: {
    id: "00000000-0000-4000-8000-000401909284",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909284",
    startsAt: "2026-10-31T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Minnesota Timberwolves",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "LA Clippers",
        },
      },
    ],
  },
  _401909285: {
    id: "00000000-0000-4000-8000-000401909285",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909285",
    startsAt: "2026-10-31T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Golden State Warriors",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Los Angeles Lakers",
        },
      },
    ],
  },
  _401909286: {
    id: "00000000-0000-4000-8000-000401909286",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909286",
    startsAt: "2026-10-31T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Phoenix Suns",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Denver Nuggets",
        },
      },
    ],
  },
  _401909896: {
    id: "00000000-0000-4000-8000-000401909896",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909896",
    startsAt: "2026-10-31T19:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Utah Jazz",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Portland Trail Blazers",
        },
      },
    ],
  },
  _401909897: {
    id: "00000000-0000-4000-8000-000401909897",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909897",
    startsAt: "2026-10-31T22:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Charlotte Hornets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Philadelphia 76ers",
        },
      },
    ],
  },
  _401909898: {
    id: "00000000-0000-4000-8000-000401909898",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909898",
    startsAt: "2026-10-31T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "New Orleans Pelicans",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Atlanta Hawks",
        },
      },
    ],
  },
  _401909899: {
    id: "00000000-0000-4000-8000-000401909899",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909899",
    startsAt: "2026-11-01T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Memphis Grizzlies",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Sacramento Kings",
        },
      },
    ],
  },
  _401909900: {
    id: "00000000-0000-4000-8000-000401909900",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909900",
    startsAt: "2026-11-01T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Milwaukee Bucks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Cleveland Cavaliers",
        },
      },
    ],
  },
  _401909901: {
    id: "00000000-0000-4000-8000-000401909901",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909901",
    startsAt: "2026-11-01T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "San Antonio Spurs",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Minnesota Timberwolves",
        },
      },
    ],
  },
  _401909902: {
    id: "00000000-0000-4000-8000-000401909902",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909902",
    startsAt: "2026-11-01T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Houston Rockets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Oklahoma City Thunder",
        },
      },
    ],
  },
  _401909903: {
    id: "00000000-0000-4000-8000-000401909903",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909903",
    startsAt: "2026-11-01T20:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Orlando Magic",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Boston Celtics",
        },
      },
    ],
  },
  _401909904: {
    id: "00000000-0000-4000-8000-000401909904",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909904",
    startsAt: "2026-11-01T22:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Indiana Pacers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Brooklyn Nets",
        },
      },
    ],
  },
  _401909905: {
    id: "00000000-0000-4000-8000-000401909905",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909905",
    startsAt: "2026-11-02T01:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Golden State Warriors",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "LA Clippers",
        },
      },
    ],
  },
  _401909906: {
    id: "00000000-0000-4000-8000-000401909906",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909906",
    startsAt: "2026-11-02T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Los Angeles Lakers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Toronto Raptors",
        },
      },
    ],
  },
  _401909907: {
    id: "00000000-0000-4000-8000-000401909907",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909907",
    startsAt: "2026-11-03T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Cleveland Cavaliers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Oklahoma City Thunder",
        },
      },
    ],
  },
  _401909908: {
    id: "00000000-0000-4000-8000-000401909908",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909908",
    startsAt: "2026-11-03T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Charlotte Hornets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Detroit Pistons",
        },
      },
    ],
  },
  _401909909: {
    id: "00000000-0000-4000-8000-000401909909",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909909",
    startsAt: "2026-11-03T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Indiana Pacers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Atlanta Hawks",
        },
      },
    ],
  },
  _401909910: {
    id: "00000000-0000-4000-8000-000401909910",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909910",
    startsAt: "2026-11-03T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "New York Knicks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Brooklyn Nets",
        },
      },
    ],
  },
  _401909911: {
    id: "00000000-0000-4000-8000-000401909911",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909911",
    startsAt: "2026-11-03T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Orlando Magic",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Washington Wizards",
        },
      },
    ],
  },
  _401909912: {
    id: "00000000-0000-4000-8000-000401909912",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909912",
    startsAt: "2026-11-03T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Philadelphia 76ers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Chicago Bulls",
        },
      },
    ],
  },
  _401909913: {
    id: "00000000-0000-4000-8000-000401909913",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909913",
    startsAt: "2026-11-03T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Dallas Mavericks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Sacramento Kings",
        },
      },
    ],
  },
  _401909914: {
    id: "00000000-0000-4000-8000-000401909914",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909914",
    startsAt: "2026-11-03T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Memphis Grizzlies",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "New Orleans Pelicans",
        },
      },
    ],
  },
  _401909915: {
    id: "00000000-0000-4000-8000-000401909915",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909915",
    startsAt: "2026-11-03T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Minnesota Timberwolves",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Milwaukee Bucks",
        },
      },
    ],
  },
  _401909916: {
    id: "00000000-0000-4000-8000-000401909916",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909916",
    startsAt: "2026-11-03T01:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Houston Rockets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Boston Celtics",
        },
      },
    ],
  },
  _401909917: {
    id: "00000000-0000-4000-8000-000401909917",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909917",
    startsAt: "2026-11-03T01:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "San Antonio Spurs",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Utah Jazz",
        },
      },
    ],
  },
  _401909918: {
    id: "00000000-0000-4000-8000-000401909918",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909918",
    startsAt: "2026-11-03T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Denver Nuggets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Portland Trail Blazers",
        },
      },
    ],
  },
  _401909919: {
    id: "00000000-0000-4000-8000-000401909919",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909919",
    startsAt: "2026-11-03T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Golden State Warriors",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Phoenix Suns",
        },
      },
    ],
  },
  _401909920: {
    id: "00000000-0000-4000-8000-000401909920",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909920",
    startsAt: "2026-11-03T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "LA Clippers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Toronto Raptors",
        },
      },
    ],
  },
  _401909921: {
    id: "00000000-0000-4000-8000-000401909921",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909921",
    startsAt: "2026-11-03T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Los Angeles Lakers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Miami Heat",
        },
      },
    ],
  },
  _401909922: {
    id: "00000000-0000-4000-8000-000401909922",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909922",
    startsAt: "2026-11-05T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Detroit Pistons",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Philadelphia 76ers",
        },
      },
    ],
  },
  _401909923: {
    id: "00000000-0000-4000-8000-000401909923",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909923",
    startsAt: "2026-11-05T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Washington Wizards",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Atlanta Hawks",
        },
      },
    ],
  },
  _401909924: {
    id: "00000000-0000-4000-8000-000401909924",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909924",
    startsAt: "2026-11-05T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Boston Celtics",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Milwaukee Bucks",
        },
      },
    ],
  },
  _401909925: {
    id: "00000000-0000-4000-8000-000401909925",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909925",
    startsAt: "2026-11-05T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Brooklyn Nets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Charlotte Hornets",
        },
      },
    ],
  },
  _401909926: {
    id: "00000000-0000-4000-8000-000401909926",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909926",
    startsAt: "2026-11-05T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "New York Knicks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Chicago Bulls",
        },
      },
    ],
  },
  _401909927: {
    id: "00000000-0000-4000-8000-000401909927",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909927",
    startsAt: "2026-11-05T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Memphis Grizzlies",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Indiana Pacers",
        },
      },
    ],
  },
  _401909928: {
    id: "00000000-0000-4000-8000-000401909928",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909928",
    startsAt: "2026-11-05T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "New Orleans Pelicans",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Utah Jazz",
        },
      },
    ],
  },
  _401909929: {
    id: "00000000-0000-4000-8000-000401909929",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909929",
    startsAt: "2026-11-05T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Oklahoma City Thunder",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Cleveland Cavaliers",
        },
      },
    ],
  },
  _401909930: {
    id: "00000000-0000-4000-8000-000401909930",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909930",
    startsAt: "2026-11-05T01:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Houston Rockets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Minnesota Timberwolves",
        },
      },
    ],
  },
  _401909931: {
    id: "00000000-0000-4000-8000-000401909931",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909931",
    startsAt: "2026-11-05T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Denver Nuggets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Toronto Raptors",
        },
      },
    ],
  },
  _401909932: {
    id: "00000000-0000-4000-8000-000401909932",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909932",
    startsAt: "2026-11-05T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Phoenix Suns",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Portland Trail Blazers",
        },
      },
    ],
  },
  _401909933: {
    id: "00000000-0000-4000-8000-000401909933",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909933",
    startsAt: "2026-11-05T02:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "San Antonio Spurs",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Dallas Mavericks",
        },
      },
    ],
  },
  _401909934: {
    id: "00000000-0000-4000-8000-000401909934",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909934",
    startsAt: "2026-11-05T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Sacramento Kings",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Los Angeles Lakers",
        },
      },
    ],
  },
  _401909935: {
    id: "00000000-0000-4000-8000-000401909935",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909935",
    startsAt: "2026-11-05T03:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "LA Clippers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Miami Heat",
        },
      },
    ],
  },
  _401909936: {
    id: "00000000-0000-4000-8000-000401909936",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909936",
    startsAt: "2026-11-06T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Phoenix Suns",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Orlando Magic",
        },
      },
    ],
  },
  _401909937: {
    id: "00000000-0000-4000-8000-000401909937",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909937",
    startsAt: "2026-11-06T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Golden State Warriors",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Miami Heat",
        },
      },
    ],
  },
  _401909287: {
    id: "00000000-0000-4000-8000-000401909287",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909287",
    startsAt: "2026-11-07T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Atlanta Hawks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Washington Wizards",
        },
      },
    ],
  },
  _401909288: {
    id: "00000000-0000-4000-8000-000401909288",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909288",
    startsAt: "2026-11-07T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Charlotte Hornets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Boston Celtics",
        },
      },
    ],
  },
  _401909289: {
    id: "00000000-0000-4000-8000-000401909289",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909289",
    startsAt: "2026-11-07T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Cleveland Cavaliers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Philadelphia 76ers",
        },
      },
    ],
  },
  _401909290: {
    id: "00000000-0000-4000-8000-000401909290",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909290",
    startsAt: "2026-11-07T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Dallas Mavericks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Utah Jazz",
        },
      },
    ],
  },
  _401909291: {
    id: "00000000-0000-4000-8000-000401909291",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909291",
    startsAt: "2026-11-07T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Memphis Grizzlies",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Oklahoma City Thunder",
        },
      },
    ],
  },
  _401909292: {
    id: "00000000-0000-4000-8000-000401909292",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909292",
    startsAt: "2026-11-07T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Milwaukee Bucks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Toronto Raptors",
        },
      },
    ],
  },
  _401909293: {
    id: "00000000-0000-4000-8000-000401909293",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909293",
    startsAt: "2026-11-07T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "New Orleans Pelicans",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Minnesota Timberwolves",
        },
      },
    ],
  },
  _401909294: {
    id: "00000000-0000-4000-8000-000401909294",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909294",
    startsAt: "2026-11-07T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Los Angeles Lakers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Portland Trail Blazers",
        },
      },
    ],
  },
  _401909295: {
    id: "00000000-0000-4000-8000-000401909295",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909295",
    startsAt: "2026-11-07T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Sacramento Kings",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "San Antonio Spurs",
        },
      },
    ],
  },
  _401909938: {
    id: "00000000-0000-4000-8000-000401909938",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909938",
    startsAt: "2026-11-07T22:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Indiana Pacers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Denver Nuggets",
        },
      },
    ],
  },
  _401909939: {
    id: "00000000-0000-4000-8000-000401909939",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909939",
    startsAt: "2026-11-08T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Atlanta Hawks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Brooklyn Nets",
        },
      },
    ],
  },
  _401909940: {
    id: "00000000-0000-4000-8000-000401909940",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909940",
    startsAt: "2026-11-08T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Cleveland Cavaliers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "New York Knicks",
        },
      },
    ],
  },
  _401909941: {
    id: "00000000-0000-4000-8000-000401909941",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909941",
    startsAt: "2026-11-08T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Oklahoma City Thunder",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Washington Wizards",
        },
      },
    ],
  },
  _401909942: {
    id: "00000000-0000-4000-8000-000401909942",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909942",
    startsAt: "2026-11-08T01:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Golden State Warriors",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Orlando Magic",
        },
      },
    ],
  },
  _401909943: {
    id: "00000000-0000-4000-8000-000401909943",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909943",
    startsAt: "2026-11-08T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Phoenix Suns",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Houston Rockets",
        },
      },
    ],
  },
  _401909944: {
    id: "00000000-0000-4000-8000-000401909944",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909944",
    startsAt: "2026-11-08T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Portland Trail Blazers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "San Antonio Spurs",
        },
      },
    ],
  },
  _401909945: {
    id: "00000000-0000-4000-8000-000401909945",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909945",
    startsAt: "2026-11-08T20:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Chicago Bulls",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Philadelphia 76ers",
        },
      },
    ],
  },
  _401909946: {
    id: "00000000-0000-4000-8000-000401909946",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909946",
    startsAt: "2026-11-08T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Detroit Pistons",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Los Angeles Lakers",
        },
      },
    ],
  },
  _401909947: {
    id: "00000000-0000-4000-8000-000401909947",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909947",
    startsAt: "2026-11-09T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Minnesota Timberwolves",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Utah Jazz",
        },
      },
    ],
  },
  _401909948: {
    id: "00000000-0000-4000-8000-000401909948",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909948",
    startsAt: "2026-11-09T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Dallas Mavericks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Brooklyn Nets",
        },
      },
    ],
  },
  _401909949: {
    id: "00000000-0000-4000-8000-000401909949",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909949",
    startsAt: "2026-11-09T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Milwaukee Bucks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Boston Celtics",
        },
      },
    ],
  },
  _401909950: {
    id: "00000000-0000-4000-8000-000401909950",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909950",
    startsAt: "2026-11-09T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "LA Clippers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "New Orleans Pelicans",
        },
      },
    ],
  },
  _401909951: {
    id: "00000000-0000-4000-8000-000401909951",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909951",
    startsAt: "2026-11-09T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Sacramento Kings",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Miami Heat",
        },
      },
    ],
  },
  _401909952: {
    id: "00000000-0000-4000-8000-000401909952",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909952",
    startsAt: "2026-11-10T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Atlanta Hawks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Los Angeles Lakers",
        },
      },
    ],
  },
  _401909953: {
    id: "00000000-0000-4000-8000-000401909953",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909953",
    startsAt: "2026-11-10T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Charlotte Hornets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Cleveland Cavaliers",
        },
      },
    ],
  },
  _401909954: {
    id: "00000000-0000-4000-8000-000401909954",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909954",
    startsAt: "2026-11-10T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Detroit Pistons",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Washington Wizards",
        },
      },
    ],
  },
  _401909955: {
    id: "00000000-0000-4000-8000-000401909955",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909955",
    startsAt: "2026-11-10T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Toronto Raptors",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Memphis Grizzlies",
        },
      },
    ],
  },
  _401909956: {
    id: "00000000-0000-4000-8000-000401909956",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909956",
    startsAt: "2026-11-10T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Dallas Mavericks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Indiana Pacers",
        },
      },
    ],
  },
  _401909957: {
    id: "00000000-0000-4000-8000-000401909957",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909957",
    startsAt: "2026-11-10T01:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Houston Rockets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Denver Nuggets",
        },
      },
    ],
  },
  _401909958: {
    id: "00000000-0000-4000-8000-000401909958",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909958",
    startsAt: "2026-11-10T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Phoenix Suns",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "San Antonio Spurs",
        },
      },
    ],
  },
  _401909959: {
    id: "00000000-0000-4000-8000-000401909959",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909959",
    startsAt: "2026-11-10T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Golden State Warriors",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "New Orleans Pelicans",
        },
      },
    ],
  },
  _401909960: {
    id: "00000000-0000-4000-8000-000401909960",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909960",
    startsAt: "2026-11-11T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "New York Knicks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Milwaukee Bucks",
        },
      },
    ],
  },
  _401909961: {
    id: "00000000-0000-4000-8000-000401909961",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909961",
    startsAt: "2026-11-11T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Philadelphia 76ers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Boston Celtics",
        },
      },
    ],
  },
  _401909962: {
    id: "00000000-0000-4000-8000-000401909962",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909962",
    startsAt: "2026-11-11T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Phoenix Suns",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "LA Clippers",
        },
      },
    ],
  },
  _401909963: {
    id: "00000000-0000-4000-8000-000401909963",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909963",
    startsAt: "2026-11-11T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Utah Jazz",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Miami Heat",
        },
      },
    ],
  },
  _401909964: {
    id: "00000000-0000-4000-8000-000401909964",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909964",
    startsAt: "2026-11-11T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Sacramento Kings",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Orlando Magic",
        },
      },
    ],
  },
  _401909965: {
    id: "00000000-0000-4000-8000-000401909965",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909965",
    startsAt: "2026-11-11T04:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Portland Trail Blazers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Oklahoma City Thunder",
        },
      },
    ],
  },
  _401909966: {
    id: "00000000-0000-4000-8000-000401909966",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909966",
    startsAt: "2026-11-12T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Indiana Pacers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Washington Wizards",
        },
      },
    ],
  },
  _401909967: {
    id: "00000000-0000-4000-8000-000401909967",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909967",
    startsAt: "2026-11-12T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "New York Knicks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Cleveland Cavaliers",
        },
      },
    ],
  },
  _401909968: {
    id: "00000000-0000-4000-8000-000401909968",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909968",
    startsAt: "2026-11-12T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Toronto Raptors",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Boston Celtics",
        },
      },
    ],
  },
  _401909969: {
    id: "00000000-0000-4000-8000-000401909969",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909969",
    startsAt: "2026-11-12T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Chicago Bulls",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "San Antonio Spurs",
        },
      },
    ],
  },
  _401909970: {
    id: "00000000-0000-4000-8000-000401909970",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909970",
    startsAt: "2026-11-12T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Memphis Grizzlies",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Denver Nuggets",
        },
      },
    ],
  },
  _401909971: {
    id: "00000000-0000-4000-8000-000401909971",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909971",
    startsAt: "2026-11-12T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Milwaukee Bucks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Los Angeles Lakers",
        },
      },
    ],
  },
  _401909972: {
    id: "00000000-0000-4000-8000-000401909972",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909972",
    startsAt: "2026-11-12T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "New Orleans Pelicans",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Brooklyn Nets",
        },
      },
    ],
  },
  _401909973: {
    id: "00000000-0000-4000-8000-000401909973",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909973",
    startsAt: "2026-11-12T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Utah Jazz",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Orlando Magic",
        },
      },
    ],
  },
  _401909974: {
    id: "00000000-0000-4000-8000-000401909974",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909974",
    startsAt: "2026-11-12T02:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Houston Rockets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Golden State Warriors",
        },
      },
    ],
  },
  _401909975: {
    id: "00000000-0000-4000-8000-000401909975",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909975",
    startsAt: "2026-11-12T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Portland Trail Blazers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Oklahoma City Thunder",
        },
      },
    ],
  },
  _401909976: {
    id: "00000000-0000-4000-8000-000401909976",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909976",
    startsAt: "2026-11-13T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Philadelphia 76ers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Toronto Raptors",
        },
      },
    ],
  },
  _401909977: {
    id: "00000000-0000-4000-8000-000401909977",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909977",
    startsAt: "2026-11-13T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Washington Wizards",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Detroit Pistons",
        },
      },
    ],
  },
  _401909978: {
    id: "00000000-0000-4000-8000-000401909978",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909978",
    startsAt: "2026-11-13T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Minnesota Timberwolves",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Dallas Mavericks",
        },
      },
    ],
  },
  _401909979: {
    id: "00000000-0000-4000-8000-000401909979",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909979",
    startsAt: "2026-11-13T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Phoenix Suns",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Charlotte Hornets",
        },
      },
    ],
  },
  _401909296: {
    id: "00000000-0000-4000-8000-000401909296",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909296",
    startsAt: "2026-11-14T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Indiana Pacers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "New York Knicks",
        },
      },
    ],
  },
  _401909297: {
    id: "00000000-0000-4000-8000-000401909297",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909297",
    startsAt: "2026-11-14T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Orlando Magic",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Milwaukee Bucks",
        },
      },
    ],
  },
  _401909298: {
    id: "00000000-0000-4000-8000-000401909298",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909298",
    startsAt: "2026-11-14T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Miami Heat",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Cleveland Cavaliers",
        },
      },
    ],
  },
  _401909299: {
    id: "00000000-0000-4000-8000-000401909299",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909299",
    startsAt: "2026-11-14T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Chicago Bulls",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Atlanta Hawks",
        },
      },
    ],
  },
  _401909300: {
    id: "00000000-0000-4000-8000-000401909300",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909300",
    startsAt: "2026-11-14T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "New Orleans Pelicans",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Memphis Grizzlies",
        },
      },
    ],
  },
  _401909301: {
    id: "00000000-0000-4000-8000-000401909301",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909301",
    startsAt: "2026-11-14T01:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Houston Rockets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Utah Jazz",
        },
      },
    ],
  },
  _401909302: {
    id: "00000000-0000-4000-8000-000401909302",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909302",
    startsAt: "2026-11-14T02:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "San Antonio Spurs",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Golden State Warriors",
        },
      },
    ],
  },
  _401909303: {
    id: "00000000-0000-4000-8000-000401909303",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909303",
    startsAt: "2026-11-14T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Sacramento Kings",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Portland Trail Blazers",
        },
      },
    ],
  },
  _401909304: {
    id: "00000000-0000-4000-8000-000401909304",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909304",
    startsAt: "2026-11-14T03:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "LA Clippers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Oklahoma City Thunder",
        },
      },
    ],
  },
  _401909980: {
    id: "00000000-0000-4000-8000-000401909980",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909980",
    startsAt: "2026-11-15T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "New Orleans Pelicans",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Denver Nuggets",
        },
      },
    ],
  },
  _401909981: {
    id: "00000000-0000-4000-8000-000401909981",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909981",
    startsAt: "2026-11-15T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Cleveland Cavaliers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Dallas Mavericks",
        },
      },
    ],
  },
  _401909982: {
    id: "00000000-0000-4000-8000-000401909982",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909982",
    startsAt: "2026-11-15T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Miami Heat",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Detroit Pistons",
        },
      },
    ],
  },
  _401909983: {
    id: "00000000-0000-4000-8000-000401909983",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909983",
    startsAt: "2026-11-15T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Memphis Grizzlies",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Brooklyn Nets",
        },
      },
    ],
  },
  _401909984: {
    id: "00000000-0000-4000-8000-000401909984",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909984",
    startsAt: "2026-11-15T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Minnesota Timberwolves",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Chicago Bulls",
        },
      },
    ],
  },
  _401909985: {
    id: "00000000-0000-4000-8000-000401909985",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909985",
    startsAt: "2026-11-15T18:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Philadelphia 76ers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Indiana Pacers",
        },
      },
    ],
  },
  _401909986: {
    id: "00000000-0000-4000-8000-000401909986",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909986",
    startsAt: "2026-11-15T21:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Phoenix Suns",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Los Angeles Lakers",
        },
      },
    ],
  },
  _401909987: {
    id: "00000000-0000-4000-8000-000401909987",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909987",
    startsAt: "2026-11-15T21:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "LA Clippers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Charlotte Hornets",
        },
      },
    ],
  },
  _401909988: {
    id: "00000000-0000-4000-8000-000401909988",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909988",
    startsAt: "2026-11-15T22:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Utah Jazz",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "San Antonio Spurs",
        },
      },
    ],
  },
  _401909989: {
    id: "00000000-0000-4000-8000-000401909989",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909989",
    startsAt: "2026-11-15T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Boston Celtics",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Dallas Mavericks",
        },
      },
    ],
  },
  _401909990: {
    id: "00000000-0000-4000-8000-000401909990",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909990",
    startsAt: "2026-11-15T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Toronto Raptors",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "New York Knicks",
        },
      },
    ],
  },
  _401909991: {
    id: "00000000-0000-4000-8000-000401909991",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909991",
    startsAt: "2026-11-16T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Washington Wizards",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Houston Rockets",
        },
      },
    ],
  },
  _401909992: {
    id: "00000000-0000-4000-8000-000401909992",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909992",
    startsAt: "2026-11-16T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Milwaukee Bucks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Atlanta Hawks",
        },
      },
    ],
  },
  _401909993: {
    id: "00000000-0000-4000-8000-000401909993",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909993",
    startsAt: "2026-11-16T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Sacramento Kings",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Oklahoma City Thunder",
        },
      },
    ],
  },
  _401909994: {
    id: "00000000-0000-4000-8000-000401909994",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909994",
    startsAt: "2026-11-17T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Boston Celtics",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Orlando Magic",
        },
      },
    ],
  },
  _401909995: {
    id: "00000000-0000-4000-8000-000401909995",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909995",
    startsAt: "2026-11-17T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Cleveland Cavaliers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Chicago Bulls",
        },
      },
    ],
  },
  _401909996: {
    id: "00000000-0000-4000-8000-000401909996",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909996",
    startsAt: "2026-11-17T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Washington Wizards",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Memphis Grizzlies",
        },
      },
    ],
  },
  _401909997: {
    id: "00000000-0000-4000-8000-000401909997",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909997",
    startsAt: "2026-11-17T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Brooklyn Nets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Philadelphia 76ers",
        },
      },
    ],
  },
  _401909998: {
    id: "00000000-0000-4000-8000-000401909998",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909998",
    startsAt: "2026-11-17T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Miami Heat",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Houston Rockets",
        },
      },
    ],
  },
  _401909999: {
    id: "00000000-0000-4000-8000-000401909999",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909999",
    startsAt: "2026-11-17T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Minnesota Timberwolves",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Portland Trail Blazers",
        },
      },
    ],
  },
  _401910000: {
    id: "00000000-0000-4000-8000-000401910000",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910000",
    startsAt: "2026-11-17T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "New Orleans Pelicans",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Golden State Warriors",
        },
      },
    ],
  },
  _401910001: {
    id: "00000000-0000-4000-8000-000401910001",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910001",
    startsAt: "2026-11-17T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Denver Nuggets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Phoenix Suns",
        },
      },
    ],
  },
  _401910002: {
    id: "00000000-0000-4000-8000-000401910002",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910002",
    startsAt: "2026-11-18T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Toronto Raptors",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "New York Knicks",
        },
      },
    ],
  },
  _401910003: {
    id: "00000000-0000-4000-8000-000401910003",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910003",
    startsAt: "2026-11-18T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Minnesota Timberwolves",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Portland Trail Blazers",
        },
      },
    ],
  },
  _401910004: {
    id: "00000000-0000-4000-8000-000401910004",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910004",
    startsAt: "2026-11-18T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "San Antonio Spurs",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Detroit Pistons",
        },
      },
    ],
  },
  _401910005: {
    id: "00000000-0000-4000-8000-000401910005",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910005",
    startsAt: "2026-11-18T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Los Angeles Lakers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Charlotte Hornets",
        },
      },
    ],
  },
  _401910006: {
    id: "00000000-0000-4000-8000-000401910006",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910006",
    startsAt: "2026-11-18T04:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "LA Clippers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Utah Jazz",
        },
      },
    ],
  },
  _401910007: {
    id: "00000000-0000-4000-8000-000401910007",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910007",
    startsAt: "2026-11-19T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Cleveland Cavaliers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Memphis Grizzlies",
        },
      },
    ],
  },
  _401910008: {
    id: "00000000-0000-4000-8000-000401910008",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910008",
    startsAt: "2026-11-19T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Indiana Pacers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Houston Rockets",
        },
      },
    ],
  },
  _401910009: {
    id: "00000000-0000-4000-8000-000401910009",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910009",
    startsAt: "2026-11-19T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Miami Heat",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Milwaukee Bucks",
        },
      },
    ],
  },
  _401910010: {
    id: "00000000-0000-4000-8000-000401910010",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910010",
    startsAt: "2026-11-19T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Orlando Magic",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Philadelphia 76ers",
        },
      },
    ],
  },
  _401910011: {
    id: "00000000-0000-4000-8000-000401910011",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910011",
    startsAt: "2026-11-19T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Brooklyn Nets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Chicago Bulls",
        },
      },
    ],
  },
  _401910012: {
    id: "00000000-0000-4000-8000-000401910012",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910012",
    startsAt: "2026-11-19T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Toronto Raptors",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Washington Wizards",
        },
      },
    ],
  },
  _401910013: {
    id: "00000000-0000-4000-8000-000401910013",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910013",
    startsAt: "2026-11-19T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "New Orleans Pelicans",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Detroit Pistons",
        },
      },
    ],
  },
  _401910014: {
    id: "00000000-0000-4000-8000-000401910014",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910014",
    startsAt: "2026-11-19T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Oklahoma City Thunder",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Atlanta Hawks",
        },
      },
    ],
  },
  _401910015: {
    id: "00000000-0000-4000-8000-000401910015",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910015",
    startsAt: "2026-11-19T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Denver Nuggets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Boston Celtics",
        },
      },
    ],
  },
  _401910016: {
    id: "00000000-0000-4000-8000-000401910016",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910016",
    startsAt: "2026-11-19T02:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Dallas Mavericks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Golden State Warriors",
        },
      },
    ],
  },
  _401910017: {
    id: "00000000-0000-4000-8000-000401910017",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910017",
    startsAt: "2026-11-19T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Los Angeles Lakers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Utah Jazz",
        },
      },
    ],
  },
  _401910018: {
    id: "00000000-0000-4000-8000-000401910018",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910018",
    startsAt: "2026-11-19T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Sacramento Kings",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Phoenix Suns",
        },
      },
    ],
  },
  _401910019: {
    id: "00000000-0000-4000-8000-000401910019",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910019",
    startsAt: "2026-11-20T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Memphis Grizzlies",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Golden State Warriors",
        },
      },
    ],
  },
  _401910020: {
    id: "00000000-0000-4000-8000-000401910020",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910020",
    startsAt: "2026-11-20T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Milwaukee Bucks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Portland Trail Blazers",
        },
      },
    ],
  },
  _401910021: {
    id: "00000000-0000-4000-8000-000401910021",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910021",
    startsAt: "2026-11-20T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Minnesota Timberwolves",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "New York Knicks",
        },
      },
    ],
  },
  _401910022: {
    id: "00000000-0000-4000-8000-000401910022",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910022",
    startsAt: "2026-11-20T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "San Antonio Spurs",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "LA Clippers",
        },
      },
    ],
  },
  _401909305: {
    id: "00000000-0000-4000-8000-000401909305",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909305",
    startsAt: "2026-11-21T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Atlanta Hawks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Charlotte Hornets",
        },
      },
    ],
  },
  _401909306: {
    id: "00000000-0000-4000-8000-000401909306",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909306",
    startsAt: "2026-11-21T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Brooklyn Nets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Orlando Magic",
        },
      },
    ],
  },
  _401909307: {
    id: "00000000-0000-4000-8000-000401909307",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909307",
    startsAt: "2026-11-21T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Cleveland Cavaliers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Indiana Pacers",
        },
      },
    ],
  },
  _401909308: {
    id: "00000000-0000-4000-8000-000401909308",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909308",
    startsAt: "2026-11-21T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Detroit Pistons",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Toronto Raptors",
        },
      },
    ],
  },
  _401909309: {
    id: "00000000-0000-4000-8000-000401909309",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909309",
    startsAt: "2026-11-21T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Chicago Bulls",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Washington Wizards",
        },
      },
    ],
  },
  _401909310: {
    id: "00000000-0000-4000-8000-000401909310",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909310",
    startsAt: "2026-11-21T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Oklahoma City Thunder",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "New Orleans Pelicans",
        },
      },
    ],
  },
  _401909311: {
    id: "00000000-0000-4000-8000-000401909311",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909311",
    startsAt: "2026-11-21T02:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Utah Jazz",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Phoenix Suns",
        },
      },
    ],
  },
  _401909312: {
    id: "00000000-0000-4000-8000-000401909312",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909312",
    startsAt: "2026-11-21T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Denver Nuggets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Houston Rockets",
        },
      },
    ],
  },
  _401909313: {
    id: "00000000-0000-4000-8000-000401909313",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909313",
    startsAt: "2026-11-21T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Los Angeles Lakers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Sacramento Kings",
        },
      },
    ],
  },
  _401910023: {
    id: "00000000-0000-4000-8000-000401910023",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910023",
    startsAt: "2026-11-21T18:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Philadelphia 76ers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Milwaukee Bucks",
        },
      },
    ],
  },
  _401910024: {
    id: "00000000-0000-4000-8000-000401910024",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910024",
    startsAt: "2026-11-22T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "New York Knicks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Portland Trail Blazers",
        },
      },
    ],
  },
  _401910025: {
    id: "00000000-0000-4000-8000-000401910025",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910025",
    startsAt: "2026-11-22T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Dallas Mavericks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "LA Clippers",
        },
      },
    ],
  },
  _401910026: {
    id: "00000000-0000-4000-8000-000401910026",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910026",
    startsAt: "2026-11-22T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Minnesota Timberwolves",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Memphis Grizzlies",
        },
      },
    ],
  },
  _401910027: {
    id: "00000000-0000-4000-8000-000401910027",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910027",
    startsAt: "2026-11-22T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "San Antonio Spurs",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "New Orleans Pelicans",
        },
      },
    ],
  },
  _401910028: {
    id: "00000000-0000-4000-8000-000401910028",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910028",
    startsAt: "2026-11-22T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Sacramento Kings",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Boston Celtics",
        },
      },
    ],
  },
  _401910029: {
    id: "00000000-0000-4000-8000-000401910029",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910029",
    startsAt: "2026-11-22T20:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Atlanta Hawks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Detroit Pistons",
        },
      },
    ],
  },
  _401910030: {
    id: "00000000-0000-4000-8000-000401910030",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910030",
    startsAt: "2026-11-22T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Miami Heat",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Oklahoma City Thunder",
        },
      },
    ],
  },
  _401910031: {
    id: "00000000-0000-4000-8000-000401910031",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910031",
    startsAt: "2026-11-23T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Washington Wizards",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Orlando Magic",
        },
      },
    ],
  },
  _401910032: {
    id: "00000000-0000-4000-8000-000401910032",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910032",
    startsAt: "2026-11-23T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Chicago Bulls",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Denver Nuggets",
        },
      },
    ],
  },
  _401910033: {
    id: "00000000-0000-4000-8000-000401910033",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910033",
    startsAt: "2026-11-23T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Utah Jazz",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Dallas Mavericks",
        },
      },
    ],
  },
  _401910034: {
    id: "00000000-0000-4000-8000-000401910034",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910034",
    startsAt: "2026-11-23T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "New York Knicks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Indiana Pacers",
        },
      },
    ],
  },
  _401910035: {
    id: "00000000-0000-4000-8000-000401910035",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910035",
    startsAt: "2026-11-23T01:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Golden State Warriors",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Boston Celtics",
        },
      },
    ],
  },
  _401910036: {
    id: "00000000-0000-4000-8000-000401910036",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910036",
    startsAt: "2026-11-24T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Charlotte Hornets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Memphis Grizzlies",
        },
      },
    ],
  },
  _401910037: {
    id: "00000000-0000-4000-8000-000401910037",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910037",
    startsAt: "2026-11-24T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Philadelphia 76ers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Portland Trail Blazers",
        },
      },
    ],
  },
  _401910038: {
    id: "00000000-0000-4000-8000-000401910038",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910038",
    startsAt: "2026-11-24T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Indiana Pacers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Oklahoma City Thunder",
        },
      },
    ],
  },
  _401910039: {
    id: "00000000-0000-4000-8000-000401910039",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910039",
    startsAt: "2026-11-24T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Toronto Raptors",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Milwaukee Bucks",
        },
      },
    ],
  },
  _401910040: {
    id: "00000000-0000-4000-8000-000401910040",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910040",
    startsAt: "2026-11-24T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Minnesota Timberwolves",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Brooklyn Nets",
        },
      },
    ],
  },
  _401910041: {
    id: "00000000-0000-4000-8000-000401910041",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910041",
    startsAt: "2026-11-24T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Chicago Bulls",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Cleveland Cavaliers",
        },
      },
    ],
  },
  _401910042: {
    id: "00000000-0000-4000-8000-000401910042",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910042",
    startsAt: "2026-11-24T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "New Orleans Pelicans",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Phoenix Suns",
        },
      },
    ],
  },
  _401910043: {
    id: "00000000-0000-4000-8000-000401910043",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910043",
    startsAt: "2026-11-24T01:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Houston Rockets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "LA Clippers",
        },
      },
    ],
  },
  _401910044: {
    id: "00000000-0000-4000-8000-000401910044",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910044",
    startsAt: "2026-11-24T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Los Angeles Lakers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Utah Jazz",
        },
      },
    ],
  },
  _401910045: {
    id: "00000000-0000-4000-8000-000401910045",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910045",
    startsAt: "2026-11-24T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Sacramento Kings",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "San Antonio Spurs",
        },
      },
    ],
  },
  _401909314: {
    id: "00000000-0000-4000-8000-000401909314",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909314",
    startsAt: "2026-11-25T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Orlando Magic",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Detroit Pistons",
        },
      },
    ],
  },
  _401909315: {
    id: "00000000-0000-4000-8000-000401909315",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909315",
    startsAt: "2026-11-25T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Washington Wizards",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Boston Celtics",
        },
      },
    ],
  },
  _401909316: {
    id: "00000000-0000-4000-8000-000401909316",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909316",
    startsAt: "2026-11-25T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Denver Nuggets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Dallas Mavericks",
        },
      },
    ],
  },
  _401909317: {
    id: "00000000-0000-4000-8000-000401909317",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909317",
    startsAt: "2026-11-25T22:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Philadelphia 76ers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Miami Heat",
        },
      },
    ],
  },
  _401909318: {
    id: "00000000-0000-4000-8000-000401909318",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909318",
    startsAt: "2026-11-26T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Charlotte Hornets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Chicago Bulls",
        },
      },
    ],
  },
  _401909319: {
    id: "00000000-0000-4000-8000-000401909319",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909319",
    startsAt: "2026-11-26T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "New York Knicks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Cleveland Cavaliers",
        },
      },
    ],
  },
  _401909320: {
    id: "00000000-0000-4000-8000-000401909320",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909320",
    startsAt: "2026-11-26T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Oklahoma City Thunder",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Minnesota Timberwolves",
        },
      },
    ],
  },
  _401909321: {
    id: "00000000-0000-4000-8000-000401909321",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909321",
    startsAt: "2026-11-26T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Memphis Grizzlies",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "LA Clippers",
        },
      },
    ],
  },
  _401909322: {
    id: "00000000-0000-4000-8000-000401909322",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909322",
    startsAt: "2026-11-26T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Milwaukee Bucks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Brooklyn Nets",
        },
      },
    ],
  },
  _401909323: {
    id: "00000000-0000-4000-8000-000401909323",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909323",
    startsAt: "2026-11-26T01:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Houston Rockets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Phoenix Suns",
        },
      },
    ],
  },
  _401909324: {
    id: "00000000-0000-4000-8000-000401909324",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909324",
    startsAt: "2026-11-26T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Golden State Warriors",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Sacramento Kings",
        },
      },
    ],
  },
  _401909325: {
    id: "00000000-0000-4000-8000-000401909325",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909325",
    startsAt: "2026-11-26T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Portland Trail Blazers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "San Antonio Spurs",
        },
      },
    ],
  },
  _401909326: {
    id: "00000000-0000-4000-8000-000401909326",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909326",
    startsAt: "2026-11-28T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "New York Knicks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Miami Heat",
        },
      },
    ],
  },
  _401909327: {
    id: "00000000-0000-4000-8000-000401909327",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909327",
    startsAt: "2026-11-28T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Detroit Pistons",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Milwaukee Bucks",
        },
      },
    ],
  },
  _401909328: {
    id: "00000000-0000-4000-8000-000401909328",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909328",
    startsAt: "2026-11-28T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Indiana Pacers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Philadelphia 76ers",
        },
      },
    ],
  },
  _401909329: {
    id: "00000000-0000-4000-8000-000401909329",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909329",
    startsAt: "2026-11-28T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Toronto Raptors",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Brooklyn Nets",
        },
      },
    ],
  },
  _401909330: {
    id: "00000000-0000-4000-8000-000401909330",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909330",
    startsAt: "2026-11-28T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Boston Celtics",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Atlanta Hawks",
        },
      },
    ],
  },
  _401909331: {
    id: "00000000-0000-4000-8000-000401909331",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909331",
    startsAt: "2026-11-28T01:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Minnesota Timberwolves",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Memphis Grizzlies",
        },
      },
    ],
  },
  _401909332: {
    id: "00000000-0000-4000-8000-000401909332",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909332",
    startsAt: "2026-11-28T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Phoenix Suns",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Dallas Mavericks",
        },
      },
    ],
  },
  _401909333: {
    id: "00000000-0000-4000-8000-000401909333",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909333",
    startsAt: "2026-11-28T02:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "San Antonio Spurs",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Los Angeles Lakers",
        },
      },
    ],
  },
  _401909334: {
    id: "00000000-0000-4000-8000-000401909334",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909334",
    startsAt: "2026-11-28T02:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Utah Jazz",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Denver Nuggets",
        },
      },
    ],
  },
  _401909335: {
    id: "00000000-0000-4000-8000-000401909335",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909335",
    startsAt: "2026-11-28T02:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "LA Clippers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "New Orleans Pelicans",
        },
      },
    ],
  },
  _401909336: {
    id: "00000000-0000-4000-8000-000401909336",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909336",
    startsAt: "2026-11-28T02:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Portland Trail Blazers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Golden State Warriors",
        },
      },
    ],
  },
  _401910046: {
    id: "00000000-0000-4000-8000-000401910046",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910046",
    startsAt: "2026-11-28T22:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Washington Wizards",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Orlando Magic",
        },
      },
    ],
  },
  _401910047: {
    id: "00000000-0000-4000-8000-000401910047",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910047",
    startsAt: "2026-11-28T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Charlotte Hornets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Brooklyn Nets",
        },
      },
    ],
  },
  _401910048: {
    id: "00000000-0000-4000-8000-000401910048",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910048",
    startsAt: "2026-11-29T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Chicago Bulls",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Indiana Pacers",
        },
      },
    ],
  },
  _401910049: {
    id: "00000000-0000-4000-8000-000401910049",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910049",
    startsAt: "2026-11-29T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Milwaukee Bucks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Oklahoma City Thunder",
        },
      },
    ],
  },
  _401910050: {
    id: "00000000-0000-4000-8000-000401910050",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910050",
    startsAt: "2026-11-29T01:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Houston Rockets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Philadelphia 76ers",
        },
      },
    ],
  },
  _401910051: {
    id: "00000000-0000-4000-8000-000401910051",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910051",
    startsAt: "2026-11-29T21:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Memphis Grizzlies",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Los Angeles Lakers",
        },
      },
    ],
  },
  _401910052: {
    id: "00000000-0000-4000-8000-000401910052",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910052",
    startsAt: "2026-11-29T21:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "San Antonio Spurs",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Boston Celtics",
        },
      },
    ],
  },
  _401910053: {
    id: "00000000-0000-4000-8000-000401910053",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910053",
    startsAt: "2026-11-29T22:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Utah Jazz",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Phoenix Suns",
        },
      },
    ],
  },
  _401910054: {
    id: "00000000-0000-4000-8000-000401910054",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910054",
    startsAt: "2026-11-29T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Cleveland Cavaliers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Miami Heat",
        },
      },
    ],
  },
  _401910055: {
    id: "00000000-0000-4000-8000-000401910055",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910055",
    startsAt: "2026-11-29T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Detroit Pistons",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Orlando Magic",
        },
      },
    ],
  },
  _401910056: {
    id: "00000000-0000-4000-8000-000401910056",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910056",
    startsAt: "2026-11-29T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "New York Knicks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Atlanta Hawks",
        },
      },
    ],
  },
  _401910057: {
    id: "00000000-0000-4000-8000-000401910057",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910057",
    startsAt: "2026-11-29T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Toronto Raptors",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Denver Nuggets",
        },
      },
    ],
  },
  _401910058: {
    id: "00000000-0000-4000-8000-000401910058",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910058",
    startsAt: "2026-11-29T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Portland Trail Blazers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "New Orleans Pelicans",
        },
      },
    ],
  },
  _401910059: {
    id: "00000000-0000-4000-8000-000401910059",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910059",
    startsAt: "2026-11-30T01:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Golden State Warriors",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "LA Clippers",
        },
      },
    ],
  },
  _401910060: {
    id: "00000000-0000-4000-8000-000401910060",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910060",
    startsAt: "2026-11-30T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Sacramento Kings",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Minnesota Timberwolves",
        },
      },
    ],
  },
  _401910061: {
    id: "00000000-0000-4000-8000-000401910061",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910061",
    startsAt: "2026-12-01T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Charlotte Hornets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Washington Wizards",
        },
      },
    ],
  },
  _401910062: {
    id: "00000000-0000-4000-8000-000401910062",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910062",
    startsAt: "2026-12-01T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Detroit Pistons",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Denver Nuggets",
        },
      },
    ],
  },
  _401910063: {
    id: "00000000-0000-4000-8000-000401910063",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910063",
    startsAt: "2026-12-01T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Brooklyn Nets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Oklahoma City Thunder",
        },
      },
    ],
  },
  _401910064: {
    id: "00000000-0000-4000-8000-000401910064",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910064",
    startsAt: "2026-12-01T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Houston Rockets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Los Angeles Lakers",
        },
      },
    ],
  },
  _401910065: {
    id: "00000000-0000-4000-8000-000401910065",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910065",
    startsAt: "2026-12-01T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Dallas Mavericks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Boston Celtics",
        },
      },
    ],
  },
  _401910066: {
    id: "00000000-0000-4000-8000-000401910066",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910066",
    startsAt: "2026-12-01T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Milwaukee Bucks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "San Antonio Spurs",
        },
      },
    ],
  },
  _401910067: {
    id: "00000000-0000-4000-8000-000401910067",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910067",
    startsAt: "2026-12-01T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Sacramento Kings",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "New Orleans Pelicans",
        },
      },
    ],
  },
  _401910068: {
    id: "00000000-0000-4000-8000-000401910068",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910068",
    startsAt: "2026-12-02T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Cleveland Cavaliers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Indiana Pacers",
        },
      },
    ],
  },
  _401910069: {
    id: "00000000-0000-4000-8000-000401910069",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910069",
    startsAt: "2026-12-02T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Philadelphia 76ers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Memphis Grizzlies",
        },
      },
    ],
  },
  _401910070: {
    id: "00000000-0000-4000-8000-000401910070",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910070",
    startsAt: "2026-12-02T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Miami Heat",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Atlanta Hawks",
        },
      },
    ],
  },
  _401910071: {
    id: "00000000-0000-4000-8000-000401910071",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910071",
    startsAt: "2026-12-02T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Chicago Bulls",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "New York Knicks",
        },
      },
    ],
  },
  _401910072: {
    id: "00000000-0000-4000-8000-000401910072",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910072",
    startsAt: "2026-12-02T01:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Houston Rockets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Toronto Raptors",
        },
      },
    ],
  },
  _401910073: {
    id: "00000000-0000-4000-8000-000401910073",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910073",
    startsAt: "2026-12-02T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Phoenix Suns",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "LA Clippers",
        },
      },
    ],
  },
  _401910074: {
    id: "00000000-0000-4000-8000-000401910074",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910074",
    startsAt: "2026-12-02T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Portland Trail Blazers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Minnesota Timberwolves",
        },
      },
    ],
  },
  _401910075: {
    id: "00000000-0000-4000-8000-000401910075",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910075",
    startsAt: "2026-12-02T04:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Golden State Warriors",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Utah Jazz",
        },
      },
    ],
  },
  _401910076: {
    id: "00000000-0000-4000-8000-000401910076",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910076",
    startsAt: "2026-12-03T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Detroit Pistons",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Memphis Grizzlies",
        },
      },
    ],
  },
  _401910077: {
    id: "00000000-0000-4000-8000-000401910077",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910077",
    startsAt: "2026-12-03T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Philadelphia 76ers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Denver Nuggets",
        },
      },
    ],
  },
  _401910078: {
    id: "00000000-0000-4000-8000-000401910078",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910078",
    startsAt: "2026-12-03T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Boston Celtics",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Charlotte Hornets",
        },
      },
    ],
  },
  _401910079: {
    id: "00000000-0000-4000-8000-000401910079",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910079",
    startsAt: "2026-12-03T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Dallas Mavericks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Orlando Magic",
        },
      },
    ],
  },
  _401910080: {
    id: "00000000-0000-4000-8000-000401910080",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910080",
    startsAt: "2026-12-03T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Milwaukee Bucks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "New York Knicks",
        },
      },
    ],
  },
  _401910081: {
    id: "00000000-0000-4000-8000-000401910081",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910081",
    startsAt: "2026-12-03T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "New Orleans Pelicans",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Los Angeles Lakers",
        },
      },
    ],
  },
  _401910082: {
    id: "00000000-0000-4000-8000-000401910082",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910082",
    startsAt: "2026-12-03T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Oklahoma City Thunder",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Brooklyn Nets",
        },
      },
    ],
  },
  _401910083: {
    id: "00000000-0000-4000-8000-000401910083",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910083",
    startsAt: "2026-12-03T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Phoenix Suns",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Sacramento Kings",
        },
      },
    ],
  },
  _401910084: {
    id: "00000000-0000-4000-8000-000401910084",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910084",
    startsAt: "2026-12-03T03:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "LA Clippers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Minnesota Timberwolves",
        },
      },
    ],
  },
  _401910085: {
    id: "00000000-0000-4000-8000-000401910085",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910085",
    startsAt: "2026-12-04T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Atlanta Hawks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Indiana Pacers",
        },
      },
    ],
  },
  _401910086: {
    id: "00000000-0000-4000-8000-000401910086",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910086",
    startsAt: "2026-12-04T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Miami Heat",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Washington Wizards",
        },
      },
    ],
  },
  _401910087: {
    id: "00000000-0000-4000-8000-000401910087",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910087",
    startsAt: "2026-12-04T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Chicago Bulls",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Cleveland Cavaliers",
        },
      },
    ],
  },
  _401910088: {
    id: "00000000-0000-4000-8000-000401910088",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910088",
    startsAt: "2026-12-04T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "San Antonio Spurs",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Toronto Raptors",
        },
      },
    ],
  },
  _401910089: {
    id: "00000000-0000-4000-8000-000401910089",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910089",
    startsAt: "2026-12-04T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Portland Trail Blazers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Utah Jazz",
        },
      },
    ],
  },
  _401910090: {
    id: "00000000-0000-4000-8000-000401910090",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910090",
    startsAt: "2026-12-12T22:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Memphis Grizzlies",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Milwaukee Bucks",
        },
      },
    ],
  },
  _401910091: {
    id: "00000000-0000-4000-8000-000401910091",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910091",
    startsAt: "2026-12-13T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Washington Wizards",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Charlotte Hornets",
        },
      },
    ],
  },
  _401910092: {
    id: "00000000-0000-4000-8000-000401910092",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910092",
    startsAt: "2026-12-13T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Philadelphia 76ers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Orlando Magic",
        },
      },
    ],
  },
  _401910093: {
    id: "00000000-0000-4000-8000-000401910093",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910093",
    startsAt: "2026-12-13T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Cleveland Cavaliers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Golden State Warriors",
        },
      },
    ],
  },
  _401910094: {
    id: "00000000-0000-4000-8000-000401910094",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910094",
    startsAt: "2026-12-13T01:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Miami Heat",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "New York Knicks",
        },
      },
    ],
  },
  _401910095: {
    id: "00000000-0000-4000-8000-000401910095",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910095",
    startsAt: "2026-12-13T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Phoenix Suns",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Minnesota Timberwolves",
        },
      },
    ],
  },
  _401910096: {
    id: "00000000-0000-4000-8000-000401910096",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910096",
    startsAt: "2026-12-13T02:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Utah Jazz",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Denver Nuggets",
        },
      },
    ],
  },
  _401910097: {
    id: "00000000-0000-4000-8000-000401910097",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910097",
    startsAt: "2026-12-13T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Portland Trail Blazers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Atlanta Hawks",
        },
      },
    ],
  },
  _401910098: {
    id: "00000000-0000-4000-8000-000401910098",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910098",
    startsAt: "2026-12-13T20:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Brooklyn Nets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Boston Celtics",
        },
      },
    ],
  },
  _401910099: {
    id: "00000000-0000-4000-8000-000401910099",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910099",
    startsAt: "2026-12-13T20:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Oklahoma City Thunder",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Toronto Raptors",
        },
      },
    ],
  },
  _401910100: {
    id: "00000000-0000-4000-8000-000401910100",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910100",
    startsAt: "2026-12-13T22:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Indiana Pacers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Detroit Pistons",
        },
      },
    ],
  },
  _401910101: {
    id: "00000000-0000-4000-8000-000401910101",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910101",
    startsAt: "2026-12-13T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Chicago Bulls",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Houston Rockets",
        },
      },
    ],
  },
  _401910102: {
    id: "00000000-0000-4000-8000-000401910102",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910102",
    startsAt: "2026-12-14T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "San Antonio Spurs",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "LA Clippers",
        },
      },
    ],
  },
  _401910103: {
    id: "00000000-0000-4000-8000-000401910103",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910103",
    startsAt: "2026-12-14T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Sacramento Kings",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "New Orleans Pelicans",
        },
      },
    ],
  },
  _401910104: {
    id: "00000000-0000-4000-8000-000401910104",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910104",
    startsAt: "2026-12-15T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Charlotte Hornets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Toronto Raptors",
        },
      },
    ],
  },
  _401910105: {
    id: "00000000-0000-4000-8000-000401910105",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910105",
    startsAt: "2026-12-15T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Detroit Pistons",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Brooklyn Nets",
        },
      },
    ],
  },
  _401910106: {
    id: "00000000-0000-4000-8000-000401910106",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910106",
    startsAt: "2026-12-15T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Orlando Magic",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Philadelphia 76ers",
        },
      },
    ],
  },
  _401910107: {
    id: "00000000-0000-4000-8000-000401910107",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910107",
    startsAt: "2026-12-15T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Boston Celtics",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Washington Wizards",
        },
      },
    ],
  },
  _401910108: {
    id: "00000000-0000-4000-8000-000401910108",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910108",
    startsAt: "2026-12-15T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Chicago Bulls",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Miami Heat",
        },
      },
    ],
  },
  _401910109: {
    id: "00000000-0000-4000-8000-000401910109",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910109",
    startsAt: "2026-12-15T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Dallas Mavericks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Milwaukee Bucks",
        },
      },
    ],
  },
  _401910110: {
    id: "00000000-0000-4000-8000-000401910110",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910110",
    startsAt: "2026-12-15T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Memphis Grizzlies",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Golden State Warriors",
        },
      },
    ],
  },
  _401910111: {
    id: "00000000-0000-4000-8000-000401910111",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910111",
    startsAt: "2026-12-15T01:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Houston Rockets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "New York Knicks",
        },
      },
    ],
  },
  _401910112: {
    id: "00000000-0000-4000-8000-000401910112",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910112",
    startsAt: "2026-12-15T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Phoenix Suns",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Atlanta Hawks",
        },
      },
    ],
  },
  _401910113: {
    id: "00000000-0000-4000-8000-000401910113",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910113",
    startsAt: "2026-12-15T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Utah Jazz",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Minnesota Timberwolves",
        },
      },
    ],
  },
  _401910114: {
    id: "00000000-0000-4000-8000-000401910114",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910114",
    startsAt: "2026-12-15T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Los Angeles Lakers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "New Orleans Pelicans",
        },
      },
    ],
  },
  _401910115: {
    id: "00000000-0000-4000-8000-000401910115",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910115",
    startsAt: "2026-12-16T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Cleveland Cavaliers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "San Antonio Spurs",
        },
      },
    ],
  },
  _401910116: {
    id: "00000000-0000-4000-8000-000401910116",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910116",
    startsAt: "2026-12-16T04:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Portland Trail Blazers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Denver Nuggets",
        },
      },
    ],
  },
  _401910117: {
    id: "00000000-0000-4000-8000-000401910117",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910117",
    startsAt: "2026-12-17T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Boston Celtics",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Washington Wizards",
        },
      },
    ],
  },
  _401910118: {
    id: "00000000-0000-4000-8000-000401910118",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910118",
    startsAt: "2026-12-17T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Charlotte Hornets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "LA Clippers",
        },
      },
    ],
  },
  _401910119: {
    id: "00000000-0000-4000-8000-000401910119",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910119",
    startsAt: "2026-12-17T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Detroit Pistons",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Phoenix Suns",
        },
      },
    ],
  },
  _401910120: {
    id: "00000000-0000-4000-8000-000401910120",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910120",
    startsAt: "2026-12-17T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Indiana Pacers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Golden State Warriors",
        },
      },
    ],
  },
  _401910121: {
    id: "00000000-0000-4000-8000-000401910121",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910121",
    startsAt: "2026-12-17T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Orlando Magic",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Cleveland Cavaliers",
        },
      },
    ],
  },
  _401910122: {
    id: "00000000-0000-4000-8000-000401910122",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910122",
    startsAt: "2026-12-17T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Brooklyn Nets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Dallas Mavericks",
        },
      },
    ],
  },
  _401910123: {
    id: "00000000-0000-4000-8000-000401910123",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910123",
    startsAt: "2026-12-17T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Toronto Raptors",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "San Antonio Spurs",
        },
      },
    ],
  },
  _401910124: {
    id: "00000000-0000-4000-8000-000401910124",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910124",
    startsAt: "2026-12-17T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Chicago Bulls",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Utah Jazz",
        },
      },
    ],
  },
  _401910125: {
    id: "00000000-0000-4000-8000-000401910125",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910125",
    startsAt: "2026-12-17T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Memphis Grizzlies",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Miami Heat",
        },
      },
    ],
  },
  _401910126: {
    id: "00000000-0000-4000-8000-000401910126",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910126",
    startsAt: "2026-12-17T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "New Orleans Pelicans",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "New York Knicks",
        },
      },
    ],
  },
  _401910127: {
    id: "00000000-0000-4000-8000-000401910127",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910127",
    startsAt: "2026-12-17T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Oklahoma City Thunder",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Sacramento Kings",
        },
      },
    ],
  },
  _401910128: {
    id: "00000000-0000-4000-8000-000401910128",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910128",
    startsAt: "2026-12-17T01:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Houston Rockets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Milwaukee Bucks",
        },
      },
    ],
  },
  _401910129: {
    id: "00000000-0000-4000-8000-000401910129",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910129",
    startsAt: "2026-12-17T02:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Minnesota Timberwolves",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Los Angeles Lakers",
        },
      },
    ],
  },
  _401910130: {
    id: "00000000-0000-4000-8000-000401910130",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910130",
    startsAt: "2026-12-18T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Indiana Pacers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Portland Trail Blazers",
        },
      },
    ],
  },
  _401910131: {
    id: "00000000-0000-4000-8000-000401910131",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910131",
    startsAt: "2026-12-18T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Philadelphia 76ers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Dallas Mavericks",
        },
      },
    ],
  },
  _401910132: {
    id: "00000000-0000-4000-8000-000401910132",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910132",
    startsAt: "2026-12-18T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Denver Nuggets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Atlanta Hawks",
        },
      },
    ],
  },
  _401910133: {
    id: "00000000-0000-4000-8000-000401910133",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910133",
    startsAt: "2026-12-19T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Charlotte Hornets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Oklahoma City Thunder",
        },
      },
    ],
  },
  _401910134: {
    id: "00000000-0000-4000-8000-000401910134",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910134",
    startsAt: "2026-12-19T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Miami Heat",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "LA Clippers",
        },
      },
    ],
  },
  _401910135: {
    id: "00000000-0000-4000-8000-000401910135",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910135",
    startsAt: "2026-12-19T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Washington Wizards",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "New York Knicks",
        },
      },
    ],
  },
  _401910136: {
    id: "00000000-0000-4000-8000-000401910136",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910136",
    startsAt: "2026-12-19T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Boston Celtics",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Utah Jazz",
        },
      },
    ],
  },
  _401910137: {
    id: "00000000-0000-4000-8000-000401910137",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910137",
    startsAt: "2026-12-19T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Brooklyn Nets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Orlando Magic",
        },
      },
    ],
  },
  _401910138: {
    id: "00000000-0000-4000-8000-000401910138",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910138",
    startsAt: "2026-12-19T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Detroit Pistons",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Cleveland Cavaliers",
        },
      },
    ],
  },
  _401910139: {
    id: "00000000-0000-4000-8000-000401910139",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910139",
    startsAt: "2026-12-19T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Toronto Raptors",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Golden State Warriors",
        },
      },
    ],
  },
  _401910140: {
    id: "00000000-0000-4000-8000-000401910140",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910140",
    startsAt: "2026-12-19T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Memphis Grizzlies",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Houston Rockets",
        },
      },
    ],
  },
  _401910141: {
    id: "00000000-0000-4000-8000-000401910141",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910141",
    startsAt: "2026-12-19T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Milwaukee Bucks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Phoenix Suns",
        },
      },
    ],
  },
  _401910142: {
    id: "00000000-0000-4000-8000-000401910142",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910142",
    startsAt: "2026-12-19T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Minnesota Timberwolves",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Los Angeles Lakers",
        },
      },
    ],
  },
  _401910143: {
    id: "00000000-0000-4000-8000-000401910143",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910143",
    startsAt: "2026-12-19T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "New Orleans Pelicans",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Sacramento Kings",
        },
      },
    ],
  },
  _401910144: {
    id: "00000000-0000-4000-8000-000401910144",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910144",
    startsAt: "2026-12-19T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "San Antonio Spurs",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Chicago Bulls",
        },
      },
    ],
  },
  _401910145: {
    id: "00000000-0000-4000-8000-000401910145",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910145",
    startsAt: "2026-12-19T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Charlotte Hornets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Portland Trail Blazers",
        },
      },
    ],
  },
  _401910146: {
    id: "00000000-0000-4000-8000-000401910146",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910146",
    startsAt: "2026-12-20T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Atlanta Hawks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Orlando Magic",
        },
      },
    ],
  },
  _401910147: {
    id: "00000000-0000-4000-8000-000401910147",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910147",
    startsAt: "2026-12-20T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Dallas Mavericks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Chicago Bulls",
        },
      },
    ],
  },
  _401910148: {
    id: "00000000-0000-4000-8000-000401910148",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910148",
    startsAt: "2026-12-20T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Denver Nuggets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Los Angeles Lakers",
        },
      },
    ],
  },
  _401910149: {
    id: "00000000-0000-4000-8000-000401910149",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910149",
    startsAt: "2026-12-20T20:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Brooklyn Nets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Washington Wizards",
        },
      },
    ],
  },
  _401910150: {
    id: "00000000-0000-4000-8000-000401910150",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910150",
    startsAt: "2026-12-20T20:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Toronto Raptors",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Houston Rockets",
        },
      },
    ],
  },
  _401910151: {
    id: "00000000-0000-4000-8000-000401910151",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910151",
    startsAt: "2026-12-20T21:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Memphis Grizzlies",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Phoenix Suns",
        },
      },
    ],
  },
  _401910152: {
    id: "00000000-0000-4000-8000-000401910152",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910152",
    startsAt: "2026-12-20T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Cleveland Cavaliers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Utah Jazz",
        },
      },
    ],
  },
  _401910153: {
    id: "00000000-0000-4000-8000-000401910153",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910153",
    startsAt: "2026-12-20T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Miami Heat",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Sacramento Kings",
        },
      },
    ],
  },
  _401910154: {
    id: "00000000-0000-4000-8000-000401910154",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910154",
    startsAt: "2026-12-21T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Atlanta Hawks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Oklahoma City Thunder",
        },
      },
    ],
  },
  _401910155: {
    id: "00000000-0000-4000-8000-000401910155",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910155",
    startsAt: "2026-12-21T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "New Orleans Pelicans",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "San Antonio Spurs",
        },
      },
    ],
  },
  _401910156: {
    id: "00000000-0000-4000-8000-000401910156",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910156",
    startsAt: "2026-12-21T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Boston Celtics",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Detroit Pistons",
        },
      },
    ],
  },
  _401910157: {
    id: "00000000-0000-4000-8000-000401910157",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910157",
    startsAt: "2026-12-21T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Milwaukee Bucks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Golden State Warriors",
        },
      },
    ],
  },
  _401910158: {
    id: "00000000-0000-4000-8000-000401910158",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910158",
    startsAt: "2026-12-21T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "LA Clippers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Indiana Pacers",
        },
      },
    ],
  },
  _401910159: {
    id: "00000000-0000-4000-8000-000401910159",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910159",
    startsAt: "2026-12-22T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Charlotte Hornets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Philadelphia 76ers",
        },
      },
    ],
  },
  _401910160: {
    id: "00000000-0000-4000-8000-000401910160",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910160",
    startsAt: "2026-12-22T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Cleveland Cavaliers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "New York Knicks",
        },
      },
    ],
  },
  _401910161: {
    id: "00000000-0000-4000-8000-000401910161",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910161",
    startsAt: "2026-12-22T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Orlando Magic",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Sacramento Kings",
        },
      },
    ],
  },
  _401910162: {
    id: "00000000-0000-4000-8000-000401910162",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910162",
    startsAt: "2026-12-22T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Brooklyn Nets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Portland Trail Blazers",
        },
      },
    ],
  },
  _401910163: {
    id: "00000000-0000-4000-8000-000401910163",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910163",
    startsAt: "2026-12-22T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Miami Heat",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Chicago Bulls",
        },
      },
    ],
  },
  _401910164: {
    id: "00000000-0000-4000-8000-000401910164",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910164",
    startsAt: "2026-12-22T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Minnesota Timberwolves",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Phoenix Suns",
        },
      },
    ],
  },
  _401910165: {
    id: "00000000-0000-4000-8000-000401910165",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910165",
    startsAt: "2026-12-22T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "New Orleans Pelicans",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Memphis Grizzlies",
        },
      },
    ],
  },
  _401910166: {
    id: "00000000-0000-4000-8000-000401910166",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910166",
    startsAt: "2026-12-22T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "San Antonio Spurs",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Milwaukee Bucks",
        },
      },
    ],
  },
  _401910167: {
    id: "00000000-0000-4000-8000-000401910167",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910167",
    startsAt: "2026-12-22T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Los Angeles Lakers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Indiana Pacers",
        },
      },
    ],
  },
  _401910168: {
    id: "00000000-0000-4000-8000-000401910168",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910168",
    startsAt: "2026-12-22T03:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "LA Clippers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Denver Nuggets",
        },
      },
    ],
  },
  _401910169: {
    id: "00000000-0000-4000-8000-000401910169",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910169",
    startsAt: "2026-12-23T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Washington Wizards",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Toronto Raptors",
        },
      },
    ],
  },
  _401910170: {
    id: "00000000-0000-4000-8000-000401910170",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910170",
    startsAt: "2026-12-23T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Oklahoma City Thunder",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Detroit Pistons",
        },
      },
    ],
  },
  _401910171: {
    id: "00000000-0000-4000-8000-000401910171",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910171",
    startsAt: "2026-12-23T03:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Golden State Warriors",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Dallas Mavericks",
        },
      },
    ],
  },
  _401910172: {
    id: "00000000-0000-4000-8000-000401910172",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910172",
    startsAt: "2026-12-24T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Atlanta Hawks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Detroit Pistons",
        },
      },
    ],
  },
  _401910173: {
    id: "00000000-0000-4000-8000-000401910173",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910173",
    startsAt: "2026-12-24T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Orlando Magic",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Charlotte Hornets",
        },
      },
    ],
  },
  _401910174: {
    id: "00000000-0000-4000-8000-000401910174",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910174",
    startsAt: "2026-12-24T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Washington Wizards",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Cleveland Cavaliers",
        },
      },
    ],
  },
  _401910175: {
    id: "00000000-0000-4000-8000-000401910175",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910175",
    startsAt: "2026-12-24T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Boston Celtics",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Portland Trail Blazers",
        },
      },
    ],
  },
  _401910176: {
    id: "00000000-0000-4000-8000-000401910176",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910176",
    startsAt: "2026-12-24T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Brooklyn Nets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "San Antonio Spurs",
        },
      },
    ],
  },
  _401910177: {
    id: "00000000-0000-4000-8000-000401910177",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910177",
    startsAt: "2026-12-24T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Miami Heat",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Chicago Bulls",
        },
      },
    ],
  },
  _401910178: {
    id: "00000000-0000-4000-8000-000401910178",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910178",
    startsAt: "2026-12-24T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "New York Knicks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Utah Jazz",
        },
      },
    ],
  },
  _401910179: {
    id: "00000000-0000-4000-8000-000401910179",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910179",
    startsAt: "2026-12-24T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Philadelphia 76ers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Houston Rockets",
        },
      },
    ],
  },
  _401910180: {
    id: "00000000-0000-4000-8000-000401910180",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910180",
    startsAt: "2026-12-24T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Memphis Grizzlies",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Toronto Raptors",
        },
      },
    ],
  },
  _401910181: {
    id: "00000000-0000-4000-8000-000401910181",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910181",
    startsAt: "2026-12-24T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Milwaukee Bucks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Minnesota Timberwolves",
        },
      },
    ],
  },
  _401910182: {
    id: "00000000-0000-4000-8000-000401910182",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910182",
    startsAt: "2026-12-24T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "New Orleans Pelicans",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Oklahoma City Thunder",
        },
      },
    ],
  },
  _401910183: {
    id: "00000000-0000-4000-8000-000401910183",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910183",
    startsAt: "2026-12-24T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Phoenix Suns",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Indiana Pacers",
        },
      },
    ],
  },
  _401910184: {
    id: "00000000-0000-4000-8000-000401910184",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910184",
    startsAt: "2026-12-24T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Los Angeles Lakers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Denver Nuggets",
        },
      },
    ],
  },
  _401910185: {
    id: "00000000-0000-4000-8000-000401910185",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910185",
    startsAt: "2026-12-24T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Sacramento Kings",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Dallas Mavericks",
        },
      },
    ],
  },
  _401910186: {
    id: "00000000-0000-4000-8000-000401910186",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910186",
    startsAt: "2026-12-24T03:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "LA Clippers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Golden State Warriors",
        },
      },
    ],
  },
  _401909097: {
    id: "00000000-0000-4000-8000-000401909097",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909097",
    startsAt: "2026-12-25T17:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "New York Knicks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "San Antonio Spurs",
        },
      },
    ],
  },
  _401909098: {
    id: "00000000-0000-4000-8000-000401909098",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909098",
    startsAt: "2026-12-25T19:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Boston Celtics",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Miami Heat",
        },
      },
    ],
  },
  _401909099: {
    id: "00000000-0000-4000-8000-000401909099",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909099",
    startsAt: "2026-12-25T22:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Los Angeles Lakers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Philadelphia 76ers",
        },
      },
    ],
  },
  _401909100: {
    id: "00000000-0000-4000-8000-000401909100",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909100",
    startsAt: "2026-12-26T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Minnesota Timberwolves",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Oklahoma City Thunder",
        },
      },
    ],
  },
  _401909101: {
    id: "00000000-0000-4000-8000-000401909101",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909101",
    startsAt: "2026-12-26T03:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Golden State Warriors",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Denver Nuggets",
        },
      },
    ],
  },
  _401910187: {
    id: "00000000-0000-4000-8000-000401910187",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910187",
    startsAt: "2026-12-26T18:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Washington Wizards",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Portland Trail Blazers",
        },
      },
    ],
  },
  _401910188: {
    id: "00000000-0000-4000-8000-000401910188",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910188",
    startsAt: "2026-12-26T20:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Atlanta Hawks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Charlotte Hornets",
        },
      },
    ],
  },
  _401910189: {
    id: "00000000-0000-4000-8000-000401910189",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910189",
    startsAt: "2026-12-26T22:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Utah Jazz",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Indiana Pacers",
        },
      },
    ],
  },
  _401910190: {
    id: "00000000-0000-4000-8000-000401910190",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910190",
    startsAt: "2026-12-26T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Brooklyn Nets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "New Orleans Pelicans",
        },
      },
    ],
  },
  _401910191: {
    id: "00000000-0000-4000-8000-000401910191",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910191",
    startsAt: "2026-12-27T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Orlando Magic",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Toronto Raptors",
        },
      },
    ],
  },
  _401910192: {
    id: "00000000-0000-4000-8000-000401910192",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910192",
    startsAt: "2026-12-27T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Chicago Bulls",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Detroit Pistons",
        },
      },
    ],
  },
  _401910193: {
    id: "00000000-0000-4000-8000-000401910193",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910193",
    startsAt: "2026-12-27T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Dallas Mavericks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Phoenix Suns",
        },
      },
    ],
  },
  _401910194: {
    id: "00000000-0000-4000-8000-000401910194",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910194",
    startsAt: "2026-12-27T03:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "LA Clippers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Memphis Grizzlies",
        },
      },
    ],
  },
  _401910195: {
    id: "00000000-0000-4000-8000-000401910195",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910195",
    startsAt: "2026-12-27T20:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Houston Rockets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Oklahoma City Thunder",
        },
      },
    ],
  },
  _401910196: {
    id: "00000000-0000-4000-8000-000401910196",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910196",
    startsAt: "2026-12-27T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Cleveland Cavaliers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Washington Wizards",
        },
      },
    ],
  },
  _401910197: {
    id: "00000000-0000-4000-8000-000401910197",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910197",
    startsAt: "2026-12-27T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Miami Heat",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Charlotte Hornets",
        },
      },
    ],
  },
  _401910198: {
    id: "00000000-0000-4000-8000-000401910198",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910198",
    startsAt: "2026-12-27T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "New York Knicks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Brooklyn Nets",
        },
      },
    ],
  },
  _401910199: {
    id: "00000000-0000-4000-8000-000401910199",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910199",
    startsAt: "2026-12-27T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Orlando Magic",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Milwaukee Bucks",
        },
      },
    ],
  },
  _401910200: {
    id: "00000000-0000-4000-8000-000401910200",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910200",
    startsAt: "2026-12-27T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Sacramento Kings",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Utah Jazz",
        },
      },
    ],
  },
  _401910201: {
    id: "00000000-0000-4000-8000-000401910201",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910201",
    startsAt: "2026-12-28T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Detroit Pistons",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Portland Trail Blazers",
        },
      },
    ],
  },
  _401910202: {
    id: "00000000-0000-4000-8000-000401910202",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910202",
    startsAt: "2026-12-28T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "San Antonio Spurs",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Atlanta Hawks",
        },
      },
    ],
  },
  _401910203: {
    id: "00000000-0000-4000-8000-000401910203",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910203",
    startsAt: "2026-12-28T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Denver Nuggets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Indiana Pacers",
        },
      },
    ],
  },
  _401910204: {
    id: "00000000-0000-4000-8000-000401910204",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910204",
    startsAt: "2026-12-28T01:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Golden State Warriors",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Minnesota Timberwolves",
        },
      },
    ],
  },
  _401910205: {
    id: "00000000-0000-4000-8000-000401910205",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910205",
    startsAt: "2026-12-28T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "LA Clippers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Philadelphia 76ers",
        },
      },
    ],
  },
  _401910206: {
    id: "00000000-0000-4000-8000-000401910206",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910206",
    startsAt: "2026-12-28T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Los Angeles Lakers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Memphis Grizzlies",
        },
      },
    ],
  },
  _401910207: {
    id: "00000000-0000-4000-8000-000401910207",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910207",
    startsAt: "2026-12-29T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Toronto Raptors",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "New Orleans Pelicans",
        },
      },
    ],
  },
  _401910208: {
    id: "00000000-0000-4000-8000-000401910208",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910208",
    startsAt: "2026-12-29T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Boston Celtics",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Cleveland Cavaliers",
        },
      },
    ],
  },
  _401910209: {
    id: "00000000-0000-4000-8000-000401910209",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910209",
    startsAt: "2026-12-29T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Phoenix Suns",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Golden State Warriors",
        },
      },
    ],
  },
  _401910210: {
    id: "00000000-0000-4000-8000-000401910210",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910210",
    startsAt: "2026-12-29T03:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Denver Nuggets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Minnesota Timberwolves",
        },
      },
    ],
  },
  _401910211: {
    id: "00000000-0000-4000-8000-000401910211",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910211",
    startsAt: "2026-12-30T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Atlanta Hawks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Chicago Bulls",
        },
      },
    ],
  },
  _401910212: {
    id: "00000000-0000-4000-8000-000401910212",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910212",
    startsAt: "2026-12-30T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Charlotte Hornets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Orlando Magic",
        },
      },
    ],
  },
  _401910213: {
    id: "00000000-0000-4000-8000-000401910213",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910213",
    startsAt: "2026-12-30T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Indiana Pacers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "LA Clippers",
        },
      },
    ],
  },
  _401910214: {
    id: "00000000-0000-4000-8000-000401910214",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910214",
    startsAt: "2026-12-30T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Dallas Mavericks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Miami Heat",
        },
      },
    ],
  },
  _401910215: {
    id: "00000000-0000-4000-8000-000401910215",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910215",
    startsAt: "2026-12-30T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Memphis Grizzlies",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "San Antonio Spurs",
        },
      },
    ],
  },
  _401910216: {
    id: "00000000-0000-4000-8000-000401910216",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910216",
    startsAt: "2026-12-30T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Oklahoma City Thunder",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Milwaukee Bucks",
        },
      },
    ],
  },
  _401910217: {
    id: "00000000-0000-4000-8000-000401910217",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910217",
    startsAt: "2026-12-30T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Portland Trail Blazers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Brooklyn Nets",
        },
      },
    ],
  },
  _401910218: {
    id: "00000000-0000-4000-8000-000401910218",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910218",
    startsAt: "2026-12-30T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Sacramento Kings",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Philadelphia 76ers",
        },
      },
    ],
  },
  _401910219: {
    id: "00000000-0000-4000-8000-000401910219",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910219",
    startsAt: "2026-12-30T03:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Los Angeles Lakers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Houston Rockets",
        },
      },
    ],
  },
  _401910220: {
    id: "00000000-0000-4000-8000-000401910220",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910220",
    startsAt: "2026-12-31T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Detroit Pistons",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "New Orleans Pelicans",
        },
      },
    ],
  },
  _401910221: {
    id: "00000000-0000-4000-8000-000401910221",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910221",
    startsAt: "2026-12-31T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Toronto Raptors",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Washington Wizards",
        },
      },
    ],
  },
  _401910222: {
    id: "00000000-0000-4000-8000-000401910222",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910222",
    startsAt: "2026-12-31T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Chicago Bulls",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Boston Celtics",
        },
      },
    ],
  },
  _401910223: {
    id: "00000000-0000-4000-8000-000401910223",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910223",
    startsAt: "2026-12-31T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Phoenix Suns",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Philadelphia 76ers",
        },
      },
    ],
  },
  _401910224: {
    id: "00000000-0000-4000-8000-000401910224",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910224",
    startsAt: "2026-12-31T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Utah Jazz",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "New York Knicks",
        },
      },
    ],
  },
  _401910225: {
    id: "00000000-0000-4000-8000-000401910225",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910225",
    startsAt: "2026-12-31T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Golden State Warriors",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Houston Rockets",
        },
      },
    ],
  },
  _401910226: {
    id: "00000000-0000-4000-8000-000401910226",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910226",
    startsAt: "2026-12-31T18:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Charlotte Hornets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "San Antonio Spurs",
        },
      },
    ],
  },
  _401910227: {
    id: "00000000-0000-4000-8000-000401910227",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910227",
    startsAt: "2026-12-31T20:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Atlanta Hawks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Milwaukee Bucks",
        },
      },
    ],
  },
  _401910228: {
    id: "00000000-0000-4000-8000-000401910228",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910228",
    startsAt: "2026-12-31T20:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Cleveland Cavaliers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "LA Clippers",
        },
      },
    ],
  },
  _401910229: {
    id: "00000000-0000-4000-8000-000401910229",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910229",
    startsAt: "2026-12-31T20:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Indiana Pacers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Orlando Magic",
        },
      },
    ],
  },
  _401910230: {
    id: "00000000-0000-4000-8000-000401910230",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910230",
    startsAt: "2026-12-31T21:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Minnesota Timberwolves",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Denver Nuggets",
        },
      },
    ],
  },
  _401910231: {
    id: "00000000-0000-4000-8000-000401910231",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910231",
    startsAt: "2026-12-31T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Sacramento Kings",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Brooklyn Nets",
        },
      },
    ],
  },
  _401910232: {
    id: "00000000-0000-4000-8000-000401910232",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910232",
    startsAt: "2027-01-01T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "New Orleans Pelicans",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Los Angeles Lakers",
        },
      },
    ],
  },
  _401910233: {
    id: "00000000-0000-4000-8000-000401910233",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910233",
    startsAt: "2027-01-01T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Oklahoma City Thunder",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Miami Heat",
        },
      },
    ],
  },
  _401910234: {
    id: "00000000-0000-4000-8000-000401910234",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910234",
    startsAt: "2027-01-01T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Phoenix Suns",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "New York Knicks",
        },
      },
    ],
  },
  _401910235: {
    id: "00000000-0000-4000-8000-000401910235",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910235",
    startsAt: "2027-01-01T22:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Washington Wizards",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "San Antonio Spurs",
        },
      },
    ],
  },
  _401910236: {
    id: "00000000-0000-4000-8000-000401910236",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910236",
    startsAt: "2027-01-02T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Detroit Pistons",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Orlando Magic",
        },
      },
    ],
  },
  _401910237: {
    id: "00000000-0000-4000-8000-000401910237",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910237",
    startsAt: "2027-01-02T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Toronto Raptors",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "LA Clippers",
        },
      },
    ],
  },
  _401910238: {
    id: "00000000-0000-4000-8000-000401910238",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910238",
    startsAt: "2027-01-02T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Milwaukee Bucks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Philadelphia 76ers",
        },
      },
    ],
  },
  _401910239: {
    id: "00000000-0000-4000-8000-000401910239",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910239",
    startsAt: "2027-01-02T01:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Houston Rockets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Dallas Mavericks",
        },
      },
    ],
  },
  _401910240: {
    id: "00000000-0000-4000-8000-000401910240",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910240",
    startsAt: "2027-01-02T02:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Utah Jazz",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Boston Celtics",
        },
      },
    ],
  },
  _401910241: {
    id: "00000000-0000-4000-8000-000401910241",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910241",
    startsAt: "2027-01-02T18:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Charlotte Hornets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Cleveland Cavaliers",
        },
      },
    ],
  },
  _401910242: {
    id: "00000000-0000-4000-8000-000401910242",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910242",
    startsAt: "2027-01-02T22:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Denver Nuggets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "New York Knicks",
        },
      },
    ],
  },
  _401910243: {
    id: "00000000-0000-4000-8000-000401910243",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910243",
    startsAt: "2027-01-03T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Indiana Pacers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Minnesota Timberwolves",
        },
      },
    ],
  },
  _401910244: {
    id: "00000000-0000-4000-8000-000401910244",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910244",
    startsAt: "2027-01-03T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "New Orleans Pelicans",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Miami Heat",
        },
      },
    ],
  },
  _401910245: {
    id: "00000000-0000-4000-8000-000401910245",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910245",
    startsAt: "2027-01-03T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Atlanta Hawks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Dallas Mavericks",
        },
      },
    ],
  },
  _401910246: {
    id: "00000000-0000-4000-8000-000401910246",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910246",
    startsAt: "2027-01-03T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Chicago Bulls",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Los Angeles Lakers",
        },
      },
    ],
  },
  _401910247: {
    id: "00000000-0000-4000-8000-000401910247",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910247",
    startsAt: "2027-01-03T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Oklahoma City Thunder",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Utah Jazz",
        },
      },
    ],
  },
  _401910248: {
    id: "00000000-0000-4000-8000-000401910248",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910248",
    startsAt: "2027-01-03T01:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Golden State Warriors",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Brooklyn Nets",
        },
      },
    ],
  },
  _401910249: {
    id: "00000000-0000-4000-8000-000401910249",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910249",
    startsAt: "2027-01-03T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Phoenix Suns",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Sacramento Kings",
        },
      },
    ],
  },
  _401910250: {
    id: "00000000-0000-4000-8000-000401910250",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910250",
    startsAt: "2027-01-03T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Portland Trail Blazers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Boston Celtics",
        },
      },
    ],
  },
  _401910251: {
    id: "00000000-0000-4000-8000-000401910251",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910251",
    startsAt: "2027-01-03T22:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Denver Nuggets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Detroit Pistons",
        },
      },
    ],
  },
  _401910252: {
    id: "00000000-0000-4000-8000-000401910252",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910252",
    startsAt: "2027-01-03T22:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Milwaukee Bucks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Charlotte Hornets",
        },
      },
    ],
  },
  _401910253: {
    id: "00000000-0000-4000-8000-000401910253",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910253",
    startsAt: "2027-01-03T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Orlando Magic",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Memphis Grizzlies",
        },
      },
    ],
  },
  _401910254: {
    id: "00000000-0000-4000-8000-000401910254",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910254",
    startsAt: "2027-01-04T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Toronto Raptors",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Los Angeles Lakers",
        },
      },
    ],
  },
  _401910255: {
    id: "00000000-0000-4000-8000-000401910255",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910255",
    startsAt: "2027-01-04T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Washington Wizards",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "LA Clippers",
        },
      },
    ],
  },
  _401910256: {
    id: "00000000-0000-4000-8000-000401910256",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910256",
    startsAt: "2027-01-04T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Houston Rockets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Cleveland Cavaliers",
        },
      },
    ],
  },
  _401910257: {
    id: "00000000-0000-4000-8000-000401910257",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910257",
    startsAt: "2027-01-04T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Minnesota Timberwolves",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "San Antonio Spurs",
        },
      },
    ],
  },
  _401910258: {
    id: "00000000-0000-4000-8000-000401910258",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910258",
    startsAt: "2027-01-04T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Oklahoma City Thunder",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Sacramento Kings",
        },
      },
    ],
  },
  _401910259: {
    id: "00000000-0000-4000-8000-000401910259",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910259",
    startsAt: "2027-01-05T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Indiana Pacers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Chicago Bulls",
        },
      },
    ],
  },
  _401910260: {
    id: "00000000-0000-4000-8000-000401910260",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910260",
    startsAt: "2027-01-05T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Philadelphia 76ers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Atlanta Hawks",
        },
      },
    ],
  },
  _401910261: {
    id: "00000000-0000-4000-8000-000401910261",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910261",
    startsAt: "2027-01-05T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "New Orleans Pelicans",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Dallas Mavericks",
        },
      },
    ],
  },
  _401910262: {
    id: "00000000-0000-4000-8000-000401910262",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910262",
    startsAt: "2027-01-05T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Phoenix Suns",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Boston Celtics",
        },
      },
    ],
  },
  _401910263: {
    id: "00000000-0000-4000-8000-000401910263",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910263",
    startsAt: "2027-01-05T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Utah Jazz",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Brooklyn Nets",
        },
      },
    ],
  },
  _401910264: {
    id: "00000000-0000-4000-8000-000401910264",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910264",
    startsAt: "2027-01-05T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Portland Trail Blazers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "New York Knicks",
        },
      },
    ],
  },
  _401910265: {
    id: "00000000-0000-4000-8000-000401910265",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910265",
    startsAt: "2027-01-06T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Charlotte Hornets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Atlanta Hawks",
        },
      },
    ],
  },
  _401910266: {
    id: "00000000-0000-4000-8000-000401910266",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910266",
    startsAt: "2027-01-06T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Cleveland Cavaliers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Toronto Raptors",
        },
      },
    ],
  },
  _401910267: {
    id: "00000000-0000-4000-8000-000401910267",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910267",
    startsAt: "2027-01-06T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Orlando Magic",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "LA Clippers",
        },
      },
    ],
  },
  _401910268: {
    id: "00000000-0000-4000-8000-000401910268",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910268",
    startsAt: "2027-01-06T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Washington Wizards",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Los Angeles Lakers",
        },
      },
    ],
  },
  _401910269: {
    id: "00000000-0000-4000-8000-000401910269",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910269",
    startsAt: "2027-01-06T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Miami Heat",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Memphis Grizzlies",
        },
      },
    ],
  },
  _401910270: {
    id: "00000000-0000-4000-8000-000401910270",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910270",
    startsAt: "2027-01-06T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Chicago Bulls",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Milwaukee Bucks",
        },
      },
    ],
  },
  _401910271: {
    id: "00000000-0000-4000-8000-000401910271",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910271",
    startsAt: "2027-01-06T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Houston Rockets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Minnesota Timberwolves",
        },
      },
    ],
  },
  _401910272: {
    id: "00000000-0000-4000-8000-000401910272",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910272",
    startsAt: "2027-01-06T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Denver Nuggets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Phoenix Suns",
        },
      },
    ],
  },
  _401910273: {
    id: "00000000-0000-4000-8000-000401910273",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910273",
    startsAt: "2027-01-06T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Sacramento Kings",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Detroit Pistons",
        },
      },
    ],
  },
  _401910274: {
    id: "00000000-0000-4000-8000-000401910274",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910274",
    startsAt: "2027-01-07T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Brooklyn Nets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Utah Jazz",
        },
      },
    ],
  },
  _401910275: {
    id: "00000000-0000-4000-8000-000401910275",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910275",
    startsAt: "2027-01-07T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Philadelphia 76ers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Oklahoma City Thunder",
        },
      },
    ],
  },
  _401910276: {
    id: "00000000-0000-4000-8000-000401910276",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910276",
    startsAt: "2027-01-07T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "New Orleans Pelicans",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Portland Trail Blazers",
        },
      },
    ],
  },
  _401910277: {
    id: "00000000-0000-4000-8000-000401910277",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910277",
    startsAt: "2027-01-07T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "San Antonio Spurs",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Indiana Pacers",
        },
      },
    ],
  },
  _401910278: {
    id: "00000000-0000-4000-8000-000401910278",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910278",
    startsAt: "2027-01-07T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Golden State Warriors",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "New York Knicks",
        },
      },
    ],
  },
  _401910279: {
    id: "00000000-0000-4000-8000-000401910279",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910279",
    startsAt: "2027-01-08T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Atlanta Hawks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Indiana Pacers",
        },
      },
    ],
  },
  _401910280: {
    id: "00000000-0000-4000-8000-000401910280",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910280",
    startsAt: "2027-01-08T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Charlotte Hornets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Denver Nuggets",
        },
      },
    ],
  },
  _401910281: {
    id: "00000000-0000-4000-8000-000401910281",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910281",
    startsAt: "2027-01-08T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Orlando Magic",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Cleveland Cavaliers",
        },
      },
    ],
  },
  _401910282: {
    id: "00000000-0000-4000-8000-000401910282",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910282",
    startsAt: "2027-01-08T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Washington Wizards",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Oklahoma City Thunder",
        },
      },
    ],
  },
  _401910283: {
    id: "00000000-0000-4000-8000-000401910283",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910283",
    startsAt: "2027-01-08T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Brooklyn Nets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Miami Heat",
        },
      },
    ],
  },
  _401910284: {
    id: "00000000-0000-4000-8000-000401910284",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910284",
    startsAt: "2027-01-08T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Toronto Raptors",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Minnesota Timberwolves",
        },
      },
    ],
  },
  _401910285: {
    id: "00000000-0000-4000-8000-000401910285",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910285",
    startsAt: "2027-01-08T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Dallas Mavericks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Portland Trail Blazers",
        },
      },
    ],
  },
  _401910286: {
    id: "00000000-0000-4000-8000-000401910286",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910286",
    startsAt: "2027-01-08T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Milwaukee Bucks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "LA Clippers",
        },
      },
    ],
  },
  _401910287: {
    id: "00000000-0000-4000-8000-000401910287",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910287",
    startsAt: "2027-01-08T01:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Houston Rockets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Memphis Grizzlies",
        },
      },
    ],
  },
  _401910288: {
    id: "00000000-0000-4000-8000-000401910288",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910288",
    startsAt: "2027-01-08T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Golden State Warriors",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Detroit Pistons",
        },
      },
    ],
  },
  _401910289: {
    id: "00000000-0000-4000-8000-000401910289",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910289",
    startsAt: "2027-01-08T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Los Angeles Lakers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Boston Celtics",
        },
      },
    ],
  },
  _401910290: {
    id: "00000000-0000-4000-8000-000401910290",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910290",
    startsAt: "2027-01-08T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Sacramento Kings",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Chicago Bulls",
        },
      },
    ],
  },
  _401910291: {
    id: "00000000-0000-4000-8000-000401910291",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910291",
    startsAt: "2027-01-09T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Philadelphia 76ers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Miami Heat",
        },
      },
    ],
  },
  _401910292: {
    id: "00000000-0000-4000-8000-000401910292",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910292",
    startsAt: "2027-01-09T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Washington Wizards",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Minnesota Timberwolves",
        },
      },
    ],
  },
  _401910293: {
    id: "00000000-0000-4000-8000-000401910293",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910293",
    startsAt: "2027-01-09T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Toronto Raptors",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Utah Jazz",
        },
      },
    ],
  },
  _401910294: {
    id: "00000000-0000-4000-8000-000401910294",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910294",
    startsAt: "2027-01-09T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "New Orleans Pelicans",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Orlando Magic",
        },
      },
    ],
  },
  _401910295: {
    id: "00000000-0000-4000-8000-000401910295",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910295",
    startsAt: "2027-01-09T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "San Antonio Spurs",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Memphis Grizzlies",
        },
      },
    ],
  },
  _401910296: {
    id: "00000000-0000-4000-8000-000401910296",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910296",
    startsAt: "2027-01-09T02:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Dallas Mavericks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Phoenix Suns",
        },
      },
    ],
  },
  _401910297: {
    id: "00000000-0000-4000-8000-000401910297",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910297",
    startsAt: "2027-01-09T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Los Angeles Lakers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Detroit Pistons",
        },
      },
    ],
  },
  _401910298: {
    id: "00000000-0000-4000-8000-000401910298",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910298",
    startsAt: "2027-01-09T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Sacramento Kings",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "New York Knicks",
        },
      },
    ],
  },
  _401910299: {
    id: "00000000-0000-4000-8000-000401910299",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910299",
    startsAt: "2027-01-09T22:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Cleveland Cavaliers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Denver Nuggets",
        },
      },
    ],
  },
  _401910300: {
    id: "00000000-0000-4000-8000-000401910300",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910300",
    startsAt: "2027-01-09T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Brooklyn Nets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Houston Rockets",
        },
      },
    ],
  },
  _401910301: {
    id: "00000000-0000-4000-8000-000401910301",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910301",
    startsAt: "2027-01-10T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Indiana Pacers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Milwaukee Bucks",
        },
      },
    ],
  },
  _401910302: {
    id: "00000000-0000-4000-8000-000401910302",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910302",
    startsAt: "2027-01-10T01:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Golden State Warriors",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Chicago Bulls",
        },
      },
    ],
  },
  _401910303: {
    id: "00000000-0000-4000-8000-000401910303",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910303",
    startsAt: "2027-01-10T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Portland Trail Blazers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Charlotte Hornets",
        },
      },
    ],
  },
  _401910304: {
    id: "00000000-0000-4000-8000-000401910304",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910304",
    startsAt: "2027-01-10T03:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "LA Clippers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Boston Celtics",
        },
      },
    ],
  },
  _401910305: {
    id: "00000000-0000-4000-8000-000401910305",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910305",
    startsAt: "2027-01-10T20:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Atlanta Hawks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "San Antonio Spurs",
        },
      },
    ],
  },
  _401910306: {
    id: "00000000-0000-4000-8000-000401910306",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910306",
    startsAt: "2027-01-10T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Detroit Pistons",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Utah Jazz",
        },
      },
    ],
  },
  _401910307: {
    id: "00000000-0000-4000-8000-000401910307",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910307",
    startsAt: "2027-01-10T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Miami Heat",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "New Orleans Pelicans",
        },
      },
    ],
  },
  _401910308: {
    id: "00000000-0000-4000-8000-000401910308",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910308",
    startsAt: "2027-01-10T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Orlando Magic",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Oklahoma City Thunder",
        },
      },
    ],
  },
  _401910309: {
    id: "00000000-0000-4000-8000-000401910309",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910309",
    startsAt: "2027-01-10T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Toronto Raptors",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Philadelphia 76ers",
        },
      },
    ],
  },
  _401910310: {
    id: "00000000-0000-4000-8000-000401910310",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910310",
    startsAt: "2027-01-10T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Memphis Grizzlies",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Dallas Mavericks",
        },
      },
    ],
  },
  _401910311: {
    id: "00000000-0000-4000-8000-000401910311",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910311",
    startsAt: "2027-01-11T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Phoenix Suns",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Chicago Bulls",
        },
      },
    ],
  },
  _401910312: {
    id: "00000000-0000-4000-8000-000401910312",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910312",
    startsAt: "2027-01-11T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Sacramento Kings",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Charlotte Hornets",
        },
      },
    ],
  },
  _401910313: {
    id: "00000000-0000-4000-8000-000401910313",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910313",
    startsAt: "2027-01-12T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Indiana Pacers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Brooklyn Nets",
        },
      },
    ],
  },
  _401910314: {
    id: "00000000-0000-4000-8000-000401910314",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910314",
    startsAt: "2027-01-12T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Washington Wizards",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Atlanta Hawks",
        },
      },
    ],
  },
  _401910315: {
    id: "00000000-0000-4000-8000-000401910315",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910315",
    startsAt: "2027-01-12T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Boston Celtics",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Houston Rockets",
        },
      },
    ],
  },
  _401910316: {
    id: "00000000-0000-4000-8000-000401910316",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910316",
    startsAt: "2027-01-12T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "New York Knicks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Denver Nuggets",
        },
      },
    ],
  },
  _401910317: {
    id: "00000000-0000-4000-8000-000401910317",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910317",
    startsAt: "2027-01-12T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Minnesota Timberwolves",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Cleveland Cavaliers",
        },
      },
    ],
  },
  _401910318: {
    id: "00000000-0000-4000-8000-000401910318",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910318",
    startsAt: "2027-01-12T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "LA Clippers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Los Angeles Lakers",
        },
      },
    ],
  },
  _401910319: {
    id: "00000000-0000-4000-8000-000401910319",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910319",
    startsAt: "2027-01-13T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Miami Heat",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Brooklyn Nets",
        },
      },
    ],
  },
  _401910320: {
    id: "00000000-0000-4000-8000-000401910320",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910320",
    startsAt: "2027-01-13T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Toronto Raptors",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Detroit Pistons",
        },
      },
    ],
  },
  _401910321: {
    id: "00000000-0000-4000-8000-000401910321",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910321",
    startsAt: "2027-01-13T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Philadelphia 76ers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Washington Wizards",
        },
      },
    ],
  },
  _401910322: {
    id: "00000000-0000-4000-8000-000401910322",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910322",
    startsAt: "2027-01-13T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Memphis Grizzlies",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Dallas Mavericks",
        },
      },
    ],
  },
  _401910323: {
    id: "00000000-0000-4000-8000-000401910323",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910323",
    startsAt: "2027-01-13T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Milwaukee Bucks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Denver Nuggets",
        },
      },
    ],
  },
  _401910324: {
    id: "00000000-0000-4000-8000-000401910324",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910324",
    startsAt: "2027-01-13T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Utah Jazz",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Chicago Bulls",
        },
      },
    ],
  },
  _401910325: {
    id: "00000000-0000-4000-8000-000401910325",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910325",
    startsAt: "2027-01-13T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Portland Trail Blazers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Orlando Magic",
        },
      },
    ],
  },
  _401910326: {
    id: "00000000-0000-4000-8000-000401910326",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910326",
    startsAt: "2027-01-13T04:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Golden State Warriors",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Sacramento Kings",
        },
      },
    ],
  },
  _401910327: {
    id: "00000000-0000-4000-8000-000401910327",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910327",
    startsAt: "2027-01-14T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Atlanta Hawks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Cleveland Cavaliers",
        },
      },
    ],
  },
  _401910328: {
    id: "00000000-0000-4000-8000-000401910328",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910328",
    startsAt: "2027-01-14T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Boston Celtics",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "New York Knicks",
        },
      },
    ],
  },
  _401910329: {
    id: "00000000-0000-4000-8000-000401910329",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910329",
    startsAt: "2027-01-14T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Indiana Pacers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Milwaukee Bucks",
        },
      },
    ],
  },
  _401910330: {
    id: "00000000-0000-4000-8000-000401910330",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910330",
    startsAt: "2027-01-14T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Toronto Raptors",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Phoenix Suns",
        },
      },
    ],
  },
  _401910331: {
    id: "00000000-0000-4000-8000-000401910331",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910331",
    startsAt: "2027-01-14T02:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Oklahoma City Thunder",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Houston Rockets",
        },
      },
    ],
  },
  _401910332: {
    id: "00000000-0000-4000-8000-000401910332",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910332",
    startsAt: "2027-01-14T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Golden State Warriors",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Charlotte Hornets",
        },
      },
    ],
  },
  _401910333: {
    id: "00000000-0000-4000-8000-000401910333",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910333",
    startsAt: "2027-01-14T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Portland Trail Blazers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Los Angeles Lakers",
        },
      },
    ],
  },
  _401910334: {
    id: "00000000-0000-4000-8000-000401910334",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910334",
    startsAt: "2027-01-14T19:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "San Antonio Spurs",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "New Orleans Pelicans",
        },
      },
    ],
  },
  _401910335: {
    id: "00000000-0000-4000-8000-000401910335",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910335",
    startsAt: "2027-01-15T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Detroit Pistons",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Dallas Mavericks",
        },
      },
    ],
  },
  _401910336: {
    id: "00000000-0000-4000-8000-000401910336",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910336",
    startsAt: "2027-01-15T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Philadelphia 76ers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Brooklyn Nets",
        },
      },
    ],
  },
  _401910337: {
    id: "00000000-0000-4000-8000-000401910337",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910337",
    startsAt: "2027-01-15T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "New York Knicks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Miami Heat",
        },
      },
    ],
  },
  _401910338: {
    id: "00000000-0000-4000-8000-000401910338",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910338",
    startsAt: "2027-01-15T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Chicago Bulls",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Minnesota Timberwolves",
        },
      },
    ],
  },
  _401910339: {
    id: "00000000-0000-4000-8000-000401910339",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910339",
    startsAt: "2027-01-15T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Denver Nuggets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Memphis Grizzlies",
        },
      },
    ],
  },
  _401910340: {
    id: "00000000-0000-4000-8000-000401910340",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910340",
    startsAt: "2027-01-15T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Utah Jazz",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Charlotte Hornets",
        },
      },
    ],
  },
  _401910341: {
    id: "00000000-0000-4000-8000-000401910341",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910341",
    startsAt: "2027-01-15T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Los Angeles Lakers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Orlando Magic",
        },
      },
    ],
  },
  _401910342: {
    id: "00000000-0000-4000-8000-000401910342",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910342",
    startsAt: "2027-01-15T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Sacramento Kings",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "LA Clippers",
        },
      },
    ],
  },
  _401910343: {
    id: "00000000-0000-4000-8000-000401910343",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910343",
    startsAt: "2027-01-16T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Atlanta Hawks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Golden State Warriors",
        },
      },
    ],
  },
  _401910344: {
    id: "00000000-0000-4000-8000-000401910344",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910344",
    startsAt: "2027-01-16T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Indiana Pacers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Phoenix Suns",
        },
      },
    ],
  },
  _401910345: {
    id: "00000000-0000-4000-8000-000401910345",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910345",
    startsAt: "2027-01-16T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Toronto Raptors",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Miami Heat",
        },
      },
    ],
  },
  _401910346: {
    id: "00000000-0000-4000-8000-000401910346",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910346",
    startsAt: "2027-01-16T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Milwaukee Bucks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Cleveland Cavaliers",
        },
      },
    ],
  },
  _401910347: {
    id: "00000000-0000-4000-8000-000401910347",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910347",
    startsAt: "2027-01-16T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Oklahoma City Thunder",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Utah Jazz",
        },
      },
    ],
  },
  _401910348: {
    id: "00000000-0000-4000-8000-000401910348",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910348",
    startsAt: "2027-01-16T01:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Houston Rockets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Washington Wizards",
        },
      },
    ],
  },
  _401910349: {
    id: "00000000-0000-4000-8000-000401910349",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910349",
    startsAt: "2027-01-16T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Portland Trail Blazers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Sacramento Kings",
        },
      },
    ],
  },
  _401910350: {
    id: "00000000-0000-4000-8000-000401910350",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910350",
    startsAt: "2027-01-16T03:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "LA Clippers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Orlando Magic",
        },
      },
    ],
  },
  _401910351: {
    id: "00000000-0000-4000-8000-000401910351",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910351",
    startsAt: "2027-01-16T17:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Philadelphia 76ers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Minnesota Timberwolves",
        },
      },
    ],
  },
  _401910352: {
    id: "00000000-0000-4000-8000-000401910352",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910352",
    startsAt: "2027-01-17T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Boston Celtics",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Brooklyn Nets",
        },
      },
    ],
  },
  _401910353: {
    id: "00000000-0000-4000-8000-000401910353",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910353",
    startsAt: "2027-01-17T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "New York Knicks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Dallas Mavericks",
        },
      },
    ],
  },
  _401910354: {
    id: "00000000-0000-4000-8000-000401910354",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910354",
    startsAt: "2027-01-17T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Memphis Grizzlies",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Cleveland Cavaliers",
        },
      },
    ],
  },
  _401910355: {
    id: "00000000-0000-4000-8000-000401910355",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910355",
    startsAt: "2027-01-17T01:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Houston Rockets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Detroit Pistons",
        },
      },
    ],
  },
  _401910356: {
    id: "00000000-0000-4000-8000-000401910356",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910356",
    startsAt: "2027-01-17T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Denver Nuggets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Charlotte Hornets",
        },
      },
    ],
  },
  _401910357: {
    id: "00000000-0000-4000-8000-000401910357",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910357",
    startsAt: "2027-01-17T15:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "New Orleans Pelicans",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "San Antonio Spurs",
        },
      },
    ],
  },
  _401910358: {
    id: "00000000-0000-4000-8000-000401910358",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910358",
    startsAt: "2027-01-17T18:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Washington Wizards",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Indiana Pacers",
        },
      },
    ],
  },
  _401910359: {
    id: "00000000-0000-4000-8000-000401910359",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910359",
    startsAt: "2027-01-17T20:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Chicago Bulls",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Toronto Raptors",
        },
      },
    ],
  },
  _401910360: {
    id: "00000000-0000-4000-8000-000401910360",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910360",
    startsAt: "2027-01-17T20:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Oklahoma City Thunder",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Portland Trail Blazers",
        },
      },
    ],
  },
  _401910361: {
    id: "00000000-0000-4000-8000-000401910361",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910361",
    startsAt: "2027-01-17T22:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Utah Jazz",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Sacramento Kings",
        },
      },
    ],
  },
  _401910362: {
    id: "00000000-0000-4000-8000-000401910362",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910362",
    startsAt: "2027-01-17T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Miami Heat",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Golden State Warriors",
        },
      },
    ],
  },
  _401910363: {
    id: "00000000-0000-4000-8000-000401910363",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910363",
    startsAt: "2027-01-18T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Denver Nuggets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Orlando Magic",
        },
      },
    ],
  },
  _401910364: {
    id: "00000000-0000-4000-8000-000401910364",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910364",
    startsAt: "2027-01-18T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Los Angeles Lakers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Milwaukee Bucks",
        },
      },
    ],
  },
  _401909473: {
    id: "00000000-0000-4000-8000-000401909473",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909473",
    startsAt: "2027-01-18T17:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Cleveland Cavaliers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Detroit Pistons",
        },
      },
    ],
  },
  _401909474: {
    id: "00000000-0000-4000-8000-000401909474",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909474",
    startsAt: "2027-01-18T19:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Atlanta Hawks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Philadelphia 76ers",
        },
      },
    ],
  },
  _401910365: {
    id: "00000000-0000-4000-8000-000401910365",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910365",
    startsAt: "2027-01-18T20:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Washington Wizards",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Boston Celtics",
        },
      },
    ],
  },
  _401909475: {
    id: "00000000-0000-4000-8000-000401909475",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909475",
    startsAt: "2027-01-18T22:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "New York Knicks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Minnesota Timberwolves",
        },
      },
    ],
  },
  _401909476: {
    id: "00000000-0000-4000-8000-000401909476",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909476",
    startsAt: "2027-01-19T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Memphis Grizzlies",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Houston Rockets",
        },
      },
    ],
  },
  _401910366: {
    id: "00000000-0000-4000-8000-000401910366",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910366",
    startsAt: "2027-01-19T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Dallas Mavericks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Oklahoma City Thunder",
        },
      },
    ],
  },
  _401910367: {
    id: "00000000-0000-4000-8000-000401910367",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910367",
    startsAt: "2027-01-19T03:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "LA Clippers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Phoenix Suns",
        },
      },
    ],
  },
  _401910368: {
    id: "00000000-0000-4000-8000-000401910368",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910368",
    startsAt: "2027-01-20T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Orlando Magic",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Golden State Warriors",
        },
      },
    ],
  },
  _401910369: {
    id: "00000000-0000-4000-8000-000401910369",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910369",
    startsAt: "2027-01-20T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Philadelphia 76ers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Indiana Pacers",
        },
      },
    ],
  },
  _401910370: {
    id: "00000000-0000-4000-8000-000401910370",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910370",
    startsAt: "2027-01-20T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Toronto Raptors",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Chicago Bulls",
        },
      },
    ],
  },
  _401910371: {
    id: "00000000-0000-4000-8000-000401910371",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910371",
    startsAt: "2027-01-20T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Miami Heat",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Portland Trail Blazers",
        },
      },
    ],
  },
  _401910372: {
    id: "00000000-0000-4000-8000-000401910372",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910372",
    startsAt: "2027-01-20T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Dallas Mavericks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Charlotte Hornets",
        },
      },
    ],
  },
  _401910373: {
    id: "00000000-0000-4000-8000-000401910373",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910373",
    startsAt: "2027-01-20T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Denver Nuggets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Utah Jazz",
        },
      },
    ],
  },
  _401910374: {
    id: "00000000-0000-4000-8000-000401910374",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910374",
    startsAt: "2027-01-20T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Sacramento Kings",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Los Angeles Lakers",
        },
      },
    ],
  },
  _401910375: {
    id: "00000000-0000-4000-8000-000401910375",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910375",
    startsAt: "2027-01-21T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Atlanta Hawks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Portland Trail Blazers",
        },
      },
    ],
  },
  _401910376: {
    id: "00000000-0000-4000-8000-000401910376",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910376",
    startsAt: "2027-01-21T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Brooklyn Nets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Chicago Bulls",
        },
      },
    ],
  },
  _401910377: {
    id: "00000000-0000-4000-8000-000401910377",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910377",
    startsAt: "2027-01-21T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Boston Celtics",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Indiana Pacers",
        },
      },
    ],
  },
  _401910378: {
    id: "00000000-0000-4000-8000-000401910378",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910378",
    startsAt: "2027-01-21T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "New York Knicks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Toronto Raptors",
        },
      },
    ],
  },
  _401910379: {
    id: "00000000-0000-4000-8000-000401910379",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910379",
    startsAt: "2027-01-21T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Minnesota Timberwolves",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Houston Rockets",
        },
      },
    ],
  },
  _401910380: {
    id: "00000000-0000-4000-8000-000401910380",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910380",
    startsAt: "2027-01-21T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "New Orleans Pelicans",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Oklahoma City Thunder",
        },
      },
    ],
  },
  _401910381: {
    id: "00000000-0000-4000-8000-000401910381",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910381",
    startsAt: "2027-01-21T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Phoenix Suns",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Memphis Grizzlies",
        },
      },
    ],
  },
  _401910382: {
    id: "00000000-0000-4000-8000-000401910382",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910382",
    startsAt: "2027-01-21T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Utah Jazz",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "LA Clippers",
        },
      },
    ],
  },
  _401910383: {
    id: "00000000-0000-4000-8000-000401910383",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910383",
    startsAt: "2027-01-21T02:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "San Antonio Spurs",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Miami Heat",
        },
      },
    ],
  },
  _401910384: {
    id: "00000000-0000-4000-8000-000401910384",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910384",
    startsAt: "2027-01-21T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Sacramento Kings",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Milwaukee Bucks",
        },
      },
    ],
  },
  _401910385: {
    id: "00000000-0000-4000-8000-000401910385",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910385",
    startsAt: "2027-01-22T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Boston Celtics",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Philadelphia 76ers",
        },
      },
    ],
  },
  _401910386: {
    id: "00000000-0000-4000-8000-000401910386",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910386",
    startsAt: "2027-01-22T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Brooklyn Nets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Cleveland Cavaliers",
        },
      },
    ],
  },
  _401910387: {
    id: "00000000-0000-4000-8000-000401910387",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910387",
    startsAt: "2027-01-22T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Denver Nuggets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Washington Wizards",
        },
      },
    ],
  },
  _401910388: {
    id: "00000000-0000-4000-8000-000401910388",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910388",
    startsAt: "2027-01-22T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Golden State Warriors",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Los Angeles Lakers",
        },
      },
    ],
  },
  _401910389: {
    id: "00000000-0000-4000-8000-000401910389",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910389",
    startsAt: "2027-01-23T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Atlanta Hawks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "New York Knicks",
        },
      },
    ],
  },
  _401910390: {
    id: "00000000-0000-4000-8000-000401910390",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910390",
    startsAt: "2027-01-23T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Charlotte Hornets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Houston Rockets",
        },
      },
    ],
  },
  _401910391: {
    id: "00000000-0000-4000-8000-000401910391",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910391",
    startsAt: "2027-01-23T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Orlando Magic",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Portland Trail Blazers",
        },
      },
    ],
  },
  _401910392: {
    id: "00000000-0000-4000-8000-000401910392",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910392",
    startsAt: "2027-01-23T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Detroit Pistons",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Indiana Pacers",
        },
      },
    ],
  },
  _401910393: {
    id: "00000000-0000-4000-8000-000401910393",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910393",
    startsAt: "2027-01-23T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "New Orleans Pelicans",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Dallas Mavericks",
        },
      },
    ],
  },
  _401910394: {
    id: "00000000-0000-4000-8000-000401910394",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910394",
    startsAt: "2027-01-23T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Oklahoma City Thunder",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Memphis Grizzlies",
        },
      },
    ],
  },
  _401910395: {
    id: "00000000-0000-4000-8000-000401910395",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910395",
    startsAt: "2027-01-23T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Phoenix Suns",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Utah Jazz",
        },
      },
    ],
  },
  _401910396: {
    id: "00000000-0000-4000-8000-000401910396",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910396",
    startsAt: "2027-01-23T02:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "San Antonio Spurs",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Minnesota Timberwolves",
        },
      },
    ],
  },
  _401910397: {
    id: "00000000-0000-4000-8000-000401910397",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910397",
    startsAt: "2027-01-23T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Golden State Warriors",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Milwaukee Bucks",
        },
      },
    ],
  },
  _401910398: {
    id: "00000000-0000-4000-8000-000401910398",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910398",
    startsAt: "2027-01-23T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Los Angeles Lakers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Sacramento Kings",
        },
      },
    ],
  },
  _401910399: {
    id: "00000000-0000-4000-8000-000401910399",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910399",
    startsAt: "2027-01-23T03:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "LA Clippers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Washington Wizards",
        },
      },
    ],
  },
  _401910400: {
    id: "00000000-0000-4000-8000-000401910400",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910400",
    startsAt: "2027-01-23T22:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Chicago Bulls",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Philadelphia 76ers",
        },
      },
    ],
  },
  _401910401: {
    id: "00000000-0000-4000-8000-000401910401",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910401",
    startsAt: "2027-01-23T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Brooklyn Nets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Toronto Raptors",
        },
      },
    ],
  },
  _401910402: {
    id: "00000000-0000-4000-8000-000401910402",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910402",
    startsAt: "2027-01-24T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Boston Celtics",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Charlotte Hornets",
        },
      },
    ],
  },
  _401910403: {
    id: "00000000-0000-4000-8000-000401910403",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910403",
    startsAt: "2027-01-24T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Miami Heat",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Atlanta Hawks",
        },
      },
    ],
  },
  _401910404: {
    id: "00000000-0000-4000-8000-000401910404",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910404",
    startsAt: "2027-01-24T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Dallas Mavericks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Cleveland Cavaliers",
        },
      },
    ],
  },
  _401910405: {
    id: "00000000-0000-4000-8000-000401910405",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910405",
    startsAt: "2027-01-24T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Denver Nuggets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Milwaukee Bucks",
        },
      },
    ],
  },
  _401910406: {
    id: "00000000-0000-4000-8000-000401910406",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910406",
    startsAt: "2027-01-24T20:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "San Antonio Spurs",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Portland Trail Blazers",
        },
      },
    ],
  },
  _401910407: {
    id: "00000000-0000-4000-8000-000401910407",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910407",
    startsAt: "2027-01-24T21:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Phoenix Suns",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Utah Jazz",
        },
      },
    ],
  },
  _401910408: {
    id: "00000000-0000-4000-8000-000401910408",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910408",
    startsAt: "2027-01-24T21:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Los Angeles Lakers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Washington Wizards",
        },
      },
    ],
  },
  _401910409: {
    id: "00000000-0000-4000-8000-000401910409",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910409",
    startsAt: "2027-01-24T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Detroit Pistons",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Minnesota Timberwolves",
        },
      },
    ],
  },
  _401910410: {
    id: "00000000-0000-4000-8000-000401910410",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910410",
    startsAt: "2027-01-24T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Orlando Magic",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Houston Rockets",
        },
      },
    ],
  },
  _401910411: {
    id: "00000000-0000-4000-8000-000401910411",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910411",
    startsAt: "2027-01-25T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "New York Knicks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "LA Clippers",
        },
      },
    ],
  },
  _401910412: {
    id: "00000000-0000-4000-8000-000401910412",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910412",
    startsAt: "2027-01-25T01:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Golden State Warriors",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Oklahoma City Thunder",
        },
      },
    ],
  },
  _401910413: {
    id: "00000000-0000-4000-8000-000401910413",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910413",
    startsAt: "2027-01-26T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Boston Celtics",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Toronto Raptors",
        },
      },
    ],
  },
  _401910414: {
    id: "00000000-0000-4000-8000-000401910414",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910414",
    startsAt: "2027-01-26T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Charlotte Hornets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Orlando Magic",
        },
      },
    ],
  },
  _401910415: {
    id: "00000000-0000-4000-8000-000401910415",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910415",
    startsAt: "2027-01-26T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Philadelphia 76ers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "LA Clippers",
        },
      },
    ],
  },
  _401910416: {
    id: "00000000-0000-4000-8000-000401910416",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910416",
    startsAt: "2027-01-26T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Brooklyn Nets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Miami Heat",
        },
      },
    ],
  },
  _401910417: {
    id: "00000000-0000-4000-8000-000401910417",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910417",
    startsAt: "2027-01-26T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Chicago Bulls",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Dallas Mavericks",
        },
      },
    ],
  },
  _401910418: {
    id: "00000000-0000-4000-8000-000401910418",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910418",
    startsAt: "2027-01-26T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Memphis Grizzlies",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Minnesota Timberwolves",
        },
      },
    ],
  },
  _401910419: {
    id: "00000000-0000-4000-8000-000401910419",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910419",
    startsAt: "2027-01-26T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "New Orleans Pelicans",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Cleveland Cavaliers",
        },
      },
    ],
  },
  _401910420: {
    id: "00000000-0000-4000-8000-000401910420",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910420",
    startsAt: "2027-01-26T02:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Denver Nuggets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Sacramento Kings",
        },
      },
    ],
  },
  _401910421: {
    id: "00000000-0000-4000-8000-000401910421",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910421",
    startsAt: "2027-01-27T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Detroit Pistons",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Atlanta Hawks",
        },
      },
    ],
  },
  _401910422: {
    id: "00000000-0000-4000-8000-000401910422",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910422",
    startsAt: "2027-01-27T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Indiana Pacers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Chicago Bulls",
        },
      },
    ],
  },
  _401910423: {
    id: "00000000-0000-4000-8000-000401910423",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910423",
    startsAt: "2027-01-27T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "New York Knicks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Phoenix Suns",
        },
      },
    ],
  },
  _401910424: {
    id: "00000000-0000-4000-8000-000401910424",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910424",
    startsAt: "2027-01-27T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "San Antonio Spurs",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Houston Rockets",
        },
      },
    ],
  },
  _401910425: {
    id: "00000000-0000-4000-8000-000401910425",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910425",
    startsAt: "2027-01-27T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Utah Jazz",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Milwaukee Bucks",
        },
      },
    ],
  },
  _401910426: {
    id: "00000000-0000-4000-8000-000401910426",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910426",
    startsAt: "2027-01-27T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Portland Trail Blazers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Washington Wizards",
        },
      },
    ],
  },
  _401910427: {
    id: "00000000-0000-4000-8000-000401910427",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910427",
    startsAt: "2027-01-27T04:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Los Angeles Lakers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Oklahoma City Thunder",
        },
      },
    ],
  },
  _401910428: {
    id: "00000000-0000-4000-8000-000401910428",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910428",
    startsAt: "2027-01-28T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Cleveland Cavaliers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Detroit Pistons",
        },
      },
    ],
  },
  _401910429: {
    id: "00000000-0000-4000-8000-000401910429",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910429",
    startsAt: "2027-01-28T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Philadelphia 76ers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Sacramento Kings",
        },
      },
    ],
  },
  _401910430: {
    id: "00000000-0000-4000-8000-000401910430",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910430",
    startsAt: "2027-01-28T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Boston Celtics",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "LA Clippers",
        },
      },
    ],
  },
  _401910431: {
    id: "00000000-0000-4000-8000-000401910431",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910431",
    startsAt: "2027-01-28T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Brooklyn Nets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Phoenix Suns",
        },
      },
    ],
  },
  _401910432: {
    id: "00000000-0000-4000-8000-000401910432",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910432",
    startsAt: "2027-01-28T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Toronto Raptors",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Dallas Mavericks",
        },
      },
    ],
  },
  _401910433: {
    id: "00000000-0000-4000-8000-000401910433",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910433",
    startsAt: "2027-01-28T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "San Antonio Spurs",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Charlotte Hornets",
        },
      },
    ],
  },
  _401910434: {
    id: "00000000-0000-4000-8000-000401910434",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910434",
    startsAt: "2027-01-28T01:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Houston Rockets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "New Orleans Pelicans",
        },
      },
    ],
  },
  _401910435: {
    id: "00000000-0000-4000-8000-000401910435",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910435",
    startsAt: "2027-01-28T02:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Minnesota Timberwolves",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Denver Nuggets",
        },
      },
    ],
  },
  _401910436: {
    id: "00000000-0000-4000-8000-000401910436",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910436",
    startsAt: "2027-01-28T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Portland Trail Blazers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Golden State Warriors",
        },
      },
    ],
  },
  _401910437: {
    id: "00000000-0000-4000-8000-000401910437",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910437",
    startsAt: "2027-01-29T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Indiana Pacers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Los Angeles Lakers",
        },
      },
    ],
  },
  _401910438: {
    id: "00000000-0000-4000-8000-000401910438",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910438",
    startsAt: "2027-01-29T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "New York Knicks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Atlanta Hawks",
        },
      },
    ],
  },
  _401910439: {
    id: "00000000-0000-4000-8000-000401910439",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910439",
    startsAt: "2027-01-29T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Orlando Magic",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Chicago Bulls",
        },
      },
    ],
  },
  _401910440: {
    id: "00000000-0000-4000-8000-000401910440",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910440",
    startsAt: "2027-01-29T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Washington Wizards",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Sacramento Kings",
        },
      },
    ],
  },
  _401910441: {
    id: "00000000-0000-4000-8000-000401910441",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910441",
    startsAt: "2027-01-29T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "New Orleans Pelicans",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Philadelphia 76ers",
        },
      },
    ],
  },
  _401910442: {
    id: "00000000-0000-4000-8000-000401910442",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910442",
    startsAt: "2027-01-29T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Oklahoma City Thunder",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Memphis Grizzlies",
        },
      },
    ],
  },
  _401910443: {
    id: "00000000-0000-4000-8000-000401910443",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910443",
    startsAt: "2027-01-29T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Utah Jazz",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Golden State Warriors",
        },
      },
    ],
  },
  _401910444: {
    id: "00000000-0000-4000-8000-000401910444",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910444",
    startsAt: "2027-01-29T02:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Milwaukee Bucks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Miami Heat",
        },
      },
    ],
  },
  _401910445: {
    id: "00000000-0000-4000-8000-000401910445",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910445",
    startsAt: "2027-01-30T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Toronto Raptors",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Cleveland Cavaliers",
        },
      },
    ],
  },
  _401910446: {
    id: "00000000-0000-4000-8000-000401910446",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910446",
    startsAt: "2027-01-30T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Boston Celtics",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Phoenix Suns",
        },
      },
    ],
  },
  _401910447: {
    id: "00000000-0000-4000-8000-000401910447",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910447",
    startsAt: "2027-01-30T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Brooklyn Nets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "LA Clippers",
        },
      },
    ],
  },
  _401910448: {
    id: "00000000-0000-4000-8000-000401910448",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910448",
    startsAt: "2027-01-30T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Dallas Mavericks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Detroit Pistons",
        },
      },
    ],
  },
  _401910449: {
    id: "00000000-0000-4000-8000-000401910449",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910449",
    startsAt: "2027-01-30T01:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Houston Rockets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Orlando Magic",
        },
      },
    ],
  },
  _401910450: {
    id: "00000000-0000-4000-8000-000401910450",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910450",
    startsAt: "2027-01-30T02:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Minnesota Timberwolves",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Charlotte Hornets",
        },
      },
    ],
  },
  _401910451: {
    id: "00000000-0000-4000-8000-000401910451",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910451",
    startsAt: "2027-01-30T17:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Miami Heat",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Philadelphia 76ers",
        },
      },
    ],
  },
  _401910452: {
    id: "00000000-0000-4000-8000-000401910452",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910452",
    startsAt: "2027-01-30T20:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Oklahoma City Thunder",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Denver Nuggets",
        },
      },
    ],
  },
  _401910453: {
    id: "00000000-0000-4000-8000-000401910453",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910453",
    startsAt: "2027-01-30T22:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Golden State Warriors",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "San Antonio Spurs",
        },
      },
    ],
  },
  _401910454: {
    id: "00000000-0000-4000-8000-000401910454",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910454",
    startsAt: "2027-01-31T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Indiana Pacers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Washington Wizards",
        },
      },
    ],
  },
  _401910455: {
    id: "00000000-0000-4000-8000-000401910455",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910455",
    startsAt: "2027-01-31T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Cleveland Cavaliers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "New Orleans Pelicans",
        },
      },
    ],
  },
  _401910456: {
    id: "00000000-0000-4000-8000-000401910456",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910456",
    startsAt: "2027-01-31T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Milwaukee Bucks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Atlanta Hawks",
        },
      },
    ],
  },
  _401910457: {
    id: "00000000-0000-4000-8000-000401910457",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910457",
    startsAt: "2027-01-31T01:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "New York Knicks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Los Angeles Lakers",
        },
      },
    ],
  },
  _401910458: {
    id: "00000000-0000-4000-8000-000401910458",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910458",
    startsAt: "2027-01-31T02:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Utah Jazz",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Memphis Grizzlies",
        },
      },
    ],
  },
  _401910459: {
    id: "00000000-0000-4000-8000-000401910459",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910459",
    startsAt: "2027-01-31T20:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Detroit Pistons",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Sacramento Kings",
        },
      },
    ],
  },
  _401910460: {
    id: "00000000-0000-4000-8000-000401910460",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910460",
    startsAt: "2027-01-31T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Orlando Magic",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Brooklyn Nets",
        },
      },
    ],
  },
  _401910461: {
    id: "00000000-0000-4000-8000-000401910461",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910461",
    startsAt: "2027-01-31T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Toronto Raptors",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Boston Celtics",
        },
      },
    ],
  },
  _401910462: {
    id: "00000000-0000-4000-8000-000401910462",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910462",
    startsAt: "2027-01-31T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Minnesota Timberwolves",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Phoenix Suns",
        },
      },
    ],
  },
  _401910463: {
    id: "00000000-0000-4000-8000-000401910463",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910463",
    startsAt: "2027-01-31T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Oklahoma City Thunder",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Chicago Bulls",
        },
      },
    ],
  },
  _401910464: {
    id: "00000000-0000-4000-8000-000401910464",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910464",
    startsAt: "2027-02-01T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Charlotte Hornets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Los Angeles Lakers",
        },
      },
    ],
  },
  _401910465: {
    id: "00000000-0000-4000-8000-000401910465",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910465",
    startsAt: "2027-02-01T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Denver Nuggets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Portland Trail Blazers",
        },
      },
    ],
  },
  _401910466: {
    id: "00000000-0000-4000-8000-000401910466",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910466",
    startsAt: "2027-02-01T01:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Dallas Mavericks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Houston Rockets",
        },
      },
    ],
  },
  _401910467: {
    id: "00000000-0000-4000-8000-000401910467",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910467",
    startsAt: "2027-02-02T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Atlanta Hawks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Washington Wizards",
        },
      },
    ],
  },
  _401910468: {
    id: "00000000-0000-4000-8000-000401910468",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910468",
    startsAt: "2027-02-02T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Philadelphia 76ers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "New Orleans Pelicans",
        },
      },
    ],
  },
  _401910469: {
    id: "00000000-0000-4000-8000-000401910469",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910469",
    startsAt: "2027-02-02T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Brooklyn Nets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "New York Knicks",
        },
      },
    ],
  },
  _401910470: {
    id: "00000000-0000-4000-8000-000401910470",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910470",
    startsAt: "2027-02-02T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Indiana Pacers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Miami Heat",
        },
      },
    ],
  },
  _401910471: {
    id: "00000000-0000-4000-8000-000401910471",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910471",
    startsAt: "2027-02-02T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Milwaukee Bucks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Memphis Grizzlies",
        },
      },
    ],
  },
  _401910472: {
    id: "00000000-0000-4000-8000-000401910472",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910472",
    startsAt: "2027-02-02T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Utah Jazz",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Cleveland Cavaliers",
        },
      },
    ],
  },
  _401910473: {
    id: "00000000-0000-4000-8000-000401910473",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910473",
    startsAt: "2027-02-02T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Golden State Warriors",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "San Antonio Spurs",
        },
      },
    ],
  },
  _401910474: {
    id: "00000000-0000-4000-8000-000401910474",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910474",
    startsAt: "2027-02-03T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Detroit Pistons",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Chicago Bulls",
        },
      },
    ],
  },
  _401910475: {
    id: "00000000-0000-4000-8000-000401910475",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910475",
    startsAt: "2027-02-03T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Orlando Magic",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "New Orleans Pelicans",
        },
      },
    ],
  },
  _401910476: {
    id: "00000000-0000-4000-8000-000401910476",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910476",
    startsAt: "2027-02-03T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Miami Heat",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Charlotte Hornets",
        },
      },
    ],
  },
  _401910477: {
    id: "00000000-0000-4000-8000-000401910477",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910477",
    startsAt: "2027-02-03T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Boston Celtics",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Los Angeles Lakers",
        },
      },
    ],
  },
  _401910478: {
    id: "00000000-0000-4000-8000-000401910478",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910478",
    startsAt: "2027-02-03T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Dallas Mavericks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Toronto Raptors",
        },
      },
    ],
  },
  _401910479: {
    id: "00000000-0000-4000-8000-000401910479",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910479",
    startsAt: "2027-02-03T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Denver Nuggets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Oklahoma City Thunder",
        },
      },
    ],
  },
  _401910480: {
    id: "00000000-0000-4000-8000-000401910480",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910480",
    startsAt: "2027-02-03T03:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "LA Clippers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "San Antonio Spurs",
        },
      },
    ],
  },
  _401910481: {
    id: "00000000-0000-4000-8000-000401910481",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910481",
    startsAt: "2027-02-03T04:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Portland Trail Blazers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Minnesota Timberwolves",
        },
      },
    ],
  },
  _401910482: {
    id: "00000000-0000-4000-8000-000401910482",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910482",
    startsAt: "2027-02-04T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Detroit Pistons",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "New York Knicks",
        },
      },
    ],
  },
  _401910483: {
    id: "00000000-0000-4000-8000-000401910483",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910483",
    startsAt: "2027-02-04T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Indiana Pacers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Atlanta Hawks",
        },
      },
    ],
  },
  _401910484: {
    id: "00000000-0000-4000-8000-000401910484",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910484",
    startsAt: "2027-02-04T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Memphis Grizzlies",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Philadelphia 76ers",
        },
      },
    ],
  },
  _401910485: {
    id: "00000000-0000-4000-8000-000401910485",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910485",
    startsAt: "2027-02-04T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Phoenix Suns",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Cleveland Cavaliers",
        },
      },
    ],
  },
  _401910486: {
    id: "00000000-0000-4000-8000-000401910486",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910486",
    startsAt: "2027-02-04T02:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Houston Rockets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Utah Jazz",
        },
      },
    ],
  },
  _401910487: {
    id: "00000000-0000-4000-8000-000401910487",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910487",
    startsAt: "2027-02-04T03:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "LA Clippers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Golden State Warriors",
        },
      },
    ],
  },
  _401910488: {
    id: "00000000-0000-4000-8000-000401910488",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910488",
    startsAt: "2027-02-05T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Washington Wizards",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "New Orleans Pelicans",
        },
      },
    ],
  },
  _401910489: {
    id: "00000000-0000-4000-8000-000401910489",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910489",
    startsAt: "2027-02-05T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Brooklyn Nets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Los Angeles Lakers",
        },
      },
    ],
  },
  _401910490: {
    id: "00000000-0000-4000-8000-000401910490",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910490",
    startsAt: "2027-02-05T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Charlotte Hornets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Boston Celtics",
        },
      },
    ],
  },
  _401910491: {
    id: "00000000-0000-4000-8000-000401910491",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910491",
    startsAt: "2027-02-05T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Miami Heat",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Milwaukee Bucks",
        },
      },
    ],
  },
  _401910492: {
    id: "00000000-0000-4000-8000-000401910492",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910492",
    startsAt: "2027-02-05T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "New York Knicks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Toronto Raptors",
        },
      },
    ],
  },
  _401910493: {
    id: "00000000-0000-4000-8000-000401910493",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910493",
    startsAt: "2027-02-05T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Chicago Bulls",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Oklahoma City Thunder",
        },
      },
    ],
  },
  _401910494: {
    id: "00000000-0000-4000-8000-000401910494",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910494",
    startsAt: "2027-02-05T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "San Antonio Spurs",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Orlando Magic",
        },
      },
    ],
  },
  _401910495: {
    id: "00000000-0000-4000-8000-000401910495",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910495",
    startsAt: "2027-02-05T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Denver Nuggets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Dallas Mavericks",
        },
      },
    ],
  },
  _401910496: {
    id: "00000000-0000-4000-8000-000401910496",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910496",
    startsAt: "2027-02-05T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Portland Trail Blazers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Cleveland Cavaliers",
        },
      },
    ],
  },
  _401910497: {
    id: "00000000-0000-4000-8000-000401910497",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910497",
    startsAt: "2027-02-05T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Sacramento Kings",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Minnesota Timberwolves",
        },
      },
    ],
  },
  _401910498: {
    id: "00000000-0000-4000-8000-000401910498",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910498",
    startsAt: "2027-02-06T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Atlanta Hawks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Boston Celtics",
        },
      },
    ],
  },
  _401910499: {
    id: "00000000-0000-4000-8000-000401910499",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910499",
    startsAt: "2027-02-06T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Charlotte Hornets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Golden State Warriors",
        },
      },
    ],
  },
  _401910500: {
    id: "00000000-0000-4000-8000-000401910500",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910500",
    startsAt: "2027-02-06T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Philadelphia 76ers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Detroit Pistons",
        },
      },
    ],
  },
  _401910501: {
    id: "00000000-0000-4000-8000-000401910501",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910501",
    startsAt: "2027-02-06T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Denver Nuggets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "LA Clippers",
        },
      },
    ],
  },
  _401910502: {
    id: "00000000-0000-4000-8000-000401910502",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910502",
    startsAt: "2027-02-06T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Phoenix Suns",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Houston Rockets",
        },
      },
    ],
  },
  _401910503: {
    id: "00000000-0000-4000-8000-000401910503",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910503",
    startsAt: "2027-02-06T02:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Oklahoma City Thunder",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Indiana Pacers",
        },
      },
    ],
  },
  _401910504: {
    id: "00000000-0000-4000-8000-000401910504",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910504",
    startsAt: "2027-02-06T20:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Dallas Mavericks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Utah Jazz",
        },
      },
    ],
  },
  _401910505: {
    id: "00000000-0000-4000-8000-000401910505",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910505",
    startsAt: "2027-02-06T20:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Minnesota Timberwolves",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Miami Heat",
        },
      },
    ],
  },
  _401910506: {
    id: "00000000-0000-4000-8000-000401910506",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910506",
    startsAt: "2027-02-06T22:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Memphis Grizzlies",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Portland Trail Blazers",
        },
      },
    ],
  },
  _401910507: {
    id: "00000000-0000-4000-8000-000401910507",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910507",
    startsAt: "2027-02-06T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Brooklyn Nets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Washington Wizards",
        },
      },
    ],
  },
  _401910508: {
    id: "00000000-0000-4000-8000-000401910508",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910508",
    startsAt: "2027-02-07T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Cleveland Cavaliers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Orlando Magic",
        },
      },
    ],
  },
  _401910509: {
    id: "00000000-0000-4000-8000-000401910509",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910509",
    startsAt: "2027-02-07T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Toronto Raptors",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Milwaukee Bucks",
        },
      },
    ],
  },
  _401910510: {
    id: "00000000-0000-4000-8000-000401910510",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910510",
    startsAt: "2027-02-07T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Chicago Bulls",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "New Orleans Pelicans",
        },
      },
    ],
  },
  _401910511: {
    id: "00000000-0000-4000-8000-000401910511",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910511",
    startsAt: "2027-02-07T01:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "San Antonio Spurs",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Los Angeles Lakers",
        },
      },
    ],
  },
  _401910512: {
    id: "00000000-0000-4000-8000-000401910512",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910512",
    startsAt: "2027-02-07T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Sacramento Kings",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Phoenix Suns",
        },
      },
    ],
  },
  _401910513: {
    id: "00000000-0000-4000-8000-000401910513",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910513",
    startsAt: "2027-02-07T20:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Atlanta Hawks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Denver Nuggets",
        },
      },
    ],
  },
  _401910514: {
    id: "00000000-0000-4000-8000-000401910514",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910514",
    startsAt: "2027-02-07T20:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Detroit Pistons",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Golden State Warriors",
        },
      },
    ],
  },
  _401910515: {
    id: "00000000-0000-4000-8000-000401910515",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910515",
    startsAt: "2027-02-07T20:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Minnesota Timberwolves",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Utah Jazz",
        },
      },
    ],
  },
  _401910516: {
    id: "00000000-0000-4000-8000-000401910516",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910516",
    startsAt: "2027-02-07T21:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Dallas Mavericks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "LA Clippers",
        },
      },
    ],
  },
  _401910517: {
    id: "00000000-0000-4000-8000-000401910517",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910517",
    startsAt: "2027-02-07T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Toronto Raptors",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Charlotte Hornets",
        },
      },
    ],
  },
  _401910518: {
    id: "00000000-0000-4000-8000-000401910518",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910518",
    startsAt: "2027-02-08T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Philadelphia 76ers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Boston Celtics",
        },
      },
    ],
  },
  _401910519: {
    id: "00000000-0000-4000-8000-000401910519",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910519",
    startsAt: "2027-02-08T02:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Oklahoma City Thunder",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "New York Knicks",
        },
      },
    ],
  },
  _401910520: {
    id: "00000000-0000-4000-8000-000401910520",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910520",
    startsAt: "2027-02-08T03:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Sacramento Kings",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Houston Rockets",
        },
      },
    ],
  },
  _401910521: {
    id: "00000000-0000-4000-8000-000401910521",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910521",
    startsAt: "2027-02-09T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Atlanta Hawks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Miami Heat",
        },
      },
    ],
  },
  _401910522: {
    id: "00000000-0000-4000-8000-000401910522",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910522",
    startsAt: "2027-02-09T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Indiana Pacers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "New Orleans Pelicans",
        },
      },
    ],
  },
  _401910523: {
    id: "00000000-0000-4000-8000-000401910523",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910523",
    startsAt: "2027-02-09T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Philadelphia 76ers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Brooklyn Nets",
        },
      },
    ],
  },
  _401910524: {
    id: "00000000-0000-4000-8000-000401910524",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910524",
    startsAt: "2027-02-09T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Washington Wizards",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Chicago Bulls",
        },
      },
    ],
  },
  _401910525: {
    id: "00000000-0000-4000-8000-000401910525",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910525",
    startsAt: "2027-02-09T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Memphis Grizzlies",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Portland Trail Blazers",
        },
      },
    ],
  },
  _401910526: {
    id: "00000000-0000-4000-8000-000401910526",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910526",
    startsAt: "2027-02-09T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Milwaukee Bucks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Orlando Magic",
        },
      },
    ],
  },
  _401910527: {
    id: "00000000-0000-4000-8000-000401910527",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910527",
    startsAt: "2027-02-09T02:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Phoenix Suns",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Los Angeles Lakers",
        },
      },
    ],
  },
  _401910528: {
    id: "00000000-0000-4000-8000-000401910528",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910528",
    startsAt: "2027-02-10T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Cleveland Cavaliers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Toronto Raptors",
        },
      },
    ],
  },
  _401910529: {
    id: "00000000-0000-4000-8000-000401910529",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910529",
    startsAt: "2027-02-10T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Boston Celtics",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Denver Nuggets",
        },
      },
    ],
  },
  _401910530: {
    id: "00000000-0000-4000-8000-000401910530",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910530",
    startsAt: "2027-02-10T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Brooklyn Nets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Minnesota Timberwolves",
        },
      },
    ],
  },
  _401910531: {
    id: "00000000-0000-4000-8000-000401910531",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910531",
    startsAt: "2027-02-10T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "New York Knicks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Charlotte Hornets",
        },
      },
    ],
  },
  _401910532: {
    id: "00000000-0000-4000-8000-000401910532",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910532",
    startsAt: "2027-02-10T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Chicago Bulls",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Golden State Warriors",
        },
      },
    ],
  },
  _401910533: {
    id: "00000000-0000-4000-8000-000401910533",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910533",
    startsAt: "2027-02-10T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Dallas Mavericks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "San Antonio Spurs",
        },
      },
    ],
  },
  _401910534: {
    id: "00000000-0000-4000-8000-000401910534",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910534",
    startsAt: "2027-02-10T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Milwaukee Bucks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Sacramento Kings",
        },
      },
    ],
  },
  _401910535: {
    id: "00000000-0000-4000-8000-000401910535",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910535",
    startsAt: "2027-02-10T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Oklahoma City Thunder",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Portland Trail Blazers",
        },
      },
    ],
  },
  _401910536: {
    id: "00000000-0000-4000-8000-000401910536",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910536",
    startsAt: "2027-02-10T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Utah Jazz",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Houston Rockets",
        },
      },
    ],
  },
  _401910537: {
    id: "00000000-0000-4000-8000-000401910537",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910537",
    startsAt: "2027-02-10T03:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "LA Clippers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Detroit Pistons",
        },
      },
    ],
  },
  _401910538: {
    id: "00000000-0000-4000-8000-000401910538",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910538",
    startsAt: "2027-02-11T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Atlanta Hawks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "New Orleans Pelicans",
        },
      },
    ],
  },
  _401910539: {
    id: "00000000-0000-4000-8000-000401910539",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910539",
    startsAt: "2027-02-11T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Indiana Pacers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Cleveland Cavaliers",
        },
      },
    ],
  },
  _401910540: {
    id: "00000000-0000-4000-8000-000401910540",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910540",
    startsAt: "2027-02-11T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Washington Wizards",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Miami Heat",
        },
      },
    ],
  },
  _401910541: {
    id: "00000000-0000-4000-8000-000401910541",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910541",
    startsAt: "2027-02-11T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Boston Celtics",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Golden State Warriors",
        },
      },
    ],
  },
  _401910542: {
    id: "00000000-0000-4000-8000-000401910542",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910542",
    startsAt: "2027-02-11T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Memphis Grizzlies",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Orlando Magic",
        },
      },
    ],
  },
  _401910543: {
    id: "00000000-0000-4000-8000-000401910543",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910543",
    startsAt: "2027-02-11T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Phoenix Suns",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Detroit Pistons",
        },
      },
    ],
  },
  _401910544: {
    id: "00000000-0000-4000-8000-000401910544",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910544",
    startsAt: "2027-02-11T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Los Angeles Lakers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "LA Clippers",
        },
      },
    ],
  },
  _401910545: {
    id: "00000000-0000-4000-8000-000401910545",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910545",
    startsAt: "2027-02-12T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Charlotte Hornets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Milwaukee Bucks",
        },
      },
    ],
  },
  _401910546: {
    id: "00000000-0000-4000-8000-000401910546",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910546",
    startsAt: "2027-02-12T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Indiana Pacers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Utah Jazz",
        },
      },
    ],
  },
  _401910547: {
    id: "00000000-0000-4000-8000-000401910547",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910547",
    startsAt: "2027-02-12T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Philadelphia 76ers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "New York Knicks",
        },
      },
    ],
  },
  _401910548: {
    id: "00000000-0000-4000-8000-000401910548",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910548",
    startsAt: "2027-02-12T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Dallas Mavericks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Portland Trail Blazers",
        },
      },
    ],
  },
  _401910549: {
    id: "00000000-0000-4000-8000-000401910549",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910549",
    startsAt: "2027-02-12T01:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Houston Rockets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Sacramento Kings",
        },
      },
    ],
  },
  _401910550: {
    id: "00000000-0000-4000-8000-000401910550",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910550",
    startsAt: "2027-02-12T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Denver Nuggets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Chicago Bulls",
        },
      },
    ],
  },
  _401910551: {
    id: "00000000-0000-4000-8000-000401910551",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910551",
    startsAt: "2027-02-12T02:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Oklahoma City Thunder",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "San Antonio Spurs",
        },
      },
    ],
  },
  _401910552: {
    id: "00000000-0000-4000-8000-000401910552",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910552",
    startsAt: "2027-02-13T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Atlanta Hawks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Phoenix Suns",
        },
      },
    ],
  },
  _401910553: {
    id: "00000000-0000-4000-8000-000401910553",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910553",
    startsAt: "2027-02-13T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Orlando Magic",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Miami Heat",
        },
      },
    ],
  },
  _401910554: {
    id: "00000000-0000-4000-8000-000401910554",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910554",
    startsAt: "2027-02-13T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Washington Wizards",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Brooklyn Nets",
        },
      },
    ],
  },
  _401910555: {
    id: "00000000-0000-4000-8000-000401910555",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910555",
    startsAt: "2027-02-13T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Toronto Raptors",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Cleveland Cavaliers",
        },
      },
    ],
  },
  _401910556: {
    id: "00000000-0000-4000-8000-000401910556",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910556",
    startsAt: "2027-02-13T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Boston Celtics",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Minnesota Timberwolves",
        },
      },
    ],
  },
  _401910557: {
    id: "00000000-0000-4000-8000-000401910557",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910557",
    startsAt: "2027-02-13T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Memphis Grizzlies",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "LA Clippers",
        },
      },
    ],
  },
  _401910558: {
    id: "00000000-0000-4000-8000-000401910558",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910558",
    startsAt: "2027-02-13T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "New Orleans Pelicans",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Houston Rockets",
        },
      },
    ],
  },
  _401910559: {
    id: "00000000-0000-4000-8000-000401910559",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910559",
    startsAt: "2027-02-13T03:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Los Angeles Lakers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Denver Nuggets",
        },
      },
    ],
  },
  _401910560: {
    id: "00000000-0000-4000-8000-000401910560",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910560",
    startsAt: "2027-02-13T19:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Indiana Pacers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Sacramento Kings",
        },
      },
    ],
  },
  _401910561: {
    id: "00000000-0000-4000-8000-000401910561",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910561",
    startsAt: "2027-02-13T20:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Charlotte Hornets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Dallas Mavericks",
        },
      },
    ],
  },
  _401910562: {
    id: "00000000-0000-4000-8000-000401910562",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910562",
    startsAt: "2027-02-13T20:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Portland Trail Blazers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Detroit Pistons",
        },
      },
    ],
  },
  _401910563: {
    id: "00000000-0000-4000-8000-000401910563",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910563",
    startsAt: "2027-02-13T22:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Oklahoma City Thunder",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Philadelphia 76ers",
        },
      },
    ],
  },
  _401910564: {
    id: "00000000-0000-4000-8000-000401910564",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910564",
    startsAt: "2027-02-14T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Orlando Magic",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "San Antonio Spurs",
        },
      },
    ],
  },
  _401910565: {
    id: "00000000-0000-4000-8000-000401910565",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910565",
    startsAt: "2027-02-14T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Washington Wizards",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Milwaukee Bucks",
        },
      },
    ],
  },
  _401910566: {
    id: "00000000-0000-4000-8000-000401910566",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910566",
    startsAt: "2027-02-14T01:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "New York Knicks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Golden State Warriors",
        },
      },
    ],
  },
  _401910567: {
    id: "00000000-0000-4000-8000-000401910567",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910567",
    startsAt: "2027-02-14T18:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Atlanta Hawks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Sacramento Kings",
        },
      },
    ],
  },
  _401910568: {
    id: "00000000-0000-4000-8000-000401910568",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910568",
    startsAt: "2027-02-14T18:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Boston Celtics",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Toronto Raptors",
        },
      },
    ],
  },
  _401910569: {
    id: "00000000-0000-4000-8000-000401910569",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910569",
    startsAt: "2027-02-14T18:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Cleveland Cavaliers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Phoenix Suns",
        },
      },
    ],
  },
  _401910570: {
    id: "00000000-0000-4000-8000-000401910570",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910570",
    startsAt: "2027-02-14T18:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Miami Heat",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Brooklyn Nets",
        },
      },
    ],
  },
  _401910571: {
    id: "00000000-0000-4000-8000-000401910571",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910571",
    startsAt: "2027-02-14T19:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Houston Rockets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Denver Nuggets",
        },
      },
    ],
  },
  _401910572: {
    id: "00000000-0000-4000-8000-000401910572",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910572",
    startsAt: "2027-02-14T19:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "New Orleans Pelicans",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "LA Clippers",
        },
      },
    ],
  },
  _401910573: {
    id: "00000000-0000-4000-8000-000401910573",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910573",
    startsAt: "2027-02-14T20:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Portland Trail Blazers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Chicago Bulls",
        },
      },
    ],
  },
  _401909477: {
    id: "00000000-0000-4000-8000-000401909477",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909477",
    startsAt: "2027-02-15T17:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Charlotte Hornets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Minnesota Timberwolves",
        },
      },
    ],
  },
  _401909478: {
    id: "00000000-0000-4000-8000-000401909478",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909478",
    startsAt: "2027-02-15T19:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Dallas Mavericks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Philadelphia 76ers",
        },
      },
    ],
  },
  _401909479: {
    id: "00000000-0000-4000-8000-000401909479",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909479",
    startsAt: "2027-02-15T22:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Miami Heat",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "San Antonio Spurs",
        },
      },
    ],
  },
  _401910574: {
    id: "00000000-0000-4000-8000-000401910574",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910574",
    startsAt: "2027-02-16T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Washington Wizards",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Phoenix Suns",
        },
      },
    ],
  },
  _401909480: {
    id: "00000000-0000-4000-8000-000401909480",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401909480",
    startsAt: "2027-02-16T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Golden State Warriors",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Indiana Pacers",
        },
      },
    ],
  },
  _401910575: {
    id: "00000000-0000-4000-8000-000401910575",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910575",
    startsAt: "2027-02-16T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Memphis Grizzlies",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "New York Knicks",
        },
      },
    ],
  },
  _401910576: {
    id: "00000000-0000-4000-8000-000401910576",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910576",
    startsAt: "2027-02-16T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Oklahoma City Thunder",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Orlando Magic",
        },
      },
    ],
  },
  _401910577: {
    id: "00000000-0000-4000-8000-000401910577",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910577",
    startsAt: "2027-02-16T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Utah Jazz",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Detroit Pistons",
        },
      },
    ],
  },
  _401910578: {
    id: "00000000-0000-4000-8000-000401910578",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910578",
    startsAt: "2027-02-17T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Cleveland Cavaliers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Milwaukee Bucks",
        },
      },
    ],
  },
  _401910579: {
    id: "00000000-0000-4000-8000-000401910579",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910579",
    startsAt: "2027-02-17T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Atlanta Hawks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Toronto Raptors",
        },
      },
    ],
  },
  _401910580: {
    id: "00000000-0000-4000-8000-000401910580",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910580",
    startsAt: "2027-02-17T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Los Angeles Lakers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Chicago Bulls",
        },
      },
    ],
  },
  _401910581: {
    id: "00000000-0000-4000-8000-000401910581",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910581",
    startsAt: "2027-02-17T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Portland Trail Blazers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "New Orleans Pelicans",
        },
      },
    ],
  },
  _401910582: {
    id: "00000000-0000-4000-8000-000401910582",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910582",
    startsAt: "2027-02-17T04:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "LA Clippers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Houston Rockets",
        },
      },
    ],
  },
  _401910583: {
    id: "00000000-0000-4000-8000-000401910583",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910583",
    startsAt: "2027-02-18T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Charlotte Hornets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Toronto Raptors",
        },
      },
    ],
  },
  _401910584: {
    id: "00000000-0000-4000-8000-000401910584",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910584",
    startsAt: "2027-02-18T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Cleveland Cavaliers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Milwaukee Bucks",
        },
      },
    ],
  },
  _401910585: {
    id: "00000000-0000-4000-8000-000401910585",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910585",
    startsAt: "2027-02-18T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Detroit Pistons",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "New York Knicks",
        },
      },
    ],
  },
  _401910586: {
    id: "00000000-0000-4000-8000-000401910586",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910586",
    startsAt: "2027-02-18T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Orlando Magic",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Dallas Mavericks",
        },
      },
    ],
  },
  _401910587: {
    id: "00000000-0000-4000-8000-000401910587",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910587",
    startsAt: "2027-02-18T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Philadelphia 76ers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Phoenix Suns",
        },
      },
    ],
  },
  _401910588: {
    id: "00000000-0000-4000-8000-000401910588",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910588",
    startsAt: "2027-02-18T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Washington Wizards",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Miami Heat",
        },
      },
    ],
  },
  _401910589: {
    id: "00000000-0000-4000-8000-000401910589",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910589",
    startsAt: "2027-02-18T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Brooklyn Nets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Atlanta Hawks",
        },
      },
    ],
  },
  _401910590: {
    id: "00000000-0000-4000-8000-000401910590",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910590",
    startsAt: "2027-02-18T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Memphis Grizzlies",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "San Antonio Spurs",
        },
      },
    ],
  },
  _401910591: {
    id: "00000000-0000-4000-8000-000401910591",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910591",
    startsAt: "2027-02-18T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Denver Nuggets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Utah Jazz",
        },
      },
    ],
  },
  _401910592: {
    id: "00000000-0000-4000-8000-000401910592",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910592",
    startsAt: "2027-02-18T02:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Oklahoma City Thunder",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Boston Celtics",
        },
      },
    ],
  },
  _401910593: {
    id: "00000000-0000-4000-8000-000401910593",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910593",
    startsAt: "2027-02-18T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Golden State Warriors",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "New Orleans Pelicans",
        },
      },
    ],
  },
  _401910594: {
    id: "00000000-0000-4000-8000-000401910594",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910594",
    startsAt: "2027-02-18T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Sacramento Kings",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Indiana Pacers",
        },
      },
    ],
  },
  _401910595: {
    id: "00000000-0000-4000-8000-000401910595",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910595",
    startsAt: "2027-02-18T03:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "LA Clippers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Chicago Bulls",
        },
      },
    ],
  },
  _401910596: {
    id: "00000000-0000-4000-8000-000401910596",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910596",
    startsAt: "2027-02-19T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Minnesota Timberwolves",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "San Antonio Spurs",
        },
      },
    ],
  },
  _401910597: {
    id: "00000000-0000-4000-8000-000401910597",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910597",
    startsAt: "2027-02-19T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Memphis Grizzlies",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Boston Celtics",
        },
      },
    ],
  },
  _401910598: {
    id: "00000000-0000-4000-8000-000401910598",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910598",
    startsAt: "2027-02-19T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Los Angeles Lakers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Houston Rockets",
        },
      },
    ],
  },
  _401910599: {
    id: "00000000-0000-4000-8000-000401910599",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910599",
    startsAt: "2027-02-19T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Portland Trail Blazers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Indiana Pacers",
        },
      },
    ],
  },
  _401910600: {
    id: "00000000-0000-4000-8000-000401910600",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910600",
    startsAt: "2027-02-26T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Cleveland Cavaliers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Sacramento Kings",
        },
      },
    ],
  },
  _401910601: {
    id: "00000000-0000-4000-8000-000401910601",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910601",
    startsAt: "2027-02-26T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Detroit Pistons",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Miami Heat",
        },
      },
    ],
  },
  _401910602: {
    id: "00000000-0000-4000-8000-000401910602",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910602",
    startsAt: "2027-02-26T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Orlando Magic",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Charlotte Hornets",
        },
      },
    ],
  },
  _401910603: {
    id: "00000000-0000-4000-8000-000401910603",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910603",
    startsAt: "2027-02-26T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Brooklyn Nets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Philadelphia 76ers",
        },
      },
    ],
  },
  _401910604: {
    id: "00000000-0000-4000-8000-000401910604",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910604",
    startsAt: "2027-02-26T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "New York Knicks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Oklahoma City Thunder",
        },
      },
    ],
  },
  _401910605: {
    id: "00000000-0000-4000-8000-000401910605",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910605",
    startsAt: "2027-02-26T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Chicago Bulls",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Atlanta Hawks",
        },
      },
    ],
  },
  _401910606: {
    id: "00000000-0000-4000-8000-000401910606",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910606",
    startsAt: "2027-02-26T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Milwaukee Bucks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Washington Wizards",
        },
      },
    ],
  },
  _401910607: {
    id: "00000000-0000-4000-8000-000401910607",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910607",
    startsAt: "2027-02-26T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "New Orleans Pelicans",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Phoenix Suns",
        },
      },
    ],
  },
  _401910608: {
    id: "00000000-0000-4000-8000-000401910608",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910608",
    startsAt: "2027-02-26T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Golden State Warriors",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Dallas Mavericks",
        },
      },
    ],
  },
  _401910609: {
    id: "00000000-0000-4000-8000-000401910609",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910609",
    startsAt: "2027-02-26T03:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "LA Clippers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Utah Jazz",
        },
      },
    ],
  },
  _401910610: {
    id: "00000000-0000-4000-8000-000401910610",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910610",
    startsAt: "2027-02-27T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Boston Celtics",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Cleveland Cavaliers",
        },
      },
    ],
  },
  _401910611: {
    id: "00000000-0000-4000-8000-000401910611",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910611",
    startsAt: "2027-02-27T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Toronto Raptors",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Atlanta Hawks",
        },
      },
    ],
  },
  _401910612: {
    id: "00000000-0000-4000-8000-000401910612",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910612",
    startsAt: "2027-02-27T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Minnesota Timberwolves",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Indiana Pacers",
        },
      },
    ],
  },
  _401910613: {
    id: "00000000-0000-4000-8000-000401910613",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910613",
    startsAt: "2027-02-27T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "San Antonio Spurs",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Memphis Grizzlies",
        },
      },
    ],
  },
  _401910614: {
    id: "00000000-0000-4000-8000-000401910614",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910614",
    startsAt: "2027-02-27T01:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Houston Rockets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Charlotte Hornets",
        },
      },
    ],
  },
  _401910615: {
    id: "00000000-0000-4000-8000-000401910615",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910615",
    startsAt: "2027-02-27T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Denver Nuggets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Los Angeles Lakers",
        },
      },
    ],
  },
  _401910616: {
    id: "00000000-0000-4000-8000-000401910616",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910616",
    startsAt: "2027-02-27T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Portland Trail Blazers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Dallas Mavericks",
        },
      },
    ],
  },
  _401910617: {
    id: "00000000-0000-4000-8000-000401910617",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910617",
    startsAt: "2027-02-27T20:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Utah Jazz",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Washington Wizards",
        },
      },
    ],
  },
  _401910618: {
    id: "00000000-0000-4000-8000-000401910618",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910618",
    startsAt: "2027-02-27T22:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Detroit Pistons",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Oklahoma City Thunder",
        },
      },
    ],
  },
  _401910619: {
    id: "00000000-0000-4000-8000-000401910619",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910619",
    startsAt: "2027-02-28T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Chicago Bulls",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Brooklyn Nets",
        },
      },
    ],
  },
  _401910620: {
    id: "00000000-0000-4000-8000-000401910620",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910620",
    startsAt: "2027-02-28T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Memphis Grizzlies",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Sacramento Kings",
        },
      },
    ],
  },
  _401910621: {
    id: "00000000-0000-4000-8000-000401910621",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910621",
    startsAt: "2027-02-28T01:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "New York Knicks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Philadelphia 76ers",
        },
      },
    ],
  },
  _401910622: {
    id: "00000000-0000-4000-8000-000401910622",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910622",
    startsAt: "2027-02-28T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Phoenix Suns",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "New Orleans Pelicans",
        },
      },
    ],
  },
  _401910623: {
    id: "00000000-0000-4000-8000-000401910623",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910623",
    startsAt: "2027-02-28T18:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "San Antonio Spurs",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Denver Nuggets",
        },
      },
    ],
  },
  _401910624: {
    id: "00000000-0000-4000-8000-000401910624",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910624",
    startsAt: "2027-02-28T20:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Dallas Mavericks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Los Angeles Lakers",
        },
      },
    ],
  },
  _401910625: {
    id: "00000000-0000-4000-8000-000401910625",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910625",
    startsAt: "2027-02-28T21:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Indiana Pacers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Toronto Raptors",
        },
      },
    ],
  },
  _401910626: {
    id: "00000000-0000-4000-8000-000401910626",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910626",
    startsAt: "2027-02-28T21:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Orlando Magic",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Atlanta Hawks",
        },
      },
    ],
  },
  _401910627: {
    id: "00000000-0000-4000-8000-000401910627",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910627",
    startsAt: "2027-03-01T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Charlotte Hornets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Sacramento Kings",
        },
      },
    ],
  },
  _401910628: {
    id: "00000000-0000-4000-8000-000401910628",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910628",
    startsAt: "2027-03-01T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Minnesota Timberwolves",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Boston Celtics",
        },
      },
    ],
  },
  _401910629: {
    id: "00000000-0000-4000-8000-000401910629",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910629",
    startsAt: "2027-03-01T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "New York Knicks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Milwaukee Bucks",
        },
      },
    ],
  },
  _401910630: {
    id: "00000000-0000-4000-8000-000401910630",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910630",
    startsAt: "2027-03-01T02:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Houston Rockets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Miami Heat",
        },
      },
    ],
  },
  _401910631: {
    id: "00000000-0000-4000-8000-000401910631",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910631",
    startsAt: "2027-03-01T03:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "LA Clippers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Portland Trail Blazers",
        },
      },
    ],
  },
  _401910632: {
    id: "00000000-0000-4000-8000-000401910632",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910632",
    startsAt: "2027-03-02T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Cleveland Cavaliers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Philadelphia 76ers",
        },
      },
    ],
  },
  _401910633: {
    id: "00000000-0000-4000-8000-000401910633",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910633",
    startsAt: "2027-03-02T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Detroit Pistons",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Chicago Bulls",
        },
      },
    ],
  },
  _401910634: {
    id: "00000000-0000-4000-8000-000401910634",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910634",
    startsAt: "2027-03-02T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "New Orleans Pelicans",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Utah Jazz",
        },
      },
    ],
  },
  _401910635: {
    id: "00000000-0000-4000-8000-000401910635",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910635",
    startsAt: "2027-03-02T01:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Houston Rockets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Golden State Warriors",
        },
      },
    ],
  },
  _401910636: {
    id: "00000000-0000-4000-8000-000401910636",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910636",
    startsAt: "2027-03-02T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Denver Nuggets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Brooklyn Nets",
        },
      },
    ],
  },
  _401910637: {
    id: "00000000-0000-4000-8000-000401910637",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910637",
    startsAt: "2027-03-02T02:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Phoenix Suns",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Washington Wizards",
        },
      },
    ],
  },
  _401910638: {
    id: "00000000-0000-4000-8000-000401910638",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910638",
    startsAt: "2027-03-03T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Indiana Pacers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Boston Celtics",
        },
      },
    ],
  },
  _401910639: {
    id: "00000000-0000-4000-8000-000401910639",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910639",
    startsAt: "2027-03-03T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Orlando Magic",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Los Angeles Lakers",
        },
      },
    ],
  },
  _401910640: {
    id: "00000000-0000-4000-8000-000401910640",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910640",
    startsAt: "2027-03-03T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Miami Heat",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Toronto Raptors",
        },
      },
    ],
  },
  _401910641: {
    id: "00000000-0000-4000-8000-000401910641",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910641",
    startsAt: "2027-03-03T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "New York Knicks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Memphis Grizzlies",
        },
      },
    ],
  },
  _401910642: {
    id: "00000000-0000-4000-8000-000401910642",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910642",
    startsAt: "2027-03-03T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Dallas Mavericks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Golden State Warriors",
        },
      },
    ],
  },
  _401910643: {
    id: "00000000-0000-4000-8000-000401910643",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910643",
    startsAt: "2027-03-03T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Milwaukee Bucks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Detroit Pistons",
        },
      },
    ],
  },
  _401910644: {
    id: "00000000-0000-4000-8000-000401910644",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910644",
    startsAt: "2027-03-03T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Oklahoma City Thunder",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Minnesota Timberwolves",
        },
      },
    ],
  },
  _401910645: {
    id: "00000000-0000-4000-8000-000401910645",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910645",
    startsAt: "2027-03-03T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Sacramento Kings",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Washington Wizards",
        },
      },
    ],
  },
  _401910646: {
    id: "00000000-0000-4000-8000-000401910646",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910646",
    startsAt: "2027-03-03T04:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Portland Trail Blazers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "LA Clippers",
        },
      },
    ],
  },
  _401910647: {
    id: "00000000-0000-4000-8000-000401910647",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910647",
    startsAt: "2027-03-04T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Atlanta Hawks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Chicago Bulls",
        },
      },
    ],
  },
  _401910648: {
    id: "00000000-0000-4000-8000-000401910648",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910648",
    startsAt: "2027-03-04T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Philadelphia 76ers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Charlotte Hornets",
        },
      },
    ],
  },
  _401910649: {
    id: "00000000-0000-4000-8000-000401910649",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910649",
    startsAt: "2027-03-04T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Miami Heat",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Toronto Raptors",
        },
      },
    ],
  },
  _401910650: {
    id: "00000000-0000-4000-8000-000401910650",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910650",
    startsAt: "2027-03-04T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Milwaukee Bucks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Utah Jazz",
        },
      },
    ],
  },
  _401910651: {
    id: "00000000-0000-4000-8000-000401910651",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910651",
    startsAt: "2027-03-04T01:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Houston Rockets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "New Orleans Pelicans",
        },
      },
    ],
  },
  _401910652: {
    id: "00000000-0000-4000-8000-000401910652",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910652",
    startsAt: "2027-03-04T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Phoenix Suns",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Brooklyn Nets",
        },
      },
    ],
  },
  _401910653: {
    id: "00000000-0000-4000-8000-000401910653",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910653",
    startsAt: "2027-03-04T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Denver Nuggets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "San Antonio Spurs",
        },
      },
    ],
  },
  _401910654: {
    id: "00000000-0000-4000-8000-000401910654",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910654",
    startsAt: "2027-03-05T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Cleveland Cavaliers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Portland Trail Blazers",
        },
      },
    ],
  },
  _401910655: {
    id: "00000000-0000-4000-8000-000401910655",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910655",
    startsAt: "2027-03-05T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Orlando Magic",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Indiana Pacers",
        },
      },
    ],
  },
  _401910656: {
    id: "00000000-0000-4000-8000-000401910656",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910656",
    startsAt: "2027-03-05T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Philadelphia 76ers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Los Angeles Lakers",
        },
      },
    ],
  },
  _401910657: {
    id: "00000000-0000-4000-8000-000401910657",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910657",
    startsAt: "2027-03-05T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Atlanta Hawks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Memphis Grizzlies",
        },
      },
    ],
  },
  _401910658: {
    id: "00000000-0000-4000-8000-000401910658",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910658",
    startsAt: "2027-03-05T02:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Dallas Mavericks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "New York Knicks",
        },
      },
    ],
  },
  _401910659: {
    id: "00000000-0000-4000-8000-000401910659",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910659",
    startsAt: "2027-03-05T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Golden State Warriors",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Washington Wizards",
        },
      },
    ],
  },
  _401910660: {
    id: "00000000-0000-4000-8000-000401910660",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910660",
    startsAt: "2027-03-05T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Sacramento Kings",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Oklahoma City Thunder",
        },
      },
    ],
  },
  _401910661: {
    id: "00000000-0000-4000-8000-000401910661",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910661",
    startsAt: "2027-03-05T03:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "LA Clippers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Brooklyn Nets",
        },
      },
    ],
  },
  _401910662: {
    id: "00000000-0000-4000-8000-000401910662",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910662",
    startsAt: "2027-03-06T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Detroit Pistons",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Boston Celtics",
        },
      },
    ],
  },
  _401910663: {
    id: "00000000-0000-4000-8000-000401910663",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910663",
    startsAt: "2027-03-06T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Orlando Magic",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Utah Jazz",
        },
      },
    ],
  },
  _401910664: {
    id: "00000000-0000-4000-8000-000401910664",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910664",
    startsAt: "2027-03-06T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Toronto Raptors",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Portland Trail Blazers",
        },
      },
    ],
  },
  _401910665: {
    id: "00000000-0000-4000-8000-000401910665",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910665",
    startsAt: "2027-03-06T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "New Orleans Pelicans",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Milwaukee Bucks",
        },
      },
    ],
  },
  _401910666: {
    id: "00000000-0000-4000-8000-000401910666",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910666",
    startsAt: "2027-03-06T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Phoenix Suns",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Minnesota Timberwolves",
        },
      },
    ],
  },
  _401910667: {
    id: "00000000-0000-4000-8000-000401910667",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910667",
    startsAt: "2027-03-06T02:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Houston Rockets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "San Antonio Spurs",
        },
      },
    ],
  },
  _401910668: {
    id: "00000000-0000-4000-8000-000401910668",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910668",
    startsAt: "2027-03-06T20:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Miami Heat",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Indiana Pacers",
        },
      },
    ],
  },
  _401910669: {
    id: "00000000-0000-4000-8000-000401910669",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910669",
    startsAt: "2027-03-06T22:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Chicago Bulls",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Charlotte Hornets",
        },
      },
    ],
  },
  _401910670: {
    id: "00000000-0000-4000-8000-000401910670",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910670",
    startsAt: "2027-03-06T22:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Cleveland Cavaliers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Atlanta Hawks",
        },
      },
    ],
  },
  _401910671: {
    id: "00000000-0000-4000-8000-000401910671",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910671",
    startsAt: "2027-03-07T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Washington Wizards",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Utah Jazz",
        },
      },
    ],
  },
  _401910672: {
    id: "00000000-0000-4000-8000-000401910672",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910672",
    startsAt: "2027-03-07T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Memphis Grizzlies",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "New Orleans Pelicans",
        },
      },
    ],
  },
  _401910673: {
    id: "00000000-0000-4000-8000-000401910673",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910673",
    startsAt: "2027-03-07T01:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Los Angeles Lakers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Oklahoma City Thunder",
        },
      },
    ],
  },
  _401910674: {
    id: "00000000-0000-4000-8000-000401910674",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910674",
    startsAt: "2027-03-07T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Sacramento Kings",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "LA Clippers",
        },
      },
    ],
  },
  _401910675: {
    id: "00000000-0000-4000-8000-000401910675",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910675",
    startsAt: "2027-03-07T18:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Boston Celtics",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Philadelphia 76ers",
        },
      },
    ],
  },
  _401910676: {
    id: "00000000-0000-4000-8000-000401910676",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910676",
    startsAt: "2027-03-07T20:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Denver Nuggets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Minnesota Timberwolves",
        },
      },
    ],
  },
  _401910677: {
    id: "00000000-0000-4000-8000-000401910677",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910677",
    startsAt: "2027-03-07T22:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Chicago Bulls",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Portland Trail Blazers",
        },
      },
    ],
  },
  _401910678: {
    id: "00000000-0000-4000-8000-000401910678",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910678",
    startsAt: "2027-03-08T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "San Antonio Spurs",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "New York Knicks",
        },
      },
    ],
  },
  _401910679: {
    id: "00000000-0000-4000-8000-000401910679",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910679",
    startsAt: "2027-03-08T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Golden State Warriors",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Houston Rockets",
        },
      },
    ],
  },
  _401910680: {
    id: "00000000-0000-4000-8000-000401910680",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910680",
    startsAt: "2027-03-08T03:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Los Angeles Lakers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Brooklyn Nets",
        },
      },
    ],
  },
  _401910681: {
    id: "00000000-0000-4000-8000-000401910681",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910681",
    startsAt: "2027-03-09T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Indiana Pacers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Charlotte Hornets",
        },
      },
    ],
  },
  _401910682: {
    id: "00000000-0000-4000-8000-000401910682",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910682",
    startsAt: "2027-03-09T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Philadelphia 76ers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Utah Jazz",
        },
      },
    ],
  },
  _401910683: {
    id: "00000000-0000-4000-8000-000401910683",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910683",
    startsAt: "2027-03-09T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Miami Heat",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Phoenix Suns",
        },
      },
    ],
  },
  _401910684: {
    id: "00000000-0000-4000-8000-000401910684",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910684",
    startsAt: "2027-03-09T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Memphis Grizzlies",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Atlanta Hawks",
        },
      },
    ],
  },
  _401910685: {
    id: "00000000-0000-4000-8000-000401910685",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910685",
    startsAt: "2027-03-09T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Minnesota Timberwolves",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "New Orleans Pelicans",
        },
      },
    ],
  },
  _401910686: {
    id: "00000000-0000-4000-8000-000401910686",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910686",
    startsAt: "2027-03-09T02:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Oklahoma City Thunder",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Dallas Mavericks",
        },
      },
    ],
  },
  _401910687: {
    id: "00000000-0000-4000-8000-000401910687",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910687",
    startsAt: "2027-03-09T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Sacramento Kings",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Denver Nuggets",
        },
      },
    ],
  },
  _401910688: {
    id: "00000000-0000-4000-8000-000401910688",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910688",
    startsAt: "2027-03-09T03:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "LA Clippers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Houston Rockets",
        },
      },
    ],
  },
  _401910689: {
    id: "00000000-0000-4000-8000-000401910689",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910689",
    startsAt: "2027-03-10T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Orlando Magic",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Phoenix Suns",
        },
      },
    ],
  },
  _401910690: {
    id: "00000000-0000-4000-8000-000401910690",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910690",
    startsAt: "2027-03-10T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Brooklyn Nets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Milwaukee Bucks",
        },
      },
    ],
  },
  _401910691: {
    id: "00000000-0000-4000-8000-000401910691",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910691",
    startsAt: "2027-03-10T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Detroit Pistons",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Cleveland Cavaliers",
        },
      },
    ],
  },
  _401910692: {
    id: "00000000-0000-4000-8000-000401910692",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910692",
    startsAt: "2027-03-10T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Chicago Bulls",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Boston Celtics",
        },
      },
    ],
  },
  _401910693: {
    id: "00000000-0000-4000-8000-000401910693",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910693",
    startsAt: "2027-03-10T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Dallas Mavericks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Memphis Grizzlies",
        },
      },
    ],
  },
  _401910694: {
    id: "00000000-0000-4000-8000-000401910694",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910694",
    startsAt: "2027-03-10T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "San Antonio Spurs",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Washington Wizards",
        },
      },
    ],
  },
  _401910695: {
    id: "00000000-0000-4000-8000-000401910695",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910695",
    startsAt: "2027-03-10T04:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Golden State Warriors",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Portland Trail Blazers",
        },
      },
    ],
  },
  _401910696: {
    id: "00000000-0000-4000-8000-000401910696",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910696",
    startsAt: "2027-03-11T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Charlotte Hornets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "New Orleans Pelicans",
        },
      },
    ],
  },
  _401910697: {
    id: "00000000-0000-4000-8000-000401910697",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910697",
    startsAt: "2027-03-11T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Miami Heat",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Orlando Magic",
        },
      },
    ],
  },
  _401910698: {
    id: "00000000-0000-4000-8000-000401910698",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910698",
    startsAt: "2027-03-11T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Toronto Raptors",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Oklahoma City Thunder",
        },
      },
    ],
  },
  _401910699: {
    id: "00000000-0000-4000-8000-000401910699",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910699",
    startsAt: "2027-03-11T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Utah Jazz",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Houston Rockets",
        },
      },
    ],
  },
  _401910700: {
    id: "00000000-0000-4000-8000-000401910700",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910700",
    startsAt: "2027-03-11T02:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Minnesota Timberwolves",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Atlanta Hawks",
        },
      },
    ],
  },
  _401910701: {
    id: "00000000-0000-4000-8000-000401910701",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910701",
    startsAt: "2027-03-11T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Portland Trail Blazers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Denver Nuggets",
        },
      },
    ],
  },
  _401910702: {
    id: "00000000-0000-4000-8000-000401910702",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910702",
    startsAt: "2027-03-11T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Sacramento Kings",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Golden State Warriors",
        },
      },
    ],
  },
  _401910703: {
    id: "00000000-0000-4000-8000-000401910703",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910703",
    startsAt: "2027-03-11T03:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "LA Clippers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "New York Knicks",
        },
      },
    ],
  },
  _401910704: {
    id: "00000000-0000-4000-8000-000401910704",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910704",
    startsAt: "2027-03-12T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Charlotte Hornets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Indiana Pacers",
        },
      },
    ],
  },
  _401910705: {
    id: "00000000-0000-4000-8000-000401910705",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910705",
    startsAt: "2027-03-12T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Detroit Pistons",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Milwaukee Bucks",
        },
      },
    ],
  },
  _401910706: {
    id: "00000000-0000-4000-8000-000401910706",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910706",
    startsAt: "2027-03-12T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Boston Celtics",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Memphis Grizzlies",
        },
      },
    ],
  },
  _401910707: {
    id: "00000000-0000-4000-8000-000401910707",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910707",
    startsAt: "2027-03-12T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "San Antonio Spurs",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Philadelphia 76ers",
        },
      },
    ],
  },
  _401910708: {
    id: "00000000-0000-4000-8000-000401910708",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910708",
    startsAt: "2027-03-12T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Atlanta Hawks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Brooklyn Nets",
        },
      },
    ],
  },
  _401910709: {
    id: "00000000-0000-4000-8000-000401910709",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910709",
    startsAt: "2027-03-12T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Chicago Bulls",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Phoenix Suns",
        },
      },
    ],
  },
  _401910710: {
    id: "00000000-0000-4000-8000-000401910710",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910710",
    startsAt: "2027-03-12T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Dallas Mavericks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Washington Wizards",
        },
      },
    ],
  },
  _401910711: {
    id: "00000000-0000-4000-8000-000401910711",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910711",
    startsAt: "2027-03-12T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Los Angeles Lakers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "New York Knicks",
        },
      },
    ],
  },
  _401910712: {
    id: "00000000-0000-4000-8000-000401910712",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910712",
    startsAt: "2027-03-12T03:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "LA Clippers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Cleveland Cavaliers",
        },
      },
    ],
  },
  _401910713: {
    id: "00000000-0000-4000-8000-000401910713",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910713",
    startsAt: "2027-03-13T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Boston Celtics",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Oklahoma City Thunder",
        },
      },
    ],
  },
  _401910714: {
    id: "00000000-0000-4000-8000-000401910714",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910714",
    startsAt: "2027-03-13T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Milwaukee Bucks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Miami Heat",
        },
      },
    ],
  },
  _401910715: {
    id: "00000000-0000-4000-8000-000401910715",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910715",
    startsAt: "2027-03-13T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "New Orleans Pelicans",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Toronto Raptors",
        },
      },
    ],
  },
  _401910716: {
    id: "00000000-0000-4000-8000-000401910716",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910716",
    startsAt: "2027-03-13T02:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Utah Jazz",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Sacramento Kings",
        },
      },
    ],
  },
  _401910717: {
    id: "00000000-0000-4000-8000-000401910717",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910717",
    startsAt: "2027-03-13T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Denver Nuggets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Golden State Warriors",
        },
      },
    ],
  },
  _401910718: {
    id: "00000000-0000-4000-8000-000401910718",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910718",
    startsAt: "2027-03-13T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Los Angeles Lakers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Cleveland Cavaliers",
        },
      },
    ],
  },
  _401910719: {
    id: "00000000-0000-4000-8000-000401910719",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910719",
    startsAt: "2027-03-13T20:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Atlanta Hawks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Orlando Magic",
        },
      },
    ],
  },
  _401910720: {
    id: "00000000-0000-4000-8000-000401910720",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910720",
    startsAt: "2027-03-13T20:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Detroit Pistons",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Brooklyn Nets",
        },
      },
    ],
  },
  _401910721: {
    id: "00000000-0000-4000-8000-000401910721",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910721",
    startsAt: "2027-03-13T22:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Houston Rockets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Indiana Pacers",
        },
      },
    ],
  },
  _401910722: {
    id: "00000000-0000-4000-8000-000401910722",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910722",
    startsAt: "2027-03-13T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Charlotte Hornets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Phoenix Suns",
        },
      },
    ],
  },
  _401910723: {
    id: "00000000-0000-4000-8000-000401910723",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910723",
    startsAt: "2027-03-14T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Chicago Bulls",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Memphis Grizzlies",
        },
      },
    ],
  },
  _401910724: {
    id: "00000000-0000-4000-8000-000401910724",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910724",
    startsAt: "2027-03-14T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Dallas Mavericks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "New Orleans Pelicans",
        },
      },
    ],
  },
  _401910725: {
    id: "00000000-0000-4000-8000-000401910725",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910725",
    startsAt: "2027-03-14T01:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Minnesota Timberwolves",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Philadelphia 76ers",
        },
      },
    ],
  },
  _401910726: {
    id: "00000000-0000-4000-8000-000401910726",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910726",
    startsAt: "2027-03-14T03:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Portland Trail Blazers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "LA Clippers",
        },
      },
    ],
  },
  _401910727: {
    id: "00000000-0000-4000-8000-000401910727",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910727",
    startsAt: "2027-03-14T16:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "New York Knicks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Boston Celtics",
        },
      },
    ],
  },
  _401910728: {
    id: "00000000-0000-4000-8000-000401910728",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910728",
    startsAt: "2027-03-14T18:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Oklahoma City Thunder",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "San Antonio Spurs",
        },
      },
    ],
  },
  _401910729: {
    id: "00000000-0000-4000-8000-000401910729",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910729",
    startsAt: "2027-03-14T21:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Toronto Raptors",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Detroit Pistons",
        },
      },
    ],
  },
  _401910730: {
    id: "00000000-0000-4000-8000-000401910730",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910730",
    startsAt: "2027-03-14T22:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Sacramento Kings",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Cleveland Cavaliers",
        },
      },
    ],
  },
  _401910731: {
    id: "00000000-0000-4000-8000-000401910731",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910731",
    startsAt: "2027-03-14T23:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Denver Nuggets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Miami Heat",
        },
      },
    ],
  },
  _401910732: {
    id: "00000000-0000-4000-8000-000401910732",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910732",
    startsAt: "2027-03-15T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Minnesota Timberwolves",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Washington Wizards",
        },
      },
    ],
  },
  _401910733: {
    id: "00000000-0000-4000-8000-000401910733",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910733",
    startsAt: "2027-03-15T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Los Angeles Lakers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Golden State Warriors",
        },
      },
    ],
  },
  _401910734: {
    id: "00000000-0000-4000-8000-000401910734",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910734",
    startsAt: "2027-03-15T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Philadelphia 76ers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Toronto Raptors",
        },
      },
    ],
  },
  _401910735: {
    id: "00000000-0000-4000-8000-000401910735",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910735",
    startsAt: "2027-03-15T23:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Brooklyn Nets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Indiana Pacers",
        },
      },
    ],
  },
  _401910736: {
    id: "00000000-0000-4000-8000-000401910736",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910736",
    startsAt: "2027-03-16T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Chicago Bulls",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Orlando Magic",
        },
      },
    ],
  },
  _401910737: {
    id: "00000000-0000-4000-8000-000401910737",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910737",
    startsAt: "2027-03-16T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Memphis Grizzlies",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Phoenix Suns",
        },
      },
    ],
  },
  _401910738: {
    id: "00000000-0000-4000-8000-000401910738",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910738",
    startsAt: "2027-03-16T01:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Dallas Mavericks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Atlanta Hawks",
        },
      },
    ],
  },
  _401910739: {
    id: "00000000-0000-4000-8000-000401910739",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910739",
    startsAt: "2027-03-16T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Washington Wizards",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "New York Knicks",
        },
      },
    ],
  },
  _401910740: {
    id: "00000000-0000-4000-8000-000401910740",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910740",
    startsAt: "2027-03-16T23:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Boston Celtics",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Sacramento Kings",
        },
      },
    ],
  },
  _401910741: {
    id: "00000000-0000-4000-8000-000401910741",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910741",
    startsAt: "2027-03-17T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Indiana Pacers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Detroit Pistons",
        },
      },
    ],
  },
  _401910742: {
    id: "00000000-0000-4000-8000-000401910742",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910742",
    startsAt: "2027-03-17T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Milwaukee Bucks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Orlando Magic",
        },
      },
    ],
  },
  _401910743: {
    id: "00000000-0000-4000-8000-000401910743",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910743",
    startsAt: "2027-03-17T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "New Orleans Pelicans",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Minnesota Timberwolves",
        },
      },
    ],
  },
  _401910744: {
    id: "00000000-0000-4000-8000-000401910744",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910744",
    startsAt: "2027-03-17T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Oklahoma City Thunder",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Charlotte Hornets",
        },
      },
    ],
  },
  _401910745: {
    id: "00000000-0000-4000-8000-000401910745",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910745",
    startsAt: "2027-03-17T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Houston Rockets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "San Antonio Spurs",
        },
      },
    ],
  },
  _401910746: {
    id: "00000000-0000-4000-8000-000401910746",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910746",
    startsAt: "2027-03-17T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Golden State Warriors",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Cleveland Cavaliers",
        },
      },
    ],
  },
  _401910747: {
    id: "00000000-0000-4000-8000-000401910747",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910747",
    startsAt: "2027-03-17T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Portland Trail Blazers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Los Angeles Lakers",
        },
      },
    ],
  },
  _401910748: {
    id: "00000000-0000-4000-8000-000401910748",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910748",
    startsAt: "2027-03-17T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "LA Clippers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Denver Nuggets",
        },
      },
    ],
  },
  _401910749: {
    id: "00000000-0000-4000-8000-000401910749",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910749",
    startsAt: "2027-03-17T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Philadelphia 76ers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Chicago Bulls",
        },
      },
    ],
  },
  _401910750: {
    id: "00000000-0000-4000-8000-000401910750",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910750",
    startsAt: "2027-03-17T23:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "New York Knicks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Sacramento Kings",
        },
      },
    ],
  },
  _401910751: {
    id: "00000000-0000-4000-8000-000401910751",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910751",
    startsAt: "2027-03-17T23:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Oklahoma City Thunder",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Dallas Mavericks",
        },
      },
    ],
  },
  _401910752: {
    id: "00000000-0000-4000-8000-000401910752",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910752",
    startsAt: "2027-03-18T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Houston Rockets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Brooklyn Nets",
        },
      },
    ],
  },
  _401910753: {
    id: "00000000-0000-4000-8000-000401910753",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910753",
    startsAt: "2027-03-18T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Utah Jazz",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Atlanta Hawks",
        },
      },
    ],
  },
  _401910754: {
    id: "00000000-0000-4000-8000-000401910754",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910754",
    startsAt: "2027-03-18T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Golden State Warriors",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Memphis Grizzlies",
        },
      },
    ],
  },
  _401910755: {
    id: "00000000-0000-4000-8000-000401910755",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910755",
    startsAt: "2027-03-18T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Los Angeles Lakers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Phoenix Suns",
        },
      },
    ],
  },
  _401910756: {
    id: "00000000-0000-4000-8000-000401910756",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910756",
    startsAt: "2027-03-18T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Portland Trail Blazers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Miami Heat",
        },
      },
    ],
  },
  _401910757: {
    id: "00000000-0000-4000-8000-000401910757",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910757",
    startsAt: "2027-03-18T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Indiana Pacers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Toronto Raptors",
        },
      },
    ],
  },
  _401910758: {
    id: "00000000-0000-4000-8000-000401910758",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910758",
    startsAt: "2027-03-18T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Washington Wizards",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Philadelphia 76ers",
        },
      },
    ],
  },
  _401910759: {
    id: "00000000-0000-4000-8000-000401910759",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910759",
    startsAt: "2027-03-18T23:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Boston Celtics",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Orlando Magic",
        },
      },
    ],
  },
  _401910760: {
    id: "00000000-0000-4000-8000-000401910760",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910760",
    startsAt: "2027-03-19T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Milwaukee Bucks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Detroit Pistons",
        },
      },
    ],
  },
  _401910761: {
    id: "00000000-0000-4000-8000-000401910761",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910761",
    startsAt: "2027-03-19T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "New Orleans Pelicans",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Charlotte Hornets",
        },
      },
    ],
  },
  _401910762: {
    id: "00000000-0000-4000-8000-000401910762",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910762",
    startsAt: "2027-03-19T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "San Antonio Spurs",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Brooklyn Nets",
        },
      },
    ],
  },
  _401910763: {
    id: "00000000-0000-4000-8000-000401910763",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910763",
    startsAt: "2027-03-19T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Denver Nuggets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Cleveland Cavaliers",
        },
      },
    ],
  },
  _401910764: {
    id: "00000000-0000-4000-8000-000401910764",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910764",
    startsAt: "2027-03-19T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Utah Jazz",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Minnesota Timberwolves",
        },
      },
    ],
  },
  _401910765: {
    id: "00000000-0000-4000-8000-000401910765",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910765",
    startsAt: "2027-03-19T02:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "LA Clippers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Memphis Grizzlies",
        },
      },
    ],
  },
  _401910766: {
    id: "00000000-0000-4000-8000-000401910766",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910766",
    startsAt: "2027-03-19T23:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Toronto Raptors",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Sacramento Kings",
        },
      },
    ],
  },
  _401910767: {
    id: "00000000-0000-4000-8000-000401910767",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910767",
    startsAt: "2027-03-20T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "New Orleans Pelicans",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Houston Rockets",
        },
      },
    ],
  },
  _401910768: {
    id: "00000000-0000-4000-8000-000401910768",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910768",
    startsAt: "2027-03-20T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "San Antonio Spurs",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Dallas Mavericks",
        },
      },
    ],
  },
  _401910769: {
    id: "00000000-0000-4000-8000-000401910769",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910769",
    startsAt: "2027-03-20T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Golden State Warriors",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Portland Trail Blazers",
        },
      },
    ],
  },
  _401910770: {
    id: "00000000-0000-4000-8000-000401910770",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910770",
    startsAt: "2027-03-20T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Los Angeles Lakers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Atlanta Hawks",
        },
      },
    ],
  },
  _401910771: {
    id: "00000000-0000-4000-8000-000401910771",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910771",
    startsAt: "2027-03-20T02:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Phoenix Suns",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Miami Heat",
        },
      },
    ],
  },
  _401910772: {
    id: "00000000-0000-4000-8000-000401910772",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910772",
    startsAt: "2027-03-20T17:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "New York Knicks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Washington Wizards",
        },
      },
    ],
  },
  _401910773: {
    id: "00000000-0000-4000-8000-000401910773",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910773",
    startsAt: "2027-03-20T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Orlando Magic",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Denver Nuggets",
        },
      },
    ],
  },
  _401910774: {
    id: "00000000-0000-4000-8000-000401910774",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910774",
    startsAt: "2027-03-20T23:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Cleveland Cavaliers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Chicago Bulls",
        },
      },
    ],
  },
  _401910775: {
    id: "00000000-0000-4000-8000-000401910775",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910775",
    startsAt: "2027-03-21T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Detroit Pistons",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Charlotte Hornets",
        },
      },
    ],
  },
  _401910776: {
    id: "00000000-0000-4000-8000-000401910776",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910776",
    startsAt: "2027-03-21T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Memphis Grizzlies",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Oklahoma City Thunder",
        },
      },
    ],
  },
  _401910777: {
    id: "00000000-0000-4000-8000-000401910777",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910777",
    startsAt: "2027-03-21T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Milwaukee Bucks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Indiana Pacers",
        },
      },
    ],
  },
  _401910778: {
    id: "00000000-0000-4000-8000-000401910778",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910778",
    startsAt: "2027-03-21T02:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "LA Clippers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Atlanta Hawks",
        },
      },
    ],
  },
  _401910779: {
    id: "00000000-0000-4000-8000-000401910779",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910779",
    startsAt: "2027-03-21T19:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Boston Celtics",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "New Orleans Pelicans",
        },
      },
    ],
  },
  _401910780: {
    id: "00000000-0000-4000-8000-000401910780",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910780",
    startsAt: "2027-03-21T19:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Brooklyn Nets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Sacramento Kings",
        },
      },
    ],
  },
  _401910781: {
    id: "00000000-0000-4000-8000-000401910781",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910781",
    startsAt: "2027-03-21T21:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Utah Jazz",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Toronto Raptors",
        },
      },
    ],
  },
  _401910782: {
    id: "00000000-0000-4000-8000-000401910782",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910782",
    startsAt: "2027-03-21T21:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Phoenix Suns",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Portland Trail Blazers",
        },
      },
    ],
  },
  _401910783: {
    id: "00000000-0000-4000-8000-000401910783",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910783",
    startsAt: "2027-03-21T22:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Miami Heat",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Denver Nuggets",
        },
      },
    ],
  },
  _401910784: {
    id: "00000000-0000-4000-8000-000401910784",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910784",
    startsAt: "2027-03-21T23:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Philadelphia 76ers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "San Antonio Spurs",
        },
      },
    ],
  },
  _401910785: {
    id: "00000000-0000-4000-8000-000401910785",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910785",
    startsAt: "2027-03-22T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Los Angeles Lakers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Dallas Mavericks",
        },
      },
    ],
  },
  _401910786: {
    id: "00000000-0000-4000-8000-000401910786",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910786",
    startsAt: "2027-03-22T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Cleveland Cavaliers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Houston Rockets",
        },
      },
    ],
  },
  _401910787: {
    id: "00000000-0000-4000-8000-000401910787",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910787",
    startsAt: "2027-03-22T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Orlando Magic",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Indiana Pacers",
        },
      },
    ],
  },
  _401910788: {
    id: "00000000-0000-4000-8000-000401910788",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910788",
    startsAt: "2027-03-23T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Chicago Bulls",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Sacramento Kings",
        },
      },
    ],
  },
  _401910789: {
    id: "00000000-0000-4000-8000-000401910789",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910789",
    startsAt: "2027-03-23T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Memphis Grizzlies",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Charlotte Hornets",
        },
      },
    ],
  },
  _401910790: {
    id: "00000000-0000-4000-8000-000401910790",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910790",
    startsAt: "2027-03-23T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Milwaukee Bucks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Washington Wizards",
        },
      },
    ],
  },
  _401910791: {
    id: "00000000-0000-4000-8000-000401910791",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910791",
    startsAt: "2027-03-23T01:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Minnesota Timberwolves",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Detroit Pistons",
        },
      },
    ],
  },
  _401910792: {
    id: "00000000-0000-4000-8000-000401910792",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910792",
    startsAt: "2027-03-23T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Golden State Warriors",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Atlanta Hawks",
        },
      },
    ],
  },
  _401910793: {
    id: "00000000-0000-4000-8000-000401910793",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910793",
    startsAt: "2027-03-23T02:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "LA Clippers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Dallas Mavericks",
        },
      },
    ],
  },
  _401910794: {
    id: "00000000-0000-4000-8000-000401910794",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910794",
    startsAt: "2027-03-23T23:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Brooklyn Nets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Boston Celtics",
        },
      },
    ],
  },
  _401910795: {
    id: "00000000-0000-4000-8000-000401910795",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910795",
    startsAt: "2027-03-23T23:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "New York Knicks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "New Orleans Pelicans",
        },
      },
    ],
  },
  _401910796: {
    id: "00000000-0000-4000-8000-000401910796",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910796",
    startsAt: "2027-03-24T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Miami Heat",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Los Angeles Lakers",
        },
      },
    ],
  },
  _401910797: {
    id: "00000000-0000-4000-8000-000401910797",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910797",
    startsAt: "2027-03-24T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Utah Jazz",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Philadelphia 76ers",
        },
      },
    ],
  },
  _401910798: {
    id: "00000000-0000-4000-8000-000401910798",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910798",
    startsAt: "2027-03-24T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Portland Trail Blazers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Toronto Raptors",
        },
      },
    ],
  },
  _401910799: {
    id: "00000000-0000-4000-8000-000401910799",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910799",
    startsAt: "2027-03-24T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Phoenix Suns",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Oklahoma City Thunder",
        },
      },
    ],
  },
  _401910800: {
    id: "00000000-0000-4000-8000-000401910800",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910800",
    startsAt: "2027-03-24T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Charlotte Hornets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Detroit Pistons",
        },
      },
    ],
  },
  _401910801: {
    id: "00000000-0000-4000-8000-000401910801",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910801",
    startsAt: "2027-03-24T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Indiana Pacers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Memphis Grizzlies",
        },
      },
    ],
  },
  _401910802: {
    id: "00000000-0000-4000-8000-000401910802",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910802",
    startsAt: "2027-03-24T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Washington Wizards",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Denver Nuggets",
        },
      },
    ],
  },
  _401910803: {
    id: "00000000-0000-4000-8000-000401910803",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910803",
    startsAt: "2027-03-24T23:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Boston Celtics",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "San Antonio Spurs",
        },
      },
    ],
  },
  _401910804: {
    id: "00000000-0000-4000-8000-000401910804",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910804",
    startsAt: "2027-03-24T23:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "New York Knicks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Houston Rockets",
        },
      },
    ],
  },
  _401910805: {
    id: "00000000-0000-4000-8000-000401910805",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910805",
    startsAt: "2027-03-25T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Chicago Bulls",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Orlando Magic",
        },
      },
    ],
  },
  _401910806: {
    id: "00000000-0000-4000-8000-000401910806",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910806",
    startsAt: "2027-03-25T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Minnesota Timberwolves",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Dallas Mavericks",
        },
      },
    ],
  },
  _401910807: {
    id: "00000000-0000-4000-8000-000401910807",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910807",
    startsAt: "2027-03-25T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Golden State Warriors",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Philadelphia 76ers",
        },
      },
    ],
  },
  _401910808: {
    id: "00000000-0000-4000-8000-000401910808",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910808",
    startsAt: "2027-03-25T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Phoenix Suns",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Oklahoma City Thunder",
        },
      },
    ],
  },
  _401910809: {
    id: "00000000-0000-4000-8000-000401910809",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910809",
    startsAt: "2027-03-25T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Sacramento Kings",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Atlanta Hawks",
        },
      },
    ],
  },
  _401910810: {
    id: "00000000-0000-4000-8000-000401910810",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910810",
    startsAt: "2027-03-25T02:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "LA Clippers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Milwaukee Bucks",
        },
      },
    ],
  },
  _401910811: {
    id: "00000000-0000-4000-8000-000401910811",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910811",
    startsAt: "2027-03-25T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Cleveland Cavaliers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Los Angeles Lakers",
        },
      },
    ],
  },
  _401910812: {
    id: "00000000-0000-4000-8000-000401910812",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910812",
    startsAt: "2027-03-25T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Detroit Pistons",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Houston Rockets",
        },
      },
    ],
  },
  _401910813: {
    id: "00000000-0000-4000-8000-000401910813",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910813",
    startsAt: "2027-03-25T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Indiana Pacers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "San Antonio Spurs",
        },
      },
    ],
  },
  _401910814: {
    id: "00000000-0000-4000-8000-000401910814",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910814",
    startsAt: "2027-03-25T23:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Brooklyn Nets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Denver Nuggets",
        },
      },
    ],
  },
  _401910815: {
    id: "00000000-0000-4000-8000-000401910815",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910815",
    startsAt: "2027-03-25T23:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Miami Heat",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Utah Jazz",
        },
      },
    ],
  },
  _401910816: {
    id: "00000000-0000-4000-8000-000401910816",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910816",
    startsAt: "2027-03-26T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Memphis Grizzlies",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Chicago Bulls",
        },
      },
    ],
  },
  _401910817: {
    id: "00000000-0000-4000-8000-000401910817",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910817",
    startsAt: "2027-03-26T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Golden State Warriors",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Toronto Raptors",
        },
      },
    ],
  },
  _401910818: {
    id: "00000000-0000-4000-8000-000401910818",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910818",
    startsAt: "2027-03-26T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Charlotte Hornets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "New York Knicks",
        },
      },
    ],
  },
  _401910819: {
    id: "00000000-0000-4000-8000-000401910819",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910819",
    startsAt: "2027-03-27T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Dallas Mavericks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "New Orleans Pelicans",
        },
      },
    ],
  },
  _401910820: {
    id: "00000000-0000-4000-8000-000401910820",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910820",
    startsAt: "2027-03-27T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Minnesota Timberwolves",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Orlando Magic",
        },
      },
    ],
  },
  _401910821: {
    id: "00000000-0000-4000-8000-000401910821",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910821",
    startsAt: "2027-03-27T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Oklahoma City Thunder",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "LA Clippers",
        },
      },
    ],
  },
  _401910822: {
    id: "00000000-0000-4000-8000-000401910822",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910822",
    startsAt: "2027-03-27T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Phoenix Suns",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Milwaukee Bucks",
        },
      },
    ],
  },
  _401910823: {
    id: "00000000-0000-4000-8000-000401910823",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910823",
    startsAt: "2027-03-27T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Portland Trail Blazers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Philadelphia 76ers",
        },
      },
    ],
  },
  _401910824: {
    id: "00000000-0000-4000-8000-000401910824",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910824",
    startsAt: "2027-03-27T19:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Detroit Pistons",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "San Antonio Spurs",
        },
      },
    ],
  },
  _401910825: {
    id: "00000000-0000-4000-8000-000401910825",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910825",
    startsAt: "2027-03-27T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Atlanta Hawks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Utah Jazz",
        },
      },
    ],
  },
  _401910826: {
    id: "00000000-0000-4000-8000-000401910826",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910826",
    startsAt: "2027-03-27T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Washington Wizards",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Golden State Warriors",
        },
      },
    ],
  },
  _401910827: {
    id: "00000000-0000-4000-8000-000401910827",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910827",
    startsAt: "2027-03-28T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Miami Heat",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Boston Celtics",
        },
      },
    ],
  },
  _401910828: {
    id: "00000000-0000-4000-8000-000401910828",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910828",
    startsAt: "2027-03-28T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Chicago Bulls",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "LA Clippers",
        },
      },
    ],
  },
  _401910829: {
    id: "00000000-0000-4000-8000-000401910829",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910829",
    startsAt: "2027-03-28T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Portland Trail Blazers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Milwaukee Bucks",
        },
      },
    ],
  },
  _401910830: {
    id: "00000000-0000-4000-8000-000401910830",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910830",
    startsAt: "2027-03-28T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Sacramento Kings",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Toronto Raptors",
        },
      },
    ],
  },
  _401910831: {
    id: "00000000-0000-4000-8000-000401910831",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910831",
    startsAt: "2027-03-28T16:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Orlando Magic",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "New York Knicks",
        },
      },
    ],
  },
  _401910832: {
    id: "00000000-0000-4000-8000-000401910832",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910832",
    startsAt: "2027-03-28T19:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Brooklyn Nets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Memphis Grizzlies",
        },
      },
    ],
  },
  _401910833: {
    id: "00000000-0000-4000-8000-000401910833",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910833",
    startsAt: "2027-03-28T19:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Houston Rockets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Los Angeles Lakers",
        },
      },
    ],
  },
  _401910834: {
    id: "00000000-0000-4000-8000-000401910834",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910834",
    startsAt: "2027-03-28T22:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Charlotte Hornets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Utah Jazz",
        },
      },
    ],
  },
  _401910835: {
    id: "00000000-0000-4000-8000-000401910835",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910835",
    startsAt: "2027-03-28T22:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Washington Wizards",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Dallas Mavericks",
        },
      },
    ],
  },
  _401910836: {
    id: "00000000-0000-4000-8000-000401910836",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910836",
    startsAt: "2027-03-28T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "New Orleans Pelicans",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Boston Celtics",
        },
      },
    ],
  },
  _401910837: {
    id: "00000000-0000-4000-8000-000401910837",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910837",
    startsAt: "2027-03-28T23:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Minnesota Timberwolves",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Oklahoma City Thunder",
        },
      },
    ],
  },
  _401910838: {
    id: "00000000-0000-4000-8000-000401910838",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910838",
    startsAt: "2027-03-29T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Phoenix Suns",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Toronto Raptors",
        },
      },
    ],
  },
  _401910839: {
    id: "00000000-0000-4000-8000-000401910839",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910839",
    startsAt: "2027-03-29T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Denver Nuggets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Philadelphia 76ers",
        },
      },
    ],
  },
  _401910840: {
    id: "00000000-0000-4000-8000-000401910840",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910840",
    startsAt: "2027-03-29T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Atlanta Hawks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Minnesota Timberwolves",
        },
      },
    ],
  },
  _401910841: {
    id: "00000000-0000-4000-8000-000401910841",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910841",
    startsAt: "2027-03-29T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Cleveland Cavaliers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Miami Heat",
        },
      },
    ],
  },
  _401910842: {
    id: "00000000-0000-4000-8000-000401910842",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910842",
    startsAt: "2027-03-29T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Detroit Pistons",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "LA Clippers",
        },
      },
    ],
  },
  _401910843: {
    id: "00000000-0000-4000-8000-000401910843",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910843",
    startsAt: "2027-03-29T23:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Brooklyn Nets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Golden State Warriors",
        },
      },
    ],
  },
  _401910844: {
    id: "00000000-0000-4000-8000-000401910844",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910844",
    startsAt: "2027-03-30T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Chicago Bulls",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Indiana Pacers",
        },
      },
    ],
  },
  _401910845: {
    id: "00000000-0000-4000-8000-000401910845",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910845",
    startsAt: "2027-03-30T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Milwaukee Bucks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Dallas Mavericks",
        },
      },
    ],
  },
  _401910846: {
    id: "00000000-0000-4000-8000-000401910846",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910846",
    startsAt: "2027-03-30T01:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "San Antonio Spurs",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Phoenix Suns",
        },
      },
    ],
  },
  _401910847: {
    id: "00000000-0000-4000-8000-000401910847",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910847",
    startsAt: "2027-03-30T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Sacramento Kings",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Denver Nuggets",
        },
      },
    ],
  },
  _401910848: {
    id: "00000000-0000-4000-8000-000401910848",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910848",
    startsAt: "2027-03-30T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Charlotte Hornets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Miami Heat",
        },
      },
    ],
  },
  _401910849: {
    id: "00000000-0000-4000-8000-000401910849",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910849",
    startsAt: "2027-03-31T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Indiana Pacers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Boston Celtics",
        },
      },
    ],
  },
  _401910850: {
    id: "00000000-0000-4000-8000-000401910850",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910850",
    startsAt: "2027-03-31T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Orlando Magic",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "New York Knicks",
        },
      },
    ],
  },
  _401910851: {
    id: "00000000-0000-4000-8000-000401910851",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910851",
    startsAt: "2027-03-31T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Memphis Grizzlies",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Los Angeles Lakers",
        },
      },
    ],
  },
  _401910852: {
    id: "00000000-0000-4000-8000-000401910852",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910852",
    startsAt: "2027-03-31T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Utah Jazz",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Oklahoma City Thunder",
        },
      },
    ],
  },
  _401910853: {
    id: "00000000-0000-4000-8000-000401910853",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910853",
    startsAt: "2027-03-31T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Portland Trail Blazers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Houston Rockets",
        },
      },
    ],
  },
  _401910854: {
    id: "00000000-0000-4000-8000-000401910854",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910854",
    startsAt: "2027-03-31T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Atlanta Hawks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "LA Clippers",
        },
      },
    ],
  },
  _401910855: {
    id: "00000000-0000-4000-8000-000401910855",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910855",
    startsAt: "2027-03-31T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Detroit Pistons",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Toronto Raptors",
        },
      },
    ],
  },
  _401910856: {
    id: "00000000-0000-4000-8000-000401910856",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910856",
    startsAt: "2027-03-31T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Philadelphia 76ers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Golden State Warriors",
        },
      },
    ],
  },
  _401910857: {
    id: "00000000-0000-4000-8000-000401910857",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910857",
    startsAt: "2027-03-31T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Washington Wizards",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Chicago Bulls",
        },
      },
    ],
  },
  _401910858: {
    id: "00000000-0000-4000-8000-000401910858",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910858",
    startsAt: "2027-03-31T23:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Brooklyn Nets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Cleveland Cavaliers",
        },
      },
    ],
  },
  _401910859: {
    id: "00000000-0000-4000-8000-000401910859",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910859",
    startsAt: "2027-04-01T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Milwaukee Bucks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "New Orleans Pelicans",
        },
      },
    ],
  },
  _401910860: {
    id: "00000000-0000-4000-8000-000401910860",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910860",
    startsAt: "2027-04-01T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Minnesota Timberwolves",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Sacramento Kings",
        },
      },
    ],
  },
  _401910861: {
    id: "00000000-0000-4000-8000-000401910861",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910861",
    startsAt: "2027-04-01T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "San Antonio Spurs",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Phoenix Suns",
        },
      },
    ],
  },
  _401910862: {
    id: "00000000-0000-4000-8000-000401910862",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910862",
    startsAt: "2027-04-01T01:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Dallas Mavericks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Denver Nuggets",
        },
      },
    ],
  },
  _401910863: {
    id: "00000000-0000-4000-8000-000401910863",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910863",
    startsAt: "2027-04-01T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Portland Trail Blazers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Houston Rockets",
        },
      },
    ],
  },
  _401910864: {
    id: "00000000-0000-4000-8000-000401910864",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910864",
    startsAt: "2027-04-01T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Cleveland Cavaliers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Boston Celtics",
        },
      },
    ],
  },
  _401910865: {
    id: "00000000-0000-4000-8000-000401910865",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910865",
    startsAt: "2027-04-01T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Indiana Pacers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Orlando Magic",
        },
      },
    ],
  },
  _401910866: {
    id: "00000000-0000-4000-8000-000401910866",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910866",
    startsAt: "2027-04-01T23:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "New York Knicks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Charlotte Hornets",
        },
      },
    ],
  },
  _401910867: {
    id: "00000000-0000-4000-8000-000401910867",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910867",
    startsAt: "2027-04-02T01:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Oklahoma City Thunder",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Los Angeles Lakers",
        },
      },
    ],
  },
  _401910868: {
    id: "00000000-0000-4000-8000-000401910868",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910868",
    startsAt: "2027-04-02T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Washington Wizards",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Philadelphia 76ers",
        },
      },
    ],
  },
  _401910869: {
    id: "00000000-0000-4000-8000-000401910869",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910869",
    startsAt: "2027-04-02T23:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Boston Celtics",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Miami Heat",
        },
      },
    ],
  },
  _401910870: {
    id: "00000000-0000-4000-8000-000401910870",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910870",
    startsAt: "2027-04-02T23:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Brooklyn Nets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "New York Knicks",
        },
      },
    ],
  },
  _401910871: {
    id: "00000000-0000-4000-8000-000401910871",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910871",
    startsAt: "2027-04-02T23:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Minnesota Timberwolves",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Golden State Warriors",
        },
      },
    ],
  },
  _401910872: {
    id: "00000000-0000-4000-8000-000401910872",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910872",
    startsAt: "2027-04-03T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Chicago Bulls",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Detroit Pistons",
        },
      },
    ],
  },
  _401910873: {
    id: "00000000-0000-4000-8000-000401910873",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910873",
    startsAt: "2027-04-03T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Dallas Mavericks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Sacramento Kings",
        },
      },
    ],
  },
  _401910874: {
    id: "00000000-0000-4000-8000-000401910874",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910874",
    startsAt: "2027-04-03T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Milwaukee Bucks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Charlotte Hornets",
        },
      },
    ],
  },
  _401910875: {
    id: "00000000-0000-4000-8000-000401910875",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910875",
    startsAt: "2027-04-03T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Toronto Raptors",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Atlanta Hawks",
        },
      },
    ],
  },
  _401910876: {
    id: "00000000-0000-4000-8000-000401910876",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910876",
    startsAt: "2027-04-03T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Houston Rockets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Memphis Grizzlies",
        },
      },
    ],
  },
  _401910877: {
    id: "00000000-0000-4000-8000-000401910877",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910877",
    startsAt: "2027-04-03T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Phoenix Suns",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Denver Nuggets",
        },
      },
    ],
  },
  _401910878: {
    id: "00000000-0000-4000-8000-000401910878",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910878",
    startsAt: "2027-04-03T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Portland Trail Blazers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Utah Jazz",
        },
      },
    ],
  },
  _401910879: {
    id: "00000000-0000-4000-8000-000401910879",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910879",
    startsAt: "2027-04-03T02:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "LA Clippers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "San Antonio Spurs",
        },
      },
    ],
  },
  _401910880: {
    id: "00000000-0000-4000-8000-000401910880",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910880",
    startsAt: "2027-04-03T21:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Oklahoma City Thunder",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "New Orleans Pelicans",
        },
      },
    ],
  },
  _401910881: {
    id: "00000000-0000-4000-8000-000401910881",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910881",
    startsAt: "2027-04-03T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Orlando Magic",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Washington Wizards",
        },
      },
    ],
  },
  _401910882: {
    id: "00000000-0000-4000-8000-000401910882",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910882",
    startsAt: "2027-04-04T17:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Philadelphia 76ers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Atlanta Hawks",
        },
      },
    ],
  },
  _401910883: {
    id: "00000000-0000-4000-8000-000401910883",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910883",
    startsAt: "2027-04-04T18:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Milwaukee Bucks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Brooklyn Nets",
        },
      },
    ],
  },
  _401910884: {
    id: "00000000-0000-4000-8000-000401910884",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910884",
    startsAt: "2027-04-04T19:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Cleveland Cavaliers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Charlotte Hornets",
        },
      },
    ],
  },
  _401910885: {
    id: "00000000-0000-4000-8000-000401910885",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910885",
    startsAt: "2027-04-04T19:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Detroit Pistons",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Miami Heat",
        },
      },
    ],
  },
  _401910886: {
    id: "00000000-0000-4000-8000-000401910886",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910886",
    startsAt: "2027-04-04T19:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Dallas Mavericks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Minnesota Timberwolves",
        },
      },
    ],
  },
  _401910887: {
    id: "00000000-0000-4000-8000-000401910887",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910887",
    startsAt: "2027-04-04T19:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Toronto Raptors",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Indiana Pacers",
        },
      },
    ],
  },
  _401910888: {
    id: "00000000-0000-4000-8000-000401910888",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910888",
    startsAt: "2027-04-04T20:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Houston Rockets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Chicago Bulls",
        },
      },
    ],
  },
  _401910889: {
    id: "00000000-0000-4000-8000-000401910889",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910889",
    startsAt: "2027-04-04T20:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "LA Clippers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Phoenix Suns",
        },
      },
    ],
  },
  _401910890: {
    id: "00000000-0000-4000-8000-000401910890",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910890",
    startsAt: "2027-04-04T21:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Denver Nuggets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Memphis Grizzlies",
        },
      },
    ],
  },
  _401910891: {
    id: "00000000-0000-4000-8000-000401910891",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910891",
    startsAt: "2027-04-04T21:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Utah Jazz",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Portland Trail Blazers",
        },
      },
    ],
  },
  _401910892: {
    id: "00000000-0000-4000-8000-000401910892",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910892",
    startsAt: "2027-04-04T22:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Sacramento Kings",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Golden State Warriors",
        },
      },
    ],
  },
  _401910893: {
    id: "00000000-0000-4000-8000-000401910893",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910893",
    startsAt: "2027-04-04T23:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "New York Knicks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Boston Celtics",
        },
      },
    ],
  },
  _401910894: {
    id: "00000000-0000-4000-8000-000401910894",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910894",
    startsAt: "2027-04-05T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Los Angeles Lakers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "San Antonio Spurs",
        },
      },
    ],
  },
  _401910895: {
    id: "00000000-0000-4000-8000-000401910895",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910895",
    startsAt: "2027-04-05T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Cleveland Cavaliers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Brooklyn Nets",
        },
      },
    ],
  },
  _401910896: {
    id: "00000000-0000-4000-8000-000401910896",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910896",
    startsAt: "2027-04-05T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Orlando Magic",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Miami Heat",
        },
      },
    ],
  },
  _401910897: {
    id: "00000000-0000-4000-8000-000401910897",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910897",
    startsAt: "2027-04-06T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "New Orleans Pelicans",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Washington Wizards",
        },
      },
    ],
  },
  _401910898: {
    id: "00000000-0000-4000-8000-000401910898",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910898",
    startsAt: "2027-04-06T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Charlotte Hornets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Indiana Pacers",
        },
      },
    ],
  },
  _401910899: {
    id: "00000000-0000-4000-8000-000401910899",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910899",
    startsAt: "2027-04-06T23:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Toronto Raptors",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Philadelphia 76ers",
        },
      },
    ],
  },
  _401910900: {
    id: "00000000-0000-4000-8000-000401910900",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910900",
    startsAt: "2027-04-07T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Atlanta Hawks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "New York Knicks",
        },
      },
    ],
  },
  _401910901: {
    id: "00000000-0000-4000-8000-000401910901",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910901",
    startsAt: "2027-04-07T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Memphis Grizzlies",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Detroit Pistons",
        },
      },
    ],
  },
  _401910902: {
    id: "00000000-0000-4000-8000-000401910902",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910902",
    startsAt: "2027-04-07T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Milwaukee Bucks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Chicago Bulls",
        },
      },
    ],
  },
  _401910903: {
    id: "00000000-0000-4000-8000-000401910903",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910903",
    startsAt: "2027-04-07T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "San Antonio Spurs",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Sacramento Kings",
        },
      },
    ],
  },
  _401910904: {
    id: "00000000-0000-4000-8000-000401910904",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910904",
    startsAt: "2027-04-07T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Denver Nuggets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "New Orleans Pelicans",
        },
      },
    ],
  },
  _401910905: {
    id: "00000000-0000-4000-8000-000401910905",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910905",
    startsAt: "2027-04-07T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Utah Jazz",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Oklahoma City Thunder",
        },
      },
    ],
  },
  _401910906: {
    id: "00000000-0000-4000-8000-000401910906",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910906",
    startsAt: "2027-04-07T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Los Angeles Lakers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Dallas Mavericks",
        },
      },
    ],
  },
  _401910907: {
    id: "00000000-0000-4000-8000-000401910907",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910907",
    startsAt: "2027-04-07T02:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "LA Clippers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Minnesota Timberwolves",
        },
      },
    ],
  },
  _401910908: {
    id: "00000000-0000-4000-8000-000401910908",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910908",
    startsAt: "2027-04-07T03:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Golden State Warriors",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Phoenix Suns",
        },
      },
    ],
  },
  _401910909: {
    id: "00000000-0000-4000-8000-000401910909",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910909",
    startsAt: "2027-04-07T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Detroit Pistons",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Indiana Pacers",
        },
      },
    ],
  },
  _401910910: {
    id: "00000000-0000-4000-8000-000401910910",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910910",
    startsAt: "2027-04-07T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Orlando Magic",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Boston Celtics",
        },
      },
    ],
  },
  _401910911: {
    id: "00000000-0000-4000-8000-000401910911",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910911",
    startsAt: "2027-04-07T23:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Toronto Raptors",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Brooklyn Nets",
        },
      },
    ],
  },
  _401910912: {
    id: "00000000-0000-4000-8000-000401910912",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910912",
    startsAt: "2027-04-07T23:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "San Antonio Spurs",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Cleveland Cavaliers",
        },
      },
    ],
  },
  _401910913: {
    id: "00000000-0000-4000-8000-000401910913",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910913",
    startsAt: "2027-04-08T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Chicago Bulls",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Charlotte Hornets",
        },
      },
    ],
  },
  _401910914: {
    id: "00000000-0000-4000-8000-000401910914",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910914",
    startsAt: "2027-04-08T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Memphis Grizzlies",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Washington Wizards",
        },
      },
    ],
  },
  _401910915: {
    id: "00000000-0000-4000-8000-000401910915",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910915",
    startsAt: "2027-04-08T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Houston Rockets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Sacramento Kings",
        },
      },
    ],
  },
  _401910916: {
    id: "00000000-0000-4000-8000-000401910916",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910916",
    startsAt: "2027-04-08T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Los Angeles Lakers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Minnesota Timberwolves",
        },
      },
    ],
  },
  _401910917: {
    id: "00000000-0000-4000-8000-000401910917",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910917",
    startsAt: "2027-04-08T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Portland Trail Blazers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Dallas Mavericks",
        },
      },
    ],
  },
  _401910918: {
    id: "00000000-0000-4000-8000-000401910918",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910918",
    startsAt: "2027-04-08T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Miami Heat",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Philadelphia 76ers",
        },
      },
    ],
  },
  _401910919: {
    id: "00000000-0000-4000-8000-000401910919",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910919",
    startsAt: "2027-04-09T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Milwaukee Bucks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "New York Knicks",
        },
      },
    ],
  },
  _401910920: {
    id: "00000000-0000-4000-8000-000401910920",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910920",
    startsAt: "2027-04-09T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Denver Nuggets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "LA Clippers",
        },
      },
    ],
  },
  _401910921: {
    id: "00000000-0000-4000-8000-000401910921",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910921",
    startsAt: "2027-04-09T01:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Utah Jazz",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "New Orleans Pelicans",
        },
      },
    ],
  },
  _401910922: {
    id: "00000000-0000-4000-8000-000401910922",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910922",
    startsAt: "2027-04-09T01:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Oklahoma City Thunder",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Golden State Warriors",
        },
      },
    ],
  },
  _401910923: {
    id: "00000000-0000-4000-8000-000401910923",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910923",
    startsAt: "2027-04-09T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Atlanta Hawks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Boston Celtics",
        },
      },
    ],
  },
  _401910924: {
    id: "00000000-0000-4000-8000-000401910924",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910924",
    startsAt: "2027-04-09T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Charlotte Hornets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Brooklyn Nets",
        },
      },
    ],
  },
  _401910925: {
    id: "00000000-0000-4000-8000-000401910925",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910925",
    startsAt: "2027-04-09T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Indiana Pacers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Cleveland Cavaliers",
        },
      },
    ],
  },
  _401910926: {
    id: "00000000-0000-4000-8000-000401910926",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910926",
    startsAt: "2027-04-09T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "New York Knicks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Detroit Pistons",
        },
      },
    ],
  },
  _401910927: {
    id: "00000000-0000-4000-8000-000401910927",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910927",
    startsAt: "2027-04-09T23:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Orlando Magic",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Toronto Raptors",
        },
      },
    ],
  },
  _401910928: {
    id: "00000000-0000-4000-8000-000401910928",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910928",
    startsAt: "2027-04-10T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Miami Heat",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Washington Wizards",
        },
      },
    ],
  },
  _401910929: {
    id: "00000000-0000-4000-8000-000401910929",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910929",
    startsAt: "2027-04-10T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Chicago Bulls",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Milwaukee Bucks",
        },
      },
    ],
  },
  _401910930: {
    id: "00000000-0000-4000-8000-000401910930",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910930",
    startsAt: "2027-04-10T00:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Oklahoma City Thunder",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Golden State Warriors",
        },
      },
    ],
  },
  _401910931: {
    id: "00000000-0000-4000-8000-000401910931",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910931",
    startsAt: "2027-04-10T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Houston Rockets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Portland Trail Blazers",
        },
      },
    ],
  },
  _401910932: {
    id: "00000000-0000-4000-8000-000401910932",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910932",
    startsAt: "2027-04-10T01:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "San Antonio Spurs",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Denver Nuggets",
        },
      },
    ],
  },
  _401910933: {
    id: "00000000-0000-4000-8000-000401910933",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910933",
    startsAt: "2027-04-10T01:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Utah Jazz",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "LA Clippers",
        },
      },
    ],
  },
  _401910934: {
    id: "00000000-0000-4000-8000-000401910934",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910934",
    startsAt: "2027-04-10T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Los Angeles Lakers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Minnesota Timberwolves",
        },
      },
    ],
  },
  _401910935: {
    id: "00000000-0000-4000-8000-000401910935",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910935",
    startsAt: "2027-04-10T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Phoenix Suns",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Memphis Grizzlies",
        },
      },
    ],
  },
  _401910936: {
    id: "00000000-0000-4000-8000-000401910936",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910936",
    startsAt: "2027-04-10T02:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Sacramento Kings",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Dallas Mavericks",
        },
      },
    ],
  },
  _401910937: {
    id: "00000000-0000-4000-8000-000401910937",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910937",
    startsAt: "2027-04-11T22:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Boston Celtics",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Milwaukee Bucks",
        },
      },
    ],
  },
  _401910938: {
    id: "00000000-0000-4000-8000-000401910938",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910938",
    startsAt: "2027-04-11T22:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Brooklyn Nets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Toronto Raptors",
        },
      },
    ],
  },
  _401910939: {
    id: "00000000-0000-4000-8000-000401910939",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910939",
    startsAt: "2027-04-11T22:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Cleveland Cavaliers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Atlanta Hawks",
        },
      },
    ],
  },
  _401910940: {
    id: "00000000-0000-4000-8000-000401910940",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910940",
    startsAt: "2027-04-11T22:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Miami Heat",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Orlando Magic",
        },
      },
    ],
  },
  _401910941: {
    id: "00000000-0000-4000-8000-000401910941",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910941",
    startsAt: "2027-04-11T22:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "New York Knicks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Indiana Pacers",
        },
      },
    ],
  },
  _401910942: {
    id: "00000000-0000-4000-8000-000401910942",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910942",
    startsAt: "2027-04-11T22:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Philadelphia 76ers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Charlotte Hornets",
        },
      },
    ],
  },
  _401910943: {
    id: "00000000-0000-4000-8000-000401910943",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910943",
    startsAt: "2027-04-11T22:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Washington Wizards",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Detroit Pistons",
        },
      },
    ],
  },
  _401910944: {
    id: "00000000-0000-4000-8000-000401910944",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910944",
    startsAt: "2027-04-11T22:00:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "New Orleans Pelicans",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Chicago Bulls",
        },
      },
    ],
  },
  _401910945: {
    id: "00000000-0000-4000-8000-000401910945",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910945",
    startsAt: "2027-04-12T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Dallas Mavericks",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Memphis Grizzlies",
        },
      },
    ],
  },
  _401910946: {
    id: "00000000-0000-4000-8000-000401910946",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910946",
    startsAt: "2027-04-12T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Minnesota Timberwolves",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Houston Rockets",
        },
      },
    ],
  },
  _401910947: {
    id: "00000000-0000-4000-8000-000401910947",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910947",
    startsAt: "2027-04-12T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "San Antonio Spurs",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Portland Trail Blazers",
        },
      },
    ],
  },
  _401910948: {
    id: "00000000-0000-4000-8000-000401910948",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910948",
    startsAt: "2027-04-12T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Denver Nuggets",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Oklahoma City Thunder",
        },
      },
    ],
  },
  _401910949: {
    id: "00000000-0000-4000-8000-000401910949",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910949",
    startsAt: "2027-04-12T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Golden State Warriors",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Utah Jazz",
        },
      },
    ],
  },
  _401910950: {
    id: "00000000-0000-4000-8000-000401910950",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910950",
    startsAt: "2027-04-12T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "LA Clippers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Sacramento Kings",
        },
      },
    ],
  },
  _401910951: {
    id: "00000000-0000-4000-8000-000401910951",
    _tag: "sports_game",
    sourceId: "sports_game:espn:00000000-0000-4000-8000-000401910951",
    startsAt: "2027-04-12T00:30:00Z",
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "nba",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: "Los Angeles Lakers",
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: "Phoenix Suns",
        },
      },
    ],
  },
} as const satisfies Record<string, NbaSportEventSeed>;

export const events = Object.values(Games);
