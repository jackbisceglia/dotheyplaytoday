import { describe, expect, it } from "vitest";
import { DateTime, Predicate, Schema } from "effect";

import { MmaSeed } from "../../schema/mma.js";
import { ufcCollection } from "./index.js";

const catalog = Schema.decodeUnknownSync(MmaSeed)(ufcCollection);

// Official UFC champions and divisional top 15, October 6, 2026.
// https://www.ufc.com/rankings — refresh this snapshot alongside the catalog.
const rankedDivisions = {
  Flyweight: [
    "Joshua Van",
    "Alexandre Pantoja",
    "Manel Kape",
    "Brandon Royval",
    "Tatsuro Taira",
    "Kyoji Horiguchi",
    "Lone’er Kavanagh",
    "Asu Almabayev",
    "Brandon Moreno",
    "Amir Albazi",
    "Ramazan Temirov",
    "Tim Elliott",
    "Steve Erceg",
    "Sumudaerji",
    "Tagir Ulanbekov",
    "Alex Perez",
  ],
  Bantamweight: [
    "Petr Yan",
    "Merab Dvalishvili",
    "Sean O'Malley",
    "Song Yadong",
    "Umar Nurmagomedov",
    "Mario Bautista",
    "Cory Sandhagen",
    "Payton Talbott",
    "Aiemann Zahabi",
    "David Martinez",
    "Raul Rosas Jr.",
    "Marlon Vera",
    "Deiveson Figueiredo",
    "Farid Basharat",
    "Marcus McGhee",
    "Raoni Barcelos",
  ],
  Featherweight: [
    "Alexander Volkanovski",
    "Movsar Evloev",
    "Diego Lopes",
    "Lerone Murphy",
    "Aljamain Sterling",
    "Jean Silva",
    "Yair Rodriguez",
    "Arnold Allen",
    "Youssef Zalal",
    "Kevin Vallejos",
    "Steve Garcia",
    "Aaron Pico",
    "Melquizael Costa",
    "Brian Ortega",
    "Patricio Pitbull",
    "David Onama",
  ],
  Lightweight: [
    "Justin Gaethje",
    "Ilia Topuria",
    "Arman Tsarukyan",
    "Charles Oliveira",
    "Max Holloway",
    "Paddy Pimblett",
    "Benoît Saint Denis",
    "Quillan Salkilld",
    "Mauricio Ruffy",
    "Salahdine Parnasse",
    "Mateusz Gamrot",
    "Rafael Fiziev",
    "Renato Moicano",
    "Dan Hooker",
    "Tom Nolan",
    "Beneil Dariush",
  ],
  Welterweight: [
    "Islam Makhachev",
    "Ian Machado Garry",
    "Carlos Prates",
    "Michael Morales",
    "Jack Della Maddalena",
    "Gabriel Bonfim",
    "Sean Brady",
    "Belal Muhammad",
    "Leon Edwards",
    "Kamaru Usman",
    "Joaquin Buckley",
    "Yaroslav Amosov",
    "Uroš Medić",
    "Mike Malott",
    "Daniel Rodriguez",
    "Neil Magny",
  ],
  Middleweight: [
    "Sean Strickland",
    "Khamzat Chimaev",
    "Dricus Du Plessis",
    "Nassourdine Imavov",
    "Brendan Allen",
    "Caio Borralho",
    "Joe Pyfer",
    "Gregory Rodrigues",
    "Anthony Hernandez",
    "Israel Adesanya",
    "Christian Leroy Duncan",
    "Jared Cannonier",
    "Abus Magomedov",
    "Ikram Aliskerov",
    "Bo Nickal",
    "Shara Magomedov",
  ],
  "Light Heavyweight": [
    "Carlos Ulberg",
    "Magomed Ankalaev",
    "Jiří Procházka",
    "Alex Pereira",
    "Khalil Rountree Jr.",
    "Navajo Stirling",
    "Paulo Costa",
    "Azamat Murzakanov",
    "Dominick Reyes",
    "Jan Błachowicz",
    "Bogdan Guskov",
    "Robert Whittaker",
    "Alonzo Menifield",
    "Muhammad Saidov",
    "Reinier de Ridder",
    "Nikita Krylov",
  ],
  Heavyweight: [
    "Ciryl Gane",
    "Tom Aspinall",
    "Alexander Volkov",
    "Sergei Pavlovich",
    "Josh Hokit",
    "Curtis Blaydes",
    "Waldo Cortes Acosta",
    "Rizvan Kuniev",
    "Vitor Petrino",
    "Serghei Spivac",
    "Ante Delija",
    "Valter Walker",
    "Tyrell Fortune",
    "Derrick Lewis",
    "Aleksandar Rakić",
    "Mario Pinto",
  ],
  "Women's Strawweight": [
    "Mackenzie Dern",
    "Zhang Weili",
    "Tatiana Suarez",
    "Virna Jandiroba",
    "Denise Gomes",
    "Gillian Robertson",
    "Yan Xiaonan",
    "Fatima Kline",
    "Loopy Godinez",
    "Alexia Thainara",
    "Jéssica Andrade",
    "Tabatha Ricci",
    "Amanda Lemos",
    "Amanda Ribas",
    "Angela Hill",
    "Mizuki",
  ],
  "Women's Flyweight": [
    "Natalia Silva",
    "Valentina Shevchenko",
    "Alexa Grasso",
    "Manon Fiorot",
    "Erin Blanchfield",
    "Rose Namajunas",
    "Jasmine Jasudavicius",
    "Maycee Barber",
    "Wang Cong",
    "Tracy Cortez",
    "Miranda Maverick",
    "Karine Silva",
    "Casey O'Neill",
    "Eduarda Moura",
    "Regina Tarin",
    "Gabriella Fernandes",
  ],
  "Women's Bantamweight": [
    "Kayla Harrison",
    "Julianna Peña",
    "Joselyne Edwards",
    "Ailin Perez",
    "Raquel Pennington",
    "Norma Dumont",
    "Yana Santos",
    "Luana Santos",
    "Jacqueline Cavalcanti",
    "Macy Chiasson",
    "Karol Rosa",
    "Bia Mesquita",
    "Michelle Montague",
    "Nora Cornolle",
    "Melissa Croden",
    "Daria Zhelezniakova",
  ],
} as const;

