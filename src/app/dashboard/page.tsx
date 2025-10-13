import Logout from "@/components/auth/logout";

/**
 * Main dashboard page component for authenticated users.
 *
 * This is a simplified dashboard page that displays a welcome message and
 * provides a logout button. It serves as the main landing page for users
 * after successful authentication. The page is protected by the middleware
 * and can only be accessed by authenticated users.
 *
 * In the context of the Playwright + Firebase emulator demo, this page
 * demonstrates successful authentication and provides a simple interface
 * for testing logout functionality in E2E tests.
 *
 * @returns JSX element representing the dashboard with logout functionality
 */
export default async function Dashboard() {
  return (
    <>
      <p className="max-w-xl text-center text-lg sm:text-xl">
        You are logged in now!
      </p>

      <Logout />
    </>
  );
}
