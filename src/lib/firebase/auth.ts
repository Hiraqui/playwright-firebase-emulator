import { auth } from "@/lib/firebase/client-app";

import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged as _onAuthStateChanged,
  onIdTokenChanged as _onIdTokenChanged,
} from "firebase/auth";
import type { User, Unsubscribe } from "firebase/auth";

/**
 * Callback function type for authentication state changes.
 *
 * This interface defines the signature for callback functions that listen
 * to authentication state changes, such as sign-in, sign-out, or token refresh.
 */
interface ChangeCallback {
  /**
   * Called when authentication state changes.
   *
   * @param user - The current user object, or null if not authenticated
   */
  (user: User | null): void;
}

/**
 * Subscribes to authentication state changes.
 *
 * @param cb - Callback function to invoke when auth state changes
 * @returns Unsubscribe function to stop listening to auth state changes
 */
export function onAuthStateChanged(cb: ChangeCallback): Unsubscribe {
  return _onAuthStateChanged(auth, cb);
}

/**
 * Subscribes to ID token changes.
 * Fires when the user signs in, signs out, or the token is refreshed.
 *
 * @param cb - Callback function to invoke when ID token changes
 * @returns Unsubscribe function to stop listening to token changes
 */
export function onIdTokenChanged(cb: ChangeCallback) {
  return _onIdTokenChanged(auth, cb);
}

/**
 * Initiates Google sign-in using a popup window.
 *
 * This function creates a Google Auth provider and opens a popup window
 * for the user to authenticate with their Google account. The popup approach
 * provides a seamless authentication experience without redirecting the user
 * away from the current page.
 *
 * @returns Promise that resolves when sign-in is successful
 * @throws {FirebaseError} When sign-in fails, popup is blocked, or user cancels
 */
export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();

  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.error("Error signing in with Google", error);
  }
}

/**
 * Signs out the current user.
 *
 * This function signs out the currently authenticated user and clears
 * their authentication state. It triggers auth state change listeners
 * and should be used when implementing logout functionality.
 *
 * @returns Promise that resolves when sign-out is complete
 * @throws {FirebaseError} When sign-out operation fails
 *
 * @example
 * ```typescript
 * try {
 *   await signOut();
 *   console.log("User signed out successfully");
 * } catch (error) {
 *   console.error("Sign-out failed:", error);
 * }
 * ```
 */
export async function signOut() {
  try {
    return auth.signOut();
  } catch (error) {
    console.error("Error signing out with Google", error);
  }
}
