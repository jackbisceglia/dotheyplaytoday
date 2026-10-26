import { createRequire } from "node:module";
import { realpathSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
const require = createRequire(import.meta.url ?? "/worker.mjs");
const { build } = require(
  require.resolve("esbuild", { paths: [realpathSync("node_modules/vite")] }),
);
const baseline = process.argv[2] ?? "c342341c";
const out = resolve(process.argv[3] ?? ".api-benchmark");
await mkdir(out, { recursive: true });
const original = (file) =>
  execFileSync("git", ["show", `${baseline}:${file}`], { encoding: "utf8" });
const oldWorker = original("packages/api/src/worker.ts");
const imports = oldWorker
  .slice(0, oldWorker.indexOf("const ApiBaseLayer"))
  .split("\n")
  .filter(
    (line) =>
      !/import.*(Stack|getManagedServiceDomain|DatabaseHyperdrive|exactOptional|EmailConfig|AuthConfig)/.test(
        line,
      ),
  )
  .join("\n");
const base = oldWorker.slice(
  oldWorker.indexOf("const ApiBaseLayer"),
  oldWorker.indexOf("const WorkerLayer"),
);
const body = oldWorker
  .slice(
    oldWorker.indexOf("    // HttpApiLayer"),
    oldWorker.indexOf("\n  }).pipe(Effect.provide(WorkerLayer))"),
  )
  .replace("    return {\n      fetch:", "    return")
  .replace(
    ".pipe(Effect.provideService(RateLimiter, rateLimiter)),\n    };",
    ".pipe(Effect.provideService(RateLimiter, rateLimiter));",
  );
const oldRuntime = `${imports}\n${base}\nexport const makeApiFetch = (hyperdrive) => Effect.gen(function* () {\n${body}\n});`;
for (const variant of ["before", "after"]) {
  await build({
    entryPoints: ["scripts/api-benchmark/harness.ts"],
    outfile: `${out}/${variant}.mjs`,
    banner: {
      js: 'import { createRequire } from "node:module"; const require = createRequire(import.meta.url ?? "/worker.mjs");',
    },
    bundle: true,
    format: "esm",
    platform: "node",
    target: "es2022",
    conditions: ["worker", "import"],
    external: ["node:*", "cloudflare:workers", "@effect/platform-bun/*"],
    define: {
      "globalThis.__ALCHEMY_RUNTIME__": "true",
      "process.env.NODE_ENV": '"production"',
    },
    plugins: [
      {
        name: "benchmark-inputs",
        setup(build) {
          build.onResolve(
            {
              filter:
                /^alchemy\/Cloudflare(?:\/Workers\/(HttpServer|WorkerRuntime))?$/,
            },
            (args) => ({
              path: resolve(
                "node_modules/alchemy/lib/Cloudflare/Workers",
                args.path.endsWith("HttpServer")
                  ? "HttpServer.js"
                  : "WorkerRuntime.js",
              ),
            }),
          );
          build.onResolve({ filter: /^@effect\/sql-pg\/PgClient$/ }, () => ({
            path: resolve("scripts/api-benchmark/pg-wire.ts"),
          }));
          build.onResolve({ filter: /^pg$/ }, () => ({
            path: resolve("scripts/api-benchmark/pg.ts"),
          }));
          if (variant === "before")
            build.onLoad(
              { filter: /packages\/api\/src\/(runtime|auth\/auth)\.ts$/ },
              (args) => ({
                contents: args.path.endsWith("/runtime.ts")
                  ? oldRuntime
                  : original("packages/api/src/auth/auth.ts"),
                loader: "ts",
                resolveDir: resolve(args.path, ".."),
              }),
            );
        },
      },
    ],
  });
  await writeFile(
    `${out}/${variant}.capnp`,
    `using Workerd = import "/workerd/workerd.capnp";\nconst config :Workerd.Config = (services = [(name = "main", worker = (modules = [(name = "worker.mjs", esModule = embed "${variant}.mjs")], compatibilityDate = "2026-06-02", compatibilityFlags = ["nodejs_compat"]))], sockets = [(name = "http", address = "127.0.0.1:8799", http = (), service = "main")]);\n`,
  );
}
console.log(`Built ${baseline} and working tree into ${out}`);
