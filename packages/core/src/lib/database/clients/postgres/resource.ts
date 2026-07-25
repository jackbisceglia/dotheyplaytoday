import { ALCHEMY_PHASE, Stage } from "alchemy";
import * as Cloudflare from "alchemy/Cloudflare";
import { retain } from "alchemy/RemovalPolicy";
import * as Planetscale from "alchemy/Planetscale";
import { Effect } from "effect";
import * as Path from "effect/Path";

export const ProductionDatabaseStage = "production";
export const ProductionDatabaseName = "dotheyplaytoday";
export const ProductionBranchName = "production";
export const HyperdriveCaching = { disabled: true } as const;

const MigrationsDirByPhase = Effect.gen(function* () {
  const path = yield* Path.Path;
  const phase = yield* ALCHEMY_PHASE;

  if (phase === "runtime") {
    return "";
  }

  return yield* path
    .fromFileUrl(
      new URL("../../../../../../data/migrations/postgres", import.meta.url),
    )
    .pipe(Effect.orDie);
}).pipe(Effect.provide(Path.layer));

/**
 * One PlanetScale PostgreSQL database is owned by the production stage.
 * Every other stage references that database and owns an isolated branch.
 */
export const PlanetScalePostgres = Effect.gen(function* () {
  const stage = yield* Stage;
  const migrationsDir = yield* MigrationsDirByPhase;
  const isProduction = stage === ProductionDatabaseStage;

  const database = isProduction
    ? yield* Planetscale.PostgresDatabase("DtptPostgresDatabase", {
        name: ProductionDatabaseName,
        region: { slug: "us-east" },
        clusterSize: "PS_10",
        replicas: 0,
        defaultBranch: ProductionBranchName,
        migrationsDir,
      }).pipe(retain())
    : yield* Planetscale.PostgresDatabase.ref("DtptPostgresDatabase", {
        stage: ProductionDatabaseStage,
      });

  const branch = isProduction
    ? ProductionBranchName
    : yield* Planetscale.PostgresBranch("DtptPostgresBranch", {
        database,
        parentBranch: ProductionBranchName,
        migrationsDir,
        replicas: 0,
      });

  const role = yield* Planetscale.PostgresRole("DtptPostgresRuntimeRole", {
    database,
    branch,
    inheritedRoles: ["pg_read_all_data", "pg_write_all_data"],
    successor: "postgres",
  });

  return { database, branch, role };
});

/**
 * Cloudflare Hyperdrive V1 connection used by both Workers.
 *
 * Query caching is intentionally disabled because application reads must
 * observe current subscription and event state.
 */
export const DatabaseHyperdrive = Effect.gen(function* () {
  const { role } = yield* PlanetScalePostgres;

  return yield* Cloudflare.Hyperdrive.Connection("DtptDatabaseHyperdrive", {
    origin: role.origin,
    mtls: { sslmode: "verify-full" },
    caching: HyperdriveCaching,
    originConnectionLimit: 5,
  });
});
