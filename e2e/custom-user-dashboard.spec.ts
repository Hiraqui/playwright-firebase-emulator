import { test, expect } from "./fixtures/custom-user-fixtures";

/**
 * Dashboard functionality tests with predefined users for consistent testing.
 * Uses custom-user-fixtures to avoid conflicts in parallel test execution.
 */
test.describe("Dashboard Flow", () => {
  /**
   * Verifies dashboard displays correctly with predefined user information.
   */
  test("should display dashboard with user information", async ({
    dashboardPage,
    user,
  }) => {
    console.log(
      `Testing dashboard display with user: ${user.name} (${user.email})`
    );

    // Navigate to dashboard and verify all elements are visible
    await dashboardPage.goto();
    await dashboardPage.verifyDashboardElements();

    // Verify user information is displayed correctly
    await dashboardPage.verifyUserInfo(user.email, user.name);
  });

  /**
   * Tests logout flow from dashboard to home page with predefined users.
   */
  test("should allow logout from dashboard", async ({
    dashboardPage,
    user,
    homePage,
  }) => {
    console.log(`Testing logout from dashboard with user: ${user.name}`);

    // Navigate to dashboard
    await dashboardPage.goto();

    // Logout and verify redirect to home
    await dashboardPage.logout();

    // Should be redirected to home page with sign-in button
    await homePage.verifyWelcomeMessage();
    await expect(homePage.signInButton).toBeVisible();
  });

  /**
   * Validates authenticated predefined users have dashboard access.
   */
  test("should redirect to dashboard after successful authentication", async ({
    dashboardPage,
    user,
  }) => {
    console.log(
      `Testing automatic redirect for authenticated user: ${user.name}`
    );

    // This test verifies that authenticated users are automatically redirected to dashboard
    // The fixture already handles authentication, so we just need to verify we can access the dashboard
    await dashboardPage.waitForPageLoad();
    await expect(dashboardPage.welcomeTitle).toBeVisible();
    await expect(dashboardPage.loggedInMessage).toBeVisible();
  });
});
