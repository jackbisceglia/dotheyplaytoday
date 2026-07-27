import * as Cloudflare from "alchemy/Cloudflare";
import * as Planetscale from "alchemy/Planetscale";
import { Effect } from "effect";
import { Path } from "effect/Path";

import { Database } from "../../clients/postgres/resource.js";

export const InfraPlanetscale = Effect.gen(function* () {
  const path = yield* Path;
  const database = yield* Planetscale.PostgresDatabase(
    "InfraPostgresDatabase",
    {
      region: { slug: "us-east" },
      clusterSize: "PS_10",
      replicas: 0,
      migrationsDir: path.fromFileUrl(Database.migrations),
    },
  );
  const role = yield* Planetscale.PostgresRole("InfraPostgresRuntimeRole", {
    database,
    inheritedRoles: ["pg_read_all_data", "pg_write_all_data"],
    successor: "postgres",
  });

  return { database, role };
});

export const InfraDatabaseHyperdrive = Effect.gen(function* () {
  const planetscale = yield* InfraPlanetscale;

  return yield* Cloudflare.Hyperdrive.Connection("InfraDatabaseHyperdrive", {
    origin: planetscale.role.origin,
    mtls: { sslmode: "verify-full" },
    caching: { disabled: true },
    originConnectionLimit: 5,
  });
});
