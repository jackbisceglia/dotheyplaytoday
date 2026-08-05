import * as Cloudflare from "alchemy/Cloudflare";
import { Cause, Effect } from "effect";
import * as HttpServerResponse from "effect/unstable/http/HttpServerResponse";

import { subjectsTable } from "../../../../modules/subjects/schema.js";
import {
  Database,
  createDatabaseLayerFromHyperdriveResource,
} from "../../service.js";
import { InfraDatabaseHyperdrive } from "./resource.js";

export default class InfraDatabaseWorker extends Cloudflare.Worker<InfraDatabaseWorker>()(
  "InfraDatabaseWorker",
  {
    main: import.meta.url,
    compatibility: { date: "2026-06-02", flags: ["nodejs_compat"] },
  },
  Effect.gen(function* () {
    const hyperdrive = yield* Cloudflare.Hyperdrive.Connect(
      InfraDatabaseHyperdrive,
    );
    const DatabaseLayer = createDatabaseLayerFromHyperdriveResource(hyperdrive);

    return {
      fetch: Effect.gen(function* () {
        const database = yield* Database;

        yield* database
          .select({ id: subjectsTable.id })
          .from(subjectsTable)
          .limit(1);

        return HttpServerResponse.empty();
      }).pipe(
        Effect.provide(DatabaseLayer),
        Effect.catchCause((cause) =>
          Effect.succeed(
            HttpServerResponse.text(Cause.pretty(cause), { status: 500 }),
          ),
        ),
      ),
    };
  }).pipe(Effect.provide(Cloudflare.Hyperdrive.ConnectBinding)),
) {}
