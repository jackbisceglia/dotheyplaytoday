import { SubscriptionDocument } from "../subscriptions/schema.js";
import { TopicDocument } from "../topics/schema.js";
import { UserDocument } from "../users/schema.js";

export type DatabaseRegistry = ReturnType<typeof createDatabaseRegistry>;

export type RegistrySelectors = DatabaseRegistry["selectors"];
export type RegistryDocuments = DatabaseRegistry["documents"];

export const createDatabaseRegistry = () => {
  const documents = {
    users: UserDocument,
    subscriptions: SubscriptionDocument,
    topics: TopicDocument,
  } as const;

  const selectors = {
    user: (id: Parameters<typeof documents.users.key>[0]) =>
      documents.users.key(id),
    userByEmail: (
      email: Parameters<typeof documents.users.indexes.byEmail.key>[0],
    ) => documents.users.indexes.byEmail.key(email),
    subscription: (id: Parameters<typeof documents.subscriptions.key>[0]) =>
      documents.subscriptions.key(id),
    topic: (id: Parameters<typeof documents.topics.key>[0]) =>
      documents.topics.key(id),
  } as const;

  return { documents, selectors } as const;
};
