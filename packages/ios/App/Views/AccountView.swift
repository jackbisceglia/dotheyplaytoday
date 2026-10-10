import SwiftUI
import PlayTodayCore

struct AccountView: View {
    @Bindable var model: AppModel
    @State private var feedback = false
    @State private var deleting = false
    @State private var busy = false

    var body: some View {
        NavigationStack {
            List {
                Section {
                    HStack(spacing: 16) {
                        BrandMark().frame(width: 52, height: 52)
                        VStack(alignment: .leading, spacing: 4) {
                            Text(model.isDemo ? "You’re exploring the demo" : "You’re on the team.").font(.headline)
                            Text(model.user?.email ?? "").font(.subheadline).foregroundStyle(.secondary)
                        }
                    }.padding(.vertical, 10)
                }.listRowBackground(Color.white.opacity(0.8))
                Section {
                    LabeledContent("Delivery", value: "Email")
                    LabeledContent("Send time", value: GameSchedule.sendTime(model.sendSeconds))
                    LabeledContent("Timezone", value: model.timezone.identifier.replacingOccurrences(of: "_", with: " "))
                } header: {
                    Text("Your updates")
                } footer: {
                    Text("You’ll get an email when your teams play on your local calendar day. Manage your picks and time from Today.")
                }.listRowBackground(Color.white.opacity(0.8))
                Section("Make it better") {
                    Button { feedback = true } label: { Label("Request a team or send feedback", systemImage: "bubble.left.and.bubble.right") }
                        .disabled(model.isDemo)
                    Link(destination: URL(string: "https://dotheyplay.today")!) { Label("Visit dotheyplay.today", systemImage: "arrow.up.right.square") }
                }.listRowBackground(Color.white.opacity(0.8))
                Section {
                    Button(model.isDemo ? "Exit demo" : "Sign out") {
                        Task { await perform { try await model.signOut() } }
                    }
                    if !model.isDemo {
                        Button("Delete account & stop emails", role: .destructive) { deleting = true }
                    }
                } footer: {
                    Text(model.isDemo ? "Demo games are illustrative. No account is created and nothing is saved." : "Signing out keeps your team emails running. Deleting your account removes your saved teams and stops emails.")
                }.listRowBackground(Color.white.opacity(0.8))
                Section {
                    HStack { Spacer(); Text("A little heads-up. More game days.").font(.caption).foregroundStyle(.secondary); Spacer() }
                        .listRowBackground(Color.clear)
                }
            }
            .scrollContentBackground(.hidden).paperScreen().navigationTitle("Account")
            .disabled(busy)
            .overlay { if busy { ProgressView().padding(24).background(Brand.paper, in: RoundedRectangle(cornerRadius: 16)) } }
            .sheet(isPresented: $feedback) { FeedbackView(model: model) }
            .confirmationDialog("Delete your account?", isPresented: $deleting, titleVisibility: .visible) {
                Button("Delete account & stop emails", role: .destructive) { Task { await perform { try await model.deleteAccount() } } }
                Button("Keep my account", role: .cancel) {}
            } message: {
                Text("This permanently deletes your account, saved teams and schedule. You can sign up again later.")
            }
        }
    }

    private func perform(_ action: () async throws -> Void) async {
        busy = true
        defer { busy = false }
        do { try await action() } catch { model.handle(error) }
    }
}

struct FeedbackView: View {
    let model: AppModel
    @State private var kind: FeedbackKind = .newSubject
    @State private var text = ""
    @State private var busy = false
    @State private var sent = false
    @State private var error: String?
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 24) {
                    Text(sent ? "You’re heard." : "Who’s missing?").font(Brand.headline(34))
                    if sent {
                        MessageCard(text: "Thanks for helping shape what comes next. Your feedback has been sent.")
                        PrimaryButton(title: "Done") { dismiss() }
                    } else {
                        Text("A team, a league, a sport—or a way we could make your day better.").foregroundStyle(.secondary)
                        Picker("Feedback type", selection: $kind) {
                            ForEach(FeedbackKind.allCases, id: \.self) { Text($0.title).tag($0) }
                        }.pickerStyle(.menu)
                        TextEditor(text: $text).frame(minHeight: 180).padding(12)
                            .scrollContentBackground(.hidden).background(.white, in: RoundedRectangle(cornerRadius: 14))
                            .accessibilityLabel("Your feedback")
                        Text("\(text.utf16.count) / 2,000").font(.caption.monospaced())
                            .foregroundStyle(text.utf16.count > 2000 ? Color.red : Brand.ink.opacity(0.65))
                        if let error { MessageCard(text: error, isError: true) }
                        PrimaryButton(title: "Send feedback", busy: busy,
                                      disabled: text.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty || text.utf16.count > 2000) {
                            Task {
                                busy = true
                                error = nil
                                defer { busy = false }
                                do {
                                    guard let client = model.client else { throw APIError.invalidConfiguration }
                                    try await client.feedback(kind: kind, text: text)
                                    sent = true
                                } catch { self.error = error.localizedDescription }
                            }
                        }
                    }
                }.padding(24).frame(maxWidth: 560).frame(maxWidth: .infinity)
            }.paperScreen().navigationTitle("Feedback").navigationBarTitleDisplayMode(.inline)
                .toolbar { ToolbarItem(placement: .cancellationAction) { Button("Close") { dismiss() }.disabled(busy) } }
                .interactiveDismissDisabled(busy)
        }
    }
}
