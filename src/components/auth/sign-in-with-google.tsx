"use client";

import { signInWithGoogle } from "@/lib/firebase/auth";
import { cn } from "@/lib/utils";

import type { FirebaseError } from "firebase/app";
import { AuthErrorCodes } from "firebase/auth";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { useState, type MouseEventHandler } from "react";

import { Button } from "../ui/button";
import Spinner from "../ui/spinner";

/** Generic error message for authentication failures */
const REQUEST_ERROR = "There was an error processing your request";
/** Error message when browser blocks popup */
const POPUP_ERROR = "Your browser prevented the popup from opening";

/**
 * Google sign-in button component with loading states and error handling.
 *
 * This component renders a styled button that initiates Google authentication
 * using Firebase Auth. It handles various authentication states including
 * loading, success, and different error scenarios like popup blocking.
 * Upon successful authentication, it navigates to the dashboard page.
 *
 * @returns JSX element representing the Google sign-in button with error display
 */
export default function SignInWithGoogle() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /**
   * Handles the Google sign-in process.
   * Manages loading state, error handling, and navigation on success.
   *
   * @param event - Mouse click event
   */
  const handleSignIn: MouseEventHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signInWithGoogle();
      router.push("/dashboard");
    } catch (error) {
      const err = error as FirebaseError;
      let message = REQUEST_ERROR;
      switch (err.code) {
        case AuthErrorCodes.POPUP_BLOCKED:
          message = POPUP_ERROR;
          break;
        case AuthErrorCodes.EXPIRED_POPUP_REQUEST:
        case AuthErrorCodes.POPUP_CLOSED_BY_USER:
          console.info(err.message);
          setLoading(false);
          return;
        default:
      }
      setError(message);
      setLoading(false);
    }
  };

  return (
    <div className="font-montserrat flex flex-col items-center">
      <Button
        className={cn(
          "w-full gap-3 border border-gray-400 bg-white font-bold text-gray-700 shadow-xs",
          "hover:border-gray-400 hover:bg-gray-300 hover:text-gray-700",
          "focus-visible:ring-gray-400"
        )}
        onClick={handleSignIn}
        disabled={loading}
        variant="secondary"
        size="lg"
      >
        {loading ? (
          <Spinner className="size-6 text-blue-500" />
        ) : (
          <Image
            aria-hidden
            src="/google.svg"
            alt="Google icon"
            width={24}
            height={24}
          />
        )}
        Sign in with Google
      </Button>
      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
    </div>
  );
}
