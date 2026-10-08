import { mmaCardStart } from "@dtpt/core/modules/mma/time";
import { DateTime, Schema } from "effect";

import { devSeedWindow } from "../seed/dev.js";
import { MmaImport, type MmaImportInput } from "./schema.js";
import { ufcCatalog } from "./ufc.js";

export const buildDevMmaSeed = (now: Date = new Date()): MmaImportInput => {
  const window = devSeedWindow(now);
  const catalog = Schema.decodeUnknownSync(MmaImport)(ufcCatalog);
  return Schema.encodeSync(MmaImport)({
    ...catalog,
    cards: catalog.cards.filter((card) => {
      const start = mmaCardStart(card.details);
      if (start) {
        return (
          DateTime.isGreaterThanOrEqualTo(start, window.from) &&
          DateTime.isLessThan(start, window.to)
        );
      }
      return (
        card.details.date !== null &&
        card.details.date >= DateTime.formatIsoDate(window.from) &&
        card.details.date < DateTime.formatIsoDate(window.to)
      );
    }),
  });
};
