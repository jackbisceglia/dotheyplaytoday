import { ChannelClient } from "../../client/service.js";
import { Channel } from "../service.js";
import type { EmailRendered } from "./render.js";

export class EmailChannel extends Channel.makeService<
  EmailChannel,
  EmailRendered
>()("@dtpt/core-v2/EmailChannel") {}

export class EmailChannelClient extends ChannelClient.makeService<
  EmailChannelClient,
  EmailRendered
>()("@dtpt/core-v2/EmailChannelClient") {}
