import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { writeFile } from "node:fs/promises";
const variant = process.argv[2] ?? "after";
const directory = resolve(process.argv[3] ?? ".api-benchmark");
const samples = Number(process.argv[4] ?? 300);
const suffix = process.env.BENCH_CASE ? "-cold" : "";
const measure = async (f) => {
  const cpu = process.cpuUsage();
  const wall = performance.now();
  const value = await f();
  const elapsed = process.cpuUsage(cpu);
  return {
    value,
    wallMs: performance.now() - wall,
    cpuMs: (elapsed.user + elapsed.system) / 1000,
  };
};
const loaded = await measure(
  () => import(pathToFileURL(`${directory}/${variant}.mjs`)),
);
const app = loaded.value;
await app.prepare();
const summarize = (values) => {
  const sorted = values.toSorted((a, b) => a - b);
  return {
    median: sorted[Math.floor(sorted.length / 2)],
    p90: sorted[Math.floor(sorted.length * 0.9)],
    mean: values.reduce((a, b) => a + b, 0) / values.length,
  };
};
const cases = [];
for (const path of [
  "/api/ping",
  "/api/auth/get-session",
  "/api/user",
  "/api/user/events",
]) {
  for (const authenticated of [false, true]) {
    if (
      process.env.BENCH_CASE &&
      process.env.BENCH_CASE !== `${path}:${authenticated}`
    )
      continue;
    const init = await measure(app.initialize);
    const perform = async () => {
      const response = await app.request(path, authenticated);
      const body = await response.text();
      const expected =
        !authenticated && path.startsWith("/api/user") ? 401 : 200;
      if (response.status !== expected)
        throw new Error(`${path}: ${response.status}: ${body}`);
      if (
        authenticated &&
        path === "/api/auth/get-session" &&
        !JSON.parse(body)?.session
      )
        throw new Error("Missing session");
      return { status: response.status, body };
    };
    const first = await measure(perform);
    for (let i = 0; i < 50; i++) await perform();
    const runs = [];
    const start = { ...app.counters };
    for (let i = 0; i < samples; i++) {
      const { cpuMs, wallMs } = await measure(perform);
      runs.push({ cpuMs, wallMs });
    }
    cases.push({
      path,
      authenticated,
      init: { cpuMs: init.cpuMs, wallMs: init.wallMs },
      first,
      warm: {
        samples,
        cpuMs: summarize(runs.map((x) => x.cpuMs)),
        wallMs: summarize(runs.map((x) => x.wallMs)),
        counters: Object.fromEntries(
          Object.keys(start).map((k) => [k, app.counters[k] - start[k]]),
        ),
      },
    });
  }
}
const result = {
  variant,
  runtime: process.version,
  measurement:
    "Node process CPU (user+system) and wall time; mocked SQL drivers; modules imported once",
  import: { cpuMs: loaded.cpuMs, wallMs: loaded.wallMs },
  cases,
};
await writeFile(
  `${directory}/node-${variant}${suffix}.json`,
  JSON.stringify(result, null, 2) + "\n",
);
console.log(JSON.stringify(result, null, 2));
