import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

const privateRoutes = ["/dashboard", "/cartera", "/noticies", "/mentories", "/subscripcio", "/perfil"];
const adminRoutes = ["/admin"];
const subscriptionFreeRoutes = ["/perfil", "/subscripcio"];

function getToken(request: NextRequest) {
  return (
    request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value
  );
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

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

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
