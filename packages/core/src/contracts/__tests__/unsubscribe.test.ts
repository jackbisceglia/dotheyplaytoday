import { describe, expect, it } from "@effect/vitest";
import { Effect, Schema } from "effect";

import { Request } from "../unsubscribe.js";

const decodeUnsubscribe = Schema.decodeUnknownSync(Request);

describe("unsubscribe contract", () => {
  it("decodes a token-shaped request", () => {
    const decoded = decodeUnsubscribe({
      token: "00000000-0000-4000-8000-000000000401",
    });

    expect(decoded.token).toBe("00000000-0000-4000-8000-000000000401");
  });

  it.effect("rejects malformed token shapes", () =>
    Effect.gen(function* () {
      const error = yield* Schema.decodeUnknownEffect(Request)({
        token: "not-a-token",
      }).pipe(Effect.flip);

      expect(error._tag).toBe("SchemaError");
    }),
  );
});
