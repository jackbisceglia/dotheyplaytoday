import Foundation
#if canImport(FoundationNetworking)
import FoundationNetworking
#endif

public enum APIError: Error, LocalizedError, Equatable {
    case unauthorized, duplicateSignup, rateLimited, invalidLink, expiredLink
    case invalidSelection, invalidSchedule, invalidSignup, invalidFeedback
    case invalidConfiguration, invalidResponse, server(Int)

    public var errorDescription: String? {
        switch self {
        case .unauthorized: "Your session has expired. Sign in again to see your teams."
        case .duplicateSignup: "You already have an account. We’ve emailed you a link to sign in. Your existing teams and schedule haven’t changed."
        case .rateLimited: "Too many requests. Give it a minute, then try again."
        case .invalidLink: "Paste the original sign-in link from your email for this app’s server."
        case .expiredLink: "That link has expired or was already used. Request a fresh link and copy it here before opening it."
        case .invalidSelection: "Choose between one and four different teams."
        case .invalidSchedule: "Choose a send time in 15-minute intervals."
        case .invalidSignup: "Enter a valid email address and timezone."
        case .invalidFeedback: "Write a request between 1 and 2,000 characters."
        case .invalidConfiguration: "The app’s API address is invalid. Check the build configuration."
        case .invalidResponse: "We couldn’t read the server’s response. Please try again."
        case .server: "We couldn’t reach your teams right now. Please try again shortly."
        }
    }
}

@MainActor
public protocol SessionVault {
    func read() throws -> Data?
    func write(_ data: Data?) throws
}

public enum MagicLink {
    public static func verificationURL(from text: String, apiURL: URL) throws -> URL {
        guard let supplied = URLComponents(string: text.trimmingCharacters(in: .whitespacesAndNewlines)),
            supplied.scheme == apiURL.scheme, supplied.host?.lowercased() == apiURL.host?.lowercased(),
            supplied.port == apiURL.port, supplied.user == nil, supplied.password == nil,
            supplied.path == "/api/auth/magic-link/verify",
            let tokens = supplied.queryItems?.filter({ $0.name == "token" }), tokens.count == 1,
            let token = tokens.first?.value, !token.isEmpty, token.count <= 512
        else { throw APIError.invalidLink }
        var target = URLComponents(url: apiURL.appendingPathComponent("api/auth/magic-link/verify"), resolvingAgainstBaseURL: false)
        // Omitting callbackURL makes Better Auth return JSON and set its session cookie.
        // Never follow a pasted callback or a tracking/shortened link.
        target?.queryItems = [URLQueryItem(name: "token", value: token)]
        guard let result = target?.url else { throw APIError.invalidLink }
        return result
    }
}

private final class NoRedirects: NSObject, URLSessionTaskDelegate, Sendable {
    func urlSession(
        _ session: URLSession, task: URLSessionTask,
        willPerformHTTPRedirection response: HTTPURLResponse, newRequest request: URLRequest,
        completionHandler: @escaping @Sendable (URLRequest?) -> Void
    ) { completionHandler(nil) }
}

private struct StoredCookie: Codable {
    let name: String
    let value: String
    let domain: String
    let path: String
    let expires: Date?
    let secure: Bool

    init(_ cookie: HTTPCookie) {
        name = cookie.name
        value = cookie.value
        domain = cookie.domain
        path = cookie.path
        expires = cookie.expiresDate
        secure = cookie.isSecure
    }

    var cookie: HTTPCookie? {
        var properties: [HTTPCookiePropertyKey: Any] = [
            .name: name, .value: value, .domain: domain, .path: path,
            .secure: secure ? "TRUE" : "FALSE",
        ]
        if let expires { properties[.expires] = expires }
        return HTTPCookie(properties: properties)
    }
}

@MainActor
public final class APIClient {
    public let baseURL: URL
    private let session: URLSession
    private let vault: any SessionVault
    private let cookies: HTTPCookieStorage?

