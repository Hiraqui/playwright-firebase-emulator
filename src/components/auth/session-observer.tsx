"use client";

import useUserSession from "@/hooks/use-user-session";
import { User } from "firebase/auth";

/**
 * Props for the SessionObserver component.
 */
interface SessionObserverProps {
  /** The initial user state passed from server-side authentication */
  initialUser: User | null;
}

/**
 * Invisible component that observes and manages user session state.
 *
 * This component uses the useUserSession hook to monitor authentication
 * state changes and manage session cookies. It doesn't render any UI
 * but is essential for keeping client and server authentication in sync.
 *
 * @param props - Component props
 * @param props.initialUser - Initial user state from server-side auth
 * @returns null (renders nothing)
 */
export default function SessionObserver({ initialUser }: SessionObserverProps) {
  useUserSession(initialUser);
  return null;
}
