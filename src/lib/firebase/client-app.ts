"use client";

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import { firebaseConfig } from "./config";
import { connectEmulators } from "./emulator-config";

/**
 * Client-side Firebase app instance.
 *
 * This is the main Firebase application instance used for all client-side
 * Firebase operations. It's initialized with the project configuration
 * and automatically connects to emulators when running in development mode.
 */
export const firebaseApp = initializeApp(firebaseConfig);

/**
 * Client-side Firebase Auth instance.
 *
 * This auth instance is configured with the Firebase app and automatically
 * connects to the Auth emulator when running in development mode. Use this
 * for all authentication operations on the client side.
 */
export const auth = getAuth(firebaseApp);

// Connect to emulators in development environment
connectEmulators({ auth });
