import { expect, type Locator, type Page } from "@playwright/test";

/**
 * Page Object Model for the authenticated user dashboard page.
 * Provides methods for interacting with dashboard elements and user information.
 */
export class DashboardPage {
  readonly page: Page;

  readonly welcomeTitle: Locator;
  readonly userEmail: Locator;
  readonly userDisplayName: Locator;
  readonly loggedInMessage: Locator;
  readonly logoutButton: Locator;

  /**
   * Creates a new DashboardPage instance.
   *
   * @param page - Playwright page object
   */
  constructor(page: Page) {
    this.page = page;

    // Initialize locators using role-based selectors
    this.welcomeTitle = page.getByRole("heading", { name: /hey! welcome/i });
    this.userEmail = page.locator("h2").first();
    this.userDisplayName = page.locator("h2").nth(1);
    this.loggedInMessage = page.getByText(/you are logged in now!/i);
    this.logoutButton = page.getByRole("button", { name: /logout/i });
  }

  /**
   * Navigates to the dashboard page and waits for it to load.
   */
  async goto() {
    await this.page.goto("/dashboard");
    await this.waitForPageLoad();
  }

  /**
   * Waits for the dashboard page to be fully loaded with all elements visible.
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState("domcontentloaded");
    await expect(this.welcomeTitle).toBeVisible();
    await expect(this.loggedInMessage).toBeVisible();
    await expect(this.logoutButton).toBeVisible();
  }

  /**
   * Verifies that user information is displayed correctly on the dashboard.
   *
   * @param expectedEmail - Expected user email address
   * @param expectedDisplayName - Expected user display name
   */
  async verifyUserInfo(expectedEmail: string, expectedDisplayName: string) {
    await expect(this.userEmail).toHaveText(expectedEmail);
    await expect(this.userDisplayName).toHaveText(expectedDisplayName);
  }

  /**
   * Performs logout action and waits for navigation to home page.
   */
  async logout() {
    await expect(this.logoutButton).toBeVisible();
    await this.logoutButton.click();
    // Wait for navigation back to home page
    await this.page.waitForURL("/", { timeout: 10000 });
  }

  /**
   * Verifies all dashboard elements are visible and properly loaded.
   */
  async verifyDashboardElements() {
    await expect(this.welcomeTitle).toBeVisible();
    await expect(this.userEmail).toBeVisible();
    await expect(this.userDisplayName).toBeVisible();
    await expect(this.loggedInMessage).toBeVisible();
    await expect(this.logoutButton).toBeVisible();
  }
}
