import * as NodeHttpServer from "@effect/platform-node/NodeHttpServer";
import { SubscriptionsLayer, SubjectsLayer, UsersLayer } from "@dtpt/core";
import {
  createTables,
  layerTest,
} from "@dtpt/core/lib/database/__tests__/setup";
import { Config, Effect, Layer } from "effect";
import {
  HttpClient,
  HttpClientRequest,
  HttpRouter,
} from "effect/unstable/http";

import { HttpApiLayer } from "../index.js";
import { makeRateLimiterLayer } from "../rate-limit/service.js";

export function makeApiTestLayer(config: {
  readonly limit: number;
  readonly window: number;
}) {
  const RuntimeLayer = Layer.mergeAll(
    makeRateLimiterLayer(Config.succeed(config)),
    SubscriptionsLayer,
    SubjectsLayer,
    UsersLayer,
  ).pipe(Layer.provideMerge(layerTest));

  const ServerLayer = HttpRouter.serve(
    HttpApiLayer,
    { disableListenLog: true, disableLogger: true },
  ).pipe(
    Layer.provideMerge(NodeHttpServer.layerTest),
    Layer.provide(RuntimeLayer),
  );

  return Layer.mergeAll(RuntimeLayer, ServerLayer);
}

export const setupTables = createTables;

export function submitSignup(input: {
  readonly email?: string;
  readonly timezone?: string;
  readonly subjectIds?: readonly string[];
  readonly schedule?: { readonly _tag: "fixed_local_time"; readonly sendAtSecondsLocal: number };
}) {
  return HttpClientRequest.post("/api/signup").pipe(
    HttpClientRequest.bodyJson({
      email: input.email ?? "fan@example.com",
      timezone: input.timezone ?? "America/New_York",
      schedule: input.schedule ?? { _tag: "fixed_local_time", sendAtSecondsLocal: 9 * 60 * 60 },
      subjectIds: input.subjectIds ?? [],
    }),
    Effect.flatMap(HttpClient.execute),
  );
}

export function submitUnsubscribe(token: string) {
  return HttpClientRequest.post("/api/unsubscribe").pipe(
    HttpClientRequest.bodyJson({ token }),
    Effect.flatMap(HttpClient.execute),
  );
}
