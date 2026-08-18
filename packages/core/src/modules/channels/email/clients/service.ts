import type { EmailAddress } from "../../../users/schema.js";
import { ChannelClient } from "../../client/service.js";

export type EmailRendered = {
  readonly subject: string;
  readonly body: {
    readonly text: string;
    readonly html: string;
  };
};

export class EmailChannelClient extends ChannelClient.makeService<
  EmailChannelClient,
  EmailAddress,
  EmailRendered
>()("@dtpt/core/EmailChannelClient") {}
