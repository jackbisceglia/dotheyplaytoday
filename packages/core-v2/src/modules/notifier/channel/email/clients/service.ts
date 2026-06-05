import { ChannelClient } from "../../client/service.js";
import type { EmailDelivery } from "../delivery.js";
import type { EmailRendered } from "../render.js";

export class EmailChannelClient extends ChannelClient.makeService<
  EmailChannelClient,
  EmailDelivery,
  EmailRendered
>()("@dtpt/core-v2/EmailChannelClient") {}
