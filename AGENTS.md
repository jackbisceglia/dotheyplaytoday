# AGENTS.md

`dotheyplaytoday` lets users subscribe to supported sports subjects and receive notifications when matching events happen today in their timezone.

## Packages

- `packages/core`: domain models, contracts, persistence, scheduling, and channels.
- `packages/api`: public HTTP API.
- `packages/jobs`: scheduled notification worker and notify orchestration.
- `packages/data`: catalog, event, and development seed data.
- `packages/web`: Astro frontend.

## Working agreements

- Current source, tests, manifests, and the active diff are authoritative.
- `docs/product.md` defines intended product behavior; `docs/architecture.md` provides the current system overview.
- When documentation conflicts with implementation, investigate the mismatch instead of blindly following either one.
- Use nearby current code before inventing a pattern. Consult `reference/` only for a concrete implementation question.
- Verify dependency APIs against the pinned version or its source.
- Keep changes scoped and preserve unrelated tracked and untracked work.
- Update current documentation when behavior or architecture changes.
- Run relevant tests while editing.
- Run `pnpm lint` and `pnpm typecheck` before declaring implementation work complete.
