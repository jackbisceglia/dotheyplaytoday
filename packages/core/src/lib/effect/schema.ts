import { Schema } from "effect";

export const TaggedStructWithOptional = <
  Tag extends string,
  Fields extends Schema.Struct.Fields,
>(
  tag: Tag,
  fields: Fields,
) =>
  Schema.Struct({
    ...fields,
    _tag: Schema.optionalWith(Schema.Literal(tag), {
      default: () => tag,
    }),
  });
