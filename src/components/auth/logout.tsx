"use client";

import { signOut } from "@/lib/firebase/auth";
import { Button } from "../ui/button";

/**
 * Logout button component that handles user sign-out.
 *
 * This component renders a styled link button that triggers the Firebase
 * authentication sign-out process when clicked. It prevents the default
 * click behavior and calls the signOut function from the auth module.
 *
 * @returns JSX element representing a logout button
 */
export default function Logout() {
  const handleSignOut = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    signOut();
  };
  return (
    <Button
      size="lg"
      className="text-xl text-primary"
      variant="secondary"
      onClick={handleSignOut}
    >
      Logout
    </Button>
  );
}
