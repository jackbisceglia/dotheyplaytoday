import { Stage } from "alchemy";
import * as Cloudflare from "alchemy/Cloudflare";
import { retain } from "alchemy/RemovalPolicy";
import * as AlchemyPlanetscale from "alchemy/Planetscale";
import { Effect } from "effect";
import { Path } from "effect/Path";

export const Database = {
  id: "DtptPostgresDatabase",
  name: "dotheyplaytoday",
  migrations: new URL(
    "../../../../../../data/migrations/postgres/",
    import.meta.url,
  ),
  branches: {
    production: "production",
  },
} as const;

const ProductionDatabase = Effect.gen(function* () {
  const path = yield* Path;

  return yield* AlchemyPlanetscale.PostgresDatabase(Database.id, {
    name: Database.name,
    region: { slug: "us-east" },
    clusterSize: "PS_10",
    replicas: 0,
    defaultBranch: Database.branches.production,
    migrationsDir: path.fromFileUrl(Database.migrations),
  }).pipe(retain());
});

/**
 * One PlanetScale PostgreSQL database is owned by the production stage.
 * Every other stage references that database and owns an isolated branch.
 */
export const Planetscale = Effect.gen(function* () {
  const stage = yield* Stage;
  const path = yield* Path;

  const database =
    stage === "production"
      ? yield* ProductionDatabase
      : yield* AlchemyPlanetscale.PostgresDatabase.ref(Database.id, {
          stage: "production",
        });

  const branch =
    stage === "production"
      ? Database.branches.production
      : yield* AlchemyPlanetscale.PostgresBranch("DtptPostgresBranch", {
          database,
          parentBranch: Database.branches.production,
          migrationsDir: path.fromFileUrl(Database.migrations),
          replicas: 0,
        });

  const role = yield* AlchemyPlanetscale.PostgresRole(
    "DtptPostgresRuntimeRole",
    {
      database,
      branch,
      inheritedRoles: ["pg_read_all_data", "pg_write_all_data"],
      successor: "postgres",
    },
  );

  return { database, role };
});

/**
 * Cloudflare Hyperdrive V1 connection used by both Workers.
 *
 * Query caching is intentionally disabled because application reads must
 * observe current subscription and event state.
 */
export const DatabaseHyperdrive = Effect.gen(function* () {
  const planetscale = yield* Planetscale;

  return yield* Cloudflare.Hyperdrive.Connection("DtptDatabaseHyperdrive", {
    origin: planetscale.role.origin,
    mtls: { sslmode: "verify-full" },
    caching: { disabled: true },
    originConnectionLimit: 5,
  });
});
