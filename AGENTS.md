# AGENTS.md

This repo is dotheyplaytoday: a small app for subscribing to subjects, like NBA teams or campus groups, and getting notified when relevant events are happening today.

The live implementation is the `core`, `api`, `jobs`, `web`, and `data` packages. For domain and engineering context, read the canonical docs in `docs/rewrite/` first, especially `GLOSSARY.md`, `spec.md`, `prototype-lessons.md`, `effect-v4-and-engineering-practices.md`, and `rebuild-plan.md`.

When implementing, read reference code often for patterns before inventing new ones. Prefer source references in this order: current repo code and diff, `reference/opencode/`, `reference/t3code/`, then `reference/effect/`. Copy principles, not structure by default.

Keep changes small and specific. Run relevant checks while editing, then run `pnpm lint` and `pnpm typecheck` before calling implementation work done.
