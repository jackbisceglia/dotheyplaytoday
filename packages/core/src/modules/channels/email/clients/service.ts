import type { EmailAddress } from "../../../users/schema.js";
import { ChannelClient } from "../../client/service.js";
import type { EmailRendered } from "../design.js";

export class EmailChannelClient extends ChannelClient.makeService<
  EmailChannelClient,
  EmailAddress,
  EmailRendered
>()("@dtpt/core/EmailChannelClient") {}
