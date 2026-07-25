import { pgTableCreator } from "drizzle-orm/pg-core";

export const postgresTable = pgTableCreator((name) => name, "snake_case");
