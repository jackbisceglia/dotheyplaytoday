import SwiftUI
import PlayTodayCore

struct DashboardView: View {
    @Bindable var model: AppModel
    @State private var editing = false
    @State private var selectedLeague: League?

    private var todayGames: [Matchup] {
        var calendar = Calendar(identifier: .gregorian)
        calendar.timeZone = model.timezone
        return model.days.first { calendar.isDate($0.date, inSameDayAs: .now) }?.games ?? []
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 28) {
                    if model.isDemo {
                        HStack {
                            Label("Demo · sample games", systemImage: "sparkles").font(.caption.weight(.bold))
                            Spacer()
                            Button("Exit") { model.exitDemo() }.font(.caption.weight(.bold))
                        }.padding(14).background(Brand.wash, in: RoundedRectangle(cornerRadius: 12))
                    }
                    heading
                    todayCard
                    roster
                    if let notice = model.notice { MessageCard(text: notice) }
                    schedule
                }
                .padding(.horizontal, 24).padding(.top, 12).padding(.bottom, 32)
                .frame(maxWidth: 700)
                .frame(maxWidth: .infinity)
            }
            .paperScreen()
            .refreshable { await model.refresh() }
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    HStack(spacing: 8) {
                        BrandMark().frame(width: 28, height: 28)
                        Text("dotheyplaytoday").font(.subheadline.weight(.black))
                    }.accessibilityElement(children: .combine)
                }
            }
            .sheet(isPresented: $editing) { PreferencesView(model: model, mode: .edit) }
        }
    }

    private var heading: some View {
        VStack(alignment: .leading, spacing: 8) {
            Eyebrow(text: Date.now.formatted(Date.FormatStyle(date: .complete, time: .omitted, timeZone: model.timezone)))
            Text("Welcome back.").font(Brand.headline(34))
            Text("Your teams. Your day.").font(.body).foregroundStyle(.secondary)
        }
    }

    private var todayCard: some View {
        VStack(alignment: .leading, spacing: 20) {
            HStack {
                Label("THE DAILY LINEUP", systemImage: "sun.max.fill").font(.caption.weight(.heavy)).tracking(1.2)
                Spacer()
                Text("TODAY").font(.caption2.weight(.black)).padding(.horizontal, 10).padding(.vertical, 6)
                    .background(.white.opacity(0.15), in: Capsule())
            }
            if model.scheduleError != nil && model.events.isEmpty {
                Text("Lineup on hold.").font(Brand.headline(32))
                Text("We couldn’t load the schedule. Pull down to try again.").font(.subheadline)
            } else {
                Text(todayGames.isEmpty ? "A day off." : "It’s game day.").font(Brand.headline(36))
                Text(todayGames.isEmpty
                     ? "No games for your teams today. We’ll keep an eye on what’s next."
                     : "\(todayGames.count) \(todayGames.count == 1 ? "game" : "games") on your calendar. Here’s who’s playing.")
                    .font(.subheadline).foregroundStyle(.white.opacity(0.85)).fixedSize(horizontal: false, vertical: true)
                if !todayGames.isEmpty {
                    Divider().overlay(.white.opacity(0.25))
                    ForEach(todayGames) { game in
                        HStack(alignment: .top) {
                            VStack(alignment: .leading, spacing: 4) {
                                Text("\(TeamSymbols.emoji(game.team)) \(game.teamName)").font(.headline)
                                Text("\(game.isAway ? "at" : "vs") \(game.opponent)").font(.subheadline).foregroundStyle(.white.opacity(0.8))
                            }
                            Spacer(minLength: 12)
                            Text(GameSchedule.time(game.startsAt, timezone: model.timezone)).font(.subheadline.weight(.bold)).monospacedDigit()
                        }.accessibilityElement(children: .combine)
                    }
                }
            }
        }
        .padding(24).foregroundStyle(.white)
        .background(Brand.deep.gradient, in: RoundedRectangle(cornerRadius: 26))
    }

    private var roster: some View {
        VStack(alignment: .leading, spacing: 14) {
            HStack {
                Text("Your starting four").font(.title3.weight(.bold))
                Spacer()
                Button("Edit") { editing = true }.font(.subheadline.weight(.bold)).disabled(model.isDemo)
            }
            Text("Email updates at \(GameSchedule.sendTime(model.sendSeconds)) when your teams play.")
                .font(.subheadline).foregroundStyle(.secondary)
            LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
                ForEach(0..<4, id: \.self) { index in
                    if index < model.subscriptions.count {
                        let team = model.subscriptions[index].subject
                        VStack(alignment: .leading, spacing: 12) {
                            HStack {
                                TeamBadge(subject: team)
                                Spacer()
                                Text(team.details.leagueId.title).font(.caption2.weight(.bold)).foregroundStyle(.secondary)
                            }
                            VStack(alignment: .leading, spacing: 2) {
                                Text(team.details.location).font(.caption).foregroundStyle(.secondary)
                                Text(team.details.name).font(.headline).lineLimit(2)
                            }
                        }
                        .frame(maxWidth: .infinity, minHeight: 108, alignment: .leading)
                        .padding(16).background(.white.opacity(0.75), in: RoundedRectangle(cornerRadius: 18))
                        .accessibilityElement(children: .combine)
                    } else {
                        Button { editing = true } label: {
                            VStack(spacing: 12) {
                                Image(systemName: "plus").font(.title2)
                                Text("Add a team").font(.subheadline.weight(.medium))
                            }
                            .frame(maxWidth: .infinity, minHeight: 108).padding(16)
                            .overlay(RoundedRectangle(cornerRadius: 18).strokeBorder(Brand.ink.opacity(0.15), style: StrokeStyle(lineWidth: 1, dash: [5])))
                        }.buttonStyle(.plain).foregroundStyle(.secondary).disabled(model.isDemo)
                    }
                }
            }
        }
    }

    private var schedule: some View {
        VStack(alignment: .leading, spacing: 18) {
            HStack(alignment: .firstTextBaseline) {
                Text("Coming up").font(.title2.weight(.bold))
                Spacer()
                Text("NEXT 14 DAYS").font(.caption2.weight(.bold)).foregroundStyle(.secondary)
            }
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 8) {
                    leagueFilter("All", league: nil)
                    ForEach(League.allCases) { league in leagueFilter(league.title, league: league) }
                }
            }
            if let error = model.scheduleError {
                MessageCard(text: error, isError: true)
                if let updated = model.lastUpdated {
                    Text("Last updated \(updated.formatted(date: .abbreviated, time: .shortened)). Showing the last loaded schedule.")
                        .font(.caption).foregroundStyle(.secondary)
                }
            }
            let days = model.days.filter { day in day.games.contains { selectedLeague == nil || $0.league == selectedLeague } }
            if days.isEmpty && model.scheduleError == nil {
                VStack(alignment: .leading, spacing: 10) {
                    Image(systemName: "calendar.badge.checkmark").font(.title).foregroundStyle(Brand.deep)
                    Text(selectedLeague == nil ? "No games in the next 14 days." : "No \(selectedLeague?.title ?? "") games in the next 14 days.").font(.headline)
                    Text("Your teams are saved. Check back soon for the next matchup.").font(.subheadline).foregroundStyle(.secondary)
                }.frame(maxWidth: .infinity, alignment: .leading).card()
            }
            ForEach(days) { day in
                VStack(alignment: .leading, spacing: 0) {
                    Text(GameSchedule.dayTitle(day.date, timezone: model.timezone))
                        .font(.subheadline.weight(.bold)).foregroundStyle(.secondary).padding(.bottom, 6)
                    ForEach(day.games.filter { selectedLeague == nil || $0.league == selectedLeague }) { game in
                        GameRow(game: game, timezone: model.timezone)
                        Divider().overlay(Brand.ink.opacity(0.04))
                    }
                }
            }
            Text("Game times in \(model.timezone.identifier.replacingOccurrences(of: "_", with: " ")).")
                .font(.caption).foregroundStyle(.secondary)
        }
    }

    private func leagueFilter(_ title: String, league: League?) -> some View {
        Button { selectedLeague = league } label: {
            Text(title).font(.subheadline.weight(.semibold)).padding(.horizontal, 18).padding(.vertical, 10)
                .background(selectedLeague == league ? Brand.ink : .white.opacity(0.8), in: Capsule())
                .foregroundStyle(selectedLeague == league ? Brand.paper : Brand.ink)
        }.buttonStyle(.plain).accessibilityAddTraits(selectedLeague == league ? .isSelected : [])
    }
}

