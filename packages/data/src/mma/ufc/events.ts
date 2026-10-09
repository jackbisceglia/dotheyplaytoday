import type { MmaTrackingSubject } from "@dtpt/core/modules/subjects/variants/mma.schema";

import type { MmaSeedEncoded } from "../../schema/mma.js";

type UfcEventSeed = MmaSeedEncoded["events"][number];

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
          subjectId: "c759cf80-2526-432b-8010-000000000003",
          title: "Brendan Allen",
          fightId: "fight-1",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000004",
          title: "Christian Leroy Duncan",
          fightId: "fight-1",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000005",
          title: "Matheus Camilo",
          fightId: "fight-2",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000006",
          title: "Jai Herbert",
          fightId: "fight-2",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000007",
          title: "Loopy Godinez",
          fightId: "fight-3",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000008",
          title: "Ketlen Souza",
          fightId: "fight-3",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000009",
          title: "Andre Fili",
          fightId: "fight-4",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000010",
          title: "Kai Kamaka III",
          fightId: "fight-4",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000011",
          title: "Malcolm Wellmaker",
          fightId: "fight-5",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000012",
          title: "Otari Tanzilovi",
          fightId: "fight-5",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000013",
          title: "Julius Walker",
          fightId: "fight-6",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000014",
          title: "Gerald Meerschaert",
          fightId: "fight-6",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000015",
          title: "Francisco Prado",
          fightId: "fight-7",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000016",
          title: "Ismael Bonfim",
          fightId: "fight-7",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000017",
          title: "Niko Price",
          fightId: "fight-8",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000018",
          title: "Leon Shahbazyan",
          fightId: "fight-8",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000019",
          title: "Felipe Franco",
          fightId: "fight-9",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000020",
          title: "Brendson Ribeiro",
          fightId: "fight-9",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000021",
          title: "Allen Frye Jr.",
          fightId: "fight-10",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000022",
          title: "RJ Harris",
          fightId: "fight-10",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000023",
          title: "Alice Pereira",
          fightId: "fight-11",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000024",
          title: "Daria Zhelezniakova",
          fightId: "fight-11",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000025",
          title: "Ernesta Kareckaitė",
          fightId: "fight-12",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000026",
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
          subjectId: "c759cf80-2526-432b-8010-000000000027",
          title: "Joaquin Buckley",
          fightId: "fight-1",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000028",
          title: "Mike Malott",
          fightId: "fight-1",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000029",
          title: "Erin Blanchfield",
          fightId: "fight-2",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000030",
          title: "Jasmine Jasudavicius",
          fightId: "fight-2",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000031",
          title: "Kyle Nelson",
          fightId: "fight-3",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000032",
          title: "Cristian Perez Gonzalez",
          fightId: "fight-3",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000033",
          title: "Marc-Andre Barriault",
          fightId: "fight-4",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000034",
          title: "Kyle Daukaus",
          fightId: "fight-4",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000035",
          title: "Louis Jourdain",
          fightId: "fight-5",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000036",
          title: "Timmy Cuamba",
          fightId: "fight-5",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000037",
          title: "Mandel Nallo",
          fightId: "fight-6",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000038",
          title: "Nate Landwehr",
          fightId: "fight-6",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000039",
          title: "Tanner Boser",
          fightId: "fight-7",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000040",
          title: "Jhonata Diniz",
          fightId: "fight-7",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000041",
          title: "Julien Leblanc",
          fightId: "fight-8",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000042",
          title: "Nick Galanti",
          fightId: "fight-8",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000043",
          title: "Javad Mahjoub",
          fightId: "fight-9",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000044",
          title: "Joel Faglier",
          fightId: "fight-9",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000045",
          title: "Jamey-Lyn Horth",
          fightId: "fight-10",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000046",
          title: "Katlyn Cerminara",
          fightId: "fight-10",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000047",
          title: "Chad Anheliger",
          fightId: "fight-11",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000048",
          title: "Steven Koslow",
          fightId: "fight-11",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000049",
          title: "Melissa Croden",
          fightId: "fight-12",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000050",
          title: "Chelsea Chandler",
          fightId: "fight-12",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000051",
          title: "Cody Chovancek",
          fightId: "fight-13",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000052",
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
          subjectId: "c759cf80-2526-432b-8010-000000000053",
          title: "Alexander Volkanovski",
          fightId: "fight-1",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000054",
          title: "Movsar Evloev",
          fightId: "fight-1",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000055",
          title: "Petr Yan",
          fightId: "fight-2",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000056",
          title: "Merab Dvalishvili",
          fightId: "fight-2",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000057",
          title: "Lone’er Kavanagh",
          fightId: "fight-3",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000058",
          title: "Ramazan Temirov",
          fightId: "fight-3",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000059",
          title: "Alexander Volkov",
          fightId: "fight-4",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000060",
          title: "Rizvan Kuniev",
          fightId: "fight-4",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000061",
          title: "Aaron Pico",
          fightId: "fight-5",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000062",
          title: "Losene Keita",
          fightId: "fight-5",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000063",
          title: "Azamat Murzakanov",
          fightId: "fight-6",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000064",
          title: "Dominick Reyes",
          fightId: "fight-6",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000065",
          title: "Nikita Krylov",
          fightId: "fight-7",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000066",
          title: "Abdul Rakhman Yakhyaev",
          fightId: "fight-7",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000067",
          title: "Abus Magomedov",
          fightId: "fight-8",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000068",
          title: "Cam Rowston",
          fightId: "fight-8",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000069",
          title: "Grant Dawson",
          fightId: "fight-9",
          placement: "prelims",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000070",
          title: "Nurullo Aliev",
          fightId: "fight-9",
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
          subjectId: "c759cf80-2526-432b-8010-000000000071",
          title: "Renato Moicano",
          fightId: "fight-1",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000072",
          title: "Tom Nolan",
          fightId: "fight-1",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000073",
          title: "Randy Brown",
          fightId: "fight-2",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000074",
          title: "Carlos Leal",
          fightId: "fight-2",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000075",
          title: "Lucia Szabova",
          fightId: "fight-3",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000076",
          title: "Tainara Lisboa",
          fightId: "fight-3",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000077",
          title: "Yana Santos",
          fightId: "fight-4",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000078",
          title: "Luana Santos",
          fightId: "fight-4",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000079",
          title: "Talita Alencar",
          fightId: "fight-5",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000080",
          title: "Piera Rodriguez",
          fightId: "fight-5",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000081",
          title: "Nick Klein",
          fightId: "fight-6",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000082",
          title: "Joseph Kropschot",
          fightId: "fight-6",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000083",
          title: "Rodrigo Sezinando",
          fightId: "fight-7",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000084",
          title: "Theodor Berggren",
          fightId: "fight-7",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000085",
          title: "Jean-Paul Lebosnoyani",
          fightId: "fight-8",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000086",
          title: "Farman Hasanov",
          fightId: "fight-8",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000087",
          title: "Azamat Bekoev",
          fightId: "fight-9",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000088",
          title: "Andre Petroski",
          fightId: "fight-9",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000089",
          title: "Julian Erosa",
          fightId: "fight-10",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000090",
          title: "JeongYeong Lee",
          fightId: "fight-10",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000091",
          title: "Francis Marshall",
          fightId: "fight-11",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000092",
          title: "Gaston Bolanos",
          fightId: "fight-11",
        },
      },
    ],
  },
  {
    _tag: "mma_card",
    id: "b51165b6-7428-4620-a02e-000000000006",
    sourceId: "mma_card:ufc:b51165b6-7428-4620-a02e-000000000006",
    availability: "active",
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
          subjectId: "c759cf80-2526-432b-8010-000000000093",
          title: "Gabriel Bonfim",
          fightId: "fight-1",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000094",
          title: "Sean Brady",
          fightId: "fight-1",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000095",
          title: "Tatiana Suarez",
          fightId: "fight-2",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000096",
          title: "Virna Jandiroba",
          fightId: "fight-2",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000097",
          title: "Mantas Kondratavicius",
          fightId: "fight-3",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000098",
          title: "Wes Schultz",
          fightId: "fight-3",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000099",
          title: "Billy Elekana",
          fightId: "fight-4",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000100",
          title: "Lucas Fernando",
          fightId: "fight-4",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000101",
          title: "Austin Bashi",
          fightId: "fight-5",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000102",
          title: "Lucas Brennan",
          fightId: "fight-5",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000103",
          title: "Karine Silva",
          fightId: "fight-6",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000104",
          title: "Gabriella Fernandes",
          fightId: "fight-6",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000105",
          title: "Priscila Cachoeira",
          fightId: "fight-7",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000106",
          title: "Nina Milošević",
          fightId: "fight-7",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000107",
          title: "Keiichiro Nakamura",
          fightId: "fight-8",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000108",
          title: "Ollie Schmid",
          fightId: "fight-8",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000109",
          title: "Seokhyeon Ko",
          fightId: "fight-9",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000110",
          title: "Wellington Turman",
          fightId: "fight-9",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000111",
          title: "Jonny Parsons",
          fightId: "fight-10",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000112",
          title: "José Souza",
          fightId: "fight-10",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000113",
          title: "Davey Grant",
          fightId: "fight-11",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000114",
          title: "Elijah Smith",
          fightId: "fight-11",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000115",
          title: "José Delano",
          fightId: "fight-12",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000116",
          title: "Murtazali Magomedov",
          fightId: "fight-12",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000117",
          title: "Gabriel Lorenço",
          fightId: "fight-13",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000118",
          title: "Alvin Hines",
          fightId: "fight-13",
        },
      },
    ],
  },
];

export const getFighterFeedIds = (subjectId: string) =>
  events
    .values()
    .filter((event) =>
      event.participants.some(
        (participant) => participant.details.subjectId === subjectId,
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
