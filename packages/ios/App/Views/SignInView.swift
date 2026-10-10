import SwiftUI
import PlayTodayCore

struct SignInView: View {
    @Bindable var model: AppModel
    var initialEmail = ""
    var initialMessage: String?
    @State private var email = ""
    @State private var link = ""
    @State private var message: String?
    @State private var error: String?
    @State private var busy = false
    @State private var resendAfter = Date.distantPast
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 24) {
                    Image(systemName: "envelope.open").font(.system(size: 40, weight: .light)).foregroundStyle(Brand.deep)
                    Text("Your inbox is\nyour way in.").font(Brand.headline(34))
                    Text("No password to remember. Request a link, then copy it from your email into the app.")
                        .foregroundStyle(.secondary)
                    if let message { MessageCard(text: message) }
                    if let error { MessageCard(text: error, isError: true) }
                    VStack(alignment: .leading, spacing: 12) {
                        Text("Email address").font(.subheadline.weight(.bold))
                        TextField("you@example.com", text: $email)
                            .textContentType(.emailAddress).keyboardType(.emailAddress)
                            .textInputAutocapitalization(.never).autocorrectionDisabled()
                            .padding(16).background(.white, in: RoundedRectangle(cornerRadius: 12))
                            .accessibilityIdentifier("sign-in-email")
                        TimelineView(.periodic(from: .now, by: 1)) { timeline in
                            PrimaryButton(title: timeline.date < resendAfter ? "Link requested" : "Email me a link", busy: busy,
                                          disabled: !email.contains("@") || timeline.date < resendAfter) {
                                Task { await requestLink() }
                            }
                        }
                    }
                    Divider()
                    VStack(alignment: .leading, spacing: 12) {
                        Text("Have your link?").font(.title3.weight(.bold))
                        Text("In your email, press and hold the sign-in button and choose Copy Link. Paste it here before opening it. Links work once and expire after 15 minutes.")
                            .font(.subheadline).foregroundStyle(.secondary)
                        SecureField("Paste your sign-in link", text: $link)
                            .textInputAutocapitalization(.never).autocorrectionDisabled()
                            .padding(16).background(.white, in: RoundedRectangle(cornerRadius: 12))
                            .accessibilityIdentifier("sign-in-link")
                        PasteButton(payloadType: String.self) { strings in
                            if let value = strings.first { link = value }
                        }.labelStyle(.titleAndIcon)
                        PrimaryButton(title: "Sign in", busy: busy, disabled: link.isEmpty) {
                            Task { await redeem() }
                        }
                    }
                    Text("Opened it in your browser already? Request a new link and copy that one here.")
                        .font(.caption).foregroundStyle(.secondary)
                }.padding(24).frame(maxWidth: 560).frame(maxWidth: .infinity)
            }
            .paperScreen().navigationTitle("Sign in").navigationBarTitleDisplayMode(.inline)
            .toolbar { ToolbarItem(placement: .cancellationAction) { Button("Close") { dismiss() }.disabled(busy) } }
            .interactiveDismissDisabled(busy)
            .onAppear { email = initialEmail; message = initialMessage }
            .onDisappear { link = "" }
        }
    }

    private func requestLink() async {
        busy = true
        error = nil
        defer { busy = false }
        do {
            guard let client = model.client else { throw APIError.invalidConfiguration }
            try await client.requestLink(email: email)
            message = "If there’s an account for that email, a sign-in link is on its way."
            resendAfter = .now.addingTimeInterval(60)
        } catch { self.error = error.localizedDescription }
    }

    private func redeem() async {
        busy = true
        error = nil
        defer { busy = false }
        do {
            let value = link
            link = ""
            try await model.signIn(link: value)
            dismiss()
        } catch { self.error = error.localizedDescription }
    }
}
