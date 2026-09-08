import { Api } from "@dtpt/core/contracts/api";
import { Subjects } from "@dtpt/core/modules/subjects/service";
import { Effect } from "effect";
import { HttpApiBuilder, HttpApiError } from "effect/unstable/httpapi";

const UnexpectedErrorTags = ["DatabaseReadError", "SchemaError"] as const;

export const SubjectsGroupLayer = HttpApiBuilder.group(
  Api,
  "subjects",
  Effect.fn("SubjectsHttpApi.group")(function* (handlers) {
    const subjects = yield* Subjects;

    return handlers.handle(
      "list",
      Effect.fn("SubjectsHttpApi.list")(
        function* () {
          return yield* subjects.list();
        },
        Effect.tapErrorTag(UnexpectedErrorTags, (e) =>
          Effect.logError("subjects: unexpected failure", {
            error: e.message,
          }),
        ),
        Effect.catchTag(UnexpectedErrorTags, () =>
          Effect.fail(new HttpApiError.InternalServerError({})),
        ),
      ),
    );
  }),
);
