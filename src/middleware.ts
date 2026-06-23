import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const privateRoutes = ["/dashboard", "/cartera", "/noticies", "/mentories", "/subscripcio", "/perfil"];
const adminRoutes = ["/admin"];

function getToken(request: NextRequest) {
  return (
    request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value
  );
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect root to default locale
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/ca", request.url));
  }

  // Strip locale prefix for route matching
  const pathnameWithoutLocale = pathname.replace(/^\/(ca|es)/, "") || "/";
  const isPrivate = privateRoutes.some((r) => pathnameWithoutLocale.startsWith(r));
  const isAdmin = adminRoutes.some((r) => pathnameWithoutLocale.startsWith(r));

  if (isPrivate || isAdmin) {
    const token = getToken(request);
    if (!token) {
      const locale = pathname.startsWith("/es") ? "es" : "ca";
      return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
