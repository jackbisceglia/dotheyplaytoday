import type { EmailAddress } from "../../../users/schema.js";
import {
  ChannelProvider,
  ChannelProviderClient,
} from "../providers/service.js";
import type { EmailRendered } from "./rendered.js";

export class EmailChannelProvider extends ChannelProvider.makeService<
  EmailChannelProvider,
  EmailAddress,
  EmailRendered
>()("@dtpt/core-v2/EmailChannelProvider") {}

export class EmailChannelClient extends ChannelProviderClient.makeService<
  EmailChannelClient,
  EmailAddress,
  EmailRendered
>()("@dtpt/core-v2/EmailChannelClient") {}
