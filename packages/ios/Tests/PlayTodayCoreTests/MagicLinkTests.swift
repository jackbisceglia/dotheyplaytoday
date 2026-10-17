import Foundation
import Testing
@testable import PlayTodayCore

@Suite("Magic-link boundary")
struct MagicLinkTests {
    let api = URL(string: "https://api.dotheyplay.today")!

    @Test func stripsEveryCallbackAndPreservesTokenEncoding() throws {
        let url = try MagicLink.verificationURL(from: " https://api.dotheyplay.today/api/auth/magic-link/verify?token=a%2Bb%3D&callbackURL=https%3A%2F%2Fevil.example&errorCallbackURL=https%3A%2F%2Fevil.example\n", apiURL: api)
        let query = try #require(URLComponents(url: url, resolvingAgainstBaseURL: false)?.queryItems)
        #expect(query == [URLQueryItem(name: "token", value: "a+b=")])
        #expect(url.host == api.host)
    }

    @Test(arguments: [
        "https://evil.example/api/auth/magic-link/verify?token=secret",
        "http://api.dotheyplay.today/api/auth/magic-link/verify?token=secret",
        "https://api.dotheyplay.today:8443/api/auth/magic-link/verify?token=secret",
        "https://api.dotheyplay.today@evil.example/api/auth/magic-link/verify?token=secret",
        "https://user@api.dotheyplay.today/api/auth/magic-link/verify?token=secret",
        "https://api.dotheyplay.today/api/auth/magic-link/verify?token=one&token=two",
        "https://api.dotheyplay.today/api/auth/magic-link/verify?token=",
        "https://api.dotheyplay.today/other?token=secret",
        "https://dotheyplay.today/home",
    ])
    func rejectsUntrustedOrConsumedBrowserLinks(link: String) {
        #expect(throws: APIError.invalidLink) { try MagicLink.verificationURL(from: link, apiURL: api) }
    }
}
