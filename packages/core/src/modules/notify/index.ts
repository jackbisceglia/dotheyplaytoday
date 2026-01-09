import { Effect } from "effect";

export type NotificationTemplate = {
  subject: string;
  body: string;
};

export type BuildTemplateParams = {
  teamName: string;
  gameTime: string;
  opponent: string;
};

export class Notify extends Effect.Service<Notify>()("Notify", {
  effect: Effect.gen(function* () {
    yield* Effect.void;

    return {
      buildTemplate: Effect.fn("notify.buildTemplate")(function* (
        params: BuildTemplateParams,
      ) {
        yield* Effect.void;
        // TODO: Build notification template
        // This base template will be consumed by various clients
        // (email, WhatsApp, Signal, etc.) that transform it to their format
        return {
          subject: `${params.teamName} play today!`,
          body: `Game against ${params.opponent} at ${params.gameTime}`,
        } satisfies NotificationTemplate;
      }),
    };
  }),
}) {}
