import * as Cloudflare from "alchemy/Cloudflare";

/** Shared Cloudflare D1 resource for provisioning and Worker bindings. */
export const D1DatabaseResource = Cloudflare.D1.Database("DtptDatabase", {
  migrationsDir: "packages/data/migrations",
  primaryLocationHint: "wnam",
});
