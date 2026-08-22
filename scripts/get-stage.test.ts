import { describe, expect, it } from "vitest";
import { ConfigProvider, Effect, Layer, Path, PlatformError } from "effect";
import { ChildProcessSpawner } from "effect/unstable/process";

import { ALCHEMY_STAGE_PATTERN, getStage, resolveStage } from "./get-stage.ts";

const primary = ["/repo/.git", "/repo/.git", "/repo"].join("\n");
const linked = (name: string) =>
  ["/repo/.git/worktrees/internal-id", "/repo/.git", `/worktrees/${name}`].join(
    "\n",
  );

const run = <A, E>(effect: Effect.Effect<A, E, Path.Path>) =>
  Effect.runSync(effect.pipe(Effect.provide(Path.layer)));
const resolve = (user: string, gitOutput: string) =>
  run(resolveStage({ user, gitOutput }));

const gitFailure = new PlatformError.PlatformError(
  new PlatformError.SystemError({
    _tag: "Unknown",
    module: "ChildProcess",
    method: "spawn",
    description: "git unavailable",
  }),
);

const gitLayer = (output?: string) =>
  Layer.mock(ChildProcessSpawner.ChildProcessSpawner, {
    string: () =>
      output === undefined ? Effect.fail(gitFailure) : Effect.succeed(output),
  });

const runLive = (env: Record<string, string>, output?: string) =>
  getStage.pipe(
    Effect.provide(
      Layer.mergeAll(
        Path.layer,
        gitLayer(output),
        ConfigProvider.layer(ConfigProvider.fromEnv({ env })),
      ),
    ),
    Effect.runSync,
  );

describe("development Alchemy stage", () => {
  it("uses dev_<user> in the primary checkout", () => {
    expect(resolve("jackb", primary)).toBe("dev_jackb");
  });

  it("adds the linked worktree directory name", () => {
    expect(resolve("jackb", linked("t3code-b6f3eaab"))).toBe(
      "dev_jackb_t3code-b6f3eaab",
    );
  });

  it("gives different linked worktree directories different stages", () => {
    expect(resolve("jackb", linked("one"))).not.toBe(
      resolve("jackb", linked("two")),
    );
  });

  it("does not inspect or depend on a branch name", () => {
    expect(resolve("jackb", linked("stable-name"))).toBe(
      "dev_jackb_stable-name",
    );
  });

  it("sanitizes components to Alchemy's stage grammar", () => {
    expect(resolve("Jane.Doe", linked("Feature One@2026"))).toBe(
      "dev_jane-doe_feature-one-2026",
    );
  });

  it.each(["", "   ", "!!!"])("rejects invalid users %j", (user) => {
    expect(() => resolve(user, primary)).toThrow(/development user/);
  });

  it("fails when the user environment is missing", () => {
    expect(() => runLive({}, primary)).toThrow(/Development user is missing/);
  });

  it("supports Alchemy's USERNAME fallback", () => {
    expect(runLive({ USERNAME: "windows-user" }, primary)).toBe(
      "dev_windows-user",
    );
  });

  it("fails when Git discovery fails", () => {
    expect(() => runLive({ USER: "jackb" })).toThrow(
      /Git worktree discovery failed/,
    );
  });

  it("fails for malformed Git output", () => {
    expect(() => resolve("jackb", "/repo/.git\n/repo/.git")).toThrow(
      /invalid worktree metadata/,
    );
  });

  it("fails when Git cannot safely identify a linked worktree", () => {
    expect(() =>
      resolve(
        "jackb",
        ["/unexpected/git", "/repo/.git", "/worktrees/current"].join("\n"),
      ),
    ).toThrow(/identify a linked worktree safely/);
  });

  it.each(["---", "___", "!@#"])(
    "rejects an unusable worktree directory %j",
    (name) => {
      expect(() => resolve("jackb", linked(name))).toThrow(
        /worktree directory name/,
      );
    },
  );

  it("always produces a development stage", () => {
    const stage = resolve("production", linked("production"));

    expect(stage).not.toBe("production");
    expect(stage.startsWith("dev_")).toBe(true);
    expect(ALCHEMY_STAGE_PATTERN.test(stage)).toBe(true);
  });

  it("preserves long names because Alchemy has no stage length limit", () => {
    const first = resolve("developer", linked(`${"a".repeat(300)}1`));
    const second = resolve("developer", linked(`${"a".repeat(300)}2`));

    expect(first).not.toBe(second);
    expect(first.length).toBeGreaterThan(63);
    expect(ALCHEMY_STAGE_PATTERN.test(first)).toBe(true);
  });
});
