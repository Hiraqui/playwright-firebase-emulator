import SessionObserver from "@/components/auth/session-observer";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getAuthenticatedAppForUser } from "@/lib/firebase/server-app";
import { User } from "firebase/auth";
import Image from "next/image";

/**
 * Force Next.js to treat this route as server-side rendered.
 * Without this directive, Next.js will treat this route as static during
 * the build process and generate a static HTML file.
 */
export const dynamic = "force-dynamic";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "playwright + firebase emulator",
  description:
    "Demo showing how Zustand stores can sync with Firestore via Next.js Server Actions instead of localStorage",
  authors: [
    { name: "Martin Moro", url: "https://github.com/Hiraqui" },
    { name: "Francesca Rinaldi" },
  ],
  keywords: [
    "nextjs",
    "zustand",
    "firestore",
    "firebase",
    "typescript",
    "tailwindcss",
    "demo",
    "server-actions",
    "state-management",
    "persistence",
    "temporary-database",
  ],
  openGraph: {
    title: "playwright + firebase emulator",
    description:
      "Demo showing how Zustand stores can sync with Firestore via Next.js Server Actions instead of localStorage",
    url: "https://github.com/Hiraqui/nextjs-zustand-firestore",
    siteName: "playwright + firebase emulator",
    type: "website",
    locale: "en-US",
    emails: ["dev.martin.moro@gmail.com"],
  },
  twitter: {
    card: "summary_large_image",
    title: "playwright + firebase emulator",
    description:
      "Demo showing how Zustand stores can sync with Firestore via Next.js Server Actions instead of localStorage",
    creator: "dev.martin.moro@gmail.com",
  },
  icons: {
    icon: "/favicon.ico",
  },
  creator: "dev.martin.moro@gmail.com",
};

/**
 * Root layout component for the entire application.
 *
 * This layout sets up the basic HTML structure, font variables, and
 * initializes the session observer for authentication state management.
 * It retrieves the current user from server-side authentication and
 * passes it to the client-side session observer.
 *
 * @param props - Component props
 * @param props.children - Child components to render within the layout
 * @returns JSX element representing the root HTML structure
 */
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { currentUser } = await getAuthenticatedAppForUser();
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionObserver
          initialUser={(currentUser?.toJSON() as User) ?? null}
        />
        <div className="bg-primary text-secondary font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
          <main className="flex flex-col gap-y-20 row-start-2 items-center">
            {children}
          </main>
          <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
            <a
              className="flex items-center gap-2 hover:underline hover:underline-offset-4"
              href="https://github.com/Hiraqui/nextjs-zustand-firestore"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                aria-hidden
                src="/github-mark-white.svg"
                alt="GitHub icon"
                width={16}
                height={16}
              />
              View source code →
            </a>
          </footer>
        </div>
      </body>
    </html>
  );
}
