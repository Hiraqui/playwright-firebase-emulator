import { test as base, expect } from "@playwright/test";

import { DashboardPage } from "../pages/dashboard-page";
import { GoogleSignInPage } from "../pages/google-sign-in-page";
import { HomePage } from "../pages/home-page";

/**
 * Type definition for authenticated test fixtures.
 * Provides page objects and user data for authenticated test scenarios.
 */
type AuthenticatedFixtures = {
  /** Home page object for navigation and interactions */
  homePage: HomePage;
  /** Dashboard page object for authenticated user interactions */
  dashboardPage: DashboardPage;
  /** Authenticated user object with email and display name */
  user: {
    email: string;
    name: string;
  };
};

/**
 * Extended Playwright test with authenticated user fixtures.
 * Provides automatic user authentication and page object setup for dashboard tests.
 */
export const test = base.extend<AuthenticatedFixtures>({
  /**
   * Home page fixture that creates and initializes a HomePage instance.
   */
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  /**
   * User fixture that performs complete authentication flow with dynamically generated user.
   * Handles Google sign-in popup, user generation, and authentication completion.
   */
  user: [
    async ({ homePage, context }, use) => {
      // Navigate to home page
      await homePage.goto();

      // Verify sign-in button is present and click it
      await expect(homePage.signInButton).toBeVisible();
      const pagePromise = context.waitForEvent("page");
      await homePage.signInButton.click();

      // Handle Google sign-in page
      const googleSignInPage = new GoogleSignInPage(await pagePromise);
      await googleSignInPage.waitForPageLoad();
      const user = await googleSignInPage.generateNewUserAndLogin();

      // Try signing in with more robust error handling
      await expect(async () => {
        await googleSignInPage.page.waitForTimeout(1000);
        await googleSignInPage.signInWithGoogleButton.click();

        // Create dashboard page object and wait for intro step
        await expect(homePage.page).toHaveURL(/\/dashboard/);
      }).toPass({ intervals: [1000, 2000, 3000], timeout: 45_000 });

      // Use the authenticated user
      await use(user);
    },
    { timeout: 45_000 },
  ],

  /**
   * Dashboard page fixture that creates an authenticated dashboard page instance.
   * Depends on user fixture for authentication setup.
   */
  dashboardPage: async ({ page, user }, use) => {
    // User is authenticated via the user fixture
    void user; // Ensure user fixture is used

    // Create dashboard page object and wait for page to load
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.waitForPageLoad();

    await use(dashboardPage);
  },
});

export { expect };
