import { Stage } from "alchemy";
import * as Cloudflare from "alchemy/Cloudflare";
import { retain } from "alchemy/RemovalPolicy";
import * as AlchemyPlanetscale from "alchemy/Planetscale";
import { Effect } from "effect";

export const Database = {
  name: "dotheyplaytoday",
  stage: {
    production: "production",
  },
  branch: {
    production: "production",
  },
} as const;

const migrations = "./packages/data/migrations/postgres";
const ProductionDatabaseId = "DtptPostgresDatabase";

const ProductionDatabase = AlchemyPlanetscale.PostgresDatabase(
  ProductionDatabaseId,
  {
    name: Database.name,
    region: { slug: "us-east" },
    clusterSize: "PS_10",
    replicas: 0,
    defaultBranch: Database.branch.production,
    migrationsDir: migrations,
  },
).pipe(retain());

/**
 * One PlanetScale PostgreSQL database is owned by the production stage.
 * Every other stage references that database and owns an isolated branch.
 */
export const Planetscale = Effect.gen(function* () {
  const stage = yield* Stage;

  const database =
    stage === Database.stage.production
      ? yield* ProductionDatabase
      : yield* AlchemyPlanetscale.PostgresDatabase.ref(ProductionDatabaseId, {
          stage: Database.stage.production,
        });

  const branch =
    stage === Database.stage.production
      ? Database.branch.production
      : yield* AlchemyPlanetscale.PostgresBranch("DtptPostgresBranch", {
          database,
          parentBranch: Database.branch.production,
          migrationsDir: migrations,
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
  const { role } = yield* Planetscale;

  return yield* Cloudflare.Hyperdrive.Connection("DtptDatabaseHyperdrive", {
    origin: role.origin,
    mtls: { sslmode: "verify-full" },
    caching: { disabled: true },
    originConnectionLimit: 5,
  });
});
