import SwiftUI

@main
struct DoTheyPlayTodayApp: App {
    @State private var model = AppModel()

    var body: some Scene {
        WindowGroup {
            RootView(model: model)
                .tint(Brand.deep)
                .preferredColorScheme(.light)
                .task {
                    if ProcessInfo.processInfo.arguments.contains("--demo") { model.enterDemo() }
                    else { await model.start() }
                }
        }
    }
}

struct RootView: View {
    @Bindable var model: AppModel
    @Environment(\.scenePhase) private var scenePhase

    var body: some View {
        Group {
            switch model.phase {
            case .loading:
                VStack(spacing: 24) {
                    BrandMark().frame(width: 80, height: 80)
                    ProgressView("Getting your teams ready…")
                }.frame(maxWidth: .infinity, maxHeight: .infinity).paperScreen()
            case .welcome:
                WelcomeView(model: model)
            case .signedIn:
                TabView {
                    DashboardView(model: model)
                        .tabItem { Label("Today", systemImage: "sportscourt") }
                    AccountView(model: model)
                        .tabItem { Label("Account", systemImage: "person.crop.circle") }
                }
            case .failed:
                VStack(spacing: 24) {
                    BrandMark().frame(width: 72, height: 72)
                    Text("Let’s try that again.").font(Brand.headline(30))
                    Text(model.error ?? "We couldn’t load your account.").multilineTextAlignment(.center)
                    PrimaryButton(title: "Retry") { Task { await model.start() } }
                    Button("Explore the demo") { model.enterDemo() }
                }.padding(28).frame(maxWidth: .infinity, maxHeight: .infinity).paperScreen()
            }
        }
        .onChange(of: scenePhase) { _, phase in
            if phase == .active { Task { await model.refresh() } }
        }
        .alert("Something went wrong", isPresented: Binding(
            get: { model.error != nil && model.phase != .failed },
            set: { if !$0 { model.error = nil } }
        )) { Button("OK") { model.error = nil } } message: { Text(model.error ?? "") }
    }
}
