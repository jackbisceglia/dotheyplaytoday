import SwiftUI
import PlayTodayCore

enum Brand {
    static let paper = Color(red: 0.973, green: 0.965, blue: 0.941)
    static let ink = Color(red: 0.075, green: 0.09, blue: 0.067)
    static let green = Color(red: 0.086, green: 0.608, blue: 0.302)
    static let deep = Color(red: 0.047, green: 0.42, blue: 0.204)
    static let wash = Color(red: 0.886, green: 0.953, blue: 0.906)

    static func headline(_ size: CGFloat) -> Font {
        .system(size: size, weight: .black, design: .rounded)
    }
}

struct PrimaryButton: View {
    let title: String
    var busy = false
    var disabled = false
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: 10) {
                if busy { ProgressView().tint(.white) }
                Text(title).font(.headline)
                if !busy { Image(systemName: "arrow.right").font(.subheadline.weight(.bold)) }
            }
            .frame(maxWidth: .infinity, minHeight: 52)
            .foregroundStyle(.white)
            .background(disabled ? Brand.ink.opacity(0.3) : Brand.deep, in: RoundedRectangle(cornerRadius: 16))
        }
        .buttonStyle(.plain)
        .disabled(disabled || busy)
    }
}

struct Eyebrow: View {
    let text: String
    var body: some View {
        Text(text.uppercased()).font(.caption.weight(.heavy)).tracking(2).foregroundStyle(Brand.deep)
    }
}

struct MessageCard: View {
    let text: String
    var isError = false
    var body: some View {
        Label(text, systemImage: isError ? "exclamationmark.circle" : "checkmark.circle")
            .font(.subheadline)
            .foregroundStyle(isError ? Color(red: 0.65, green: 0.16, blue: 0.10) : Brand.deep)
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(16)
            .background(isError ? Color.red.opacity(0.06) : Brand.wash, in: RoundedRectangle(cornerRadius: 14))
            .accessibilityElement(children: .combine)
    }
}

struct BrandMark: View {
    var body: some View {
        Canvas { context, size in
            let scale = size.width / 32
            context.scaleBy(x: scale, y: scale)
            context.clip(to: Path(roundedRect: CGRect(x: 0, y: 0, width: 32, height: 32), cornerRadius: 5))
            context.fill(Path(CGRect(x: 0, y: 0, width: 32, height: 32)), with: .color(Brand.ink))
            let head = Path(ellipseIn: CGRect(x: -7, y: 8.5, width: 38, height: 38))
            context.fill(head, with: .color(Brand.green))
            context.clip(to: head)
            context.fill(Path(CGRect(x: -8, y: 11.6, width: 40, height: 3.7)), with: .color(Brand.paper))
            for x in [2.8, 13.8] {
                context.fill(Path(ellipseIn: CGRect(x: x, y: 13.1, width: 7.4, height: 7.4)), with: .color(Brand.paper))
                context.fill(Path(ellipseIn: CGRect(x: x + 3.4, y: 14, width: 3.4, height: 3.4)), with: .color(Brand.ink))
            }
        }
        .aspectRatio(1, contentMode: .fit)
        .accessibilityHidden(true)
    }
}

enum TeamSymbols {
    static let values: [String: [String: String]] = {
        guard let url = Bundle.main.url(forResource: "TeamSymbols", withExtension: "json"),
              let data = try? Data(contentsOf: url),
              let value = try? JSONDecoder().decode([String: [String: String]].self, from: data) else { return [:] }
        return value
    }()

    static func emoji(_ subject: Subject) -> String {
        values[subject.details.leagueId.rawValue]?[subject.details.abbreviation] ?? subject.details.leagueId.symbol
    }
}

struct TeamBadge: View {
    let subject: Subject
    var size: CGFloat = 46
    var body: some View {
        Text(TeamSymbols.emoji(subject)).font(.system(size: size * 0.53))
            .frame(width: size, height: size)
            .background(Brand.wash, in: RoundedRectangle(cornerRadius: size * 0.3))
            .accessibilityHidden(true)
    }
}

extension View {
    func paperScreen() -> some View {
        self.background(Brand.paper.ignoresSafeArea()).foregroundStyle(Brand.ink)
    }

    func card() -> some View {
        self.padding(20).background(.white.opacity(0.72), in: RoundedRectangle(cornerRadius: 22))
            .overlay(RoundedRectangle(cornerRadius: 22).strokeBorder(Brand.ink.opacity(0.08)))
    }
}
