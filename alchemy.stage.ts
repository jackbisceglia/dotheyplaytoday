import { Stage } from "alchemy";
import { Config, Context, Effect, Layer, Path, Schema } from "effect";
import { ChildProcess, ChildProcessSpawner } from "effect/unstable/process";

// Mirrors Alchemy 2.0.0-beta.63's stage flag schema in
// alchemy/src/Cli/commands/_shared.ts. Alchemy does not impose a maximum
// stage length; its providers apply their own physical-name limits.
export const ALCHEMY_STAGE_PATTERN = /^[a-z0-9]+([-_a-z0-9]+)*$/i;

const DEVELOPMENT_STAGE_PREFIX = "dev_";

export type WorktreeIdentity =
  | { readonly kind: "primary" }
  | { readonly kind: "linked"; readonly name: string };

export class User extends Context.Service<User, string>()(
  "@dtpt/alchemy/User",
) {}

export class Worktree extends Context.Service<Worktree, WorktreeIdentity>()(
  "@dtpt/alchemy/Worktree",
) {}

export class DevelopmentStageError extends Schema.TaggedErrorClass<DevelopmentStageError>()(
  "DevelopmentStageError",
  {
    message: Schema.String,
    cause: Schema.optional(Schema.Defect()),
  },
) {}

const fail = (message: string, cause?: unknown) =>
  Effect.fail(
    new DevelopmentStageError({
      message: `Unable to resolve development Alchemy stage: ${message}`,
      ...(cause === undefined ? {} : { cause }),
    }),
  );

const sanitize = Effect.fn("AlchemyStage.sanitize")(function* (
  value: string,
  label: string,
) {
  const sanitized = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^[-_]+|[-_]+$/g, "");

  if (sanitized.length === 0) {
    return yield* fail(
      `${label} ${JSON.stringify(value)} has no usable characters after sanitization.`,
    );
  }

  return sanitized;
});

export const DevelopmentStage = Effect.gen(function* () {
  const user = yield* sanitize(yield* User, "development user");
  const worktree = yield* Worktree;
  const name =
    worktree.kind === "linked"
      ? yield* sanitize(worktree.name, "linked worktree directory name")
      : undefined;
  const stage = [DEVELOPMENT_STAGE_PREFIX.slice(0, -1), user, name]
    .filter((component) => component !== undefined)
    .join("_");

  if (!stage.startsWith(DEVELOPMENT_STAGE_PREFIX)) {
    return yield* fail(`refusing unsafe non-development stage ${stage}.`);
  }
  if (!ALCHEMY_STAGE_PATTERN.test(stage)) {
    return yield* fail(
      `resolved stage ${JSON.stringify(stage)} violates Alchemy's stage-name constraints.`,
    );
  }

  return stage;
});

const git = Effect.fn("AlchemyStage.git")(function* (args: readonly string[]) {
  const spawner = yield* ChildProcessSpawner.ChildProcessSpawner;
  return yield* spawner.string(ChildProcess.make("git", args)).pipe(
    Effect.map((output) => output.trim()),
    Effect.mapError(
      (cause) =>
        new DevelopmentStageError({
          message: `Unable to resolve development Alchemy stage: Git discovery failed while running "git ${args.join(" ")}".`,
          cause,
        }),
    ),
  );
});

export const UserLive = Layer.effect(
  User,
  Config.string("USER").pipe(
    Config.orElse(() => Config.string("USERNAME")),
    Effect.flatMap((user) =>
      user.trim().length === 0
        ? fail("development user is missing or empty.")
        : Effect.succeed(User.of(user)),
    ),
    Effect.mapError((cause) =>
      cause instanceof DevelopmentStageError
        ? cause
        : new DevelopmentStageError({
            message:
              "Unable to resolve development Alchemy stage: development user is missing.",
            cause,
          }),
    ),
  ),
);

export const WorktreeLive = Layer.effect(
  Worktree,
  Effect.gen(function* () {
    const path = yield* Path.Path;
    const inside = yield* git(["rev-parse", "--is-inside-work-tree"]);
    const top = yield* git(["rev-parse", "--show-toplevel"]);
    const common = yield* git([
      "rev-parse",
      "--path-format=absolute",
      "--git-common-dir",
    ]);
    const directory = yield* git([
      "rev-parse",
      "--path-format=absolute",
      "--git-dir",
    ]);

    if (inside !== "true") {
      return yield* fail("the current directory is not a Git worktree.");
    }
    if (
      [top, common, directory].some(
        (candidate) => candidate.length === 0 || !path.isAbsolute(candidate),
      )
    ) {
      return yield* fail(
        "Git returned missing or non-absolute worktree metadata.",
      );
    }

    const normalizedCommon = path.resolve(common);
    const normalizedDirectory = path.resolve(directory);
    if (normalizedDirectory === normalizedCommon) {
      return Worktree.of({ kind: "primary" });
    }
    if (
      path.basename(path.dirname(normalizedDirectory)) !== "worktrees" ||
      path.dirname(path.dirname(normalizedDirectory)) !== normalizedCommon
    ) {
      return yield* fail(
        "Git directories do not positively identify a primary or linked worktree.",
      );
    }

    const name = path.basename(path.resolve(top));
    if (name.length === 0 || name === path.parse(path.resolve(top)).root) {
      return yield* fail(
        "the linked worktree directory name could not be determined.",
      );
    }
    return Worktree.of({ kind: "linked", name });
  }),
);

export const DevelopmentIdentityLive = Layer.merge(UserLive, WorktreeLive);

export const ResolvedDevelopmentStage = DevelopmentStage.pipe(
  Effect.provide(DevelopmentIdentityLive),
);

export const RuntimeStage = Stage.pipe(
  Effect.flatMap((stage) =>
    stage.startsWith(DEVELOPMENT_STAGE_PREFIX)
      ? ResolvedDevelopmentStage
      : Effect.succeed(stage),
  ),
);

export const withRuntimeStage = <A, E, R>(
  stack: Effect.Effect<A, E, R | Stage>,
) =>
  RuntimeStage.pipe(
    Effect.flatMap((stage) => stack.pipe(Effect.provideService(Stage, stage))),
  );
