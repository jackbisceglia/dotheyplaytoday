import * as Cloudflare from "alchemy/Cloudflare";
import { Effect } from "effect";
import * as HttpServerResponse from "effect/unstable/http/HttpServerResponse";

import { subjectsTable } from "../../../../modules/subjects/schema.js";
import { DatabaseHyperdrive } from "../../clients/postgres/resource.js";
import {
  Database,
  createDatabaseLayerFromHyperdriveResource,
} from "../../service.js";

export default class InfraDatabaseWorker extends Cloudflare.Worker<InfraDatabaseWorker>()(
  "InfraDatabaseWorker",
  {
    main: import.meta.url,
    compatibility: { date: "2026-06-02", flags: ["nodejs_compat"] },
  },
  Effect.gen(function* () {
    const hyperdrive = yield* Cloudflare.Hyperdrive.Connect(DatabaseHyperdrive);
    const DatabaseLayer = createDatabaseLayerFromHyperdriveResource(hyperdrive);

    return {
      fetch: Effect.gen(function* () {
        const database = yield* Database;

        yield* database
          .select({ id: subjectsTable.id })
          .from(subjectsTable)
          .limit(1)
          .pipe(Effect.orDie);

        return HttpServerResponse.empty();
      }).pipe(Effect.provide(DatabaseLayer)),
    };
  }).pipe(Effect.provide(Cloudflare.Hyperdrive.ConnectBinding)),
) {}
