import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const privateRoutes = ["/dashboard", "/cartera", "/noticies", "/mentories", "/subscripcio", "/perfil"];
const adminRoutes = ["/admin"];

function getToken(request: NextRequest) {
  return (
    request.cookies.get("authjs.session-token")?.value ||
    request.cookies.get("__Secure-authjs.session-token")?.value ||
    request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value
  );
}

export function proxy(request: NextRequest) {
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

  // Expose the pathname so server layouts can apply route-dependent rules
  // (e.g. the subscription paywall exempts /perfil and /subscripcio)
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
