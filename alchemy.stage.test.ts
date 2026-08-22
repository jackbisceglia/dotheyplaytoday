import { describe, expect, it } from "vitest";
import { ConfigProvider, Effect, Layer, Path, PlatformError } from "effect";
import { ChildProcessSpawner } from "effect/unstable/process";
import { Stage } from "alchemy";

import {
  ALCHEMY_STAGE_PATTERN,
  discoverWorktree,
  identifyWorktree,
  DevelopmentStage,
  resolveDevelopmentStage,
  RuntimeStage,
  withRuntimeStage,
} from "./alchemy.stage.ts";

const primary = { kind: "primary" } as const;
const linked = (name: string) => ({ kind: "linked", name }) as const;
const run = <A, E>(effect: Effect.Effect<A, E>) => Effect.runSync(effect);
const runWithPath = <A, E>(effect: Effect.Effect<A, E, Path.Path>) =>
  run(effect.pipe(Effect.provide(Path.layer)));

const gitFailure = new PlatformError.PlatformError(
  new PlatformError.SystemError({
    _tag: "Unknown",
    module: "ChildProcess",
    method: "spawn",
    description: "git unavailable",
  }),
);

const gitLayer = (outputs: Readonly<Record<string, string>>) =>
  Layer.mock(ChildProcessSpawner.ChildProcessSpawner, {
    string: (command) => {
      if (command._tag !== "StandardCommand") {
        return Effect.die(new Error("Expected a standard Git command"));
      }
      const output = outputs[command.args.join(" ")];
      return output === undefined
        ? Effect.fail(gitFailure)
        : Effect.succeed(output);
    },
  });

const configLayer = (env: Record<string, string>) =>
  ConfigProvider.layer(ConfigProvider.fromEnv({ env }));

const linkedGitOutputs = {
  "rev-parse --is-inside-work-tree": "true\n",
  "rev-parse --show-toplevel": "/repo/worktrees/stable-name\n",
  "rev-parse --path-format=absolute --git-common-dir": "/repo/.git\n",
  "rev-parse --path-format=absolute --git-dir":
    "/repo/.git/worktrees/internal-id\n",
  "worktree list --porcelain -z":
    "worktree /repo\0HEAD abc\0branch refs/heads/main\0\0" +
    "worktree /repo/worktrees/stable-name\0HEAD def\0branch refs/heads/feature-one\0\0",
};

