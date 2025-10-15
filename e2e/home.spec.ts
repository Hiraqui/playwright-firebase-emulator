import { test, expect } from "@playwright/test";

import { HomePage } from "./pages/home-page";

/**
 * Basic application functionality tests without authentication.
 * Tests home page loading and unauthenticated user redirection.
 */
test.describe("Basic Application Tests", () => {
  /**
   * Verifies home page loads with welcome message and sign-in button.
   */
  test("should load home page with welcome message", async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    await homePage.verifyWelcomeMessage();
    await expect(homePage.signInButton).toBeVisible();
  });

  /**
   * Validates unauthenticated users are redirected from protected routes.
   */
  test("should redirect unauthenticated users from dashboard", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL("/");
    await expect(
      page.getByRole("button", { name: /sign in with google/i })
    ).toBeVisible();
  });
});
