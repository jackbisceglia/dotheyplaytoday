import { Brand, DateTime, Option } from "effect";

/**
 * A branded string type representing a validated IANA timezone identifier.
 *
 * @example
 * ```ts
 * const tz = TimezoneId("America/New_York"); // Valid
 * const tz = TimezoneId("Invalid/Zone"); // Throws BrandError
 * ```
 */
type TimezoneId = string & Brand.Brand<"TimezoneId">;

const TimezoneId = Brand.refined<TimezoneId>(
  (id): id is TimezoneId => Option.isSome(DateTime.zoneMakeNamed(id)),
  (id) => Brand.error(`Invalid IANA timezone identifier: ${id}`),
);

/**
 * Convert a TimezoneId to a DateTime.TimeZone.Named for use with Effect's DateTime APIs.
 * This is safe because TimezoneId is already validated at construction time.
 */
const toTimeZone = (id: TimezoneId): DateTime.TimeZone.Named =>
  DateTime.zoneUnsafeMakeNamed(id);

export { TimezoneId, toTimeZone };
