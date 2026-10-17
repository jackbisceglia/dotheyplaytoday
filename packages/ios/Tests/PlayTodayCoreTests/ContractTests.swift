import Foundation
import Testing
@testable import PlayTodayCore

func fixtureData() throws -> Data {
    try Data(contentsOf: #require(Bundle.module.url(forResource: "events", withExtension: "json", subdirectory: "Fixtures")))
}

func fixtureObjects() throws -> [[String: Any]] {
    try #require(JSONSerialization.jsonObject(with: fixtureData()) as? [[String: Any]])
}

func decodeSchedule(_ objects: [[String: Any]]) throws -> [ScheduledSubscription] {
    try WireJSON.decoder().decode([ScheduledSubscription].self, from: JSONSerialization.data(withJSONObject: objects))
}

@Suite("API contracts")
struct ContractTests {
    @Test func decodesRepositoryContracts() throws {
        let data = try fixtureData()
        let subscriptions = try WireJSON.decoder().decode([Subscription].self, from: data)
        let events = try WireJSON.decoder().decode([ScheduledSubscription].self, from: data)
        #expect(subscriptions.count == 4)
        #expect(subscriptions.first?.subject.details.name == "Celtics")
        #expect(subscriptions.first?.schedule.sendAtSecondsLocal == 32400)
        #expect(events.flatMap(\.events).count == 8)
        #expect(events.first?.events.first?.startsAt == ISO8601DateFormatter().date(from: "2026-10-07T23:30:00Z"))
    }

    @Test func signupUsesWireFieldsAndNormalizesEmail() throws {
        let request = try SignupRequest(email: "  FAN@EXAMPLE.COM \n", timezone: "America/New_York", subjectIds: ["team"], seconds: 32400)
        let json = try #require(JSONSerialization.jsonObject(with: JSONEncoder().encode(request)) as? [String: Any])
        #expect(json["email"] as? String == "fan@example.com")
        #expect(json["timezone"] as? String == "America/New_York")
        #expect(json["subjectIds"] as? [String] == ["team"])
        let schedule = try #require(json["schedule"] as? [String: Any])
        #expect(schedule["_tag"] as? String == "fixed_local_time")
        #expect(schedule["sendAtSecondsLocal"] as? Int == 32400)
    }

    @Test func rejectsInvalidPreferences() throws {
        #expect(throws: APIError.invalidSelection) { try PreferencesRequest(subjectIds: [], seconds: 0) }
        #expect(throws: APIError.invalidSelection) { try PreferencesRequest(subjectIds: ["a", "a"], seconds: 0) }
        #expect(throws: APIError.invalidSelection) { try PreferencesRequest(subjectIds: ["a", "b", "c", "d", "e"], seconds: 0) }
        for seconds in [-900, 1, 3601, 86400] {
            #expect(throws: APIError.invalidSchedule) { try FixedSchedule(seconds: seconds) }
        }
        #expect(try FixedSchedule(seconds: 85500).sendAtSecondsLocal == 85500)
        #expect(FixedSchedule.options.count == 96)
        #expect(throws: APIError.invalidSignup) {
            try SignupRequest(email: "a@b.com", timezone: "invalid/zone", subjectIds: ["a"], seconds: 0)
        }
    }

    @Test func rejectsAnUnknownScheduleVariant() throws {
        let data = Data(#"{"_tag":"cron","sendAtSecondsLocal":0}"#.utf8)
        #expect(throws: APIError.invalidSchedule) { try JSONDecoder().decode(FixedSchedule.self, from: data) }
    }
}
