import { connectAuthEmulator, type Auth } from "firebase/auth";

/** The host address for Firebase emulators */
const host = process.env.NEXT_PUBLIC_FIREBASE_EMULATOR_HOST;
/** The port number for the Firebase Auth emulator */
const authEmulatorPort = process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_PORT;

/** Whether to connect to the Firebase Auth emulator */
const shouldConnectAuthEmulator =
  process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR === "true";

/**
 * Parameters for connecting to Firebase emulators.
 */
interface ConnectEmulatorsParams {
  /** Firebase Auth instance to connect to emulator */
  auth?: Auth;
}

/**
 * Connects Firebase services to their respective emulators when configured.
 * This function should be called during Firebase initialization in development
 * environments to use local emulators instead of production services.
 *
 * @param params - Object containing Firebase Auth and/or Firestore instances
 * @throws Error if emulator ports are not configured when emulators are enabled
 */
export function connectEmulators({ auth }: ConnectEmulatorsParams = {}) {
  if (!host) return;

  if (shouldConnectAuthEmulator && auth) {
    if (!authEmulatorPort)
      throw new Error(
        "The NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_PORT environment variable is not set"
      );
    const authEmulatorUrl = `http://${host}:${authEmulatorPort}`;
    (auth as unknown as { _canInitEmulator: boolean })._canInitEmulator = true;

    connectAuthEmulator(auth, authEmulatorUrl, { disableWarnings: true });
    console.info("Using firebase auth emulator...");
  }
}
