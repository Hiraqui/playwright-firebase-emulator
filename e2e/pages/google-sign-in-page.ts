import { expect, type Locator, type Page } from "@playwright/test";

/**
 * Page Object Model for the Firebase Auth Emulator Google sign-in page.
 * Handles user authentication flow including account creation and sign-in.
 */
export class GoogleSignInPage {
  readonly page: Page;

  /** Sign-in page welcome title locator */
  readonly welcomeTitle: Locator;
  /** Add new account button locator */
  readonly addAccountButton: Locator;
  /** Auto-generate user button locator */
  readonly generateUserButton: Locator;
  /** Email input field locator */
  readonly emailInput: Locator;
  /** Display name input field locator */
  readonly nameInput: Locator;

  /**
   * Creates a new GoogleSignInPage instance.
   *
   * @param page - Playwright page object for the sign-in popup
   */
  constructor(page: Page) {
    this.page = page;

    // Initialize locators using role-based selectors
    this.welcomeTitle = page.getByText("Sign-in with Google.com");
    this.addAccountButton = page.getByRole("button", {
      name: "Add new account",
    });
    this.generateUserButton = page.getByRole("button", {
      name: "Auto-generate user information",
    });
    this.emailInput = page.getByLabel("Email");
    this.nameInput = page.getByLabel("Display name");
  }

  /** Final sign-in button locator */
  get signInWithGoogleButton(): Locator {
    return this.page.getByRole("button", { name: "Sign in with Google.com" });
  }

  /**
   * Waits for the sign-in page to fully load by checking for key elements.
   */
  async waitForPageLoad() {
    await expect(this.welcomeTitle).toBeVisible();
    await expect(this.addAccountButton).toBeVisible();
  }

  /**
   * Waits for the user creation form to load with all input fields.
   */
  async waitForFormLoad() {
    await expect(this.generateUserButton).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.nameInput).toBeVisible();
    await expect(this.signInWithGoogleButton).toBeVisible();
  }

  /**
   * Generates a new user with random credentials using the emulator's auto-generation feature.
   *
   * @returns Promise resolving to user object with name and email
   * @throws Error if user generation fails
   */
  async generateNewUserAndLogin() {
    await expect(this.addAccountButton).toBeVisible();
    await this.addAccountButton.click();

    await this.waitForFormLoad();

    await this.generateUserButton.click();

    await expect(this.emailInput).toHaveValue(/@/);
    const name = await this.nameInput.inputValue();
    const email = await this.emailInput.inputValue();
    if (!name || !email) {
      throw new Error("Failed to generate user information");
    }

    return { name, email };
  }

  /**
   * Fills the sign-in form with predefined user credentials.
   *
   * @param user - User object containing name and email
   * @param user.name - User's display name
   * @param user.email - User's email address
   * @returns Promise resolving to the same user object
   */
  async fillUserAndLogin({ name, email }: { name: string; email: string }) {
    await expect(this.addAccountButton).toBeVisible();
    await this.addAccountButton.click();

    await this.waitForFormLoad();

    await this.emailInput.pressSequentially(email);
    await this.nameInput.pressSequentially(name);

    await expect(this.emailInput).toHaveValue(email);
    await expect(this.nameInput).toHaveValue(name);

    await expect(this.signInWithGoogleButton).toBeEnabled();

    return { name, email };
  }
}