private struct GameRow: View {
    let game: Matchup
    let timezone: TimeZone

    var body: some View {
        ViewThatFits(in: .horizontal) {
            HStack(alignment: .center, spacing: 14) {
                Text(GameSchedule.time(game.startsAt, timezone: timezone))
                    .font(.subheadline.weight(.medium)).monospacedDigit().frame(width: 76, alignment: .leading)
                matchup
                Spacer(minLength: 0)
                league
            }
            VStack(alignment: .leading, spacing: 8) {
                HStack { Text(GameSchedule.time(game.startsAt, timezone: timezone)).font(.subheadline); Spacer(); league }
                matchup
            }
        }
        .padding(.vertical, 16)
        .accessibilityElement(children: .combine)
    }

    private var matchup: some View {
        VStack(alignment: .leading, spacing: 5) {
            Text("\(TeamSymbols.emoji(game.team)) \(game.teamName)").font(.subheadline.weight(.bold))
            if let opponent = game.opponentTeam {
                Text("\(game.isAway ? "at" : "vs") \(TeamSymbols.emoji(opponent)) \(game.opponent)").font(.subheadline.weight(.bold))
            } else {
                Text("\(game.isAway ? "at" : "vs") \(game.opponent)").font(.subheadline).foregroundStyle(.secondary)
            }
        }.fixedSize(horizontal: false, vertical: true)
    }

    private var league: some View {
        Text(game.league.title).font(.system(size: 10, weight: .bold)).tracking(0.7)
            .padding(7).background(Brand.ink.opacity(0.045), in: RoundedRectangle(cornerRadius: 6)).foregroundStyle(.secondary)
    }
}
