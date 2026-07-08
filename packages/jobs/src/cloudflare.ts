import * as Cloudflare from "alchemy/Cloudflare";

/**
 * Cloudflare D1 resource used for provisioning and Worker binding. Runtime app
 * code receives the concrete D1 binding through the jobs runtime factory and
 * still talks to the core Drizzle Database service.
 */
export const JobsD1Database = Cloudflare.D1Database("Database", {
  migrationsDir: "packages/data/migrations",
  primaryLocationHint: "wnam",
});
