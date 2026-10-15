import { describe, expect, it } from "vitest";

import { subjects } from "./subjects.js";

describe("NCAA men's basketball team names", () => {
  it.each([
    ["Minnesota", "Golden Gophers"],
    ["Duke", "Blue Devils"],
    ["North Carolina", "Tar Heels"],
    ["Wake Forest", "Demon Deacons"],
    ["Rutgers", "Scarlet Knights"],
    ["Tulsa", "Golden Hurricane"],
    ["Penn State", "Nittany Lions"],
    ["Kent State", "Golden Flashes"],
    ["Nevada", "Wolf Pack"],
    ["North Texas", "Mean Green"],
    ["California", "Golden Bears"],
    ["St. John's", "Red Storm"],
    ["TCU", "Horned Frogs"],
    ["Texas Tech", "Red Raiders"],
    ["Tulane", "Green Wave"],
    ["Marquette", "Golden Eagles"],
    ["DePaul", "Blue Demons"],
    ["Alabama", "Crimson Tide"],
    ["Evansville", "Purple Aces"],
    ["Illinois", "Fighting Illini"],
    ["Georgia Tech", "Yellow Jackets"],
    ["Hawai'i", "Rainbow Warriors"],
    ["Notre Dame", "Fighting Irish"],
    ["Arizona State", "Sun Devils"],
  ])("keeps %s's full nickname: %s", (location, name) => {
    const team = subjects.find(
      (subject) => subject.details.location === location,
    );
    expect(team?.details.name).toBe(name);
  });
});
