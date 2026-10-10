import Foundation
import Testing
@testable import PlayTodayCore

@Suite("Local game schedule")
struct ScheduleTests {
    let utc = TimeZone.gmt
    func date(_ string: String) -> Date { ISO8601DateFormatter().date(from: string)! }

    @Test func mergesBothSubscriptionsButKeepsDoubleheaders() throws {
        var records = try fixtureObjects()
        var first = records[0]
        let games = try #require(first["events"] as? [[String: Any]])
        var game = games[0]
        game["startsAt"] = "2026-10-07T18:00:00Z"
        var rematch = game
        rematch["id"] = "doubleheader"
        rematch["startsAt"] = "2026-10-07T23:00:00Z"
        first["events"] = [game, rematch]
        var second = first
        var opponent = try #require(first["subject"] as? [String: Any])
        opponent["id"] = "knicks"
        var details = try #require(opponent["details"] as? [String: Any])
        details["display"] = "New York Knicks"
        details["name"] = "Knicks"
        opponent["details"] = details
        second["subject"] = opponent
        var duplicate = game
        duplicate["id"] = "different-provider-id"
        second["events"] = [duplicate, rematch]
        records = [first, second]
        let schedule = try decodeSchedule(records)
        let days = GameSchedule.days(from: schedule, catalog: schedule.map(\.subject), timezone: utc, now: date("2026-10-07T12:00:00Z"))
        #expect(days.count == 1)
        #expect(days.first?.games.count == 2)
        #expect(days.first?.games.first?.teamName == "Celtics")
        #expect(days.first?.games.first?.opponentTeam?.details.name == "Knicks")
        #expect(days.first?.games.first?.isAway == false)
    }

    @Test(arguments: [
        ("2026-03-08T12:00:00Z", "2026-03-08T05:00:00Z", "2026-03-22T04:00:00Z"),
        ("2026-11-01T12:00:00Z", "2026-11-01T04:00:00Z", "2026-11-15T05:00:00Z"),
    ])
    func windowFollowsCalendarDaysAcrossDST(bounds: (String, String, String)) throws {
        var first = try #require(fixtureObjects().first)
        let original = try #require((first["events"] as? [[String: Any]])?.first)
        let starts = [date(bounds.1).addingTimeInterval(-1), date(bounds.1), date(bounds.2).addingTimeInterval(-1), date(bounds.2)]
        first["events"] = starts.enumerated().map { index, start in
            var game = original
            game["id"] = "boundary-\(index)"
            game["startsAt"] = ISO8601DateFormatter().string(from: start)
            return game
        }
        let schedule = try decodeSchedule([first])
        let days = GameSchedule.days(from: schedule, catalog: schedule.map(\.subject), timezone: TimeZone(identifier: "America/New_York")!, now: date(bounds.0))
        #expect(days.flatMap(\.games).map(\.startsAt) == [starts[1], starts[2]])
    }

    @Test func excludesCancelledAndUsesSavedTimezone() throws {
        var first = try #require(fixtureObjects().first)
        var game = try #require((first["events"] as? [[String: Any]])?.first)
        game["startsAt"] = "2026-10-08T02:30:00Z"
        var cancelled = game
        cancelled["id"] = "cancelled"
        cancelled["startsAt"] = "2026-10-08T03:30:00Z"
        cancelled["availability"] = "cancelled"
        first["events"] = [cancelled, game]
        let schedule = try decodeSchedule([first])
        let timezone = TimeZone(identifier: "America/Los_Angeles")!
        let days = GameSchedule.days(from: schedule, catalog: [], timezone: timezone, now: date("2026-10-07T23:00:00Z"))
        #expect(days.flatMap(\.games).count == 1)
        #expect(days.first?.date == date("2026-10-07T07:00:00Z"))
        #expect(GameSchedule.dayTitle(days[0].date, timezone: timezone, now: date("2026-10-08T02:00:00Z")) == "Today")
    }

    @Test func unmatchedSubscriptionUsesAwayHomeOrder() throws {
        var first = try #require(fixtureObjects().first)
        var subject = try #require(first["subject"] as? [String: Any])
        var details = try #require(subject["details"] as? [String: Any])
        details["display"] = "Old team name"
        subject["details"] = details
        first["subject"] = subject
        let schedule = try decodeSchedule([first])
        let games = GameSchedule.days(from: schedule, catalog: [], timezone: utc, now: date("2026-10-07T00:00:00Z")).flatMap(\.games)
        #expect(games.first?.teamName == "New York Knicks")
        #expect(games.first?.opponent == "Boston Celtics")
        #expect(games.first?.isAway == true)
    }
}
