import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import { SESSION_COOKIE } from "./lib/firebase/config";

/** Routes that require authentication */
const protectedRoutes = ["/dashboard"];
/** Routes that are publicly accessible */
const publicRoutes = ["/"];

/**
 * Next.js middleware function that handles authentication and route protection.
 * Redirects unauthenticated users away from protected routes and authenticated
 * users to the dashboard flow.
 *
 * @param req - The incoming Next.js request object
 * @returns A NextResponse object with redirect or next() action
 */
export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  // Extract the authentication ID from session cookie
  const authId = (await cookies()).get(SESSION_COOKIE)?.value;

  // Redirect to home if user is not authenticated and trying to access protected route
  if (isProtectedRoute && !authId) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  // Redirect to dashboard if user is authenticated and on public route
  if (isPublicRoute && authId && path !== "/dashboard") {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next();
}

/**
 * Configuration object that specifies which routes the middleware should run on.
 * Excludes API routes, Next.js static files, images, and PNG files.
 */
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
