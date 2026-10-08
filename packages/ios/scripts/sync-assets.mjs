// Refresh native fixtures and emoji from the authoritative TypeScript catalog.
// No network requests or database writes. Run from any directory.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = new URL("../../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");
const write = (path, data) => writeFileSync(new URL(path, root), `${JSON.stringify(data, null, 2)}\n`);
const symbols = {};
const catalog = [];
const names = new Set(["Boston Celtics", "New York Knicks", "New York Yankees", "Boston Red Sox",
  "Philadelphia Eagles", "New York Giants", "Boston Bruins", "New York Rangers"]);

for (const league of ["nba", "nfl", "mlb", "nhl"]) {
  const logos = read(`web/src/lib/catalog/sports/${league}.ts`).split("const logos = {")[1]?.split("};")[0];
  if (!logos) throw new Error(`Cannot read ${league} logos`);
  symbols[league] = Object.fromEntries([...logos.matchAll(/(\w+): "([^"]+)"/gu)].map((match) => [match[1], match[2]]));
  const source = read(`data/src/sports/${league}/subjects.ts`);
  for (const match of source.matchAll(/id: "([^"]+)",\s*_tag: "sports_team",\s*details: \{([^}]+)\}/gu)) {
    const details = Object.fromEntries([...match[2].matchAll(/(\w+): "([^"]+)"/gu)].map((pair) => [pair[1], pair[2]]));
    if (names.has(details.display)) catalog.push({ id: match[1], _tag: "sports_team", details });
  }
}
if (catalog.length !== 8) throw new Error(`Expected eight sample teams, found ${catalog.length}`);
const find = (name) => {
  const team = catalog.find((team) => team.details.display === name);
  if (!team) throw new Error(`Missing team ${name}`);
  return team;
};
const id = (n) => `00000000-0000-4000-8000-${String(n).padStart(12, "0")}`;
const picks = ["Boston Celtics", "New York Yankees", "Philadelphia Eagles", "Boston Bruins"].map(find);
const schedule = { _tag: "fixed_local_time", sendAtSecondsLocal: 32400 };
const subscriptions = picks.map((subject, i) => ({
  id: id(9000 + i), userId: id(8999), subjectId: subject.id, subject, schedule, lastSentAt: null,
}));
const opponents = ["New York Knicks", "Boston Red Sox", "New York Giants", "New York Rangers"].map(find);
const events = subscriptions.map((subscription, i) => ({
  ...subscription,
  events: [0, 1].map((round) => {
    const gameId = id(10000 + i * 10 + round);
    return {
      id: gameId, _tag: "sports_game", sourceId: `sports_game:manual:${gameId}`,
      startsAt: `2026-10-${String(7 + i + round * 5).padStart(2, "0")}T23:30:00.000Z`,
      availability: "active", details: { _tag: "sports_game", leagueId: subscription.subject.details.leagueId },
      demoDayOffset: (i < 2 ? 0 : i) + round * 5, demoHour: i === 1 ? 16 : 19,
      participants: [subscription.subject, opponents[i]].map((team, j) => ({
        id: id(20000 + i * 100 + round * 10 + j), eventId: gameId, _tag: "sports_game",
        details: { _tag: "sports_game", role: j === 0 ? "home" : "away", title: team.details.display },
      })),
    };
  }),
}));

write("ios/App/Resources/TeamSymbols.json", symbols);
write("ios/App/Resources/Demo.json", { catalog, subscriptions, events });
write("ios/Tests/PlayTodayCoreTests/Fixtures/events.json", events);
console.log(`Updated native assets in ${fileURLToPath(new URL("ios/", root))}`);
