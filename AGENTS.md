# AGENTS.md

This repository is now treated as a prototype plus rewrite-planning workspace. The current implementation is useful evidence, but it is not automatically the target architecture.

## Canonical Docs

Read these before starting rewrite work:

- `docs/rewrite/spec.md` - product and domain spec extracted from the prototype
- `docs/rewrite/prototype-lessons.md` - what worked, what got complicated, and what not to copy
- `docs/rewrite/effect-v4-and-engineering-practices.md` - source-derived Effect v4 and project practices
- `docs/rewrite/rebuild-plan.md` - concrete phased rebuild plan

The old `.context/` PRD and todo-system agent instructions have been retired. Historical todo files may still be useful as prototype archaeology, but they are not canonical planning docs.

## Reference Order

Use source references before secondary guidance:

1. Current implementation and working-tree diff in this repo.
2. `reference/opencode/packages/opencode/AGENTS.md` and `reference/opencode/packages/opencode/specs/effect/migration.md` for Effect v4 service/module patterns.
3. `reference/t3code/package.json` and `reference/t3code/packages/effect-*` for Effect v4 package pins, typed errors, protocols, and scoped fibers.
4. `reference/effect/` for library source and tests.
5. External docs or `effect-solutions` only as a last resort when source references do not answer the question.

Do not cargo-cult reference repos. Copy the principle, then simplify for this product.

## Current Commands

```bash
pnpm typecheck
pnpm lint
pnpm format
pnpm test

pnpm @core <cmd>
pnpm @jobs <cmd>
pnpm @api <cmd>
pnpm @web <cmd>
```

Run relevant targeted checks while editing. Run all checks before considering implementation work complete.

## Rewrite Defaults

- Target Effect v4 from the first fresh implementation slice.
- Prefer `Context.Service` plus explicit `Layer.effect` services unless source references show a better v4 pattern for the case.
- Use `Schema.Class` for multi-field domain models and `Schema.TaggedErrorClass` for typed errors.
- Keep SQLite + Drizzle as the first persistence backend. Do not reintroduce Redis/KVS compatibility layers.
- Treat Drizzle table definitions as the persistence source of truth and derive persistence schemas from them.
- Keep domain and persistence shapes identical unless there is a concrete aggregate/projection boundary.
- Avoid broad barrels. Use explicit package subpath exports for public APIs.
- Favor small vertical slices that prove runtime wiring, persistence, behavior, and tests together.

## Current Prototype Shape

- `packages/core`: shared schemas, database, notifier, subscription logic, seed/tooling scripts
- `packages/jobs`: notify job orchestration
- `packages/api`: Effect HttpApi server scaffold
- `packages/web`: SolidStart landing scaffold
- `reference/`: ignored local source references for Effect, opencode, t3code, planar, and related research

## Local Standards

- Keep changes minimal and specific.
- Do not preserve backward compatibility unless there is persisted data, an external consumer, shipped behavior, or an explicit requirement.
- Avoid extracting helpers until there are multiple callsites or an immediate clarity win.
- Use Effect Platform services for effectful file, process, HTTP, path, config, and time work inside Effect code.
- Keep environment/config parsing centralized and typed.
- Tests should cover behavior, not implementation ceremony.
