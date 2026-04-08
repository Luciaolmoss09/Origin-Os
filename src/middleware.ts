import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Origin RBAC Middleware: Simple role-based protection for the V1.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Mocking role retrieval (in production this comes from a JWT/Cookie)
  const userRole = request.cookies.get("origin_role")?.value || "admin";

  // Protection Logic
  if (pathname.startsWith("/portal") && userRole !== "client" && userRole !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (pathname.startsWith("/ads") && userRole !== "media_buyer" && userRole !== "admin") {
     return NextResponse.redirect(new URL("/", request.url));
  }

  // Admin and appropriate roles can continue
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
