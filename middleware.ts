import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from '@/i18n/routing';

const intlMiddleware = createMiddleware(routing);

const privateRoutes = ['/dashboard', '/cartera', '/noticies', '/mentories', '/subscripcio', '/perfil'];

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle next-intl routing
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt).*)',
  ],
};
