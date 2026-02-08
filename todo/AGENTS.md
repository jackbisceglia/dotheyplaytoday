# Todo System

The `todo/` directory is our issue tracking mechanism. Each file represents a user story or bug that can be implemented by a single developer/agent.

## File Format

**Filename:** `todo/[STATUS]-P{N}-{NN}-{title}.md`

**Pattern:**

- `[STATUS]` - `[TODO]`, `[WIP]`, or `[DONE]`
- `P{N}` - Priority: `P0` (highest), `P1`, `P2` (lowest)
- `{NN}` - Serial ID (00, 01, 02, ...)
- `{title}` - Human-readable slug

**Example:** `todo/[TODO]-P0-01-json-backed-storage.md`

## Frontmatter

All todo files include YAML frontmatter:

```yaml
---
id: "01"
title: JSON-backed storage
description: Implement JSON-backed storage for users, subscriptions, and topics
status: TODO
priority: P0
prereqs:
  - 00-define-data-models.md
---
```

**Fields:**

- `id` - Serial ID matching filename (e.g. `"01"`)
- `title` - Human-readable title (matches filename slug)
- `description` - Brief description of the work
- `status` - `TODO`, `WIP`, or `DONE` (must match filename)
- `priority` - `P0`, `P1`, or `P2` (must match filename)
- `prereqs` - Array of prereq filenames using the stable portion only: `{NN}-{title}.md`. Status is omitted because it changes. To check if a prereq is done, search for a file matching that pattern with `[DONE]` status.
- `acceptance` (optional) - Acceptance criteria
- `verify` (optional) - How to verify the work
- `notes` (optional) - Implementation notes

## Workflow

### Selecting Work

1. **Status filter** - Only consider `[TODO]` files
2. **Priority filter** - Start with `P0`, then `P1`, then `P2`
3. **Prereqs check** - For each prereq (e.g. `00-define-data-models.md`), search for a file matching `*-00-define-data-models.md` and verify it has `[DONE]` status
4. **Start work** - Rename file to `[WIP]` and update frontmatter status

### Status Transitions

- `[TODO]` → `[WIP]`: When work begins
- `[WIP]` → `[DONE]`: When complete (typecheck + lint passing, documented)

### Priority Bumping

When selecting a todo, you may discover a prereq that is still `[TODO]` and has a lower priority than your current item. This is a signal that the prereq's priority is too low—bump it to match the current item's priority so that work can be unblocked.

## Implementation Continuity Checklist

When moving an item to `[DONE]`, run a short continuity pass:

1. **Naming continuity** - Keep domain names consistent across service tags, class names, fn labels, and tests (avoid unnecessary suffixes).
2. **Effect-first utilities** - Prefer Effect modules (`DateTime`, `Duration`, `Match`, `Effect.fn`) before adding custom helper logic.
3. **Readable signatures** - Use `*Options` object inputs for functions with 3+ args; prefix boolean predicates with `is`.
4. **Export hygiene** - Export only APIs used cross-module or likely to be reused by orchestration; keep internal helpers/types local.
5. **Behavior/message alignment** - Ensure error text and glob/path patterns reflect actual lookup behavior.
6. **Doc sync** - Update the todo acceptance/notes so they match landed function names, signatures, and implementation choices.

## Directory Structure

```
todo/
├── AGENTS.md              # This file
├── [DONE]-P0-00-*.md      # Completed high-priority items
├── [WIP]-P0-01-*.md       # In-progress high-priority items
├── [TODO]-P0-02-*.md      # Ready to work high-priority items
├── [TODO]-P1-*.md         # Medium priority
└── [TODO]-P2-*.md         # Low priority
```

## Quick Reference

**Check if an item is workable:**

```bash
# List all TODO items
ls todo | grep '^\[TODO\]'

# Check prereqs for a specific item
cat todo/[TODO]-P0-02-*.md | grep -A5 "prereqs:"
# For each prereq like "00-define-data-models.md", check its status:
ls todo | grep "00-define-data-models.md"
# If the match starts with [DONE], the prereq is satisfied
```

**Update status:**

```bash
# When starting work on [TODO]-P0-01-foo.md
mv todo/[TODO]-P0-01-foo.md todo/[WIP]-P0-01-foo.md
# Then edit file to update status: WIP in frontmatter
```
