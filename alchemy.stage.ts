import { Stage } from "alchemy";
import { Config, Effect, Path, Schema } from "effect";
import { ChildProcess, ChildProcessSpawner } from "effect/unstable/process";

// Mirrors Alchemy 2.0.0-beta.63's stage flag schema in
// alchemy/src/Cli/commands/_shared.ts. Alchemy does not impose a maximum
// stage length; its providers apply their own physical-name limits.
export const ALCHEMY_STAGE_PATTERN = /^[a-z0-9]+([-_a-z0-9]+)*$/i;

const DEVELOPMENT_STAGE_PREFIX = "dev_";

type Worktree =
  | { readonly kind: "primary" }
  | { readonly kind: "linked"; readonly name: string };

type WorktreeMetadata = {
  readonly insideWorkTree: string;
  readonly topLevel: string;
  readonly commonDirectory: string;
  readonly gitDirectory: string;
  readonly listedWorktrees: readonly string[];
};

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

export const sanitizeStageComponent = Effect.fn(
  "AlchemyStage.sanitizeComponent",
)(function* (value: unknown, label: string) {
  if (typeof value !== "string" || value.trim().length === 0) {
    return yield* fail(`${label} is missing or empty.`);
  }

  const sanitized = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^[-_]+|[-_]+$/g, "");

  if (sanitized.length === 0 || !/[a-z0-9]/.test(sanitized)) {
    return yield* fail(
      `${label} ${JSON.stringify(value)} has no usable characters after sanitization.`,
    );
  }

  return sanitized;
});

export const resolveDevelopmentStage = Effect.fn(
  "AlchemyStage.resolveDevelopmentStage",
)(function* ({ user, worktree }: { user: unknown; worktree: Worktree }) {
  const userComponent = yield* sanitizeStageComponent(user, "development user");
  const worktreeComponent =
    worktree.kind === "linked"
      ? yield* sanitizeStageComponent(
          worktree.name,
          "linked worktree directory name",
        )
      : undefined;
  const stage = `${DEVELOPMENT_STAGE_PREFIX}${userComponent}${
    worktreeComponent === undefined ? "" : `_${worktreeComponent}`
  }`;

  if (!ALCHEMY_STAGE_PATTERN.test(stage)) {
    return yield* fail(
      `resolved stage ${JSON.stringify(stage)} violates Alchemy's stage-name constraints.`,
    );
  }
  if (!stage.startsWith(DEVELOPMENT_STAGE_PREFIX) || stage === "production") {
    return yield* fail(
      `refusing unsafe non-development stage ${JSON.stringify(stage)}.`,
    );
  }

  return stage;
});

export const parseWorktreeList = Effect.fn("AlchemyStage.parseWorktreeList")(
  function* (output: string) {
    const entries = output.split("\0\0").filter((entry) => entry.length > 0);

    return yield* Effect.forEach(entries, (entry) => {
      const worktree = entry
        .split("\0")
        .find((field) => field.startsWith("worktree "))
        ?.slice("worktree ".length);
      return worktree === undefined || worktree.length === 0
        ? fail("Git returned a worktree entry without a directory.")
        : Effect.succeed(worktree);
    });
  },
);

export const identifyWorktree = Effect.fn("AlchemyStage.identifyWorktree")(
  function* ({
    insideWorkTree,
    topLevel,
    commonDirectory,
    gitDirectory,
    listedWorktrees,
  }: WorktreeMetadata) {
    const path = yield* Path.Path;

    if (insideWorkTree !== "true") {
      return yield* fail("the current directory is not a Git worktree.");
    }

    const paths = [topLevel, commonDirectory, gitDirectory, ...listedWorktrees];
    if (
      paths.some(
        (candidate) =>
          candidate.trim().length === 0 || !path.isAbsolute(candidate),
      )
    ) {
      return yield* fail(
        "Git returned missing or non-absolute worktree metadata.",
      );
    }

    const top = path.resolve(topLevel);
    const common = path.resolve(commonDirectory);
    const git = path.resolve(gitDirectory);
    const matchingWorktrees = listedWorktrees.filter(
      (worktree) => path.resolve(worktree) === top,
    );
    if (matchingWorktrees.length !== 1) {
      return yield* fail(
        `Git worktree metadata does not uniquely identify ${JSON.stringify(top)}.`,
      );
    }

    if (git === common) {
      return { kind: "primary" } satisfies Worktree;
    }

    if (
      path.basename(path.dirname(git)) !== "worktrees" ||
      path.dirname(path.dirname(git)) !== common
    ) {
      return yield* fail(
        "Git directories do not positively identify a primary or linked worktree.",
      );
    }

    const name = path.basename(top);
    if (name.length === 0 || name === path.parse(top).root) {
      return yield* fail(
        "the linked worktree directory name could not be determined.",
      );
    }
    return { kind: "linked", name } satisfies Worktree;
  },
);

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

export const discoverWorktree = Effect.fn("AlchemyStage.discoverWorktree")(
  function* () {
    const insideWorkTree = yield* git(["rev-parse", "--is-inside-work-tree"]);
    const topLevel = yield* git(["rev-parse", "--show-toplevel"]);
    const commonDirectory = yield* git([
      "rev-parse",
      "--path-format=absolute",
      "--git-common-dir",
    ]);
    const gitDirectory = yield* git([
      "rev-parse",
      "--path-format=absolute",
      "--git-dir",
    ]);
    const listedWorktrees = yield* git([
      "worktree",
      "list",
      "--porcelain",
      "-z",
    ]).pipe(Effect.flatMap(parseWorktreeList));

    return yield* identifyWorktree({
      insideWorkTree,
      topLevel,
      commonDirectory,
      gitDirectory,
      listedWorktrees,
    });
  },
);

export const DevelopmentStage = Effect.gen(function* () {
  const user = yield* Config.string("USER").pipe(
    Config.orElse(() => Config.string("USERNAME")),
    Effect.mapError(
      (cause) =>
        new DevelopmentStageError({
          message:
            "Unable to resolve development Alchemy stage: development user is missing.",
          cause,
        }),
    ),
  );
  const worktree = yield* discoverWorktree();
  return yield* resolveDevelopmentStage({ user, worktree });
});

export const RuntimeStage = Stage.pipe(
  Effect.flatMap((stage) =>
    stage.startsWith(DEVELOPMENT_STAGE_PREFIX)
      ? DevelopmentStage
      : Effect.succeed(stage),
  ),
);

export const withRuntimeStage = <A, E, R>(
  stack: Effect.Effect<A, E, R | Stage>,
) =>
  RuntimeStage.pipe(
    Effect.flatMap((stage) => stack.pipe(Effect.provideService(Stage, stage))),
  );
