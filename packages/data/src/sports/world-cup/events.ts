import type { SportsSeedEncoded } from "../../schema/sports.js";

type WorldCupSportEventSeed = SportsSeedEncoded["events"][number];

const makeWorldCupGame = (
  serial: number,
  startsAt: string,
  homeTitle: string,
  awayTitle: string,
): WorldCupSportEventSeed => {
  const id = `00000000-0000-4000-8000-${String(serial).padStart(12, "0")}`;

  return {
    id,
    _tag: "sports_game",
    sourceId: `sports_game:seed:${id}`,
    startsAt,
    availability: "active",
    details: {
      _tag: "sports_game",
      leagueId: "world-cup",
    },
    participants: [
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "home",
          title: homeTitle,
        },
      },
      {
        _tag: "sports_game",
        details: {
          _tag: "sports_game",
          role: "away",
          title: awayTitle,
        },
      },
    ],
  };
};

export const Games = {
  GroupA: {
    Matchday1: {
      MexicoVsSouthAfrica: makeWorldCupGame(
        901,
        "2026-06-11T19:00:00Z",
        "Mexico",
        "South Africa",
      ),
      SouthKoreaVsCzechia: makeWorldCupGame(
        902,
        "2026-06-12T02:00:00Z",
        "South Korea",
        "Czechia",
      ),
    },
    Matchday2: {
      CzechiaVsSouthAfrica: makeWorldCupGame(
        903,
        "2026-06-18T16:00:00Z",
        "Czechia",
        "South Africa",
      ),
      MexicoVsSouthKorea: makeWorldCupGame(
        904,
        "2026-06-19T01:00:00Z",
        "Mexico",
        "South Korea",
      ),
    },
    Matchday3: {
      CzechiaVsMexico: makeWorldCupGame(
        905,
        "2026-06-25T01:00:00Z",
        "Czechia",
        "Mexico",
      ),
      SouthAfricaVsSouthKorea: makeWorldCupGame(
        906,
        "2026-06-25T01:00:00Z",
        "South Africa",
        "South Korea",
      ),
    },
  },
  GroupB: {
    Matchday1: {
      CanadaVsBosniaAndHerzegovina: makeWorldCupGame(
        907,
        "2026-06-12T19:00:00Z",
        "Canada",
        "Bosnia and Herzegovina",
      ),
      QatarVsSwitzerland: makeWorldCupGame(
        908,
        "2026-06-13T19:00:00Z",
        "Qatar",
        "Switzerland",
      ),
    },
    Matchday2: {
      SwitzerlandVsBosniaAndHerzegovina: makeWorldCupGame(
        909,
        "2026-06-18T19:00:00Z",
        "Switzerland",
        "Bosnia and Herzegovina",
      ),
      CanadaVsQatar: makeWorldCupGame(
        910,
        "2026-06-18T22:00:00Z",
        "Canada",
        "Qatar",
      ),
    },
    Matchday3: {
      SwitzerlandVsCanada: makeWorldCupGame(
        911,
        "2026-06-24T19:00:00Z",
        "Switzerland",
        "Canada",
      ),
      BosniaAndHerzegovinaVsQatar: makeWorldCupGame(
        912,
        "2026-06-24T19:00:00Z",
        "Bosnia and Herzegovina",
        "Qatar",
      ),
    },
  },
  GroupC: {
    Matchday1: {
      BrazilVsMorocco: makeWorldCupGame(
        913,
        "2026-06-13T22:00:00Z",
        "Brazil",
        "Morocco",
      ),
      HaitiVsScotland: makeWorldCupGame(
        914,
        "2026-06-14T01:00:00Z",
        "Haiti",
        "Scotland",
      ),
    },
    Matchday2: {
      ScotlandVsMorocco: makeWorldCupGame(
        915,
        "2026-06-19T22:00:00Z",
        "Scotland",
        "Morocco",
      ),
      BrazilVsHaiti: makeWorldCupGame(
        916,
        "2026-06-20T00:30:00Z",
        "Brazil",
        "Haiti",
      ),
    },
    Matchday3: {
      ScotlandVsBrazil: makeWorldCupGame(
        917,
        "2026-06-24T22:00:00Z",
        "Scotland",
        "Brazil",
      ),
      MoroccoVsHaiti: makeWorldCupGame(
        918,
        "2026-06-24T22:00:00Z",
        "Morocco",
        "Haiti",
      ),
    },
  },
  GroupD: {
    Matchday1: {
      UnitedStatesVsParaguay: makeWorldCupGame(
        919,
        "2026-06-13T01:00:00Z",
        "United States",
        "Paraguay",
      ),
      AustraliaVsTurkiye: makeWorldCupGame(
        920,
        "2026-06-14T04:00:00Z",
        "Australia",
        "Turkiye",
      ),
    },
    Matchday2: {
      UnitedStatesVsAustralia: makeWorldCupGame(
        921,
        "2026-06-19T19:00:00Z",
        "United States",
        "Australia",
      ),
      TurkiyeVsParaguay: makeWorldCupGame(
        922,
        "2026-06-20T03:00:00Z",
        "Turkiye",
        "Paraguay",
      ),
    },
    Matchday3: {
      TurkiyeVsUnitedStates: makeWorldCupGame(
        923,
        "2026-06-26T02:00:00Z",
        "Turkiye",
        "United States",
      ),
      ParaguayVsAustralia: makeWorldCupGame(
        924,
        "2026-06-26T02:00:00Z",
        "Paraguay",
        "Australia",
      ),
    },
  },
  GroupE: {
    Matchday1: {
      GermanyVsCuracao: makeWorldCupGame(
        925,
        "2026-06-14T17:00:00Z",
        "Germany",
        "Curacao",
      ),
      IvoryCoastVsEcuador: makeWorldCupGame(
        926,
        "2026-06-14T23:00:00Z",
        "Ivory Coast",
        "Ecuador",
      ),
    },
    Matchday2: {
      GermanyVsIvoryCoast: makeWorldCupGame(
        927,
        "2026-06-20T20:00:00Z",
        "Germany",
        "Ivory Coast",
      ),
      EcuadorVsCuracao: makeWorldCupGame(
        928,
        "2026-06-21T03:00:00Z",
        "Ecuador",
        "Curacao",
      ),
    },
    Matchday3: {
      EcuadorVsGermany: makeWorldCupGame(
        929,
        "2026-06-25T20:00:00Z",
        "Ecuador",
        "Germany",
      ),
      CuracaoVsIvoryCoast: makeWorldCupGame(
        930,
        "2026-06-25T20:00:00Z",
        "Curacao",
        "Ivory Coast",
      ),
    },
  },
  GroupF: {
    Matchday1: {
      NetherlandsVsJapan: makeWorldCupGame(
        931,
        "2026-06-14T20:00:00Z",
        "Netherlands",
        "Japan",
      ),
      SwedenVsTunisia: makeWorldCupGame(
        932,
        "2026-06-15T02:00:00Z",
        "Sweden",
        "Tunisia",
      ),
    },
    Matchday2: {
      NetherlandsVsSweden: makeWorldCupGame(
        933,
        "2026-06-20T17:00:00Z",
        "Netherlands",
        "Sweden",
      ),
      TunisiaVsJapan: makeWorldCupGame(
        934,
        "2026-06-21T04:00:00Z",
        "Tunisia",
        "Japan",
      ),
    },
    Matchday3: {
      JapanVsSweden: makeWorldCupGame(
        935,
        "2026-06-25T23:00:00Z",
        "Japan",
        "Sweden",
      ),
      TunisiaVsNetherlands: makeWorldCupGame(
        936,
        "2026-06-25T23:00:00Z",
        "Tunisia",
        "Netherlands",
      ),
    },
  },
  GroupG: {
    Matchday1: {
      BelgiumVsEgypt: makeWorldCupGame(
        937,
        "2026-06-15T19:00:00Z",
        "Belgium",
        "Egypt",
      ),
      IranVsNewZealand: makeWorldCupGame(
        938,
        "2026-06-16T01:00:00Z",
        "Iran",
        "New Zealand",
      ),
    },
    Matchday2: {
      BelgiumVsIran: makeWorldCupGame(
        939,
        "2026-06-21T19:00:00Z",
        "Belgium",
        "Iran",
      ),
      NewZealandVsEgypt: makeWorldCupGame(
        940,
        "2026-06-22T01:00:00Z",
        "New Zealand",
        "Egypt",
      ),
    },
    Matchday3: {
      EgyptVsIran: makeWorldCupGame(
        941,
        "2026-06-27T03:00:00Z",
        "Egypt",
        "Iran",
      ),
      NewZealandVsBelgium: makeWorldCupGame(
        942,
        "2026-06-27T03:00:00Z",
        "New Zealand",
        "Belgium",
      ),
    },
  },
  GroupH: {
    Matchday1: {
      SpainVsCapeVerde: makeWorldCupGame(
        943,
        "2026-06-15T16:00:00Z",
        "Spain",
        "Cape Verde",
      ),
      SaudiArabiaVsUruguay: makeWorldCupGame(
        944,
        "2026-06-15T22:00:00Z",
        "Saudi Arabia",
        "Uruguay",
      ),
    },
    Matchday2: {
      SpainVsSaudiArabia: makeWorldCupGame(
        945,
        "2026-06-21T16:00:00Z",
        "Spain",
        "Saudi Arabia",
      ),
      UruguayVsCapeVerde: makeWorldCupGame(
        946,
        "2026-06-21T22:00:00Z",
        "Uruguay",
        "Cape Verde",
      ),
    },
    Matchday3: {
      CapeVerdeVsSaudiArabia: makeWorldCupGame(
        947,
        "2026-06-27T00:00:00Z",
        "Cape Verde",
        "Saudi Arabia",
      ),
      UruguayVsSpain: makeWorldCupGame(
        948,
        "2026-06-27T00:00:00Z",
        "Uruguay",
        "Spain",
      ),
    },
  },
  GroupI: {
    Matchday1: {
      FranceVsSenegal: makeWorldCupGame(
        949,
        "2026-06-16T19:00:00Z",
        "France",
        "Senegal",
      ),
      IraqVsNorway: makeWorldCupGame(
        950,
        "2026-06-16T22:00:00Z",
        "Iraq",
        "Norway",
      ),
    },
    Matchday2: {
      FranceVsIraq: makeWorldCupGame(
        951,
        "2026-06-22T21:00:00Z",
        "France",
        "Iraq",
      ),
      NorwayVsSenegal: makeWorldCupGame(
        952,
        "2026-06-23T00:00:00Z",
        "Norway",
        "Senegal",
      ),
    },
    Matchday3: {
      NorwayVsFrance: makeWorldCupGame(
        953,
        "2026-06-26T19:00:00Z",
        "Norway",
        "France",
      ),
      SenegalVsIraq: makeWorldCupGame(
        954,
        "2026-06-26T19:00:00Z",
        "Senegal",
        "Iraq",
      ),
    },
  },
  GroupJ: {
    Matchday1: {
      ArgentinaVsAlgeria: makeWorldCupGame(
        955,
        "2026-06-17T01:00:00Z",
        "Argentina",
        "Algeria",
      ),
      AustriaVsJordan: makeWorldCupGame(
        956,
        "2026-06-17T04:00:00Z",
        "Austria",
        "Jordan",
      ),
    },
    Matchday2: {
      ArgentinaVsAustria: makeWorldCupGame(
        957,
        "2026-06-22T17:00:00Z",
        "Argentina",
        "Austria",
      ),
      JordanVsAlgeria: makeWorldCupGame(
        958,
        "2026-06-23T03:00:00Z",
        "Jordan",
        "Algeria",
      ),
    },
    Matchday3: {
      AlgeriaVsAustria: makeWorldCupGame(
        959,
        "2026-06-28T02:00:00Z",
        "Algeria",
        "Austria",
      ),
      JordanVsArgentina: makeWorldCupGame(
        960,
        "2026-06-28T02:00:00Z",
        "Jordan",
        "Argentina",
      ),
    },
  },
  GroupK: {
    Matchday1: {
      PortugalVsDRCongo: makeWorldCupGame(
        961,
        "2026-06-17T17:00:00Z",
        "Portugal",
        "DR Congo",
      ),
      UzbekistanVsColombia: makeWorldCupGame(
        962,
        "2026-06-18T02:00:00Z",
        "Uzbekistan",
        "Colombia",
      ),
    },
    Matchday2: {
      PortugalVsUzbekistan: makeWorldCupGame(
        963,
        "2026-06-23T17:00:00Z",
        "Portugal",
        "Uzbekistan",
      ),
      ColombiaVsDRCongo: makeWorldCupGame(
        964,
        "2026-06-24T02:00:00Z",
        "Colombia",
        "DR Congo",
      ),
    },
    Matchday3: {
      ColombiaVsPortugal: makeWorldCupGame(
        965,
        "2026-06-27T23:30:00Z",
        "Colombia",
        "Portugal",
      ),
      DRCongoVsUzbekistan: makeWorldCupGame(
        966,
        "2026-06-27T23:30:00Z",
        "DR Congo",
        "Uzbekistan",
      ),
    },
  },
  GroupL: {
    Matchday1: {
      EnglandVsCroatia: makeWorldCupGame(
        967,
        "2026-06-17T20:00:00Z",
        "England",
        "Croatia",
      ),
      GhanaVsPanama: makeWorldCupGame(
        968,
        "2026-06-17T23:00:00Z",
        "Ghana",
        "Panama",
      ),
    },
    Matchday2: {
      EnglandVsGhana: makeWorldCupGame(
        969,
        "2026-06-23T20:00:00Z",
        "England",
        "Ghana",
      ),
      PanamaVsCroatia: makeWorldCupGame(
        970,
        "2026-06-23T23:00:00Z",
        "Panama",
        "Croatia",
      ),
    },
    Matchday3: {
      PanamaVsEngland: makeWorldCupGame(
        971,
        "2026-06-27T21:00:00Z",
        "Panama",
        "England",
      ),
      CroatiaVsGhana: makeWorldCupGame(
        972,
        "2026-06-27T21:00:00Z",
        "Croatia",
        "Ghana",
      ),
    },
  },
  Quarterfinals: {
    July11: {
      NorwayVsEngland: makeWorldCupGame(
        999,
        "2026-07-11T21:00:00Z",
        "Norway",
        "England",
      ),
      ArgentinaVsSwitzerland: makeWorldCupGame(
        1000,
        "2026-07-12T01:00:00Z",
        "Argentina",
        "Switzerland",
      ),
    },
  },
} as const satisfies Record<
  string,
  Record<string, Record<string, WorldCupSportEventSeed>>
