import * as NodeRuntime from "@effect/platform-node/NodeRuntime";
import * as NodeServices from "@effect/platform-node/NodeServices";
import {
  Config,
  Console,
  Data,
  Effect,
  Option,
  Path,
  Schema,
  SchemaTransformation,
} from "effect";
import { ChildProcess, ChildProcessSpawner } from "effect/unstable/process";

export const ALCHEMY_STAGE_PATTERN = /^[a-z0-9]+([-_a-z0-9]+)*$/i;

const StageComponent = Schema.String.pipe(
  Schema.decodeTo(
    Schema.NonEmptyString.annotate({
      identifier: "StageComponent",
      expected: "an Alchemy stage component with usable characters",
      description: "an Alchemy stage component with usable characters",
    }),
    SchemaTransformation.transform({
      decode: (value) =>
        value
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9_-]+/g, "-")
          .replace(/^[-_]+|[-_]+$/g, ""),
      encode: (value) => value,
    }),
  ),
);

const decodeStageComponent = Schema.decodeUnknownEffect(StageComponent);

class PrimaryCheckout extends Data.TaggedError("PrimaryCheckout") {}

class InvalidWorktree extends Data.TaggedError("InvalidWorktree")<{
  readonly message: string;
}> {}

export const getUser = Config.string("USER").pipe(
  Config.orElse(() => Config.string("USERNAME")),
  Effect.flatMap(decodeStageComponent),
);

export const getWorktree = Effect.gen(function* () {
  const path = yield* Path.Path;
  const spawner = yield* ChildProcessSpawner.ChildProcessSpawner;
  const output = yield* spawner.string(
    ChildProcess.make("git", [
      "rev-parse",
      "--path-format=absolute",
      "--git-dir",
      "--git-common-dir",
      "--show-toplevel",
    ]),
  );
  const parts = output.trim().split("\n");
  const gitDirectory = parts[0] ?? "";
  const commonDirectory = parts[1] ?? "";
  const topLevel = parts[2] ?? "";

  if (
    parts.length !== 3 ||
    !path.isAbsolute(gitDirectory) ||
    !path.isAbsolute(commonDirectory) ||
    !path.isAbsolute(topLevel)
  ) {
    return yield* new InvalidWorktree({
      message: "Git returned invalid worktree metadata.",
    });
  }

  const git = path.resolve(gitDirectory);
  const common = path.resolve(commonDirectory);
  if (git === common) {
    return yield* new PrimaryCheckout();
  }
  if (
    path.basename(path.dirname(git)) !== "worktrees" ||
    path.dirname(path.dirname(git)) !== common
  ) {
    return yield* new InvalidWorktree({
      message: "Git did not identify a linked worktree safely.",
    });
  }

  return yield* decodeStageComponent(path.basename(path.resolve(topLevel)));
});

export const getStage = Effect.gen(function* () {
  const user = yield* getUser;
  const worktree = yield* getWorktree.pipe(
    Effect.map(Option.some),
    Effect.catchTag("PrimaryCheckout", () => Effect.succeed(Option.none())),
  );

  return Option.match(worktree, {
    onNone: () => `dev_${user}`,
    onSome: (name) => `dev_${user}_${name}`,
  });
});

if (import.meta.main) {
  NodeRuntime.runMain(
    getStage.pipe(Effect.tap(Console.log), Effect.provide(NodeServices.layer)),
  );
}
