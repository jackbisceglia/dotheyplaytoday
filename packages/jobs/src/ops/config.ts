import { Config } from "effect";

import { EmailAddress } from "@dtpt/core/modules/users/schema";

export const AdminEmail = Config.schema(EmailAddress, "ADMIN_EMAIL");
