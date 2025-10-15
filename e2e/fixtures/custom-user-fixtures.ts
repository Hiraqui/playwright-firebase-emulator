import { test as base, expect } from "@playwright/test";

import { DashboardPage } from "../pages/dashboard-page";
import { GoogleSignInPage } from "../pages/google-sign-in-page";
import { HomePage } from "../pages/home-page";

/**
 * Predefined test users pool for consistent parallel test execution.
 * Each worker gets assigned a different user to avoid authentication conflicts.
 */
const TEST_USERS = [
  { email: "alice.smith@test.com", name: "Alice Smith" },
  { email: "bob.johnson@test.com", name: "Bob Johnson" },
  { email: "carol.williams@test.com", name: "Carol Williams" },
  { email: "david.brown@test.com", name: "David Brown" },
  { email: "emma.jones@test.com", name: "Emma Jones" },
  { email: "frank.garcia@test.com", name: "Frank Garcia" },
] as const;

/**
 * Type definition for authenticated test fixtures with predefined users.
 */
type AuthenticatedFixtures = {
  /** Home page object for navigation and interactions */
  homePage: HomePage;
  /** Dashboard page object for authenticated user interactions */
  dashboardPage: DashboardPage;
  /** Predefined user object with email and display name */
  user: {
    email: string;
    name: string;
  };
};

/**
 * Extended Playwright test with predefined user fixtures for consistent testing.
 * Assigns different users to parallel workers to avoid authentication conflicts.
 */
export const test = base.extend<AuthenticatedFixtures>({
  /**
   * Home page fixture that creates and initializes a HomePage instance.
   */
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  /**
   * User fixture that assigns a predefined user based on worker ID.
   * Ensures consistent user data across test runs and avoids parallel execution conflicts.
   */
  user: async ({}, use) => {
    // Assign one user per worker to avoid conflicts
    const workerId = parseInt(process.env.TEST_WORKER_INDEX || "0", 10);
    const selectedUser = TEST_USERS[workerId % TEST_USERS.length];

    // Use the assigned user
    await use(selectedUser);
  },

  /**
   * Dashboard page fixture that performs authentication with predefined user data.
   * Handles complete sign-in flow and dashboard page initialization.
   */
  dashboardPage: async ({ page, homePage, user, context }, use) => {
    // User is authenticated via the user fixture
    void user; // Ensure user fixture is used

    // Navigate to home page
    await homePage.goto();

    // Verify sign-in button is present and click it
    await expect(homePage.signInButton).toBeVisible();
    const pagePromise = context.waitForEvent("page");
    await homePage.signInButton.click();

    // Handle Google sign-in page
    const googleSignInPage = new GoogleSignInPage(await pagePromise);
    await googleSignInPage.waitForPageLoad();
    await googleSignInPage.fillUserAndLogin(user);
    const dashboardPage = new DashboardPage(page);

    // Try signing in with more robust error handling
    await expect(async () => {
      await googleSignInPage.page.waitForTimeout(1000);
      await googleSignInPage.signInWithGoogleButton.click();

      // Wait for navigation to dashboard after successful authentication

      // Create dashboard page object and wait for intro step
      await dashboardPage.waitForPageLoad();
    }).toPass({ intervals: [1000, 2000, 3000], timeout: 45_000 });

    await use(dashboardPage);
  },
});

export { expect };