>;

export const events = [
  ...Object.values(Games.GroupA.Matchday1),
  ...Object.values(Games.GroupA.Matchday2),
  ...Object.values(Games.GroupA.Matchday3),
  ...Object.values(Games.GroupB.Matchday1),
  ...Object.values(Games.GroupB.Matchday2),
  ...Object.values(Games.GroupB.Matchday3),
  ...Object.values(Games.GroupC.Matchday1),
  ...Object.values(Games.GroupC.Matchday2),
  ...Object.values(Games.GroupC.Matchday3),
  ...Object.values(Games.GroupD.Matchday1),
  ...Object.values(Games.GroupD.Matchday2),
  ...Object.values(Games.GroupD.Matchday3),
  ...Object.values(Games.GroupE.Matchday1),
  ...Object.values(Games.GroupE.Matchday2),
  ...Object.values(Games.GroupE.Matchday3),
  ...Object.values(Games.GroupF.Matchday1),
  ...Object.values(Games.GroupF.Matchday2),
  ...Object.values(Games.GroupF.Matchday3),
  ...Object.values(Games.GroupG.Matchday1),
  ...Object.values(Games.GroupG.Matchday2),
  ...Object.values(Games.GroupG.Matchday3),
  ...Object.values(Games.GroupH.Matchday1),
  ...Object.values(Games.GroupH.Matchday2),
  ...Object.values(Games.GroupH.Matchday3),
  ...Object.values(Games.GroupI.Matchday1),
  ...Object.values(Games.GroupI.Matchday2),
  ...Object.values(Games.GroupI.Matchday3),
  ...Object.values(Games.GroupJ.Matchday1),
  ...Object.values(Games.GroupJ.Matchday2),
  ...Object.values(Games.GroupJ.Matchday3),
  ...Object.values(Games.GroupK.Matchday1),
  ...Object.values(Games.GroupK.Matchday2),
  ...Object.values(Games.GroupK.Matchday3),
  ...Object.values(Games.GroupL.Matchday1),
  ...Object.values(Games.GroupL.Matchday2),
  ...Object.values(Games.GroupL.Matchday3),
  ...Object.values(Games.Quarterfinals.July11),
] satisfies readonly WorldCupSportEventSeed[];
