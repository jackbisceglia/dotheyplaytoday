import { Effect } from "effect";
import { TimezoneId } from "../../lib/effect";

// TODO: many
//  - policy should be its own discriminated union that can hold policy data (if event start, how soon before, if day start, what time)
//  - preference should be its own entity
//  - teamId should reference a team entity
//  - should we rename team to something else- what if it's boxing where there's no teams. should we use something else like participant?
type Preference = {
  userId: string;
  competitorId: string;
  policy: "event-start" | "day-start" | "day-prior";
};

type UserEntity = {
  id: string;
  name: string;
  email: string;
  timezone: TimezoneId;
  preferences: Omit<Preference, "userId">[];
};

const personal: UserEntity = {
  id: "jack",
  name: "Jack Bisceglia",
  email: "jack@example.com",
  timezone: TimezoneId("America/New_York"),
  preferences: [{ competitorId: "boston-celtics", policy: "day-start" }],
};

export class Users extends Effect.Service<Users>()("User", {
  effect: Effect.gen(function* () {
    yield* Effect.void;

    // TODO: user lookup
    const get = Effect.fn("users.get")(function* () {
      yield* Effect.void;

      return personal;
    });

    return { get };
  }),
}) {}
