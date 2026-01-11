# AGENTS.md

This file contains guidelines for agentic coding agents working in this repository.

## Project Overview

A configurable notification service that checks if a sports team (starting with Boston Celtics) has a game today and sends notifications. Built with Effect, Bun, and TypeScript in a monorepo structure.

**Tech Stack:**

- Runtime: Bun
- Package Manager: pnpm (v10.11.0)
- Effect: v3.19.13 with @effect/platform and @effect/platform-bun
- TypeScript: v5.9.2 extending @tsconfig/bun + @tsconfig/strictest
- ESLint: v9 with typescript-eslint strict type-checked rules
- Prettier: v3.6

## Build/Lint/Test Commands

### Root-level Commands

```bash
pnpm typecheck    # Type check all packages
pnpm lint         # ESLint all packages
pnpm format       # Prettier all packages
```

### Package-specific Commands

```bash
pnpm @core <cmd>  # Run command in @dtpt/core package
pnpm @core typecheck
pnpm @core lint
pnpm @core format
```

### Running Commands in Specific Packages

```bash
pnpm -F @dtpt/core <cmd>  # Alternative syntax
pnpm -r run <cmd>         # Run in all packages
```

**Note:** No test framework is set up yet. Tests will be added later.

## Project Structure

```
dotheyplaytoday/
├── packages/
│   └── core/                    # @dtpt/core - shared core logic
│       └── src/
│           ├── lib/effect/      # Effect utilities (TaggedError)
│           └── modules/         # Effect.Service modules
│               ├── user/        # User service
│               ├── notify/      # Notification template builder
│               └── schedule/    # Schedule checking logic
└── AGENTS.md                    # This file
```

- `packages/` contains consuming surfaces (future packages)
- `packages/core/` contains core logic shared across packages
- Each module follows the `Effect.Service` pattern

## Code Style Guidelines

### Imports

- Import Effect utilities directly: `import { Effect } from "effect"`
- Use barrel exports in `index.ts` files
- Export modules from main package index: `export * from "./modules/user"`

### TypeScript Configuration

- Extends `@tsconfig/strictest` + `@tsconfig/bun`
- Use `type` keyword (not `interface`) per ESLint rule
- **Do not add** `types: ["bun-types"]` to tsconfig - handled implicitly
- Target: ESNext, Module: ESNext, ModuleResolution: Bundler

### Naming Conventions

- PascalCase for Effect.Service classes: `Users`, `Notify`, `Schedule`
- camelCase for functions and variables
- Prefix unused variables with `_` to satisfy ESLint
- Service names use PascalCase: `"User"`, `"Notify"`, `"Schedule"`

### Effect Patterns

#### Service Structure

```typescript
export class Users extends Effect.Service<Users>()("User", {
  effect: Effect.gen(function* () {
    yield* Effect.void; // Required for ESLint require-yield rule

    // Service methods
    const get = Effect.fn("users.get")(function* () {
      yield* Effect.void; // Required in all Effect.fn generators
      return result;
    });

    return { get };
  }),
}) {}
```

#### Key Requirements

- **Always** include `yield* Effect.void` in Effect.gen generators
- **Always** include `yield* Effect.void` in Effect.fn generators
- Use `Effect.fn("name")` for named effect functions
- Service methods are returned as object from generator

#### Error Handling

- Use custom `TaggedError` utility from `lib/effect/error.ts`
- Create tagged errors: `class MyError extends TaggedError("MyError") {}`
- Use `ensureTaggedError()` to normalize unknown errors
- Prefer tag-based switches over instanceof checks

### Formatting

- Prettier uses default configuration (empty prettier.config.js)
- ESLint config extends typescript-eslint strict type-checked rules
- ESLint ignores `eslint.config.js` files
- Use `satisfies` for type assertions when appropriate

### Package Exports

- Use direct TS imports via package exports: `"./*": "./src/*.ts"`
- Allows imports like: `import { Users } from "@dtpt/core/modules/user"`

## Dependencies

### Catalog Management

- Use catalog versions from `pnpm-workspace.yaml`
- Effect versions must be compatible:
  - `@effect/platform-bun@^0.87.0` requires `@effect/platform@^0.94.0`
  - `effect@^3.19.13` is the core version

### Adding Dependencies

- Add to appropriate package.json
- Use `catalog:` for Effect ecosystem packages
- Update workspace catalog if adding new shared dependencies

## Key Patterns & Gotchas

### Effect Stubs

- All Effect.gen generators must include `yield* Effect.void`
- All Effect.fn generators must include `yield* Effect.void`
- This satisfies ESLint's require-yield rule

### Module Organization

- Each module is an Effect.Service
- Services are self-contained with their own effect context
- Use barrel exports for clean public APIs
- Keep business logic in service methods

### Error Patterns

- Tagged errors provide type-safe error handling
- Use `_tag` for error discrimination
- Wrap third-party errors with `ensureTaggedError()`

### Development Workflow

1. Run `pnpm typecheck` before committing
2. Run `pnpm lint` to ensure code quality
3. Run `pnpm format` to fix formatting issues
4. All commands should pass before considering work complete
