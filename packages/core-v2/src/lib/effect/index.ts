import { Array, pipe, Schema } from "effect";

type TaggedMember<TTag extends PropertyKey, TLiteral extends string> =
  Schema.Top & {
    readonly fields: Readonly<
      Record<
        TTag,
        {
          readonly schema: {
            readonly literal: TLiteral;
          };
        }
      >
    >;
  };

type TaggedUnionMember = TaggedMember<"_tag", string> & {
  readonly Type: { readonly _tag: string };
};

export function TaggedUnion<
  const Members extends readonly [TaggedUnionMember, ...TaggedUnionMember[]],
>(entries: Members) {
  const schema = Schema.Union(entries).pipe(Schema.toTaggedUnion("_tag"));

  return Object.assign(schema, { tags: tagsFromTaggedUnion(schema) });
}

/**
 * Extracts literal discriminator values from a `Schema.Union`.
 *
 * The first overload is the common domain case: use the conventional `_tag`
 * discriminator. The second overload is for the rarer case where the union uses
 * another discriminator key. Both overloads preserve the concrete literal tuple
 * type so callers can pass the result to `Schema.Literals(...)` and Drizzle enum
 * columns without restating the tags by hand.
 */
export function tagsFromTaggedUnion<
  const TMembers extends Array.NonEmptyReadonlyArray<
    TaggedMember<"_tag", string>
  >,
>(
  union: Schema.Union<TMembers>,
): Array.NonEmptyArray<TMembers[number]["fields"]["_tag"]["schema"]["literal"]>;
export function tagsFromTaggedUnion<
  const TTag extends PropertyKey,
  const TMembers extends Array.NonEmptyReadonlyArray<
    TaggedMember<TTag, string>
  >,
>(
  union: Schema.Union<TMembers>,
  tag: TTag,
): Array.NonEmptyArray<TMembers[number]["fields"][TTag]["schema"]["literal"]>;
export function tagsFromTaggedUnion<
  const TTag extends PropertyKey,
  const TMembers extends Array.NonEmptyReadonlyArray<
    TaggedMember<TTag, string>
  >,
>(
  union: Schema.Union<TMembers>,
  tag: TTag = "_tag" as TTag,
): Array.NonEmptyArray<TMembers[number]["fields"][TTag]["schema"]["literal"]> {
  return pipe(
    union.members,
    Array.map((member) => member.fields[tag].schema.literal),
  );
}
