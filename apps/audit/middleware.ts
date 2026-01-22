import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const PORTAL_URL = process.env.PORTAL_URL ?? 'https://portal.example.com';

const isAuthenticated = (request: NextRequest): boolean => {
  const authToken = request.cookies.get('auth_token')?.value;
  const authorizationHeader = request.headers.get('authorization');

  return Boolean(authToken || authorizationHeader);
};

const hasOrganizationSelected = (request: NextRequest): boolean =>
  Boolean(request.cookies.get('org_id')?.value);

const hasActiveSubscription = (request: NextRequest): boolean =>
  Boolean(request.cookies.get('subscription')?.value);

const redirectToPortal = () => NextResponse.redirect(PORTAL_URL);

export const middleware = (request: NextRequest) => {
  if (!isAuthenticated(request)) {
    return redirectToPortal();
  }

  if (!hasOrganizationSelected(request)) {
    return redirectToPortal();
  }

  if (!hasActiveSubscription(request)) {
    return redirectToPortal();
  }

  return NextResponse.next();
};

export const config = {
  matcher: ['/((?!_next|favicon.ico).*)'],
};
