import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    // Admin-only routes
    const adminRoutes = ["/dashboard", "/clients", "/calendar", "/settings", "/finanzas", "/ads"]
    const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route))

    if (isAdminRoute && token?.role !== "admin") {
      // Clients trying to reach admin pages go to their portal
      if (token?.role === "client" && token?.clientId) {
        return NextResponse.redirect(new URL(`/portal/${token.clientId}`, req.url))
      }
      return NextResponse.redirect(new URL("/login", req.url))
    }

    // Portal routes — only clients or admins
    if (pathname.startsWith("/portal")) {
      if (token?.role === "client") {
        // Make sure client can only see their own portal
        const pathClientId = pathname.split("/")[2]
        if (pathClientId && pathClientId !== token.clientId) {
          return NextResponse.redirect(new URL(`/portal/${token.clientId}`, req.url))
        }
      } else if (token?.role !== "admin") {
        return NextResponse.redirect(new URL("/login", req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // Always allow public routes
        if (
          pathname.startsWith("/login") ||
          pathname.startsWith("/register") ||
          pathname.startsWith("/api/auth")
        ) {
          return true
        }

        // All other routes require a token
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
}
