import Foundation

public enum League: String, Codable, CaseIterable, Sendable, Identifiable {
    case nba, nfl, mlb, nhl
    public var id: String { rawValue }
    public var title: String { rawValue.uppercased() }
    public var symbol: String {
        switch self {
        case .nba: "🏀"
        case .nfl: "🏈"
        case .mlb: "⚾"
        case .nhl: "🏒"
        }
    }
}

public struct Subject: Codable, Hashable, Identifiable, Sendable {
    public let id: String
    public let details: Details

    public struct Details: Codable, Hashable, Sendable {
        public let leagueId: League
        public let display: String
        public let location: String
        public let name: String
        public let abbreviation: String
    }
}

public struct User: Codable, Equatable, Sendable {
    public let email: String
    public let timezone: String
    public var timeZone: TimeZone { TimeZone(identifier: timezone) ?? .gmt }

    public init(email: String, timezone: String) {
        self.email = email
        self.timezone = timezone
    }
}

public struct FixedSchedule: Codable, Equatable, Sendable {
    public let _tag = "fixed_local_time"
    public let sendAtSecondsLocal: Int
    public static let defaultSeconds = 9 * 3600
    public static let options = Array(stride(from: 0, to: 86400, by: 900))

    public init(seconds: Int) throws {
        guard Self.options.contains(seconds) else { throw APIError.invalidSchedule }
        sendAtSecondsLocal = seconds
    }

    public init(from decoder: any Decoder) throws {
        let values = try decoder.container(keyedBy: CodingKeys.self)
        guard try values.decode(String.self, forKey: ._tag) == "fixed_local_time" else {
            throw APIError.invalidSchedule
        }
        try self.init(seconds: values.decode(Int.self, forKey: .sendAtSecondsLocal))
    }
}

public struct Subscription: Codable, Identifiable, Sendable {
    public let id: String
    public let subject: Subject
    public let schedule: FixedSchedule

    public init(id: String, subject: Subject, schedule: FixedSchedule) {
        self.id = id
        self.subject = subject
        self.schedule = schedule
    }
}

public struct ScheduledSubscription: Codable, Sendable {
    public let subject: Subject
    public let events: [Game]
}

public struct Game: Codable, Identifiable, Sendable {
    public let id: String
    public let startsAt: Date
    public let availability: String
    public let details: Details
    public let participants: [Participant]

    public struct Details: Codable, Sendable {
        public let leagueId: League
    }

    public struct Participant: Codable, Sendable {
        public let details: Details
        public struct Details: Codable, Sendable {
            public let role: String
            public let title: String
        }
    }
}

public struct PreferencesRequest: Encodable, Sendable {
    public let subjectIds: [String]
    public let schedule: FixedSchedule

    public init(subjectIds: [String], seconds: Int) throws {
        guard (1...4).contains(subjectIds.count), Set(subjectIds).count == subjectIds.count else {
            throw APIError.invalidSelection
        }
        self.subjectIds = subjectIds
        schedule = try FixedSchedule(seconds: seconds)
    }
}

public struct SignupRequest: Encodable, Sendable {
    public let email: String
    public let timezone: String
    public let subjectIds: [String]
    public let schedule: FixedSchedule

    public init(email: String, timezone: String, subjectIds: [String], seconds: Int) throws {
        let normalized = email.trimmingCharacters(in: .whitespacesAndNewlines).lowercased()
        guard normalized.contains("@"), !normalized.contains(where: \.isWhitespace),
            TimeZone(identifier: timezone) != nil
        else { throw APIError.invalidSignup }
        let preferences = try PreferencesRequest(subjectIds: subjectIds, seconds: seconds)
        self.email = normalized
        self.timezone = timezone
        self.subjectIds = preferences.subjectIds
        schedule = preferences.schedule
    }
}

public enum FeedbackKind: String, CaseIterable, Encodable, Sendable {
    case newSubject = "new_subject", general
    public var title: String { self == .newSubject ? "Request a team or league" : "Feedback or support" }
}

public enum WireJSON {
    public static func decoder() -> JSONDecoder {
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .custom { decoder in
            let value = try decoder.singleValueContainer().decode(String.self)
            let format = ISO8601DateFormatter()
            format.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
            if let date = format.date(from: value) { return date }
            format.formatOptions = [.withInternetDateTime]
            guard let date = format.date(from: value) else {
                throw DecodingError.dataCorrupted(.init(codingPath: decoder.codingPath,
                                                       debugDescription: "Invalid UTC instant"))
            }
            return date
        }
        return decoder
    }
}
