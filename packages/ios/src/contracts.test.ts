import { readFileSync } from "node:fs";
import { Schema } from "effect";
import { describe, expect, it } from "vitest";
import { EventsResponse } from "@dtpt/core/contracts/events";
import { SubjectsResponse } from "@dtpt/core/contracts/subjects";
import { SubscriptionsResponse } from "@dtpt/core/contracts/subscription";

const readJSON = (path: string): unknown =>
  JSON.parse(readFileSync(new URL(path, import.meta.url), "utf8"));

describe("iOS wire fixtures", () => {
  it("keeps the Swift decoding fixture compatible with the real events contract", () => {
    const fixture = readJSON("../Tests/PlayTodayCoreTests/Fixtures/events.json");
    const subscriptions = Schema.decodeUnknownSync(EventsResponse)(fixture);
    expect(subscriptions).toHaveLength(4);
    expect(subscriptions.flatMap((subscription) => subscription.events)).toHaveLength(8);
  });

  it("keeps the native demo catalog and preferences compatible with API responses", () => {
    const demo = Schema.decodeUnknownSync(Schema.Struct({
      catalog: SubjectsResponse,
      subscriptions: SubscriptionsResponse,
      events: EventsResponse,
    }))(readJSON("../App/Resources/Demo.json"));
    expect(demo.catalog).toHaveLength(8);
    expect(demo.subscriptions).toHaveLength(4);
    expect(demo.events).toHaveLength(4);
  });
});
