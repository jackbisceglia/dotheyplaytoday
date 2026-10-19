import * as NodeServices from "@effect/platform-node/NodeServices";
import { describe, expect, it } from "@effect/vitest";
import { Effect } from "effect";
import { Command } from "effect/unstable/cli";
import { HttpClient, HttpClientResponse } from "effect/unstable/http";

import { NotifyCommand } from "../cli.js";

describe("notify CLI", () => {
  it.effect(
    "routes weekly dry runs and serializes filters without requiring force",
    () =>
      Effect.gen(function* () {
        const requests: { url: string; body: string }[] = [];
        const client = HttpClient.make((request) => {
          if (request.body._tag !== "Uint8Array")
            return Effect.die("Expected JSON body");

          requests.push({
            url: request.url,
            body: new TextDecoder().decode(request.body.body),
          });

          return Effect.succeed(
            HttpClientResponse.fromWeb(request, Response.json({ ok: true })),
          );
        });

        const run = Command.runWith(NotifyCommand, { version: "test" });

        yield* run([
          "--weekly",
          "--dry-run",
          "--user",
          " FAN@EXAMPLE.COM ",
          "--now",
          "2026-10-08T15:00:00Z",
        ]).pipe(Effect.provideService(HttpClient.HttpClient, client));
        yield* run(["--dry-run", "--force"]).pipe(
          Effect.provideService(HttpClient.HttpClient, client),
        );

        expect(requests.map((request) => request.url)).toEqual([
          "http://localhost:8788/test/weekly-digest",
          "http://localhost:8788/test/notify",
        ]);
        expect(JSON.parse(requests[0]?.body ?? "null")).toEqual({
          dryRun: true,
          force: false,
          userEmail: "fan@example.com",
          now: "2026-10-08T15:00:00.000Z",
        });
        expect(JSON.parse(requests[1]?.body ?? "null")).toEqual({
          dryRun: true,
          force: true,
        });
      }).pipe(Effect.provide(NodeServices.layer)),
  );
});
