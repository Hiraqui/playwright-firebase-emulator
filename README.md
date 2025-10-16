# Playwright + Firebase Emulator Testing

[![Next.js](https://img.shields.io/badge/Next.js-15.5.4-000000?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=flat&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-12.3.0-FFCA28?style=flat&logo=firebase&logoColor=white)](https://firebase.google.com/)
[![Playwright](https://img.shields.io/badge/Playwright-1.56.0-2EAD33?style=flat&logo=playwright&logoColor=white)](https://playwright.dev/)

A focused demonstration project showcasing **end-to-end testing with Playwright and Firebase Auth Emulator integration**. This project demonstrates modern E2E testing patterns for authentication flows in Next.js applications using local Firebase emulators.

## 📋 Table of Contents

- [🎯 What This Demonstrates](#-what-this-demonstrates)
- [🏗️ Architecture Overview](#-architecture-overview)
- [🚀 Quick Start](#-quick-start)
- [🧪 E2E Testing Architecture](#-e2e-testing-architecture)
- [🏢 Project Structure](#-project-structure)
- [🔐 Firebase Auth Emulator Features](#-firebase-auth-emulator-features)
- [🎨 Tech Stack](#-tech-stack)
- [🚦 Available Scripts](#-available-scripts)
- [🔧 Configuration](#-configuration)
- [📚 Key Testing Concepts](#-key-testing-concepts)
- [🧪 Test Examples](#-test-examples)
- [🔧 Troubleshooting](#-troubleshooting)
- [🎯 Learning Outcomes](#-learning-outcomes)
- [👨‍💻 Authors](#-authors)
- [🤖 AI Assistance Disclaimer](#-ai-assistance-disclaimer)
- [🙏 Acknowledgments](#-acknowledgments)

## 🎯 What This Demonstrates

This repository demonstrates:

- **🧪 E2E Testing with Playwright**: Comprehensive browser automation testing patterns
- **🔥 Firebase Auth Emulator Integration**: Local authentication testing without production services
- **🏗️ Page Object Model (POM)**: Maintainable and scalable test architecture
- **🔐 Google Sign-In Testing**: Automated authentication flow testing with emulated users
- **🔧 Custom Fixtures**: Reusable test setup for authenticated user sessions
- **⚡ Multi-Browser Testing**: Cross-browser compatibility with Chromium, Firefox, and WebKit

## 🏗️ Architecture Overview

### Core Pattern: E2E Testing with Firebase Auth Emulator

This project demonstrates comprehensive E2E testing patterns using:

1. **Firebase Auth Emulator** runs locally on port 9099 for isolated testing
2. **Page Object Models** provide maintainable test structure and reusable interactions
3. **Custom Fixtures** handle authentication setup and user session management
4. **Automated User Generation** creates test users dynamically using emulator features

```typescript
// Page Object Model for Google Sign-In
export class GoogleSignInPage {
  readonly page: Page;
  readonly generateUserButton: Locator;
  readonly emailInput: Locator;
  readonly nameInput: Locator;

  constructor(page: Page) {
    this.page = page;
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

  async generateNewUserAndLogin() {
    await this.addAccountButton.click();
    await this.generateUserButton.click();
    const email = await this.emailInput.inputValue();
    const name = await this.nameInput.inputValue();
    return { name, email };
  }
}
```

### Custom Fixtures Pattern

```typescript
// Authenticated test fixtures with automatic user setup
export const test = base.extend<AuthenticatedFixtures>({
  user: [
    async ({ homePage, context }, use) => {
      await homePage.goto();
      await expect(homePage.signInButton).toBeVisible();
      const pagePromise = context.waitForEvent("page");
      await homePage.signInButton.click();

      const googleSignInPage = new GoogleSignInPage(await pagePromise);
      await googleSignInPage.waitForPageLoad();
      const user = await googleSignInPage.generateNewUserAndLogin();

      // Robust authentication with retry logic
      await expect(async () => {
        await googleSignInPage.page.waitForTimeout(1000);
        await googleSignInPage.signInWithGoogleButton.click();
        await expect(homePage.page).toHaveURL(/\/dashboard/);
      }).toPass({ intervals: [1000, 2000, 3000], timeout: 45_000 });

      await use(user);
    },
    { timeout: 45_000 },
  ],

  dashboardPage: async ({ page, user }, use) => {
    void user; // Ensure user fixture is used
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.waitForPageLoad();
    await use(dashboardPage);
  },
});
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Firebase CLI: `npm install -g firebase-tools`

### Installation

1. **Clone and install dependencies**

   ```bash
   git clone <repository-url>
   cd playwright-firebase-emulator
   npm install
   ```

2. **Install Playwright browsers**

   ```bash
   npx playwright install
   ```

3. **Set up environment variables**

   Create a `.env.local` file with:

   ```env
   NEXT_PUBLIC_FIREBASE_EMULATOR_HOST=127.0.0.1
   NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR=true
   NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_PORT=9099
   ```

4. **Start Firebase emulators**

   ```bash
   npm run emulators
   ```

5. **Run development server** (in another terminal)

   ```bash
   npm run dev
   ```

6. **Run E2E tests** (in another terminal)

   ```bash
   npm run test:e2e
   ```

## 🧪 E2E Testing Architecture

This project showcases advanced E2E testing patterns with Firebase Auth Emulator:

### Page Object Model (POM) Pattern

The project uses POM for maintainable test organization:

```typescript
// HomePage Page Object
export class HomePage {
  readonly page: Page;
  readonly welcomeTitle: Locator;
  readonly signInButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.welcomeTitle = page.getByRole("heading", {
      name: /welcome to.*playwright.*firebase emulator/i,
    });
    this.signInButton = page.getByRole("button", {
      name: /sign in with google/i,
    });
  }

  async goto() {
    await this.page.goto("/");
    await expect(this.welcomeTitle).toBeVisible();
  }
}
```

### Firebase Auth Emulator Integration

The emulator provides realistic authentication testing with two approaches:

```typescript
// GoogleSignInPage handles emulator interactions
export class GoogleSignInPage {
  // Method 1: Auto-generate new users (used by base-fixtures.ts)
  async generateNewUserAndLogin() {
    await this.addAccountButton.click();
    await this.waitForFormLoad();
    await this.generateUserButton.click(); // Auto-generates test user

    const email = await this.emailInput.inputValue();
    const name = await this.nameInput.inputValue();
    return { name, email };
  }

  // Method 2: Use predefined user data (used by custom-user-fixtures.ts)
  async fillUserAndLogin({ name, email }: { name: string; email: string }) {
    await this.addAccountButton.click();
    await this.waitForFormLoad();
    await this.emailInput.pressSequentially(email);
    await this.nameInput.pressSequentially(name);
    await expect(this.signInWithGoogleButton).toBeEnabled();
    return { name, email };
  }
}
```

### Custom Fixtures for Authentication

Two fixture patterns are available:

#### 1. Dynamic User Generation (base-fixtures.ts)

```typescript
export const test = base.extend<AuthenticatedFixtures>({
  user: [
    async ({ homePage, context }, use) => {
      // Navigate to home and initiate sign-in
      await homePage.goto();
      await expect(homePage.signInButton).toBeVisible();
      const pagePromise = context.waitForEvent("page");
      await homePage.signInButton.click();

      // Generate new user with Firebase Auth Emulator
      const googleSignInPage = new GoogleSignInPage(await pagePromise);
      await googleSignInPage.waitForPageLoad();
      const user = await googleSignInPage.generateNewUserAndLogin();

      // Complete authentication with robust error handling
      await expect(async () => {
        await googleSignInPage.page.waitForTimeout(1000);
        await googleSignInPage.signInWithGoogleButton.click();
        await expect(homePage.page).toHaveURL(/\/dashboard/);
      }).toPass({ intervals: [1000, 2000, 3000], timeout: 45_000 });

      await use(user);
    },
    { timeout: 45_000 },
  ],
});
```

#### 2. Predefined User Pool (custom-user-fixtures.ts)

```typescript
const TEST_USERS = [
  { email: "alice.smith@test.com", name: "Alice Smith" },
  { email: "bob.johnson@test.com", name: "Bob Johnson" },
  { email: "carol.williams@test.com", name: "Carol Williams" },
  { email: "david.brown@test.com", name: "David Brown" },
  { email: "emma.jones@test.com", name: "Emma Jones" },
  { email: "frank.garcia@test.com", name: "Frank Garcia" },
] as const;

export const test = base.extend<AuthenticatedFixtures>({
  user: async ({}, use) => {
    // Assigns different users to parallel workers to avoid conflicts
    const workerId = parseInt(process.env.TEST_WORKER_INDEX || "0", 10);
    const selectedUser = TEST_USERS[workerId % TEST_USERS.length];
    await use(selectedUser);
  },

  dashboardPage: [
    async ({ page, homePage, user, context }, use) => {
      // Navigate and authenticate with predefined user
      await homePage.goto();
      await expect(homePage.signInButton).toBeVisible();
      const pagePromise = context.waitForEvent("page");
      await homePage.signInButton.click();

      // Use predefined user data for authentication
      const googleSignInPage = new GoogleSignInPage(await pagePromise);
      await googleSignInPage.waitForPageLoad();
      await googleSignInPage.fillUserAndLogin(user);

      // Complete sign-in with explicit timeouts
      await googleSignInPage.page.waitForTimeout(1_000);
      await googleSignInPage.signInWithGoogleButton.click({ timeout: 15_000 });
      await expect(homePage.page).toHaveURL(/\/dashboard/, { timeout: 15_000 });

      const dashboardPage = new DashboardPage(page);
      await use(dashboardPage);
    },
    { timeout: 45_000 },
  ],
});
```

## 🏢 Project Structure

```
playwright-firebase-emulator/
├── e2e/                           # E2E test files and configuration
│   ├── fixtures/
│   │   ├── base-fixtures.ts       # Dynamic user generation fixtures
│   │   └── custom-user-fixtures.ts # Predefined user pool fixtures
│   ├── pages/                     # Page Object Models
│   │   ├── home-page.ts           # Home page interactions
│   │   ├── google-sign-in-page.ts # Firebase Auth emulator interactions
│   │   └── dashboard-page.ts      # Dashboard page interactions
│   ├── home.spec.ts               # Basic application tests
│   ├── dashboard.spec.ts          # Dashboard flow tests (dynamic users)
│   └── custom-user-dashboard.spec.ts # Dashboard tests (predefined users)
├── src/
│   ├── app/
│   │   ├── page.tsx               # Home page with Google Sign-In
│   │   └── dashboard/
│   │       ├── layout.tsx         # Dashboard layout with user info
│   │       └── page.tsx           # Dashboard page content
│   ├── components/
│   │   ├── auth/
│   │   │   ├── sign-in-with-google.tsx # Google authentication button
│   │   │   ├── logout.tsx         # Logout functionality
│   │   │   └── session-observer.tsx   # Authentication state observer
│   │   └── ui/                    # UI components (Button, Spinner)
│   ├── lib/firebase/
│   │   ├── client-app.ts          # Firebase client configuration
│   │   ├── server-app.ts          # Firebase server configuration
│   │   ├── auth.ts                # Authentication functions
│   │   ├── config.ts              # Firebase project configuration
│   │   └── emulator-config.ts     # Emulator connection setup
│   ├── hooks/
│   │   └── use-user-session.ts    # Authentication session hook
│   └── middleware.ts              # Route protection middleware
├── firebase.json                  # Firebase emulator configuration
├── playwright.config.ts           # Playwright test configuration
└── package.json                   # Dependencies and scripts
```

## 🔐 Firebase Auth Emulator Features

### Realistic Authentication Testing

The Firebase Auth Emulator provides:

```javascript
// Emulator automatically generates test users
await googleSignInPage.generateUserButton.click();

// Returns realistic user data
const user = {
  email: "generated.user@test.com",
  name: "Generated User",
};
```

### User Session Management

- **Server-side authentication** verification in middleware
- **Automatic redirects** for unauthenticated users to sign-in
- **Dashboard redirect** for authenticated users
- **Session persistence** across test scenarios
- **Clean isolation** between test runs

### Emulator Configuration

```json
// firebase.json
{
  "emulators": {
    "auth": {
      "port": 9099
    },
    "ui": {
      "enabled": true
    },
    "singleProjectMode": true
  }
}
```

## 🎨 Tech Stack

| Category           | Technology        | Purpose                                   |
| ------------------ | ----------------- | ----------------------------------------- |
| **Framework**      | Next.js 15.5.4    | React framework with App Router           |
| **Frontend**       | React 19.1.0      | UI library with modern patterns           |
| **Authentication** | Firebase Auth     | User authentication & session management  |
| **UI Framework**   | Tailwind CSS 4    | Utility-first CSS framework               |
| **UI Components**  | Radix UI          | Accessible component primitives           |
| **E2E Testing**    | Playwright 1.56.0 | Browser automation and testing framework  |
| **Type Safety**    | TypeScript 5.x    | Static type checking                      |
| **Emulator**       | Firebase Emulator | Local development and testing environment |

## 🚦 Available Scripts

| Script              | Description                             |
| ------------------- | --------------------------------------- |
| `npm run dev`       | Start development server with Turbopack |
| `npm run build`     | Build production application            |
| `npm run test:e2e`  | Run Playwright E2E tests                |
| `npm run emulators` | Start Firebase emulators                |
| `npm run lint`      | Run ESLint                              |

### Test Execution Patterns

```bash
# Run all E2E tests
npm run test:e2e

# Run specific test file
npx playwright test home.spec.ts

# Run tests in headed mode (see browser)
npx playwright test --headed

# Run tests with debugging
npx playwright test --debug

# Run tests in specific browser
npx playwright test --project=firefox
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file with:

```bash
# Firebase Configuration (optional for production use)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Emulator Configuration (for development and testing)
NEXT_PUBLIC_FIREBASE_EMULATOR_HOST=127.0.0.1     # Host address - determines if emulators are used
NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR=true          # Enable Firebase Auth emulator connection
NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_PORT=9099     # Port for Firebase Auth emulator
```

### Playwright Configuration

The `playwright.config.ts` includes:

- **Auto-start dev server**: Automatically starts Next.js before tests
- **Multi-browser testing**: Chromium, Firefox, and WebKit
- **Retry logic**: 2 retries on CI, 0 locally
- **Trace collection**: On test failures for debugging
- **Screenshot capture**: On test failures

### Firebase Emulator Setup

The emulator runs with minimal configuration:

```json
// firebase.json
{
  "emulators": {
    "auth": { "port": 9099 },
    "ui": { "enabled": true },
    "singleProjectMode": true
  }
}
```

## � GitHub Actions CI/CD

### Playwright Testing Workflow

Add `.github/workflows/playwright.yml` for automated testing:

```yaml
name: Playwright Tests
on:
  push:
    branches: [main, master]
  pull_request:
    branches: [main, master]

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: lts/*

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright Browsers
        run: npx playwright install --with-deps

      - name: Install Firebase CLI
        run: npm install -g firebase-tools

      - name: Start Firebase Emulator
        run: firebase emulators:start --only auth &

      - name: Wait for emulator
        run: npx wait-on http://localhost:9099

      - name: Run Playwright tests
        run: npm run test:e2e
        env:
          NEXT_PUBLIC_FIREBASE_EMULATOR_HOST: 127.0.0.1
          NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR: true
          NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_PORT: 9099

      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

### Key Features

- **Automated Testing**: Runs on every push and pull request
- **Firebase Emulator**: Starts auth emulator automatically in CI
- **Multi-OS Support**: Can run on Ubuntu, Windows, and macOS
- **Artifact Upload**: Saves test reports and traces for debugging
- **Environment Setup**: Installs Node.js, dependencies, and browsers

### Workflow Benefits

- **Zero Configuration**: Works out of the box with this project structure
- **Fast Feedback**: Immediate test results on code changes
- **Parallel Execution**: Tests run in parallel for faster completion
- **Debug Support**: Upload traces and screenshots on test failures

## �📚 Key Testing Concepts

### Page Object Model Best Practices

The project follows Playwright's recommended POM patterns:

```typescript
export class DashboardPage {
  readonly page: Page;
  readonly welcomeTitle: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // Use role-based locators for stability
    this.welcomeTitle = page.getByRole("heading", { name: /hey! welcome/i });
    this.logoutButton = page.getByRole("button", { name: /logout/i });
  }

  async waitForPageLoad() {
    await expect(this.welcomeTitle).toBeVisible();
    await expect(this.logoutButton).toBeVisible();
  }
}
```

### Robust Wait Strategies

Tests use explicit wait patterns for reliability:

```typescript
// Wait for authentication flow completion
await expect(async () => {
  await googleSignInPage.page.waitForTimeout(1000); // Allow form to stabilize
  await googleSignInPage.signInWithGoogleButton.click();
  await dashboardPage.waitForPageLoad();
}).toPass({ intervals: [1000, 2000, 3000], timeout: 45_000 });
```

**Note**: The `waitForTimeout(1000)` before clicking the sign-in button allows the Firebase Auth Emulator form to fully stabilize, preventing timing-related authentication failures.

#### Two Authentication Flow Approaches

- **`base-fixtures.ts`**: Uses retry logic with `toPass()` for maximum reliability in flaky environments
- **`custom-user-fixtures.ts`**: Uses direct authentication with explicit timeouts for faster, more predictable execution

### Fixture Pattern Benefits

Custom fixtures provide:

- **Automatic setup/teardown**: Authentication handled automatically
- **Test isolation**: Each test gets clean state
- **Parallel execution**: Multiple users prevent conflicts
- **Reusable patterns**: Authentication logic centralized

#### Choosing the Right Fixture Pattern

- **Use `base-fixtures.ts`** when:

  - Testing with fresh user data each time
  - User data doesn't matter for the test logic
  - You want maximum test isolation

- **Use `custom-user-fixtures.ts`** when:
  - Testing with consistent, predictable user data
  - Running parallel tests that need different users
  - User-specific data affects test behavior
  - You prefer direct authentication flow with explicit timeouts over retry logic

## 🧪 Test Examples

### Basic Application Tests

```typescript
// home.spec.ts - Testing without authentication
test("should load home page with welcome message", async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.goto();
  await homePage.verifyWelcomeMessage();
  await expect(homePage.signInButton).toBeVisible();
});
```

### Authenticated User Tests

```typescript
// dashboard.spec.ts - Using authenticated fixtures
test("should display dashboard with user information", async ({
  dashboardPage,
  user,
}) => {
  console.log(`Testing with user: ${user.name} (${user.email})`);

  await dashboardPage.goto();
  await dashboardPage.verifyUserInfo(user.email, user.name);
  await dashboardPage.verifyDashboardElements();
});
```

### Authentication Flow Testing

```typescript
// Complete authentication flow with emulator
test("should handle Google sign-in flow", async ({ page, context }) => {
  const homePage = new HomePage(page);
  await homePage.goto();

  // Click sign-in button to open popup
  const pagePromise = context.waitForEvent("page");
  await homePage.signInButton.click();

  // Handle Firebase Auth Emulator popup
  const googleSignInPage = new GoogleSignInPage(await pagePromise);
  await googleSignInPage.waitForPageLoad();

  // Generate new test user
  const user = await googleSignInPage.generateNewUserAndLogin();

  // Complete sign-in process with robust error handling
  await expect(async () => {
    await googleSignInPage.page.waitForTimeout(1000);
    await googleSignInPage.signInWithGoogleButton.click();
    await expect(page).toHaveURL(/\/dashboard/);
  }).toPass({ intervals: [1000, 2000, 3000], timeout: 45_000 });
});
```

## 🔧 Troubleshooting

### Common Issues

**Firebase Emulator Connection Issues**

```bash
# Ensure emulator is running before tests
npm run emulators

# Check emulator UI
open http://localhost:4000
```

**Test Timeout Issues**

```typescript
// Increase timeout for authentication flows
test.setTimeout(60_000);

// Use robust wait strategies with retry logic
await expect(async () => {
  await someAction();
  expect(condition).toBeTruthy();
}).toPass({ timeout: 45_000 });

// Alternative: Direct approach with explicit timeouts
await someAction();
await expect(condition).toBeTruthy({ timeout: 15_000 });
```

**Browser Popup Blocking**

```typescript
// Handle popup events properly
const pagePromise = context.waitForEvent("page");
await signInButton.click();
const popup = await pagePromise;
```

## 🎯 Learning Outcomes

This project demonstrates:

1. **Modern E2E Testing**: Playwright best practices and patterns
2. **Firebase Emulator Integration**: Local development workflows
3. **Authentication Testing**: Complex auth flow automation
4. **Page Object Models**: Scalable test architecture
5. **Custom Fixtures**: Reusable test setup patterns
6. **Cross-browser Testing**: Multi-browser compatibility

## 👨‍💻 Authors

- **Martin Moro** - _Initial work_ - [@dev.martin.moro@gmail.com](mailto:dev.martin.moro@gmail.com)

## 🤖 AI Assistance Disclaimer

This project was developed with assistance from GitHub Copilot for:

- Test implementation patterns
- Page Object Model structure
- Documentation and code comments

All code has been reviewed and validated for quality and functionality.

## 🙏 Acknowledgments

- [Playwright team](https://playwright.dev/) for the excellent testing framework
- [Firebase team](https://firebase.google.com/) for emulator suite
- [Next.js team](https://nextjs.org/) for the React framework
- [Tailwind CSS](https://tailwindcss.com/) for styling utilities

---

**⭐ Star this repo if you find it helpful for learning E2E testing with Firebase emulators!**
