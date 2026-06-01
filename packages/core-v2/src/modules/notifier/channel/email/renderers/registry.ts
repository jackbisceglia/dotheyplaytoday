import type { EventWithParticipants } from "../../../../events/service.js";
import type { Subject } from "../../../../subjects/schema.js";
import type { User } from "../../../../users/schema.js";
import type { Notification } from "../../../schema.js";

type EmailEventTag = EventWithParticipants["_tag"];
type EmailSubjectTag = Subject["_tag"];

type EmailEvent<Tag extends EmailEventTag> = Extract<
  EventWithParticipants,
  { readonly _tag: Tag }
>;
type EmailSubject<Tag extends EmailSubjectTag> = Extract<
  Subject,
  { readonly _tag: Tag }
>;

export type EmailEventRenderer<Tag extends EmailEventTag> = (input: {
  readonly event: EmailEvent<Tag>;
  readonly notification: Notification;
  readonly timezone: User["timezone"];
}) => string;

export type EmailSubjectRenderer<Tag extends EmailSubjectTag> = (input: {
  readonly notification: Notification;
  readonly subject: EmailSubject<Tag>;
}) => string;

export type EmailRendererRegistry = {
  readonly events: {
    readonly [Tag in EmailEventTag]: EmailEventRenderer<Tag>;
  };
  readonly subjects: {
    readonly [Tag in EmailSubjectTag]: EmailSubjectRenderer<Tag>;
  };
};

export const createRendererRegistry = (registry: EmailRendererRegistry) => ({
  events: {
    get: <Tag extends EmailEventTag>(tag: Tag): EmailEventRenderer<Tag> =>
      registry.events[tag],
  },
  subjects: {
    get: <Tag extends EmailSubjectTag>(tag: Tag): EmailSubjectRenderer<Tag> =>
      registry.subjects[tag],
  },
});
