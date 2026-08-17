# AGENTS.md

`dotheyplaytoday` lets users subscribe to supported sports subjects and receive notifications when matching events happen today in their timezone.

## Packages

- `packages/core`: domain models, contracts, persistence, scheduling, and channels.
- `packages/api`: public HTTP API.
- `packages/jobs`: scheduled notification worker and notify orchestration.
- `packages/data`: catalog, event, and development seed data.
- `packages/web`: Solid 2 frontend and SSR Worker.

## Working agreements

- Current source, tests, manifests, and the active diff are authoritative.
- `docs/product.md` defines intended product behavior; `docs/architecture.md` provides the current system overview.
- Use nearby current code before inventing a pattern.
- Consult `reference/` when a concrete implementation question justifies it.
- Keep changes scoped and preserve unrelated tracked and untracked work.
- Update current documentation when behavior or architecture changes.
- Run relevant tests while editing.
- Run `pnpm lint` and `pnpm typecheck` before declaring implementation work complete.
