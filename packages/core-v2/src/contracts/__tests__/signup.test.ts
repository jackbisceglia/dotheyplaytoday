import { describe, expect, it } from "@effect/vitest";
import { Effect, Schema } from "effect";

import { SignupRequest } from "../signup.js";

const decodeSignup = Schema.decodeUnknownSync(SignupRequest);

const validRequest = {
  email: " Fan@Example.COM ",
  timezone: "America/New_York",
  schedule: {
    _tag: "fixed_local_time",
    sendAtSecondsLocal: 9 * 60 * 60,
  },
  subjectIds: ["00000000-0000-4000-8000-000000000301"],
};

describe("signup contract", () => {
  it("normalizes email and decodes V1 signup inputs", () => {
    const decoded = decodeSignup(validRequest);

    expect(decoded.email).toBe("fan@example.com");
    expect(decoded.schedule).toEqual({
      _tag: "fixed_local_time",
      sendAtSecondsLocal: 9 * 60 * 60,
    });
    expect(decoded.subjectIds).toEqual([
      "00000000-0000-4000-8000-000000000301",
    ]);
  });

  it.effect("rejects invalid signup payloads", () =>
    Effect.gen(function* () {
      const error = yield* Schema.decodeUnknownEffect(SignupRequest)({
        ...validRequest,
        email: "not-an-email",
        schedule: {
          _tag: "fixed_local_time",
          sendAtSecondsLocal: 9 * 60 * 60 + 60,
        },
      }).pipe(Effect.flip);

      expect(error._tag).toBe("SchemaError");
    }),
  );
});
