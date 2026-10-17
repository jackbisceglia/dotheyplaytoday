import Foundation
import PlayTodayCore

struct DemoData {
    let catalog: [Subject]
    let user: User
    let subscriptions: [Subscription]
    let events: [ScheduledSubscription]

    static func load() throws -> DemoData {
        guard let url = Bundle.main.url(forResource: "Demo", withExtension: "json") else { throw APIError.invalidResponse }
        let data = try Data(contentsOf: url)
        struct Fixture: Decodable {
            let catalog: [Subject]
            let subscriptions: [Subscription]
        }
        let fixture = try WireJSON.decoder().decode(Fixture.self, from: data)
        // Shift illustrative fixtures to the current local day so the demo stays useful.
        // This data never enters the live API or the session vault.
        var document = try JSONSerialization.jsonObject(with: data) as? [String: Any] ?? [:]
        var schedule = document["events"] as? [[String: Any]] ?? []
        let calendar = Calendar.current
        let start = calendar.startOfDay(for: .now)
        let formatter = ISO8601DateFormatter()
        for index in schedule.indices {
            var games = schedule[index]["events"] as? [[String: Any]] ?? []
            for gameIndex in games.indices {
                let offset = games[gameIndex]["demoDayOffset"] as? Int ?? 0
                let hour = games[gameIndex]["demoHour"] as? Int ?? 19
                if let day = calendar.date(byAdding: .day, value: offset, to: start),
                   let time = calendar.date(bySettingHour: hour, minute: 30, second: 0, of: day) {
                    games[gameIndex]["startsAt"] = formatter.string(from: time)
                }
            }
            schedule[index]["events"] = games
        }
        document["events"] = schedule
        let events = try WireJSON.decoder().decode([ScheduledSubscription].self, from: JSONSerialization.data(withJSONObject: schedule))
        return DemoData(catalog: fixture.catalog, user: User(email: "demo@example.com", timezone: TimeZone.current.identifier),
                        subscriptions: fixture.subscriptions, events: events)
    }
}
