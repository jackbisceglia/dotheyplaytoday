import { execFileSync } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
const directory = resolve(process.argv[2] ?? ".api-benchmark");
const results = [];
for (const runtime of ["node", "workerd"])
  for (const variant of ["before", "after"]) {
    for (const path of [
      "/api/ping",
      "/api/auth/get-session",
      "/api/user",
      "/api/user/events",
    ])
      for (const authenticated of [false, true]) {
        execFileSync(
          process.execPath,
          [`scripts/api-benchmark/${runtime}.mjs`, variant, directory, "1"],
          {
            env: { ...process.env, BENCH_CASE: `${path}:${authenticated}` },
            stdio: "pipe",
            timeout: 30000,
          },
        );
        const result = JSON.parse(
          await readFile(
            `${directory}/${runtime}-${variant}-cold.json`,
            "utf8",
          ),
        );
        const { warm, ...cold } = result.cases[0];
        results.push({
          runtime,
          variant,
          ...(result.import ? { import: result.import } : {}),
          ...cold,
        });
      }
    console.log(`Completed fresh-process cold requests: ${runtime} ${variant}`);
  }
await writeFile(
  `${directory}/cold.json`,
  JSON.stringify(results, null, 2) + "\n",
);