describe("development Alchemy stage", () => {
  it("uses the shared user stage in the positively identified primary checkout", () => {
    expect(
      run(resolveDevelopmentStage({ user: "jackb", worktree: primary })),
    ).toBe("dev_jackb");
  });

  it("adds the linked worktree directory name", () => {
    expect(
      run(
        resolveDevelopmentStage({
          user: "jackb",
          worktree: linked("t3code-b6f3eaab"),
        }),
      ),
    ).toBe("dev_jackb_t3code-b6f3eaab");
  });

  it("gives differently named linked worktrees different stages", () => {
    const first = run(
      resolveDevelopmentStage({
        user: "jackb",
        worktree: linked("feature-one"),
      }),
    );
    const second = run(
      resolveDevelopmentStage({
        user: "jackb",
        worktree: linked("feature-two"),
      }),
    );

    expect(first).not.toBe(second);
  });

  it("discovers Git through Effect DI and ignores branch metadata", () => {
    const stage = DevelopmentStage.pipe(
      Effect.provide(
        Layer.mergeAll(
          Path.layer,
          gitLayer(linkedGitOutputs),
          configLayer({ USER: "jackb" }),
        ),
      ),
      run,
    );

    expect(stage).toBe("dev_jackb_stable-name");
  });

  it("does not change when only the branch changes", () => {
    const changedBranch = {
      ...linkedGitOutputs,
      "worktree list --porcelain -z": linkedGitOutputs[
        "worktree list --porcelain -z"
      ].replace("refs/heads/feature-one", "refs/heads/completely-different"),
    };
    const resolve = (outputs: Readonly<Record<string, string>>) =>
      DevelopmentStage.pipe(
        Effect.provide(
          Layer.mergeAll(
            Path.layer,
            gitLayer(outputs),
            configLayer({ USER: "jackb" }),
          ),
        ),
        run,
      );

    expect(resolve(changedBranch)).toBe(resolve(linkedGitOutputs));
  });

  it("sanitizes invalid characters consistently", () => {
    expect(
      run(
        resolveDevelopmentStage({
          user: "Jane.Doe",
          worktree: linked("Feature One@2026"),
        }),
      ),
    ).toBe("dev_jane-doe_feature-one-2026");
  });

  it.each([undefined, "", "   ", "!!!"])(
    "fails closed for missing or invalid user identity %j",
    (user) => {
      expect(() =>
        run(resolveDevelopmentStage({ user, worktree: primary })),
      ).toThrow(/development user/);
    },
  );

  it("fails closed when Git discovery fails", () => {
    expect(() =>
      discoverWorktree().pipe(
        Effect.provide(Layer.mergeAll(Path.layer, gitLayer({}))),
        run,
      ),
    ).toThrow(/Git discovery failed/);
  });

  it.each(["", "---", "___", "!@#"])(
    "fails closed for unusable worktree directory name %j",
    (name) => {
      expect(() =>
        run(resolveDevelopmentStage({ user: "jackb", worktree: linked(name) })),
      ).toThrow(/worktree directory name/);
    },
  );

  it("cannot resolve production or another non-development stage", () => {
    for (const worktree of [primary, linked("production")]) {
      const stage = run(
        resolveDevelopmentStage({ user: "production", worktree }),
      );
      expect(stage).not.toBe("production");
      expect(stage.startsWith("dev_")).toBe(true);
      expect(ALCHEMY_STAGE_PATTERN.test(stage)).toBe(true);
    }
  });

  it("preserves distinct long names because Alchemy has no stage length limit", () => {
    const first = run(
      resolveDevelopmentStage({
        user: "developer",
        worktree: linked(`${"a".repeat(300)}1`),
      }),
    );
    const second = run(
      resolveDevelopmentStage({
        user: "developer",
        worktree: linked(`${"a".repeat(300)}2`),
      }),
    );

    expect(first).not.toBe(second);
    expect(ALCHEMY_STAGE_PATTERN.test(first)).toBe(true);
    expect(first.length).toBeGreaterThan(63);
  });

  it("requires Git to positively identify the checkout topology", () => {
    expect(() =>
      runWithPath(
        identifyWorktree({
          insideWorkTree: "true",
          topLevel: "/repo/worktrees/current",
          commonDirectory: "/repo/.git",
          gitDirectory: "/unexpected/git-dir",
          listedWorktrees: ["/repo/worktrees/current"],
        }),
      ),
    ).toThrow(/positively identify/);
  });

  it("rejects missing Git paths instead of interpreting them as the current directory", () => {
    expect(() =>
      runWithPath(
        identifyWorktree({
          insideWorkTree: "true",
          topLevel: "",
          commonDirectory: "/repo/.git",
          gitDirectory: "/repo/.git",
          listedWorktrees: ["/repo"],
        }),
      ),
    ).toThrow(/missing or non-absolute/);
  });

  it("overrides the Stage service around the complete stack effect in development", () => {
    const stack = Stage.pipe(Effect.map((stage) => ({ stage })));
    const result = withRuntimeStage(stack).pipe(
      Effect.provide(
        Layer.mergeAll(
          Path.layer,
          gitLayer(linkedGitOutputs),
          configLayer({ USER: "jackb" }),
          Layer.succeed(Stage, "dev_jackb"),
        ),
      ),
      run,
    );

    expect(result).toEqual({ stage: "dev_jackb_stable-name" });
  });

  it("leaves production and other non-development stages unchanged", () => {
    for (const stage of ["production", "staging"]) {
      const resolved = RuntimeStage.pipe(
        Effect.provide(
          Layer.mergeAll(
            Path.layer,
            gitLayer({}),
            configLayer({}),
            Layer.succeed(Stage, stage),
          ),
        ),
        run,
      );
      expect(resolved).toBe(stage);
    }
  });
});
