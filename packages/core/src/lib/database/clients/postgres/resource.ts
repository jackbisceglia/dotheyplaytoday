import { ALCHEMY_PHASE, type AlchemyPhase, Stack } from "alchemy";
import { adopt } from "alchemy/AdoptPolicy";
import * as Cloudflare from "alchemy/Cloudflare";
import { retain } from "alchemy/RemovalPolicy";
import * as AlchemyPlanetscale from "alchemy/Planetscale";
import { Effect } from "effect";
import { Path } from "effect/Path";

import { exactOptional } from "../../../utils.js";

export const database = {
  id: "DtptPostgresDatabase",
  name: "dotheyplaytoday",
  branches: {
    production: "production",
  },
  migrationsTable: "dtpt_postgres_migrations",
  MigrationsDirectory: Effect.fn("Database.MigrationsDirectory")(function* (
    phase: AlchemyPhase,
  ) {
    if (phase === "runtime") {
      return undefined;
    }

    const path = yield* Path;

    const url = new URL(
      "../../../../../../data/migrations/postgres/",
      import.meta.url,
    );

    return yield* path.fromFileUrl(url).pipe(Effect.orDie);
  }),
} as const;

/**
 * One PlanetScale PostgreSQL database is owned by the production stage.
 * Every other stage references that database and owns an isolated branch.
 */
export const Planetscale = Effect.gen(function* () {
  const stack = yield* Stack;
  const phase = yield* ALCHEMY_PHASE;

  const stage = stack.stage;
  const migrationsDirectory = yield* database.MigrationsDirectory(phase);

  const databaseResource =
    stage === "production"
      ? yield* AlchemyPlanetscale.PostgresDatabase(database.id, {
          name: database.name,
          region: { slug: "us-east" },
          clusterSize: "PS_5",
          replicas: 0,
          defaultBranch: database.branches.production,
          ...exactOptional(migrationsDirectory, (migrationsDir) => ({
            migrationsDir,
          })),
          migrationsTable: database.migrationsTable,
        }).pipe(adopt(), retain())
      : yield* AlchemyPlanetscale.PostgresDatabase.ref(database.id, {
          stage: "production",
        });

  const branch =
    stage === "production"
      ? database.branches.production
      : yield* AlchemyPlanetscale.PostgresBranch("DtptPostgresBranch", {
          database: databaseResource,
          parentBranch: database.branches.production,
          ...exactOptional(migrationsDirectory, (migrationsDir) => ({
            migrationsDir,
          })),
          replicas: 0,
        });

  const role = yield* AlchemyPlanetscale.PostgresRole(
    "DtptPostgresWorkerRole",
    {
      database: databaseResource.name,
      branch,
      inheritedRoles: ["pg_read_all_data", "pg_write_all_data"],
      successor: "postgres",
    },
  );

  return { database: databaseResource, role };
});

/** Cloudflare Hyperdrive V1 connection used by both Workers. */
export const DatabaseHyperdrive = Effect.gen(function* () {
  const planetscale = yield* Planetscale;

  return yield* Cloudflare.Hyperdrive.Connection("DtptPostgresHyperdrive", {
    origin: planetscale.role.origin,
    dev: planetscale.role.pooledOrigin,
    // NOTE: Reads must observe current subscription and event state.
    caching: { disabled: true },
    originConnectionLimit: 5,
  });
});
