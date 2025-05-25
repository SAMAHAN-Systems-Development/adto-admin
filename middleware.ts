import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicRoutes = ["/login", "/register", "/"];

// All other routes are considered protected by default if not in publicRoutes.

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const tokenCookie = request.cookies.get("token");
  const accessToken = tokenCookie?.value;

  const isPublicRoute = publicRoutes.some(
    (route) =>
      pathname === route || (route !== "/" && pathname.startsWith(route + "/"))
  );

  if (isPublicRoute) {
    return NextResponse.next();
  }

  if (!accessToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectedFrom", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
