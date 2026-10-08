import { DateTime, Schema } from "effect";

import { devSeedWindow } from "../seed/dev.js";
import { MmaImport, type MmaImportInput } from "./schema.js";
import { ufcCatalog } from "./ufc.js";

export const buildDevMmaSeed = (now: Date = new Date()): MmaImportInput => {
  const window = devSeedWindow(now);
  const catalog = Schema.decodeUnknownSync(MmaImport)(ufcCatalog);
  return Schema.encodeSync(MmaImport)({
    ...catalog,
    cards: catalog.cards.filter(
      (card) =>
        DateTime.isGreaterThanOrEqualTo(card.startsAt, window.from) &&
        DateTime.isLessThan(card.startsAt, window.to),
    ),
  });
};
