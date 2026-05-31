import type { EmailAddress } from "../../../users/schema.js";
import { Channel } from "../service.js";
import type { EmailRendered } from "./render.js";

export class EmailChannel extends Channel.makeService<
  EmailChannel,
  EmailAddress,
  EmailRendered
>()("@dtpt/core-v2/EmailChannel") {}
