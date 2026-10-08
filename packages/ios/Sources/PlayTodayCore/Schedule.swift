import Foundation

public struct Matchup: Identifiable, Sendable {
    public let id: String
    public let startsAt: Date
    public let league: League
    public let team: Subject
    public let teamName: String
    public let opponent: String
    public let opponentTeam: Subject?
    public let isAway: Bool
}

public struct GameDay: Identifiable, Sendable {
    public var id: Date { date }
    public let date: Date
    public let games: [Matchup]
}

public enum GameSchedule {
    private static func normalized(_ name: String) -> String {
        name.trimmingCharacters(in: .whitespacesAndNewlines).lowercased()
    }

    public static func days(
        from subscriptions: [ScheduledSubscription], catalog: [Subject],
        timezone: TimeZone, now: Date = .now
    ) -> [GameDay] {
        var calendar = Calendar(identifier: .gregorian)
        calendar.timeZone = timezone
        let start = calendar.startOfDay(for: now)
        guard let end = calendar.date(byAdding: .day, value: 14, to: start) else { return [] }
        var seen = Set<String>()
        var rows: [Matchup] = []
        for subscription in subscriptions {
            for game in subscription.events {
                guard game.availability == "active", game.startsAt >= start, game.startsAt < end else { continue }
                let names = Set(game.participants.map { normalized($0.details.title) }).sorted()
                // Match the web client: participant set + league + instant, retaining the first pick's order.
                let key = names.count >= 2
                    ? ([game.details.leagueId.rawValue, String(game.startsAt.timeIntervalSince1970)] + names).joined(separator: "\u{1F}")
                    : game.id
                guard seen.insert(key).inserted else { continue }
                let team = subscription.subject
                let own = game.participants.first { normalized($0.details.title) == normalized(team.details.display) }
                let leading = own ?? game.participants.first { $0.details.role == "away" } ?? game.participants.first
                let opponent = game.participants.first { $0.details.role != leading?.details.role }
                func nickname(_ title: String) -> String {
                    catalog.first {
                        $0.details.leagueId == game.details.leagueId && normalized($0.details.display) == normalized(title)
                    }?.details.name ?? title.trimmingCharacters(in: .whitespacesAndNewlines)
                }
                let opponentTeam = subscriptions.first {
                    $0.subject.details.leagueId == game.details.leagueId &&
                    normalized($0.subject.details.display) == normalized(opponent?.details.title ?? "")
                }?.subject
                rows.append(Matchup(
                    id: key, startsAt: game.startsAt, league: game.details.leagueId, team: team,
                    teamName: own != nil ? team.details.name : leading.map { nickname($0.details.title) } ?? team.details.name,
                    opponent: opponent.map { nickname($0.details.title) } ?? "Opponent to be announced",
                    opponentTeam: opponentTeam, isAway: leading?.details.role == "away"
                ))
            }
        }
        let sorted = rows.sorted { $0.startsAt == $1.startsAt ? $0.id < $1.id : $0.startsAt < $1.startsAt }
        let grouped = Dictionary(grouping: sorted) { calendar.startOfDay(for: $0.startsAt) }
        return grouped.keys.sorted().map { GameDay(date: $0, games: grouped[$0] ?? []) }
    }

    public static func time(_ date: Date, timezone: TimeZone) -> String {
        let formatter = DateFormatter()
        formatter.timeZone = timezone
        formatter.dateStyle = .none
        formatter.timeStyle = .short
        return formatter.string(from: date)
    }

    public static func sendTime(_ seconds: Int) -> String {
        // Wall-clock preferences must not shift on DST transition days.
        let date = Date(timeIntervalSince1970: TimeInterval(seconds))
        return time(date, timezone: .gmt)
    }

    public static func dayTitle(_ date: Date, timezone: TimeZone, now: Date = .now) -> String {
        var calendar = Calendar(identifier: .gregorian)
        calendar.timeZone = timezone
        if calendar.isDate(date, inSameDayAs: now) { return "Today" }
        let formatter = DateFormatter()
        formatter.timeZone = timezone
        formatter.setLocalizedDateFormatFromTemplate("EEEE MMM d")
        return formatter.string(from: date)
    }
}
