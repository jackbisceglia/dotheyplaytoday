import { Array, Duration } from "effect";

export type Interval = {
  readonly value: number;
  readonly label: string;
};

export const defaultTimezone = "America/New_York";

export const sendTime = {
  default: Duration.toSeconds("9 hours"),
  stepSeconds: Duration.toSeconds("15 minutes"),
} as const;

const getStepCount = () =>
  Duration.toSeconds("24 hours") / sendTime.stepSeconds;

const formatSecondsLocal = (seconds: number) => {
  const parts = Duration.parts(Duration.seconds(seconds));

  const meridiem = parts.hours < 12 ? "AM" : "PM";
  const hours = parts.hours % 12 === 0 ? 12 : parts.hours % 12;

  const format = (h: number, m: number, suffix: string) =>
    `${h.toString()}:${m.toString().padStart(2, "0")} ${suffix}`;

  return format(hours, parts.minutes, meridiem);
};

export const sendTimeIntervals = Array.range(0, getStepCount() - 1).map(
  (index) => {
    const value = index * sendTime.stepSeconds;
    return { value, label: formatSecondsLocal(value) };
  },
) satisfies Interval[];

export const isValidSendTime = (seconds: number) => {
  const isInteger = Number.isInteger(seconds);
  const isWithinDay = seconds >= 0 && seconds < Duration.toSeconds("24 hours");
  const isOnStep = seconds % sendTime.stepSeconds === 0;

  return isInteger && isWithinDay && isOnStep;
};

export const detectTimezone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return undefined;
  }
};
