import * as Cloudflare from "alchemy/Cloudflare";

/**
 * The D1 database resource. Declared once and shared: the stack yields it to
 * provision + migrate, and the worker binds it as a capability via
 * `Cloudflare.D1Connection.bind(Database)`.
 *
 * `migrationsDir` is a plain repo-relative string so this module stays free of
 * `import.meta.url` / filesystem calls; those throw when the module is bundled
 * into the worker and loaded in workerd. Alchemy resolves it against the CLI's
 * cwd (the repo root) at deploy time; in the worker runtime it is never read.
 */
export const Database = Cloudflare.D1Database("Database", {
  migrationsDir: "packages/data/migrations",
  primaryLocationHint: "wnam",
});
