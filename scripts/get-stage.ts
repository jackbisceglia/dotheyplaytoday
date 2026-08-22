import * as NodeRuntime from "@effect/platform-node/NodeRuntime";
import * as NodeServices from "@effect/platform-node/NodeServices";
import { Config, Console, Effect, Path, Schema } from "effect";
import { ChildProcess, ChildProcessSpawner } from "effect/unstable/process";

export const ALCHEMY_STAGE_PATTERN = /^[a-z0-9]+([-_a-z0-9]+)*$/i;

export class StageError extends Schema.TaggedErrorClass<StageError>()(
  "StageError",
  { message: Schema.String, cause: Schema.optional(Schema.Defect()) },
) {}

const fail = (message: string, cause?: unknown) =>
  Effect.fail(
    new StageError({ message, ...(cause === undefined ? {} : { cause }) }),
  );

const sanitize = Effect.fn("Stage.sanitize")(function* (
  value: string,
  component: string,
) {
  const sanitized = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^[-_]+|[-_]+$/g, "");

  return sanitized.length > 0
    ? sanitized
    : yield* fail(`${component} has no usable characters.`);
});

export const resolveStage = Effect.fn("Stage.resolve")(function* ({
  user,
  gitOutput,
}: {
  readonly user: string;
  readonly gitOutput: string;
}) {
  const path = yield* Path.Path;
  const parts = gitOutput.trim().split("\n");
  const gitDirectory = parts[0] ?? "";
  const commonDirectory = parts[1] ?? "";
  const topLevel = parts[2] ?? "";

  if (
    parts.length !== 3 ||
    !path.isAbsolute(gitDirectory) ||
    !path.isAbsolute(commonDirectory) ||
    !path.isAbsolute(topLevel)
  ) {
    return yield* fail("Git returned invalid worktree metadata.");
  }

  const userName = yield* sanitize(user, "development user");
  const git = path.resolve(gitDirectory);
  const common = path.resolve(commonDirectory);
  let stage = `dev_${userName}`;

  if (git !== common) {
    if (
      path.basename(path.dirname(git)) !== "worktrees" ||
      path.dirname(path.dirname(git)) !== common
    ) {
      return yield* fail("Git did not identify a linked worktree safely.");
    }

    const worktreeName = yield* sanitize(
      path.basename(path.resolve(topLevel)),
      "linked worktree directory name",
    );
    stage += `_${worktreeName}`;
  }

  return ALCHEMY_STAGE_PATTERN.test(stage)
    ? stage
    : yield* fail(`${JSON.stringify(stage)} is not a valid Alchemy stage.`);
});

export const getStage = Effect.gen(function* () {
  const user = yield* Config.string("USER").pipe(
    Config.orElse(() => Config.string("USERNAME")),
    Effect.mapError(
      (cause) =>
        new StageError({ message: "Development user is missing.", cause }),
    ),
  );
  const spawner = yield* ChildProcessSpawner.ChildProcessSpawner;
  const gitOutput = yield* spawner
    .string(
      ChildProcess.make("git", [
        "rev-parse",
        "--path-format=absolute",
        "--git-dir",
        "--git-common-dir",
        "--show-toplevel",
      ]),
    )
    .pipe(
      Effect.mapError(
        (cause) =>
          new StageError({ message: "Git worktree discovery failed.", cause }),
      ),
    );

  return yield* resolveStage({ user, gitOutput });
});

if (import.meta.main) {
  NodeRuntime.runMain(
    getStage.pipe(Effect.tap(Console.log), Effect.provide(NodeServices.layer)),
  );
}
