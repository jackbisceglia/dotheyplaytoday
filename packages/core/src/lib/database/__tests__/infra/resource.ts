import * as Cloudflare from "alchemy/Cloudflare";
import * as Planetscale from "alchemy/Planetscale";
import { Effect } from "effect";

import { database as databaseDefinition } from "../../clients/postgres/resource.js";

export const InfraPlanetscale = Effect.gen(function* () {
  const migrationsDirectory = yield* databaseDefinition.migrationsDirectory;
  const database = yield* Planetscale.PostgresDatabase(
    "InfraPostgresDatabase",
    {
      region: { slug: "us-east" },
      clusterSize: "PS_5",
      replicas: 0,
      ...(migrationsDirectory === undefined
        ? {}
        : { migrationsDir: migrationsDirectory }),
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
    dev: planetscale.role.pooledOrigin,
    caching: { disabled: true },
    originConnectionLimit: 5,
  });
});
