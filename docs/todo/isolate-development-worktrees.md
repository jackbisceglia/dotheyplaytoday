# Isolate development stages by worktree

## Type

Developer experience and infrastructure safety

## Context

`pnpm dev` and `pnpm dev:seed` currently target `dev_$USER`. Multiple Git
worktrees owned by the same user therefore share one Alchemy stage and one
PlanetScale development branch.

This is acceptable for the current workflow, but it prevents independent
development databases across concurrent worktrees.

## Impact

Running `pnpm dev:seed` from one worktree destroys and recreates the shared
stage. Uncommitted database changes made from another worktree are lost, and
its running development process may temporarily reference replaced resources.

## Suggested Direction

Derive a stable, valid Alchemy stage name from both the user and worktree. Keep
the selected name consistent across `pnpm dev`, `pnpm dev:seed`, and cleanup,
and ensure destructive commands cannot target `production` or another
non-development stage.

## Acceptance Criteria

- Two worktrees owned by the same user default to distinct Alchemy stages and
  PlanetScale branches.
- Repeated commands within one worktree resolve to the same stage.
- `pnpm dev:seed` destroys and recreates only the calling worktree's stage.
- Generated stage names satisfy Alchemy's naming constraints.
- The workflow documents how to identify and destroy abandoned worktree
  stages.

## Non-Goals

- Changing production stage ownership or catalog seeding.
- Automatically migrating data between worktree databases.
- Implementing shared development databases across users.
