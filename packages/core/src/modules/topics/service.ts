import { Effect } from "effect";

import { DatabaseReadError } from "../database/errors.js";
import { Database } from "../database/service.js";
import { Topic } from "./schema.js";

export class Topics extends Effect.Service<Topics>()("@dtpt/Topics", {
  effect: Effect.gen(function* () {
    const database = yield* Database;

    const getAllEventsByTopicId = Effect.fn("Topics.getAllEventsByTopicId")(
      function* (topicId: Topic["id"]) {
        const topic = yield* database.query.topicsTable
          .findFirst({
            where: { id: { eq: topicId } },
            with: {
              events: {
                orderBy: { id: "asc" },
              },
            },
          })
          .pipe(
            Effect.mapError(() =>
              DatabaseReadError.make({
                operation: "Topics.getAllEventsByTopicId",
                message: "Failed to read topic events",
              }),
            ),
          );

        return topic?.events ?? [];
      },
    );

    return { getAllEventsByTopicId };
  }),
}) {}
