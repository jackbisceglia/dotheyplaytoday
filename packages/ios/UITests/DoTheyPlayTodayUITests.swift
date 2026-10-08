import XCTest

final class DoTheyPlayTodayUITests: XCTestCase {
    @MainActor
    func testDemoDashboardAndAccount() throws {
        let app = XCUIApplication()
        app.launchArguments = ["--demo"]
        app.launch()
        XCTAssertTrue(app.staticTexts["Welcome back."].waitForExistence(timeout: 10))
        XCTAssertTrue(app.staticTexts["Demo · sample games"].exists)
        XCTAssertTrue(app.staticTexts["It’s game day."].exists)
        let screenshot = XCTAttachment(screenshot: app.screenshot())
        screenshot.name = "Today — native demo"
        screenshot.lifetime = .keepAlways
        add(screenshot)
        app.tabBars.buttons["Account"].tap()
        XCTAssertTrue(app.staticTexts["demo@example.com"].waitForExistence(timeout: 5))
        XCTAssertTrue(app.buttons["Exit demo"].exists)
        XCTAssertFalse(app.buttons["Delete account & stop emails"].exists)
    }

    @MainActor
    func testDemoAtAccessibilityTextSize() throws {
        let app = XCUIApplication()
        app.launchArguments = ["--demo", "-UIPreferredContentSizeCategoryName", "UICTContentSizeCategoryAccessibilityXXXL"]
        app.launch()
        XCTAssertTrue(app.staticTexts["Welcome back."].waitForExistence(timeout: 10))
        app.swipeUp()
        app.swipeUp()
        let screenshot = XCTAttachment(screenshot: app.screenshot())
        screenshot.name = "Large text — native demo"
        screenshot.lifetime = .keepAlways
        add(screenshot)
        app.tabBars.buttons["Account"].tap()
        XCTAssertTrue(app.staticTexts["demo@example.com"].waitForExistence(timeout: 5))
    }
}
