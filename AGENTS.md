# AGENTS.md

This repo is a prototype plus rewrite-planning workspace for dotheyplaytoday: a small app for subscribing to subjects, like NBA teams or campus groups, and getting notified when relevant events are happening today.

The current implementation is useful evidence, but it is not automatically the target architecture. For rewrite work, read the canonical docs in `docs/rewrite/` first, especially `GLOSSARY.md`, `spec.md`, `prototype-lessons.md`, `effect-v4-and-engineering-practices.md`, and `rebuild-plan.md`.

When implementing, read reference code often for patterns before inventing new ones. Prefer source references in this order: current repo code and diff, `reference/opencode/`, `reference/t3code/`, then `reference/effect/`. Copy principles, not structure by default.

Keep changes small and specific. Run relevant checks while editing, then run `pnpm lint` and `pnpm typecheck` before calling implementation work done.
