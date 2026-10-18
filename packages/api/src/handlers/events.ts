import { Api } from "@dtpt/core/contracts/api";
import { whenSchemaIssue } from "@dtpt/core/lib/effect/index";
import { Events } from "@dtpt/core/modules/events/service";
import { UserId } from "@dtpt/core/modules/users/schema";
import { Effect, SchemaIssue } from "effect";
import { HttpApiBuilder, HttpApiError } from "effect/unstable/httpapi";

import { Auth } from "../auth/auth.js";
import { withNoStoreResponse } from "../lib/no-store.js";

const UnexpectedErrorTags = [
  "AuthRequestError",
  "DatabaseReadError",
  "SchemaError",
] as const;

export const EventsGroupLayer = HttpApiBuilder.group(
  Api,
  "events",
  Effect.fn("EventsHttpApi.group")(function* (handlers) {
    const auth = yield* Auth;

    const events = yield* Events;

    return handlers.handle(
      "list",
      Effect.fn("EventsHttpApi.list")(
        function* (ctx) {
          const session = yield* auth.getSession(ctx.request.headers);

          if (!session) return yield* new HttpApiError.Unauthorized({});

          const userId = yield* UserId.makeEffect(session.user.id);
          return yield* events.listForUser(userId);
        },
        Effect.tapError(
          whenSchemaIssue((error) =>
            Effect.logError("user events: unexpected failure", { error }),
          ),
        ),
        Effect.tapErrorTag(UnexpectedErrorTags, (error) =>
          Effect.logError("user events: unexpected failure", { error }),
        ),
        Effect.catchIf(SchemaIssue.isIssue, () =>
          Effect.fail(new HttpApiError.InternalServerError({})),
        ),
        Effect.catchTag("UserNotFound", () =>
          Effect.fail(new HttpApiError.Unauthorized({})),
        ),
        Effect.catchTag(UnexpectedErrorTags, () =>
          Effect.fail(new HttpApiError.InternalServerError({})),
        ),
        withNoStoreResponse,
      ),
    );
  }),
);
