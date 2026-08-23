import * as NodeRuntime from "@effect/platform-node/NodeRuntime";
import * as NodeServices from "@effect/platform-node/NodeServices";
import {
  Config,
  Console,
  Effect,
  Option,
  Path,
  Schema,
  SchemaTransformation,
} from "effect";
import { ChildProcess, ChildProcessSpawner } from "effect/unstable/process";

export const ALCHEMY_STAGE_PATTERN = /^[a-z0-9]+([-_a-z0-9]+)*$/i;

/**
 * Normalizes a username or worktree directory into an Alchemy stage component.
 * Alchemy accepts letters, numbers, hyphens, and underscores, with no length
 * limit. Normalization is followed by a non-empty check so unusable identities
 * fail instead of selecting a shared stage.
 */
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

class InvalidWorktree extends Schema.TaggedErrorClass<InvalidWorktree>()(
  "InvalidWorktree",
  { message: Schema.String },
) {}

export const User = Effect.gen(function* () {
  const user = yield* Config.string("USER").pipe(
    Config.orElse(() => Config.string("USERNAME")),
  );

  return yield* decodeStageComponent(user);
});

export const Worktree = Effect.gen(function* () {
  const path = yield* Path.Path;
  const spawner = yield* ChildProcessSpawner.ChildProcessSpawner;

  const command = ChildProcess.make("git", [
    "rev-parse",
    "--path-format=absolute",
    "--git-dir",
    "--git-common-dir",
    "--show-toplevel",
  ]);
  const metadata = yield* spawner.string(command);

  const parts = metadata.trim().split("\n");
  const [gitDirectory = "", commonDirectory = "", topLevel = ""] = parts;

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
    return Option.none();
  }

  if (
    path.basename(path.dirname(git)) !== "worktrees" ||
    path.dirname(path.dirname(git)) !== common
  ) {
    return yield* new InvalidWorktree({
      message: "Git did not identify a linked worktree safely.",
    });
  }

  const name = yield* decodeStageComponent(
    path.basename(path.resolve(topLevel)),
  );

  return Option.some(name);
});

export const getStage = Effect.gen(function* () {
  const user = yield* User;
  const worktree = yield* Worktree;

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