const normalizeName = (name: string) =>
  name
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

describe("UFC catalog", () => {
  it("links the upcoming lineups to their fighter and coverage feeds", () => {
    expect(catalog.events).toHaveLength(6);
    expect(catalog.events.map((event) => event.participants.length)).toEqual([
      24, 26, 28, 22, 26, 24,
    ]);
    expect(catalog.subjects).toHaveLength(289);
    expect(new Set(catalog.subjects.map((subject) => subject.id)).size).toBe(
      289,
    );

    for (const event of catalog.events) {
      for (const participant of event.participants) {
        expect(
          catalog.subjects.find(
            (subject) => subject.details.display === participant.details.title,
          )?.feedIds,
        ).toContain(event.sourceId);
      }
    }

    for (const subject of catalog.subjects) {
      const expected = catalog.events.filter((event) =>
        Predicate.isTagged(subject, "mma_tracking")
          ? subject.details.scope === "all" ||
            event.details.category === "numbered"
          : event.participants.some(
              (participant) =>
                participant.details.title === subject.details.display,
            ),
      );
      expect(subject.feedIds).toEqual(expected.map((event) => event.sourceId));
    }
  });

  it("includes the men's P4P top 15 even without a booked fight", () => {
    const ranked = catalog.subjects
      .filter(
        (subject) =>
          Predicate.isTagged(subject.details, "mma_fighter") &&
          subject.details.p4p !== null &&
          subject.details.p4p <= 15,
      )
      .toSorted((a, b) => {
        const rank = (subject: typeof a) =>
          Predicate.isTagged(subject.details, "mma_fighter")
            ? (subject.details.p4p ?? Infinity)
            : Infinity;
        return rank(a) - rank(b);
      });
    expect(ranked.map((subject) => subject.details.display)).toEqual([
      "Islam Makhachev",
      "Alexander Volkanovski",
      "Justin Gaethje",
      "Petr Yan",
      "Ilia Topuria",
      "Joshua Van",
      "Sean Strickland",
      "Tom Aspinall",
      "Merab Dvalishvili",
      "Alex Pereira",
      "Ciryl Gane",
      "Khamzat Chimaev",
      "Arman Tsarukyan",
      "Alexandre Pantoja",
      "Carlos Ulberg",
    ]);
    expect(ranked[0]?.feedIds).toEqual([]);
  });

  it("includes every ranked fighter and champion without duplicate identities", () => {
    const fighters = catalog.subjects.filter((subject) =>
      Predicate.isTagged(subject, "mma_fighter"),
    );
    const names = fighters.map((subject) =>
      normalizeName(subject.details.display),
    );
    expect(new Set(names).size).toBe(fighters.length);

    for (const division of Object.values(rankedDivisions)) {
      for (const display of division) {
        expect(
          names.filter((name) => name === normalizeName(display)),
          display,
        ).toHaveLength(1);
      }
    }

    const adesanya = fighters.find(
      (subject) => subject.details.display === "Israel Adesanya",
    );
    expect(adesanya?.feedIds).toEqual([]);
    expect(adesanya?.details.p4p).toBeNull();
    expect(adesanya?.details.profileUrl).toBe(
      "https://www.ufc.com/athlete/israel-adesanya",
    );
  });

  it("stores all 15 men's P4P ranks independently of divisional rankings", () => {
    const fighters = catalog.subjects.filter((subject) =>
      Predicate.isTagged(subject, "mma_fighter"),
    );
    expect(
      fighters.filter((fighter) => fighter.details.p4p !== null),
    ).toHaveLength(15);
    for (const [display, rank] of [
      ["Ciryl Gane", 11],
      ["Khamzat Chimaev", 12],
      ["Arman Tsarukyan", 13],
      ["Alexandre Pantoja", 14],
      ["Carlos Ulberg", 15],
    ] as const) {
      expect(
        fighters.find((fighter) => fighter.details.display === display)?.details
          .p4p,
      ).toBe(rank);
    }
    expect(
      fighters.find(
        (fighter) => fighter.details.display === "Valentina Shevchenko",
      )?.details.p4p,
    ).toBeNull();
  });

  it("uses the earliest prelim segment and applies Eastern DST by event date", () => {
    const timezone = DateTime.zoneMakeNamedUnsafe("America/New_York");
    const localStarts = catalog.events.map((event) =>
      DateTime.format(DateTime.setZone(event.startsAt, timezone), {
        locale: "en-US",
        hour: "numeric",
        minute: "2-digit",
        timeZoneName: "short",
      }),
    );
    const mainStarts = catalog.events.map((event) =>
      DateTime.format(DateTime.setZone(event.details.timings.main, timezone), {
        locale: "en-US",
        hour: "numeric",
        minute: "2-digit",
        timeZoneName: "short",
      }),
    );
    expect(mainStarts).toEqual([
      "8:00 PM EDT",
      "8:00 PM EDT",
      "2:00 PM EDT",
      "8:00 PM EDT",
      "8:00 PM EST",
      "9:00 PM EST",
    ]);
    expect(localStarts).toEqual([
      "5:00 PM EDT",
      "5:00 PM EDT",
      "10:00 AM EDT",
      "5:00 PM EDT",
      "5:00 PM EST",
      "5:00 PM EST",
    ]);
  });
});
