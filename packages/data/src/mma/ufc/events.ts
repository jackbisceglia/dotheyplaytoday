import type { MmaTrackingSubject } from "@dtpt/core/modules/subjects/variants/mma.schema";

import type { MmaSeedEncoded } from "../../schema/mma.js";

type UfcEventSeed = MmaSeedEncoded["events"][number];

// Upcoming lineups reviewed October 19, 2026 against UFC event listings.
// Additional UFC 333 prelims: https://www.ufc.com.br/news/ufc-333-card-completo-horarios-onde-assistir
export const events: readonly UfcEventSeed[] = [
  {
    _tag: "mma_card",
    id: "b51165b6-7428-4620-a02e-000000000002",
    sourceId: "mma_card:ufc:b51165b6-7428-4620-a02e-000000000002",
    availability: "active",
    sourceUrl: "https://www.ufc.com/event/ufc-fight-night-october-10-2026",
    startsAt: "2026-10-10T21:00:00.000Z",
    details: {
      _tag: "mma_card",
      leagueId: "ufc",
      title: "UFC Fight Night: Allen vs Duncan",
      category: "fight_night",
      venue: {
        title: "Meta APEX",
        location: "Las Vegas, Nevada, United States",
      },
      timings: {
        prelims: "2026-10-10T21:00:00.000Z",
        main: "2026-10-11T00:00:00.000Z",
      },
    },
    participants: [
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Brendan Allen",
          fightId: "fight-1",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Christian Leroy Duncan",
          fightId: "fight-1",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Matheus Camilo",
          fightId: "fight-2",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Jai Herbert",
          fightId: "fight-2",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Loopy Godinez",
          fightId: "fight-3",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Ketlen Souza",
          fightId: "fight-3",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Andre Fili",
          fightId: "fight-4",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Kai Kamaka III",
          fightId: "fight-4",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Malcolm Wellmaker",
          fightId: "fight-5",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Otari Tanzilovi",
          fightId: "fight-5",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Julius Walker",
          fightId: "fight-6",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Gerald Meerschaert",
          fightId: "fight-6",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Francisco Prado",
          fightId: "fight-7",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Ismael Bonfim",
          fightId: "fight-7",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Niko Price",
          fightId: "fight-8",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Leon Shahbazyan",
          fightId: "fight-8",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Felipe Franco",
          fightId: "fight-9",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Brendson Ribeiro",
          fightId: "fight-9",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Allen Frye Jr.",
          fightId: "fight-10",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "RJ Harris",
          fightId: "fight-10",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Alice Pereira",
          fightId: "fight-11",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Daria Zhelezniakova",
          fightId: "fight-11",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Ernesta Kareckaitė",
          fightId: "fight-12",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Melissa Gatto",
          fightId: "fight-12",
          placement: "prelims",
        },
      },
    ],
  },
  {
    _tag: "mma_card",
    id: "b51165b6-7428-4620-a02e-000000000003",
    sourceId: "mma_card:ufc:b51165b6-7428-4620-a02e-000000000003",
    availability: "active",
    sourceUrl: "https://www.ufc.com/event/ufc-fight-night-october-17-2026",
    startsAt: "2026-10-17T21:00:00.000Z",
    details: {
      _tag: "mma_card",
      leagueId: "ufc",
      title: "UFC Fight Night: Buckley vs Malott",
      category: "fight_night",
      venue: {
        title: "Rogers Place",
        location: "Edmonton, Alberta, Canada",
      },
      timings: {
        prelims: "2026-10-17T21:00:00.000Z",
        main: "2026-10-18T00:00:00.000Z",
      },
    },
    participants: [
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Joaquin Buckley",
          fightId: "fight-1",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Mike Malott",
          fightId: "fight-1",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Erin Blanchfield",
          fightId: "fight-2",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Jasmine Jasudavicius",
          fightId: "fight-2",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Kyle Nelson",
          fightId: "fight-3",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Cristian Perez Gonzalez",
          fightId: "fight-3",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Marc-Andre Barriault",
          fightId: "fight-4",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Kyle Daukaus",
          fightId: "fight-4",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Louis Jourdain",
          fightId: "fight-5",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Timmy Cuamba",
          fightId: "fight-5",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Mandel Nallo",
          fightId: "fight-6",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Nate Landwehr",
          fightId: "fight-6",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Tanner Boser",
          fightId: "fight-7",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Jhonata Diniz",
          fightId: "fight-7",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Julien Leblanc",
          fightId: "fight-8",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Nick Galanti",
          fightId: "fight-8",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Javad Mahjoub",
          fightId: "fight-9",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Joel Faglier",
          fightId: "fight-9",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Jamey-Lyn Horth",
          fightId: "fight-10",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Katlyn Cerminara",
          fightId: "fight-10",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Chad Anheliger",
          fightId: "fight-11",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Steven Koslow",
          fightId: "fight-11",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Melissa Croden",
          fightId: "fight-12",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Chelsea Chandler",
          fightId: "fight-12",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Cody Chovancek",
          fightId: "fight-13",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "SuYoung You",
          fightId: "fight-13",
          placement: "prelims",
        },
      },
    ],
  },
  {
    _tag: "mma_card",
    id: "b51165b6-7428-4620-a02e-000000000004",
    sourceId: "mma_card:ufc:b51165b6-7428-4620-a02e-000000000004",
    availability: "active",
    sourceUrl: "https://www.ufc.com/event/ufc-333",
    startsAt: "2026-10-24T14:00:00.000Z",
    details: {
      _tag: "mma_card",
      leagueId: "ufc",
      title: "UFC 333: Volkanovski vs Evloev",
      category: "numbered",
      venue: {
        title: "Etihad Arena",
        location: "Abu Dhabi, United Arab Emirates",
      },
      timings: {
        prelims: "2026-10-24T14:00:00.000Z",
        main: "2026-10-24T18:00:00.000Z",
      },
    },
    participants: [
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Alexander Volkanovski",
          fightId: "fight-1",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Movsar Evloev",
          fightId: "fight-1",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Petr Yan",
          fightId: "fight-2",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Merab Dvalishvili",
          fightId: "fight-2",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Lone’er Kavanagh",
          fightId: "fight-3",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Ramazan Temirov",
          fightId: "fight-3",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Alexander Volkov",
          fightId: "fight-4",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Rizvan Kuniev",
          fightId: "fight-4",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Aaron Pico",
          fightId: "fight-5",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Losene Keita",
          fightId: "fight-5",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Azamat Murzakanov",
          fightId: "fight-6",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Dominick Reyes",
          fightId: "fight-6",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Nikita Krylov",
          fightId: "fight-7",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Abdul Rakhman Yakhyaev",
          fightId: "fight-7",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Abus Magomedov",
          fightId: "fight-8",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Cam Rowston",
          fightId: "fight-8",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Grant Dawson",
          fightId: "fight-9",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Nurullo Aliev",
          fightId: "fight-9",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Colby Thicknesse",
          fightId: "fight-10",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Asaf Chopurov",
          fightId: "fight-10",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Abubakar Vagaev",
          fightId: "fight-11",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Jacob Malkoun",
          fightId: "fight-11",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Bolaji Oki",
          fightId: "fight-12",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Daniel Santos",
          fightId: "fight-12",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Kody Steele",
          fightId: "fight-13",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Noah Gugnon",
          fightId: "fight-13",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Iasmin Lucindo",
          fightId: "fight-14",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Nicolle Caliari",
          fightId: "fight-14",
          placement: "prelims",
        },
      },
    ],
  },
  {
    _tag: "mma_card",
    id: "b51165b6-7428-4620-a02e-000000000005",
    sourceId: "mma_card:ufc:b51165b6-7428-4620-a02e-000000000005",
    availability: "active",
    sourceUrl: "https://www.ufc.com/event/ufc-fight-night-october-31-2026",
    startsAt: "2026-10-31T21:00:00.000Z",
    details: {
      _tag: "mma_card",
      leagueId: "ufc",
      title: "UFC Fight Night: Moicano vs Nolan",
      category: "fight_night",
      venue: {
        title: "Meta APEX",
        location: "Las Vegas, Nevada, United States",
      },
      timings: {
        prelims: "2026-10-31T21:00:00.000Z",
        main: "2026-11-01T00:00:00.000Z",
      },
    },
    participants: [
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Renato Moicano",
          fightId: "fight-1",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Tom Nolan",
          fightId: "fight-1",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Randy Brown",
          fightId: "fight-2",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Carlos Leal",
          fightId: "fight-2",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Yana Santos",
          fightId: "fight-3",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Luana Santos",
          fightId: "fight-3",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Jean-Paul Lebosnoyani",
          fightId: "fight-4",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Farman Hasanov",
          fightId: "fight-4",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Francis Marshall",
          fightId: "fight-5",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Gaston Bolanos",
          fightId: "fight-5",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Azamat Bekoev",
          fightId: "fight-6",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Andre Petroski",
          fightId: "fight-6",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Rodrigo Sezinando",
          fightId: "fight-7",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Theodor Berggren",
          fightId: "fight-7",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Julian Erosa",
          fightId: "fight-8",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "JeongYeong Lee",
          fightId: "fight-8",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Nick Klein",
          fightId: "fight-9",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Joseph Kropschot",
          fightId: "fight-9",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Talita Alencar",
          fightId: "fight-10",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Piera Rodriguez",
          fightId: "fight-10",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Lucia Szabova",
          fightId: "fight-11",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Tainara Lisboa",
          fightId: "fight-11",
          placement: "prelims",
        },
      },
    ],
  },
  {
    _tag: "mma_card",
    id: "b51165b6-7428-4620-a02e-000000000006",
    sourceId: "mma_card:ufc:b51165b6-7428-4620-a02e-000000000006",
    availability: "active",
    // Placement: https://us.ufcespanol.com/event/ufc-fight-night-november-07-2026
    sourceUrl:
      "https://www.ufc.com/news/tickets-sale-october-10-october-31-and-november-7-ufc-fight-night-events-meta-apex",
    startsAt: "2026-11-07T22:00:00.000Z",
    details: {
      _tag: "mma_card",
      leagueId: "ufc",
      title: "UFC Fight Night: Bonfim vs Brady",
      category: "fight_night",
      venue: {
        title: "Meta APEX",
        location: "Las Vegas, Nevada, United States",
      },
      timings: {
        prelims: "2026-11-07T22:00:00.000Z",
        main: "2026-11-08T01:00:00.000Z",
      },
    },
    participants: [
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Gabriel Bonfim",
          fightId: "fight-1",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Sean Brady",
          fightId: "fight-1",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Tatiana Suarez",
          fightId: "fight-2",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Virna Jandiroba",
          fightId: "fight-2",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Davey Grant",
          fightId: "fight-3",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Elijah Smith",
          fightId: "fight-3",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Seokhyeon Ko",
          fightId: "fight-4",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Wellington Turman",
          fightId: "fight-4",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Billy Elekana",
          fightId: "fight-5",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Lucas Fernando",
          fightId: "fight-5",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Mantas Kondratavicius",
          fightId: "fight-6",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Wes Schultz",
          fightId: "fight-6",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Gabriel Lorenço",
          fightId: "fight-7",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Alvin Hines",
          fightId: "fight-7",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Karine Silva",
          fightId: "fight-8",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Gabriella Fernandes",
          fightId: "fight-8",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "José Delano",
          fightId: "fight-9",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Murtazali Magomedov",
          fightId: "fight-9",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Keiichiro Nakamura",
          fightId: "fight-10",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Ollie Schmid",
          fightId: "fight-10",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Austin Bashi",
          fightId: "fight-11",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Lucas Brennan",
          fightId: "fight-11",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Priscila Cachoeira",
          fightId: "fight-12",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Nina Milošević",
          fightId: "fight-12",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Jonny Parsons",
          fightId: "fight-13",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "José Souza",
          fightId: "fight-13",
          placement: "prelims",
        },
      },
    ],
  },
  {
    _tag: "mma_card",
    id: "ab1a300b-f6d4-4e34-b666-5486fe8b38b9",
    sourceId: "mma_card:ufc:ab1a300b-f6d4-4e34-b666-5486fe8b38b9",
    availability: "active",
    sourceUrl: "https://www.ufc.com/event/ufc-334",
    startsAt: "2026-11-14T22:00:00.000Z",
    details: {
      _tag: "mma_card",
      leagueId: "ufc",
      title: "UFC 334: Gane vs Hokit",
      category: "numbered",
      venue: {
        title: "Madison Square Garden",
        location: "New York, New York, United States",
      },
      timings: {
        prelims: "2026-11-14T22:00:00.000Z",
        main: "2026-11-15T02:00:00.000Z",
      },
    },
    participants: [
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Ciryl Gane",
          fightId: "fight-1",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Josh Hokit",
          fightId: "fight-1",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Kayla Harrison",
          fightId: "fight-2",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Amanda Nunes",
          fightId: "fight-2",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Caio Borralho",
          fightId: "fight-3",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Yousri Belgaroui",
          fightId: "fight-3",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Uroš Medić",
          fightId: "fight-4",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Kevin Holland",
          fightId: "fight-4",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Bilal Hasan",
          fightId: "fight-5",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Luis Gurule",
          fightId: "fight-5",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Stephen Thompson",
          fightId: "fight-6",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Charles Radtke",
          fightId: "fight-6",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Drew Dober",
          fightId: "fight-7",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Chris Duncan",
          fightId: "fight-7",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Jim Miller",
          fightId: "fight-8",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Terrance McKinney",
          fightId: "fight-8",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Donte Johnson",
          fightId: "fight-9",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Baisangur Susurkaev",
          fightId: "fight-9",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Macy Chiasson",
          fightId: "fight-10",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Bia Mesquita",
          fightId: "fight-10",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Adrian Yanez",
          fightId: "fight-11",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Juan Diaz",
          fightId: "fight-11",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Nazim Sadykhov",
          fightId: "fight-12",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          title: "Jefferson Nascimento",
          fightId: "fight-12",
          placement: "prelims",
        },
      },
    ],
  },
];

export const getFighterFeedIds = (title: string) =>
  events
    .values()
    .filter((event) =>
      event.participants.some(
        (participant) => participant.details.title === title,
      ),
    )
    .map((event) => event.sourceId)
    .toArray();

export const getTrackingFeedIds = (scope: MmaTrackingSubject["scope"]) =>
  events
    .values()
    .filter((event) => scope === "all" || event.details.category === "numbered")
    .map((event) => event.sourceId)
    .toArray();
