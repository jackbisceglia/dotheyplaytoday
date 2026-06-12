import { Array, Duration } from "effect";

export type SendTimeOption = {
  readonly value: number;
  readonly label: string;
};

export const defaultTimezone = "America/New_York";
export const sendTimeStepSeconds = Duration.toSeconds("15 minutes");
export const defaultSendTimeSeconds = Duration.toSeconds("9 hours");

const secondsPerDay = Duration.toSeconds("24 hours");
const sendTimeOptionCount = secondsPerDay / sendTimeStepSeconds;

const formatSecondsLocal = (seconds: number) => {
  const { hours: hours24, minutes } = Duration.parts(Duration.seconds(seconds));
  const meridiem = hours24 < 12 ? "AM" : "PM";
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  return `${String(hours12)}:${String(minutes).padStart(2, "0")} ${meridiem}`;
};

export const sendTimeOptions: readonly SendTimeOption[] = Array.range(
  0,
  sendTimeOptionCount - 1,
).map((index): SendTimeOption => {
  const value = index * sendTimeStepSeconds;
  return { value, label: formatSecondsLocal(value) };
});

export const isValidSendTime = (seconds: number) =>
  Number.isInteger(seconds) &&
  seconds >= 0 &&
  seconds < secondsPerDay &&
  seconds % sendTimeStepSeconds === 0;

export const detectTimezone = (): string | undefined => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return undefined;
  }
};
