import Foundation
import Observation
import PlayTodayCore

@MainActor
@Observable
final class AppModel {
    enum Phase { case loading, welcome, signedIn, failed }
    private(set) var phase: Phase = .loading
    private(set) var catalog: [Subject] = []
    private(set) var user: User?
    private(set) var subscriptions: [Subscription] = []
    private(set) var events: [ScheduledSubscription] = []
    private(set) var isDemo = false
    private(set) var isRefreshing = false
    private(set) var catalogLoading = false
    private(set) var catalogError: String?
    private(set) var scheduleError: String?
    private(set) var lastUpdated: Date?
    var error: String?
    var notice: String?
    let client: APIClient?

    init() {
        do {
            let address = Bundle.main.object(forInfoDictionaryKey: "APIBaseURL") as? String ?? ""
            guard let url = URL(string: address) else { throw APIError.invalidConfiguration }
            client = try APIClient(baseURL: url, vault: SessionKeychain(server: address))
        } catch {
            client = nil
            self.error = error.localizedDescription
            phase = .failed
        }
    }

    var selectedIDs: [String] { subscriptions.map(\.subject.id) }
    var sendSeconds: Int { subscriptions.first?.schedule.sendAtSecondsLocal ?? FixedSchedule.defaultSeconds }
    var timezone: TimeZone { user?.timeZone ?? .current }
    var days: [GameDay] { GameSchedule.days(from: events, catalog: catalog, timezone: timezone) }

    func start() async {
        guard let client, !isDemo else { return }
        phase = .loading
        error = nil
        await loadCatalog()
        do {
            user = try await client.user()
            subscriptions = try await client.subscriptions()
            phase = .signedIn
            await loadEvents()
        } catch APIError.unauthorized {
            clearAccount()
        } catch {
            self.error = error.localizedDescription
            phase = .failed
        }
    }

    func loadCatalog() async {
        guard let client, !isDemo, !catalogLoading else { return }
        catalogLoading = true
        defer { catalogLoading = false }
        do {
            catalog = try await client.subjects().sorted { $0.details.display.localizedStandardCompare($1.details.display) == .orderedAscending }
            catalogError = nil
        } catch {
            catalogError = error.localizedDescription
        }
    }

    func refresh() async {
        guard let client, !isDemo, phase == .signedIn, !isRefreshing else { return }
        isRefreshing = true
        defer { isRefreshing = false }
        do {
            // Commit preferences together so partial refreshes don't discard a saved roster.
            let freshUser = try await client.user()
            let freshSubscriptions = try await client.subscriptions()
            user = freshUser
            subscriptions = freshSubscriptions
            await loadEvents()
        } catch { handle(error) }
    }

    private func loadEvents() async {
        guard let client else { return }
        do {
            events = try await client.events()
            scheduleError = nil
            lastUpdated = .now
        } catch APIError.unauthorized {
            handle(APIError.unauthorized)
        } catch {
            scheduleError = "The schedule couldn’t be refreshed. Pull down to try again."
        }
    }

    func signIn(link: String) async throws {
        guard let client else { throw APIError.invalidConfiguration }
        try await client.redeemLink(link)
        await start()
        if phase == .failed { throw APIError.invalidResponse }
    }

    func save(ids: [String], seconds: Int) async throws {
        guard let client else { throw APIError.invalidConfiguration }
        let request = try PreferencesRequest(subjectIds: ids, seconds: seconds)
        try await client.update(request)
        // The write is already committed. Update the visible roster even if the following read fails.
        subscriptions = ids.compactMap { id in
            guard let team = catalog.first(where: { $0.id == id }) ?? subscriptions.first(where: { $0.subject.id == id })?.subject else { return nil }
            return Subscription(id: subscriptions.first(where: { $0.subject.id == id })?.id ?? id,
                                subject: team, schedule: request.schedule)
        }
        events = []
        notice = "Your teams and email time are saved."
        await loadEvents()
    }

    func signOut() async throws {
        if isDemo { exitDemo(); return }
        guard let client else { throw APIError.invalidConfiguration }
        try await client.signOut()
        clearAccount()
    }

    func deleteAccount() async throws {
        guard let client else { throw APIError.invalidConfiguration }
        try await client.deleteAccount()
        clearAccount()
        notice = "Your account was deleted and team emails have stopped."
    }

    func handle(_ error: any Error) {
        if error as? APIError == .unauthorized { clearAccount() }
        self.error = error.localizedDescription
    }

    private func clearAccount() {
        user = nil
        subscriptions = []
        events = []
        scheduleError = nil
        lastUpdated = nil
        phase = .welcome
    }

    func enterDemo() {
        do {
            let demo = try DemoData.load()
            catalog = demo.catalog
            subscriptions = demo.subscriptions
            events = demo.events
            user = demo.user
            scheduleError = nil
            error = nil
            isDemo = true
            phase = .signedIn
        } catch { self.error = "The demo couldn’t be loaded." }
    }

    func exitDemo() {
        isDemo = false
        catalog = []
        clearAccount()
        Task { await start() }
    }
}
