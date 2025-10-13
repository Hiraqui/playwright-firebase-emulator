"use client";

import { SESSION_COOKIE } from "@/lib/firebase/config";
import { onIdTokenChanged } from "@/lib/firebase/auth";

import { deleteCookie, setCookie } from "cookies-next";

import { User } from "firebase/auth";

import { useEffect } from "react";

/**
 * Custom hook for managing user session state and cookies.
 *
 * This hook listens for Firebase authentication state changes and manages
 * the session cookie accordingly. When a user signs in, it stores their
 * ID token in a cookie. When they sign out, it removes the cookie.
 * The hook also handles page reloads when the user changes to ensure
 * server-side authentication state stays in sync.
 *
 * @param initialUser - The initial user state from server-side authentication
 * @returns The current user object or null if not authenticated
 */
export default function useUserSession(initialUser: User | null) {
  useEffect(() => {
    return onIdTokenChanged(async (user) => {
      if (user) {
        const idToken = await user.getIdToken();
        await setCookie(SESSION_COOKIE, idToken);
      } else {
        await deleteCookie(SESSION_COOKIE);
      }
      if (initialUser?.uid === user?.uid) {
        return;
      }
      window.location.reload();
    });
  }, [initialUser]);

  return initialUser;
}
