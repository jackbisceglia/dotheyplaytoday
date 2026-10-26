import { spawn, execFileSync } from "node:child_process";
import { readFile, writeFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { gzipSync } from "node:zlib";
import WebSocket from "ws";
const variant = process.argv[2] ?? "after";
const directory = resolve(process.argv[3] ?? ".api-benchmark");
const samples = Number(process.argv[4] ?? 300);
const suffix = process.env.BENCH_CASE ? "-cold" : "";
const packageName = (await readdir("node_modules/.pnpm")).find((x) =>
  x.startsWith("@cloudflare+workerd-linux-64@"),
);
if (!packageName)
  throw new Error(
    "This runner requires the installed Linux workerd binary and /proc",
  );
const binary = resolve(
  `node_modules/.pnpm/${packageName}/node_modules/@cloudflare/workerd-linux-64/bin/workerd`,
);
const version = execFileSync(binary, ["--version"], {
  encoding: "utf8",
}).trim();
const child = spawn(
  binary,
  ["serve", `${directory}/${variant}.capnp`, "--inspector-addr=127.0.0.1:9231"],
  { stdio: ["ignore", "pipe", "pipe"] },
);
let logs = "";
child.stdout.on("data", (d) => (logs += d));
child.stderr.on("data", (d) => (logs += d));
const origin = "http://127.0.0.1:8799";
const ticks = Number(
  execFileSync("getconf", ["CLK_TCK"], { encoding: "utf8" }),
);
const cpu = async () => {
  const line = await readFile(`/proc/${child.pid}/stat`, "utf8");
  const fields = line.slice(line.lastIndexOf(")") + 2).split(" ");
  return ((Number(fields[11]) + Number(fields[12])) * 1000) / ticks;
};
const summarize = (values) => {
  const sorted = values.toSorted((a, b) => a - b);
  return {
    median: sorted[Math.floor(sorted.length / 2)],
    p90: sorted[Math.floor(sorted.length * 0.9)],
    mean: values.reduce((a, b) => a + b, 0) / values.length,
  };
};
let ws;
try {
  let targets;
  for (let i = 0; i < 100; i++) {
    if (child.exitCode !== null) throw new Error(logs);
    try {
      targets = await (await fetch("http://127.0.0.1:9231/json")).json();
      if (targets.length) break;
    } catch {}
    await new Promise((r) => setTimeout(r, 50));
  }
  if (!targets?.length) throw new Error(`Inspector unavailable: ${logs}`);
  ws = new WebSocket(targets[0].webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.once("open", resolve);
    ws.once("error", reject);
  });
  let id = 0;
  const pending = new Map();
  ws.on("message", (data) => {
    const message = JSON.parse(data);
    if (message.id) {
      const done = pending.get(message.id);
      pending.delete(message.id);
      message.error ? done.reject(message.error) : done.resolve(message.result);
    }
  });
  const command = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const key = ++id;
      pending.set(key, { resolve, reject });
      ws.send(JSON.stringify({ id: key, method, params }));
    });
  await command("Profiler.enable");
  await command("Profiler.setSamplingInterval", { interval: 1000 });
  await command("Profiler.start");
  const cases = [];
  for (const path of [
    "/api/ping",
    "/api/auth/get-session",
    "/api/user",
    "/api/user/events",
  ])
    for (const authenticated of [false, true]) {
      if (
        process.env.BENCH_CASE &&
        process.env.BENCH_CASE !== `${path}:${authenticated}`
      )
        continue;
      const initStart = performance.now();
      await (await fetch(`${origin}/__init`)).text();
      const initWallMs = performance.now() - initStart;
      const perform = async () => {
        const response = await fetch(
          `${origin}${path}${authenticated ? "?auth" : ""}`,
        );
        const body = await response.text();
        const expected =
          !authenticated && path.startsWith("/api/user") ? 401 : 200;
        if (response.status !== expected)
          throw new Error(`${path}: ${response.status} ${body}\n${logs}`);
        if (
          authenticated &&
          path === "/api/auth/get-session" &&
          !JSON.parse(body)?.session
        )
          throw new Error("Missing session");
        return { status: response.status, body };
      };
      const firstStart = performance.now();
      const response = await perform();
      const firstWallMs = performance.now() - firstStart;
      for (let i = 0; i < 50; i++) await perform();
      const before = await (await fetch(`${origin}/__counters`)).json();
      const cpuBefore = await cpu();
      const wall = [];
      for (let i = 0; i < samples; i++) {
        const start = performance.now();
        await perform();
        wall.push(performance.now() - start);
      }
      const cpuMs = (await cpu()) - cpuBefore;
      const after = await (await fetch(`${origin}/__counters`)).json();
      cases.push({
        path,
        authenticated,
        initWallMs,
        firstWallMs,
        response,
        warm: {
          samples,
          processCpuMs: cpuMs,
          processCpuMeanMs: cpuMs / samples,
          wallMs: summarize(wall),
          counters: Object.fromEntries(
            Object.keys(before).map((k) => [k, after[k] - before[k]]),
          ),
        },
      });
    }
  const { profile } = await command("Profiler.stop");
  await writeFile(
    `${directory}/workerd-${variant}${suffix}.cpuprofile.gz`,
    gzipSync(JSON.stringify(profile)),
  );
  const nodes = new Map(profile.nodes.map((n) => [n.id, n]));
  const counts = new Map();
  for (const sample of profile.samples ?? []) {
    const name = nodes.get(sample)?.callFrame.functionName || "(anonymous)";
    counts.set(name, (counts.get(name) ?? 0) + 1);
  }
  const result = {
    variant,
    runtime: version,
    measurement:
      "Local workerd process CPU from /proc (user+system, includes runtime overhead); inspector enabled; HTTP wall time includes loopback; mocked SQL drivers",
    cpuTickMs: 1000 / ticks,
    profile: {
      samples: profile.samples?.length,
      topFunctions: [...counts].sort((a, b) => b[1] - a[1]).slice(0, 30),
    },
    cases,
  };
  await writeFile(
    `${directory}/workerd-${variant}${suffix}.json`,
    JSON.stringify(result, null, 2) + "\n",
  );
  console.log(JSON.stringify(result, null, 2));
} finally {
  ws?.close();
  child.kill("SIGTERM");
  await writeFile(`${directory}/workerd-${variant}${suffix}.log`, logs);
}
