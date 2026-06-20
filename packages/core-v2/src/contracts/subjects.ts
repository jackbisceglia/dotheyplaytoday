import { Schema } from "effect";
import {
  HttpApiEndpoint,
  HttpApiError,
  HttpApiGroup,
} from "effect/unstable/httpapi";

import { Subject } from "../modules/subjects/schema.js";

export const SubjectsResponse = Schema.Array(Subject);

export const SubjectsGroup = HttpApiGroup.make("subjects").add(
  HttpApiEndpoint.get("list", "/subjects", {
    success: SubjectsResponse,
    error: HttpApiError.InternalServerError,
  }),
);
