import { expect, type Locator, type Page } from "@playwright/test";

/**
 * Page Object Model for the application home page.
 * Provides methods and locators for interacting with the landing page elements.
 */
export class HomePage {
  readonly page: Page;

  readonly welcomeTitle: Locator;
  readonly welcomeDescription: Locator;
  readonly signInButton: Locator;
  readonly sourceCodeLink: Locator;

  /**
   * Creates a new HomePage instance.
   *
   * @param page - Playwright page object
   */
  constructor(page: Page) {
    this.page = page;

    // Initialize locators using role-based selectors
    this.welcomeTitle = page.getByRole("heading", {
      name: /welcome to playwright \+ firebase emulator/i,
    });
    this.welcomeDescription = page.getByText(
      /experience seamless state management/i
    );
    this.signInButton = page.getByRole("button", {
      name: /sign in with google/i,
    });
    this.sourceCodeLink = page.getByRole("link", { name: /view source code/i });
  }

  /**
   * Navigates to the home page and waits for the welcome title to be visible.
   */
  async goto() {
    await this.page.goto("/");
    await expect(this.welcomeTitle).toBeVisible();
  }

  /**
   * Verifies that the welcome message and description are visible on the page.
   */
  async verifyWelcomeMessage() {
    await expect(this.welcomeTitle).toBeVisible();
    await expect(this.welcomeDescription).toBeVisible();
  }

  /**
   * Initiates Google sign-in by clicking the sign-in button.
   */
  async signInWithGoogle() {
    await expect(this.signInButton).toBeVisible();
    await this.signInButton.click();
  }

  /**
   * Verifies that the source code link is visible on the page.
   */
  async verifySourceCodeLink() {
    await expect(this.sourceCodeLink).toBeVisible();
  }
}
