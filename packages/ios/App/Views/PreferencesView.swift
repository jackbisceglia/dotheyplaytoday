import SwiftUI
import PlayTodayCore

struct PreferencesView: View {
    enum Mode { case signup, edit }
    @Bindable var model: AppModel
    let mode: Mode
    @State private var selected: [String] = []
    @State private var seconds = FixedSchedule.defaultSeconds
    @State private var email = ""
    @State private var timezone = TimeZone.current.identifier
    @State private var league: League = .nba
    @State private var search = ""
    @State private var busy = false
    @State private var error: String?
    @State private var completion: String?
    @State private var signingIn = false
    @Environment(\.dismiss) private var dismiss

    private var teams: [Subject] {
        model.catalog.filter {
            $0.details.leagueId == league && (search.isEmpty || $0.details.display.localizedCaseInsensitiveContains(search) || $0.details.abbreviation.localizedCaseInsensitiveContains(search))
        }
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 24) {
                    if let completion {
                        confirmation(completion)
                    } else {
                        VStack(alignment: .leading, spacing: 10) {
                            Eyebrow(text: mode == .signup ? "Build your daily lineup" : "Make it yours")
                            Text(mode == .signup ? "Who’s your team?" : "Your picks.").font(Brand.headline(34))
                            Text("Pick one to four teams. We’ll email you when they play.").foregroundStyle(.secondary)
                        }
                        selectedRoster
                        sendTime
                        if mode == .signup { signupFields }
                        if let error { MessageCard(text: error, isError: true) }
                        picker
                    }
                }
                .padding(24).padding(.bottom, 10).frame(maxWidth: 640).frame(maxWidth: .infinity)
            }
            .paperScreen()
            .safeAreaInset(edge: .bottom) {
                if completion == nil {
                    VStack(spacing: 8) {
                        PrimaryButton(title: mode == .signup ? "Start my updates" : "Save changes", busy: busy,
                                      disabled: selected.isEmpty || (mode == .signup && !email.contains("@"))) {
                            Task { await save() }
                        }
                        Text(mode == .signup ? "Confirm your email to start receiving updates." : "Changes apply to all your selected teams.")
                            .font(.caption).foregroundStyle(.secondary)
                    }.padding(.horizontal, 24).padding(.vertical, 12).background(Brand.paper)
                }
            }
            .navigationTitle(mode == .signup ? "Get started" : "Edit your teams")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button(completion == nil ? "Cancel" : "Done") { dismiss() }.disabled(busy)
                }
            }
            .interactiveDismissDisabled(busy)
            .disabled(busy)
            .onAppear {
                if mode == .edit { selected = model.selectedIDs; seconds = model.sendSeconds }
            }
            .task { if model.catalog.isEmpty { await model.loadCatalog() } }
            .sheet(isPresented: $signingIn) {
                SignInView(model: model, initialEmail: email, initialMessage: completion)
            }
        }
    }

    private var selectedRoster: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Text("YOUR ROSTER").font(.caption.weight(.heavy)).tracking(1.4)
                Spacer()
                Text("\(selected.count) / 4").font(.subheadline.monospaced().weight(.bold)).foregroundStyle(Brand.deep)
            }
            if selected.isEmpty {
                Text("Your first pick is waiting below.").font(.subheadline).foregroundStyle(.secondary)
                    .frame(maxWidth: .infinity, alignment: .leading).padding(18)
                    .background(Brand.wash, in: RoundedRectangle(cornerRadius: 14))
            } else {
                ForEach(selected, id: \.self) { id in
                    if let team = model.catalog.first(where: { $0.id == id }) ?? model.subscriptions.first(where: { $0.subject.id == id })?.subject {
                        HStack(spacing: 12) {
                            TeamBadge(subject: team, size: 36)
                            Text(team.details.display).font(.subheadline.weight(.semibold))
                            Spacer()
                            Button { selected.removeAll { $0 == id } } label: {
                                Image(systemName: "xmark.circle.fill").foregroundStyle(.secondary).frame(width: 44, height: 44)
                            }.accessibilityLabel("Remove \(team.details.display)")
                        }
                    }
                }
            }
        }
    }

    private var sendTime: some View {
        VStack(alignment: .leading, spacing: 6) {
            HStack {
                Label("Email me at", systemImage: "clock").font(.headline)
                Spacer()
                Picker("Email time", selection: $seconds) {
                    ForEach(FixedSchedule.options, id: \.self) { value in
                        Text(GameSchedule.sendTime(value)).tag(value)
                    }
                }.labelsHidden()
            }
            Text("Only on game days. \(mode == .edit ? model.timezone.identifier : timezone)")
                .font(.caption).foregroundStyle(.secondary)
        }.padding(16).background(Brand.wash, in: RoundedRectangle(cornerRadius: 16))
    }

    private var signupFields: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Where should we send your updates?").font(.headline)
            TextField("Email address", text: $email)
                .textContentType(.emailAddress).keyboardType(.emailAddress)
                .textInputAutocapitalization(.never).autocorrectionDisabled()
                .padding(16).background(.white, in: RoundedRectangle(cornerRadius: 12))
                .accessibilityIdentifier("signup-email")
            HStack {
                Text("Timezone").font(.subheadline)
                Spacer()
                Picker("Timezone", selection: $timezone) {
                    ForEach(TimeZone.knownTimeZoneIdentifiers, id: \.self) { zone in
                        Text(zone.replacingOccurrences(of: "_", with: " ")).tag(zone)
                    }
                }.labelsHidden()
            }
        }
    }

    private var picker: some View {
        VStack(alignment: .leading, spacing: 16) {
            Picker("League", selection: $league) {
                ForEach(League.allCases) { league in Text(league.title).tag(league) }
            }.pickerStyle(.segmented)
            HStack {
                Image(systemName: "magnifyingglass").foregroundStyle(.secondary)
                TextField("Search \(league.title) teams", text: $search).autocorrectionDisabled()
                    .accessibilityIdentifier("team-search")
                if !search.isEmpty { Button { search = "" } label: { Image(systemName: "xmark.circle.fill") }.accessibilityLabel("Clear search") }
            }.padding(14).background(.white, in: RoundedRectangle(cornerRadius: 12))
            if model.catalogLoading {
                ProgressView("Loading teams…").frame(maxWidth: .infinity).padding()
            } else if let failure = model.catalogError {
                MessageCard(text: failure, isError: true)
                Button("Try loading teams again") { Task { await model.loadCatalog() } }
            } else if teams.isEmpty {
                Text("No teams match your search.").foregroundStyle(.secondary).padding(.vertical)
            }
            if selected.count == 4 {
                Text("Your roster is full. Remove a pick to add another.").font(.caption).foregroundStyle(Brand.deep)
            }
            LazyVStack(spacing: 0) {
                ForEach(teams) { team in
                    let picked = selected.contains(team.id)
                    Button {
                        if picked { selected.removeAll { $0 == team.id } }
                        else if selected.count < 4 { selected.append(team.id) }
                    } label: {
                        HStack(spacing: 12) {
                            TeamBadge(subject: team)
                            VStack(alignment: .leading, spacing: 3) {
                                Text(team.details.name).font(.headline)
                                Text(team.details.location).font(.subheadline).foregroundStyle(.secondary)
                            }
                            Spacer()
                            Image(systemName: picked ? "checkmark.circle.fill" : "circle")
                                .font(.title2).foregroundStyle(picked ? Brand.deep : Brand.ink.opacity(0.2))
                        }
                        .padding(.vertical, 12).contentShape(Rectangle())
                    }
                    .buttonStyle(.plain)
                    .disabled(!picked && selected.count == 4)
                    .opacity(!picked && selected.count == 4 ? 0.4 : 1)
                    .accessibilityLabel(team.details.display)
                    .accessibilityAddTraits(picked ? .isSelected : [])
                    Divider()
                }
            }
        }
    }

    private func confirmation(_ message: String) -> some View {
        VStack(alignment: .leading, spacing: 24) {
            Image(systemName: "envelope.badge.shield.half.filled").font(.system(size: 48)).foregroundStyle(Brand.deep)
            Text("Check your email.").font(Brand.headline(34))
            MessageCard(text: message)
            Text("To sign in here, copy the confirmation link from your email without opening it, then paste it on the next screen.")
                .foregroundStyle(.secondary)
            PrimaryButton(title: "I have my email link") { signingIn = true }
        }.padding(.vertical, 30)
    }

    private func save() async {
        busy = true
        error = nil
        defer { busy = false }
        do {
            if mode == .signup {
                guard let client = model.client else { throw APIError.invalidConfiguration }
                try await client.signup(SignupRequest(email: email, timezone: timezone, subjectIds: selected, seconds: seconds))
                completion = "Check your email to start your updates."
            } else {
                try await model.save(ids: selected, seconds: seconds)
                dismiss()
            }
        } catch APIError.duplicateSignup {
            completion = APIError.duplicateSignup.localizedDescription
        } catch APIError.unauthorized {
            model.handle(APIError.unauthorized)
            dismiss()
        } catch { self.error = error.localizedDescription }
    }
}
