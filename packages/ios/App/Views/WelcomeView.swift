import SwiftUI

struct WelcomeView: View {
    @Bindable var model: AppModel
    @State private var signup = false
    @State private var signIn = false

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 28) {
                    HStack(spacing: 10) {
                        BrandMark().frame(width: 38, height: 38)
                        Text("dotheyplaytoday").font(.headline.weight(.black))
                    }.padding(.top, 12)
                    VStack(alignment: .leading, spacing: 16) {
                        Eyebrow(text: "Less searching. More cheering.")
                        Text("Do they\nplay today?").font(Brand.headline(54)).tracking(-2).lineSpacing(-3)
                            .accessibilityLabel("Do they play today?")
                        Text("Your teams’ game days, all in one place. A little heads-up. A lot to look forward to.")
                            .font(.title3).foregroundStyle(.secondary).fixedSize(horizontal: false, vertical: true)
                    }.padding(.top, 20)
                    sampleCard
                    VStack(alignment: .leading, spacing: 18) {
                        benefit("01", "Pick your people.", "Follow up to four teams across the NBA, NFL, MLB and NHL.")
                        benefit("02", "Make it a daily ritual.", "Choose a time. Get an email when your teams have a game that day.")
                        benefit("03", "Know what’s next.", "See the next two weeks, with game times in your timezone.")
                    }
                    if let notice = model.notice { MessageCard(text: notice) }
                    VStack(spacing: 18) {
                        PrimaryButton(title: "Pick my teams") { signup = true }
                        Button("Already have an account? Sign in") { signIn = true }.font(.subheadline.weight(.semibold))
                        Button("Take a look around") { model.enterDemo() }.font(.subheadline).foregroundStyle(.secondary)
                    }.padding(.top, 4)
                }
                .padding(26).padding(.bottom, 20).frame(maxWidth: 580).frame(maxWidth: .infinity)
            }
            .paperScreen()
            .sheet(isPresented: $signup) { PreferencesView(model: model, mode: .signup) }
            .sheet(isPresented: $signIn) { SignInView(model: model) }
        }
    }

    private var sampleCard: some View {
        VStack(alignment: .leading, spacing: 14) {
            HStack {
                Label("A GAME-DAY KIND OF MORNING", systemImage: "envelope.badge")
                    .font(.caption2.weight(.heavy)).tracking(0.8)
                Spacer()
            }.foregroundStyle(Brand.deep)
            Text("Coffee. Inbox. Tip-off.").font(Brand.headline(25))
            HStack(spacing: 8) {
                ForEach(["🍀", "🗽", "🦅", "🐻"], id: \.self) { emoji in
                    Text(emoji).font(.title).frame(maxWidth: .infinity).padding(.vertical, 12)
                        .background(Brand.wash, in: RoundedRectangle(cornerRadius: 12))
                }
            }
            Text("Four picks. One less thing to check.").font(.subheadline).foregroundStyle(.secondary)
        }.card()
    }

    private func benefit(_ number: String, _ title: String, _ subtitle: String) -> some View {
        HStack(alignment: .top, spacing: 14) {
            Text(number).font(.caption.monospaced().weight(.bold)).foregroundStyle(Brand.deep)
                .padding(.top, 4)
            VStack(alignment: .leading, spacing: 4) {
                Text(title).font(.headline)
                Text(subtitle).font(.subheadline).foregroundStyle(.secondary)
            }
        }
    }
}
