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
  const parts = Duration.parts(Duration.seconds(seconds));
  const meridiem = parts.hours < 12 ? "AM" : "PM";
  const hours = parts.hours % 12 === 0 ? 12 : parts.hours % 12;
  return `${String(hours)}:${String(parts.minutes).padStart(2, "0")} ${meridiem}`;
};

export const sendTimeOptions = Array.range(0, sendTimeOptionCount - 1).map(
  (index) => {
    const value = index * sendTimeStepSeconds;
    return { value, label: formatSecondsLocal(value) };
  },
) satisfies SendTimeOption[];

export const isValidSendTime = (seconds: number) =>
  Number.isInteger(seconds) &&
  seconds >= 0 &&
  seconds < secondsPerDay &&
  seconds % sendTimeStepSeconds === 0;

export const detectTimezone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return undefined;
  }
};
