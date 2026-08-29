import { defineRelations } from "drizzle-orm";

import * as schema from "./schema.js";

export const relations = defineRelations(schema, (d) => ({
  usersTable: {
    authSessions: d.many.authSessionsTable({
      from: d.usersTable.id,
      to: d.authSessionsTable.userId,
    }),
    authAccounts: d.many.authAccountsTable({
      from: d.usersTable.id,
      to: d.authAccountsTable.userId,
    }),
  },
  authSessionsTable: {
    user: d.one.usersTable({
      from: d.authSessionsTable.userId,
      to: d.usersTable.id,
    }),
  },
  authAccountsTable: {
    user: d.one.usersTable({
      from: d.authAccountsTable.userId,
      to: d.usersTable.id,
    }),
  },
  eventsTable: {
    participants: d.many.participantsTable({
      from: d.eventsTable.id,
      to: d.participantsTable.eventId,
    }),
    subjectEvents: d.many.subjectEventsTable({
      from: d.eventsTable.id,
      to: d.subjectEventsTable.eventId,
    }),
  },
  subscriptionsTable: {
    subject: d.one.subjectsTable({
      from: d.subscriptionsTable.subjectId,
      to: d.subjectsTable.id,
    }),
    user: d.one.usersTable({
      from: d.subscriptionsTable.userId,
      to: d.usersTable.id,
    }),
  },
}));
