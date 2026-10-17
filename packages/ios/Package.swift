// swift-tools-version: 6.0
import PackageDescription

let package = Package(
    name: "PlayTodayCore",
    platforms: [.iOS(.v17), .macOS(.v14)],
    products: [.library(name: "PlayTodayCore", targets: ["PlayTodayCore"])],
    targets: [
        .target(name: "PlayTodayCore"),
        .testTarget(
            name: "PlayTodayCoreTests",
            dependencies: ["PlayTodayCore"],
            resources: [.copy("Fixtures")]
        ),
    ]
)
