"use server";

import { initializeApp, initializeServerApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import { cookies } from "next/headers";

import { SESSION_COOKIE } from "./config";
import { firebaseConfig } from "./config";
import { connectEmulators } from "./emulator-config";

/**
 * Creates an authenticated Firebase Server App instance for the current user.
 * Retrieves the authentication token from the session cookie and initializes
 * a server-side Firebase app with the user's credentials.
 *
 * @returns Object containing the Firebase server app instance and current user
 * @throws Error if authentication fails or user is not authenticated
 */
export async function getAuthenticatedAppForUser() {
  const authIdToken = (await cookies()).get(SESSION_COOKIE)?.value;

  // Firebase Server App allows instantiating the SDK with credentials
  // retrieved from the client and provides server environment affordances
  const firebaseServerApp = initializeServerApp(
    initializeApp(firebaseConfig),
    authIdToken
      ? {
          authIdToken,
        }
      : {}
  );

  const auth = getAuth(firebaseServerApp);
  connectEmulators({ auth });
  await auth.authStateReady();

  return { firebaseServerApp, currentUser: auth.currentUser };
}
