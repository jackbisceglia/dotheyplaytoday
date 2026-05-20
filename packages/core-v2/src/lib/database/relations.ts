import { defineRelations } from "drizzle-orm";

import * as schema from "./schema.js";

export const relations = defineRelations(schema);
