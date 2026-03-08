---
id: "11"
title: Web and API scaffold
description: Add the SolidStart web app and Effect HttpApi server packages plus shared runtime and config defaults for the public signup stack
status: DONE
priority: P0
prereqs:
  - 00-workspace-scaffold.md
---

**Acceptance:**

- [x] Add `packages/web` as a SolidStart app and `packages/api` as an Effect HttpApi server package.
- [x] Add root workspace scripts for the new packages (`dev:web`, `dev:api`, `@web`, `@api`) without regressing existing `@core` and `@jobs` flows.
- [x] Add shared config modules in `packages/core` for public web and api origins, following the repo's Effect Config conventions.
- [x] Wire the api package with a minimal Effect HttpApi entrypoint, Node server bootstrap, and CORS setup driven by shared config.
- [x] Wire the web package with a minimal landing route and typed api client setup suitable for future signup calls.
- [x] Add at least one basic api route for health or ping so the scaffold has an end-to-end smoke path.
- [x] Update workspace/package exports and TypeScript config so the new packages build and typecheck cleanly inside the monorepo.

**Verify:**

- [x] `pnpm typecheck`
- [x] `pnpm lint`
- [x] `pnpm format`
- [x] Start the local dev flow and verify the web app can reach the api ping or health route.

**Notes:**

- Use `reference/planar` as the reference for Effect HttpApi package structure and typed client shape.
- Use SolidStart, not TanStack Start, for the web package; `reference/planar` is architectural inspiration only.
- Keep this item focused on package scaffolding and shared config defaults; do not mix in subscription business logic yet.
- Preserve current job execution paths; this item should not change `packages/jobs` behavior.
- The richer landing page exploration was stashed separately as `stash@{0}` (`design landing page spike`) so this scaffold item stays easy to review.
