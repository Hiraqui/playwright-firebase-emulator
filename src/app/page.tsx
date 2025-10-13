import SignInWithGoogle from "@/components/auth/sign-in-with-google";

/**
 * Home page component that serves as the landing page for the application.
 *
 * This page displays the main welcome message, explains the demo's purpose,
 * and provides a Google sign-in button for authentication. It serves as the
 * entry point for unauthenticated users and automatically redirects authenticated
 * users to the dashboard via the middleware.
 *
 * The page showcases the integration between Playwright E2E testing and Firebase
 * emulator authentication, demonstrating how to test authentication flows in a
 * development environment without using production Firebase services.
 *
 * @returns JSX element representing the home page with sign-in functionality
 */
export default async function Home() {
  return (
    <>
      <h1 className="font-display text-3xl font-bold transition-colors sm:text-5xl">
        Welcome to{" "}
        <span className="text-secondary/70">
          playwright + firebase emulator
        </span>
      </h1>
      <p className="max-w-xl text-center text-lg sm:text-xl">
        Experience seamless state management with Firestore as a temporary
        database. This demo shows how Zustand stores can automatically sync with
        Firestore via Next.js Server Actions instead of localStorage.
      </p>

      <SignInWithGoogle />
    </>
  );
}
