import Foundation
#if canImport(FoundationNetworking)
import FoundationNetworking
#endif
import Testing
@testable import PlayTodayCore

@MainActor
private final class MemoryVault: SessionVault {
    var data: Data?
    func read() -> Data? { data }
    func write(_ data: Data?) { self.data = data }
}

private final class StubState: @unchecked Sendable {
    typealias Handler = @Sendable (URLRequest) throws -> (Int, [String: String], Data)
    private let lock = NSLock()
    private var handler: Handler?
    func set(_ handler: @escaping Handler) { lock.withLock { self.handler = handler } }
    func respond(_ request: URLRequest) throws -> (Int, [String: String], Data) {
        let current = lock.withLock { handler }
        return try #require(current)(request)
    }
}

private final class StubProtocol: URLProtocol, @unchecked Sendable {
    static let state = StubState()
    override class func canInit(with request: URLRequest) -> Bool { true }
    override class func canonicalRequest(for request: URLRequest) -> URLRequest { request }
    override func startLoading() {
        do {
            let (status, headers, data) = try Self.state.respond(request)
            let url = try #require(request.url)
            let response = try #require(HTTPURLResponse(url: url, statusCode: status, httpVersion: "HTTP/1.1", headerFields: headers))
            client?.urlProtocol(self, didReceive: response, cacheStoragePolicy: .notAllowed)
            client?.urlProtocol(self, didLoad: data)
            client?.urlProtocolDidFinishLoading(self)
        } catch { client?.urlProtocol(self, didFailWithError: error) }
    }
    override func stopLoading() {}
}

@Suite("HTTP client", .serialized)
@MainActor
struct APIClientTests {
    private func makeClient(_ handler: @escaping StubState.Handler) throws -> (APIClient, MemoryVault) {
        StubProtocol.state.set(handler)
        let configuration = URLSessionConfiguration.ephemeral
        configuration.protocolClasses = [StubProtocol.self]
        let vault = MemoryVault()
        return (try APIClient(baseURL: URL(string: "https://api.dotheyplay.today")!, vault: vault, configuration: configuration), vault)
    }

    @Test func readsTypedEventsAndSendsTrustedOrigin() async throws {
        let data = try fixtureData()
        let (client, _) = try makeClient { request in
            #expect(request.url?.path == "/api/user/events")
            #expect(request.httpMethod == "GET")
            #expect(request.value(forHTTPHeaderField: "Origin") == "https://api.dotheyplay.today")
            #expect(request.value(forHTTPHeaderField: "Accept") == "application/json")
            return (200, [:], data)
        }
        #expect(try await client.events().count == 4)
    }

