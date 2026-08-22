import { Stage } from "alchemy";
import { describe, expect, it } from "vitest";
import { ConfigProvider, Effect, Layer, Path, PlatformError } from "effect";
import { ChildProcessSpawner } from "effect/unstable/process";

import {
  ALCHEMY_STAGE_PATTERN,
  DevelopmentStage,
  ResolvedDevelopmentStage,
  RuntimeStage,
  User,
  Worktree,
  WorktreeLive,
  withRuntimeStage,
} from "./alchemy.stage.ts";

const primary = Worktree.of({ kind: "primary" });
const linked = (name: string) => Worktree.of({ kind: "linked", name });
const run = <A, E>(effect: Effect.Effect<A, E>) => Effect.runSync(effect);
const resolve = (user: string, worktree: Worktree["Service"]) =>
  DevelopmentStage.pipe(
    Effect.provideService(User, User.of(user)),
    Effect.provideService(Worktree, worktree),
    run,
  );

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

const primaryGitOutputs = {
  "rev-parse --is-inside-work-tree": "true\n",
  "rev-parse --show-toplevel": "/repo\n",
  "rev-parse --path-format=absolute --git-common-dir": "/repo/.git\n",
  "rev-parse --path-format=absolute --git-dir": "/repo/.git\n",
};

const linkedGitOutputs = {
  ...primaryGitOutputs,
  "rev-parse --show-toplevel": "/repo/worktrees/stable-name\n",
  "rev-parse --path-format=absolute --git-dir":
    "/repo/.git/worktrees/internal-id\n",
};

const resolveLive = (
  outputs: Readonly<Record<string, string>>,
  env: Record<string, string> = { USER: "jackb" },
) =>
  ResolvedDevelopmentStage.pipe(
    Effect.provide(
      Layer.mergeAll(Path.layer, gitLayer(outputs), configLayer(env)),
    ),
    run,
  );

describe("development Alchemy stage", () => {
  it("uses dev_<user> in the primary checkout", () => {
    expect(resolve("jackb", primary)).toBe("dev_jackb");
    expect(resolveLive(primaryGitOutputs)).toBe("dev_jackb");
  });

  it("uses dev_<user>_<directory> in a linked worktree", () => {
    expect(resolve("jackb", linked("t3code-b6f3eaab"))).toBe(
      "dev_jackb_t3code-b6f3eaab",
    );
    expect(resolveLive(linkedGitOutputs)).toBe("dev_jackb_stable-name");
  });

  it("gives differently named linked worktrees different stages", () => {
    expect(resolve("jackb", linked("feature-one"))).not.toBe(
      resolve("jackb", linked("feature-two")),
    );
  });

  it("does not inspect or depend on the current branch", () => {
    expect(resolveLive(linkedGitOutputs)).toBe("dev_jackb_stable-name");
    expect(Object.keys(linkedGitOutputs)).not.toContainEqual(
      expect.stringContaining("branch"),
    );
  });

  it("sanitizes components according to Alchemy's stage grammar", () => {
    expect(resolve("Jane.Doe", linked("Feature One@2026"))).toBe(
      "dev_jane-doe_feature-one-2026",
    );
  });

  it.each(["", "   ", "!!!"])(
    "fails closed for invalid user identity %j",
    (user) => {
      expect(() => resolve(user, primary)).toThrow(/development user/);
    },
  );

  it("fails closed when the development user is missing", () => {
    expect(() => resolveLive(primaryGitOutputs, {})).toThrow(
      /development user is missing/,
    );
  });

  it("fails closed when Git discovery fails", () => {
    expect(() => resolveLive({})).toThrow(/Git discovery failed/);
  });

  it.each(["", "---", "___", "!@#"])(
    "fails closed for unusable worktree directory name %j",
    (name) => {
      expect(() => resolve("jackb", linked(name))).toThrow(
        /worktree directory name/,
      );
    },
  );

  it("cannot resolve production or another non-development stage", () => {
    for (const worktree of [primary, linked("production")]) {
      const stage = resolve("production", worktree);
      expect(stage).not.toBe("production");
      expect(stage.startsWith("dev_")).toBe(true);
      expect(ALCHEMY_STAGE_PATTERN.test(stage)).toBe(true);
    }
  });

  it("preserves distinct long names because Alchemy has no stage length limit", () => {
    const first = resolve("developer", linked(`${"a".repeat(300)}1`));
    const second = resolve("developer", linked(`${"a".repeat(300)}2`));

    expect(first).not.toBe(second);
    expect(ALCHEMY_STAGE_PATTERN.test(first)).toBe(true);
    expect(first.length).toBeGreaterThan(63);
  });

  it("fails closed when Git cannot positively identify the topology", () => {
    expect(() =>
      resolveLive({
        ...linkedGitOutputs,
        "rev-parse --path-format=absolute --git-dir": "/unexpected/git-dir\n",
      }),
    ).toThrow(/positively identify/);
  });

  it("rejects missing or non-absolute Git paths", () => {
    expect(() =>
      resolveLive({
        ...primaryGitOutputs,
        "rev-parse --show-toplevel": "",
      }),
    ).toThrow(/missing or non-absolute/);
  });

  it("rejects an empty linked worktree directory name", () => {
    expect(() =>
      Worktree.pipe(
        Effect.provide(WorktreeLive),
        Effect.provide(
          Layer.mergeAll(
            Path.layer,
            gitLayer({
              ...linkedGitOutputs,
              "rev-parse --show-toplevel": "/",
            }),
          ),
        ),
        run,
      ),
    ).toThrow(/directory name could not be determined/);
  });

  it("overrides Stage around the complete stack effect in development", () => {
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
      expect(
        RuntimeStage.pipe(Effect.provide(Layer.succeed(Stage, stage)), run),
      ).toBe(stage);
    }
  });
});
