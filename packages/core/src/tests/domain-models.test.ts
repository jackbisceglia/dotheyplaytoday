import { describe, it } from "@effect/vitest";

import { SportsEvent } from "../modules/events/schema";
import {
  FixedSchedule,
  RelativeSchedule,
  Schedule,
  Subscription,
} from "../modules/subscriptions/schema";
import { Topic } from "../modules/topics/schema";
import { User } from "../modules/users/schema";
import { expectFailure, expectSuccess } from "./test.utils";

const sampleIds = {
  userId: "00000000-0000-0000-0000-000000000001",
  subscriptionId: "00000000-0000-0000-0000-000000000002",
  topicId: "00000000-0000-0000-0000-000000000003",
  eventId: "00000000-0000-0000-0000-000000000004",
};

const sportsEventInput = {
  id: sampleIds.eventId,
  startUtc: "2026-01-24T19:30:00Z",
  teamName: "Celtics",
  opponent: "Raptors",
};

describe("domain model schemas", () => {
  describe("User", () => {
    it("accepts valid user", () => {
      expectSuccess(User, {
        id: sampleIds.userId,
        email: "test@example.com",
        timezone: "America/New_York",
      });
    });

    it("rejects invalid email", () => {
      expectFailure(User, {
        id: sampleIds.userId,
        email: "not-an-email",
        timezone: "America/New_York",
      });
    });

    it("rejects invalid timezone", () => {
      expectFailure(User, {
        id: sampleIds.userId,
        email: "test@example.com",
        timezone: "Mars/Phobos",
      });
    });

    it("rejects invalid id", () => {
      expectFailure(User, {
        id: "not-a-uuid",
        email: "test@example.com",
        timezone: "America/New_York",
      });
    });
  });

  describe("Topic", () => {
    it("accepts valid topic", () => {
      expectSuccess(Topic, { id: sampleIds.topicId, events: [] });
    });

    it("rejects invalid topic id", () => {
      expectFailure(Topic, { id: "topic", events: [] });
    });

    it("rejects invalid event entry", () => {
      expectFailure(Topic, {
        id: sampleIds.topicId,
        events: [{ ...sportsEventInput, id: "not-a-uuid" }],
      });
    });
  });

  describe("SportsEvent", () => {
    it("accepts valid event", () => {
      expectSuccess(SportsEvent, sportsEventInput);
    });

    it("rejects empty opponent", () => {
      expectFailure(SportsEvent, { ...sportsEventInput, opponent: "" });
    });

    it("rejects invalid startUtc", () => {
      expectFailure(SportsEvent, {
        ...sportsEventInput,
        startUtc: "not-a-date",
      });
    });
  });

  describe("FixedSchedule", () => {
    it("accepts edge send times", () => {
      expectSuccess(FixedSchedule, {
        type: "fixed",
        sendAtSecondsLocal: 85500,
      });
    });

    it("rejects unaligned send time", () => {
      expectFailure(FixedSchedule, {
        type: "fixed",
        sendAtSecondsLocal: 901,
      });
    });

    it("rejects out-of-range send time", () => {
      expectFailure(FixedSchedule, {
        type: "fixed",
        sendAtSecondsLocal: 86399,
      });
    });
  });

  describe("RelativeSchedule", () => {
    it("accepts zero or negative offsets", () => {
      expectSuccess(RelativeSchedule, {
        type: "relative",
        timeOffsetSeconds: -900,
      });
    });

    it("rejects positive offset", () => {
      expectFailure(RelativeSchedule, {
        type: "relative",
        timeOffsetSeconds: 1,
      });
    });
  });

  describe("Schedule", () => {
    it("accepts union variant", () => {
      expectSuccess(Schedule, {
        type: "relative",
        timeOffsetSeconds: 0,
      });
    });

    it("rejects missing discriminator", () => {
      expectFailure(Schedule, {
        sendAtSecondsLocal: 3600,
      });
    });

    it("rejects invalid discriminator", () => {
      expectFailure(Schedule, {
        type: "floating",
        sendAtSecondsLocal: 3600,
      });
    });
  });

  describe("Subscription", () => {
    it("accepts valid subscription", () => {
      expectSuccess(Subscription, {
        id: sampleIds.subscriptionId,
        userId: sampleIds.userId,
        topicId: sampleIds.topicId,
        schedule: { type: "fixed", sendAtSecondsLocal: 3600 },
        enabled: true,
        lastSentAt: "2026-01-24T19:30:00Z",
      });
    });

    it("rejects invalid lastSentAt", () => {
      expectFailure(Subscription, {
        id: sampleIds.subscriptionId,
        userId: sampleIds.userId,
        topicId: sampleIds.topicId,
        schedule: { type: "fixed", sendAtSecondsLocal: 3600 },
        enabled: true,
        lastSentAt: "not-a-date",
      });
    });
  });
});