    @Test func updatesWithCorrectBodyAndRoute() async throws {
        let (client, _) = try makeClient { request in
            #expect(request.url?.path == "/api/user/subscription")
            #expect(request.httpMethod == "POST")
            #expect(request.value(forHTTPHeaderField: "Content-Type") == "application/json")
            let body = try #require(request.httpBody)
            let json = try #require(JSONSerialization.jsonObject(with: body) as? [String: Any])
            #expect(json["subjectIds"] as? [String] == ["a", "b"])
            #expect((json["schedule"] as? [String: Any])?["sendAtSecondsLocal"] as? Int == 900)
            return (200, [:], Data(#"{"ok":true}"#.utf8))
        }
        try await client.update(PreferencesRequest(subjectIds: ["a", "b"], seconds: 900))
    }

    @Test func feedbackAcceptsNoContent() async throws {
        let (client, _) = try makeClient { request in
            #expect(request.url?.path == "/api/feedback")
            let body = try #require(request.httpBody)
            let json = try #require(JSONSerialization.jsonObject(with: body) as? [String: String])
            #expect(json == ["type": "new_subject", "request": "Add soccer"])
            return (204, [:], Data())
        }
        try await client.feedback(kind: .newSubject, text: " Add soccer \n")
        await #expect(throws: APIError.invalidFeedback) { try await client.feedback(kind: .general, text: " ") }
        await #expect(throws: APIError.invalidFeedback) { try await client.feedback(kind: .general, text: String(repeating: "🙂", count: 1001)) }
    }

    @Test func duplicateSignupIsDistinctFromTransportFailure() async throws {
        let (client, _) = try makeClient { _ in (409, [:], Data(#"{"_tag":"DuplicateSignup"}"#.utf8)) }
        await #expect(throws: APIError.duplicateSignup) {
            try await client.signup(SignupRequest(email: "a@b.com", timezone: "America/New_York", subjectIds: ["a"], seconds: 0))
        }
    }

    @Test func mapsRateLimitsAndMalformedData() async throws {
        let (client, _) = try makeClient { _ in (429, [:], Data()) }
        await #expect(throws: APIError.rateLimited) { try await client.requestLink(email: "a@b.com") }
        StubProtocol.state.set { _ in (200, [:], Data("not json".utf8)) }
        await #expect(throws: APIError.invalidResponse) { try await client.user() }
    }

    @Test func clearsVaultOnExpiredSession() async throws {
        let (client, vault) = try makeClient { _ in (401, [:], Data()) }
        vault.data = Data("old-session".utf8)
        await #expect(throws: APIError.unauthorized) { try await client.user() }
        #expect(vault.data == nil)
    }

    @Test func failedSignOutDoesNotClearLocalSession() async throws {
        let (client, vault) = try makeClient { _ in (503, [:], Data()) }
        let original = Data("old-session".utf8)
        vault.data = original
        await #expect(throws: APIError.server(503)) { try await client.signOut() }
        #expect(vault.data == original)
    }

    @Test func deletionUsesAuthenticatedEndpointWithoutToken() async throws {
        let (client, vault) = try makeClient { request in
            #expect(request.url?.path == "/api/user/unsubscribe")
            #expect(request.httpMethod == "POST")
            #expect(request.httpBody == Data("{}".utf8))
            return (200, [:], Data(#"{"ok":true}"#.utf8))
        }
        try await client.deleteAccount()
        #expect(vault.data == nil)
    }

    @Test func redeemRemovesRedirectsAndConfirmsSession() async throws {
        let (client, _) = try makeClient { request in
            if request.url?.path == "/api/auth/magic-link/verify" {
                #expect(request.url?.query == "token=secret")
                return (200, [:], Data("{}".utf8))
            }
            #expect(request.url?.path == "/api/user")
            return (200, [:], Data(#"{"email":"a@b.com","timezone":"America/New_York"}"#.utf8))
        }
        try await client.redeemLink("https://api.dotheyplay.today/api/auth/magic-link/verify?token=secret&callbackURL=https://dotheyplay.today/home")
    }

    @Test func invalidVerificationRedirectDoesNotCountAsSuccess() async throws {
        let (client, _) = try makeClient { _ in (302, ["Location": "https://evil.example?error=INVALID_TOKEN"], Data()) }
        await #expect(throws: APIError.expiredLink) {
            try await client.redeemLink("https://api.dotheyplay.today/api/auth/magic-link/verify?token=secret")
        }
    }

    @Test func rejectsInsecureRemoteServers() {
        for address in ["http://example.com", "https://user:password@example.com", "https://example.com/path", "https://example.com?token=secret"] {
            #expect(throws: APIError.invalidConfiguration) { try APIClient(baseURL: URL(string: address)!, vault: MemoryVault()) }
        }
    }

    @Test func restoresOnlyUnexpiredCookiesForThisServer() async throws {
        let vault = MemoryVault()
        let expiry = Date.now.addingTimeInterval(3600).timeIntervalSinceReferenceDate
        vault.data = Data("""
        [
          {"name":"__Secure-better-auth.session_token","value":"signed-session","domain":"api.dotheyplay.today","path":"/","expires":\(expiry),"secure":true},
          {"name":"foreign","value":"must-not-leak","domain":"other.example","path":"/","expires":\(expiry),"secure":true},
          {"name":"expired","value":"old","domain":"api.dotheyplay.today","path":"/","expires":0,"secure":true}
        ]
        """.utf8)
        let config = URLSessionConfiguration.ephemeral
        config.protocolClasses = [StubProtocol.self]
        StubProtocol.state.set { request in
            #expect(request.value(forHTTPHeaderField: "Cookie")?.contains("signed-session") == true)
            #expect(request.value(forHTTPHeaderField: "Cookie")?.contains("must-not-leak") != true)
            #expect(request.value(forHTTPHeaderField: "Cookie")?.contains("expired") != true)
            return (200, [:], Data(#"{"email":"a@b.com","timezone":"America/New_York"}"#.utf8))
        }
        let client = try APIClient(baseURL: URL(string: "https://api.dotheyplay.today")!, vault: vault, configuration: config)
        _ = try await client.user()
        let stored = try #require(vault.data)
        #expect(String(decoding: stored, as: UTF8.self).contains("signed-session"))
        #expect(!String(decoding: stored, as: UTF8.self).contains("must-not-leak"))
        try client.clearSession()
        #expect(vault.data == nil)
    }
}
