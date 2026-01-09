import { Effect } from "effect";

export type UserInfo = {
  id: string;
  name: string;
  email: string;
};

export class User extends Effect.Service<User>()("User", {
  effect: Effect.gen(function* () {
    yield* Effect.void;

    return {
      get: Effect.fn("user.get")(function* () {
        yield* Effect.void;
        // TODO: Replace with real user lookup
        return {
          id: "jack",
          name: "Jack Bisceglia",
          email: "jack@example.com",
        } satisfies UserInfo;
      }),
    };
  }),
}) {}