    public init(baseURL: URL, vault: any SessionVault, configuration: URLSessionConfiguration = .ephemeral) throws {
        guard let host = baseURL.host, !host.isEmpty, baseURL.user == nil, baseURL.password == nil,
            baseURL.query == nil, baseURL.fragment == nil, ["", "/"].contains(baseURL.path),
            baseURL.scheme == "https" || (baseURL.scheme == "http" && ["localhost", "127.0.0.1", "::1"].contains(host))
        else { throw APIError.invalidConfiguration }
        self.baseURL = baseURL
        self.vault = vault
        configuration.requestCachePolicy = .reloadIgnoringLocalCacheData
        configuration.urlCache = nil
        configuration.timeoutIntervalForRequest = 30
        configuration.timeoutIntervalForResource = 60
        cookies = configuration.httpCookieStorage
        session = URLSession(configuration: configuration, delegate: NoRedirects(), delegateQueue: nil)
        if let data = try vault.read() {
            let stored = try JSONDecoder().decode([StoredCookie].self, from: data)
            for item in stored where item.domain == host && (item.expires ?? .distantFuture) > .now {
                if let cookie = item.cookie { cookies?.setCookie(cookie) }
            }
        }
    }

    public func subjects() async throws -> [Subject] { try await get("api/subjects") }
    public func user() async throws -> User { try await get("api/user") }
    public func subscriptions() async throws -> [Subscription] { try await get("api/user/subscription") }
    public func events() async throws -> [ScheduledSubscription] { try await get("api/user/events") }

    public func signup(_ payload: SignupRequest) async throws {
        try await post("api/user", payload)
    }

    public func update(_ payload: PreferencesRequest) async throws {
        try await post("api/user/subscription", payload)
    }

    public func requestLink(email: String) async throws {
        struct Request: Encodable { let email: String }
        try await post("api/auth/sign-in/magic-link", Request(email: email.trimmingCharacters(in: .whitespacesAndNewlines).lowercased()))
    }

    public func redeemLink(_ text: String) async throws {
        let url = try MagicLink.verificationURL(from: text, apiURL: baseURL)
        _ = try await send(URLRequest(url: url), verifyingLink: true)
        // A successful verification must also produce an authenticated API session.
        _ = try await user()
    }

    public func feedback(kind: FeedbackKind, text: String) async throws {
        let trimmed = text.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty, trimmed.utf16.count <= 2000 else { throw APIError.invalidFeedback }
        struct Request: Encodable { let type: FeedbackKind; let request: String }
        try await post("api/feedback", Request(type: kind, request: trimmed))
    }

    public func signOut() async throws {
        try await post("api/auth/sign-out", Empty())
        try clearSession()
    }

    public func deleteAccount() async throws {
        try await post("api/user/unsubscribe", Empty())
        try clearSession()
    }

    public func clearSession() throws {
        for cookie in cookies?.cookies ?? [] { cookies?.deleteCookie(cookie) }
        try vault.write(nil)
    }

    private struct Empty: Encodable {}

    private func get<T: Decodable>(_ path: String) async throws -> T {
        let data = try await send(URLRequest(url: baseURL.appendingPathComponent(path)))
        do { return try WireJSON.decoder().decode(T.self, from: data) }
        catch { throw APIError.invalidResponse }
    }

    private func post<T: Encodable>(_ path: String, _ body: T) async throws {
        var request = URLRequest(url: baseURL.appendingPathComponent(path))
        request.httpMethod = "POST"
        request.httpBody = try JSONEncoder().encode(body)
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        _ = try await send(request)
    }

    private func send(_ input: URLRequest, verifyingLink: Bool = false) async throws -> Data {
        var request = input
        request.setValue("application/json", forHTTPHeaderField: "Accept")
        request.setValue(baseURL.absoluteString.trimmingCharacters(in: CharacterSet(charactersIn: "/")), forHTTPHeaderField: "Origin")
        let (data, response) = try await session.data(for: request)
        guard let response = response as? HTTPURLResponse else { throw APIError.invalidResponse }
        switch response.statusCode {
        case 200..<300: break
        case 401:
            try clearSession()
            throw APIError.unauthorized
        case 409 where request.url?.path == "/api/user": throw APIError.duplicateSignup
        case 429: throw APIError.rateLimited
        case 300..<400 where verifyingLink: throw APIError.expiredLink
        case 400 where verifyingLink: throw APIError.expiredLink
        default: throw APIError.server(response.statusCode)
        }
        let stored = (cookies?.cookies ?? []).filter {
            $0.domain == baseURL.host && $0.name.contains("better-auth") && ($0.expiresDate ?? .distantFuture) > .now
        }.map(StoredCookie.init)
        try vault.write(stored.isEmpty ? nil : JSONEncoder().encode(stored))
        return data
    }
}
