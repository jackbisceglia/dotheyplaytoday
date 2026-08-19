import { describe, expect, it } from "@effect/vitest";
import { Effect, Schema } from "effect";

import { FeedbackRequest } from "../feedback.js";
import { FeedbackRequestMaxLength } from "../../modules/feedback/schema.js";

const decodeFeedback = Schema.decodeUnknownSync(FeedbackRequest);

describe("feedback contract", () => {
  it("trims and decodes feedback", () => {
    expect(
      decodeFeedback({ type: "new_subject", request: "  Add the WNBA  " }),
    ).toEqual({ type: "new_subject", request: "Add the WNBA" });
  });

  it.effect("rejects unsupported and empty feedback", () =>
    Effect.gen(function* () {
      const unsupported = yield* Schema.decodeUnknownEffect(FeedbackRequest)({
        type: "bug",
        request: "Something broke",
      }).pipe(Effect.flip);
      const empty = yield* Schema.decodeUnknownEffect(FeedbackRequest)({
        type: "general",
        request: "   ",
      }).pipe(Effect.flip);
      const tooLong = yield* Schema.decodeUnknownEffect(FeedbackRequest)({
        type: "general",
        request: "x".repeat(FeedbackRequestMaxLength + 1),
      }).pipe(Effect.flip);

      expect(unsupported._tag).toBe("SchemaError");
      expect(empty._tag).toBe("SchemaError");
      expect(tooLong._tag).toBe("SchemaError");
    }),
  );
});
