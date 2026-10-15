import { Effect, Predicate, Schema } from "effect";

import { Subject } from "./schema.js";

const decodeSubject = Schema.decodeUnknownEffect(Subject);

// Temporary read compatibility for pre-nested catalog JSON. Writes and public
// contracts still use Subject. Never replace an existing (even invalid) league.
export const decodeStoredSubject = Effect.fn("Subjects.decodeStoredSubject")(
  function* (row: unknown) {
    if (
      !Predicate.isObject(row) ||
      !Predicate.isObject(row.details) ||
      Object.hasOwn(row.details, "league") ||
      !Object.hasOwn(row.details, "leagueId")
    ) {
      return yield* decodeSubject(row);
    }

    const { leagueId, conferenceId, ...details } = row.details;
    switch (details._tag) {
      case "sports_team":
        // Missing conferences require authoritative catalog backfill, not a
        // guessed affiliation. The canonical decoder rejects them below.
        return yield* decodeSubject({
          ...row,
          details: { ...details, league: { id: leagueId, conferenceId } },
        });
      case "mma_fighter":
      case "mma_tracking":
        return yield* decodeSubject({
          ...row,
          details: { ...details, league: { id: leagueId } },
        });
      default:
        return yield* decodeSubject(row);
    }
  },
);
