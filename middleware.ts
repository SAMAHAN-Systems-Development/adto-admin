import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

const publicRoutes = ["/login", "/register", "/"];

interface DecodedToken {
  email: string;
  sub: string;
  role: string;
  orgId?: string;
  exp: number;
}

function isTokenValid(token: string): boolean {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    // Check if token is expired
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch {
    return false;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublicRoute = publicRoutes.some(
    (route) =>
      pathname === route || (route !== "/" && pathname.startsWith(route + "/"))
  );

  if (isPublicRoute) {
    return NextResponse.next();
  }

  const tokenCookie = request.cookies.get("token");
  const accessToken = tokenCookie?.value;

  if (!accessToken || !isTokenValid(accessToken)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("reason", "auth");
    if (pathname !== "/") {
      loginUrl.searchParams.set("redirect", pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};