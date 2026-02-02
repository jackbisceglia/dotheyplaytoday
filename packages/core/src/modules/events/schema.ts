import { Schema } from "effect";

export type SportsEvent = Schema.Schema.Type<typeof SportsEvent>;
export const SportsEvent = Schema.Struct({
  id: Schema.UUID.pipe(Schema.brand("SportsEventId")),
  startUtc: Schema.DateTimeUtc,
  opponent: Schema.NonEmptyString,
});
