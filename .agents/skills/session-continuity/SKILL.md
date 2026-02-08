---
name: session-continuity
description: Performs an end-of-session continuity and learnings pass. Use when finishing an issue/PR to align naming, behavior, docs, and style decisions across the full changeset.
---

# Session Continuity

Run this at the end of a dev session, especially after iterative review feedback.

## Goals

- Make the final changeset internally consistent.
- Preserve explicit user decisions from review.
- Capture repeatable project guidance in docs/skills.

## Workflow

1. Establish scope

- Inspect tracked and untracked changes (`git status`, `git diff --name-status main`, `git diff --name-only`).
- Read all changed files and related todo item(s).

2. Reconstruct intent

- Summarize the original ask and where implementation landed.
- List explicit user style decisions and treat them as constraints.

3. Find discontinuities

- Naming drift: class/tag/fn/test names diverge.
- Behavior/message mismatch: error text does not match actual lookup behavior.
- API drift: renamed function/signature not reflected in callsites/tests/docs.
- Documentation drift: DONE todo acceptance/notes no longer match landed code.

4. Report before edits

- Present a concise list of discontinuities with file paths.
- Explain why each matters and propose minimal fixes.
- Ask targeted questions if any change could be interpreted multiple ways.

5. Apply approved fixes

- Prefer small, surgical edits.
- Keep readability high: remove needless abstraction and unnecessary type noise.
- Lean on Effect-native modules (`Effect.fn`, `Match`, `DateTime`, `Duration`) when equivalent.

6. Sync process docs

- Update `todo/AGENTS.md` (or relevant docs) with stable, repeatable conventions discovered.
- If guidance is reusable beyond one issue, add/update a project-local skill.

7. Validate

- Run `pnpm format`, `pnpm lint`, `pnpm typecheck`.
- Report what changed in 1-3 sentences plus any follow-up questions.

## Project-specific defaults

- Prefer domain names without redundant suffixes unless they add clarity.
- Boolean predicates use `is*` naming.
- For 3+ arguments, prefer `*Options` object input.
- Export only cross-module APIs; keep local helpers/types unexported.
- Keep todo acceptance and notes synchronized with final function names and signatures.
