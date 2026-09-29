import { Effect } from "effect";
import { HttpEffect, HttpServerResponse } from "effect/unstable/http";

export const withNoStoreResponse = HttpEffect.withPreResponseHandler(
  (_request, response) =>
    Effect.succeed(
      HttpServerResponse.setHeader(response, "cache-control", "no-store"),
    ),
);
