import { getAuthenticatedAppForUser } from "@/lib/firebase/server-app";
import { redirect } from "next/navigation";

/**
 * Layout component for the dashboard section of the application.
 *
 * This layout handles server-side authentication verification and displays
 * user information including email and display name. It ensures that only
 * authenticated users can access the dashboard by redirecting unauthenticated
 * users to the home page.
 *
 * The layout demonstrates server-side user data access using Firebase Server
 * App, which is essential for server-side rendering with authentication state.
 * This pattern is particularly useful for testing authentication flows with
 * Playwright and Firebase emulators.
 *
 * @param props - Component props
 * @param props.children - Child components to render within the dashboard layout
 * @returns JSX element representing the dashboard layout with user information
 */
export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { currentUser } = await getAuthenticatedAppForUser();

  if (!currentUser) {
    redirect("/");
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-2">
        <h1 className="font-display text-3xl font-bold transition-colors mb-6 sm:text-5xl">
          Hey! Welcome
        </h1>
        <h2 className="text-2xl">{currentUser.email}</h2>
        <h2 className="text-2xl">{currentUser.displayName}</h2>
      </div>
      {children}
    </>
  );
}
