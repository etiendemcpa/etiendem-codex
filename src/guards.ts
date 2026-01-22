import { NextRequest, NextResponse } from "next/server";

export type GuardResult = NextResponse | null;

export interface GuardOptions {
  redirectTo?: string;
  statusCode?: number;
  message?: string;
}

export interface RequireRoleOptions extends GuardOptions {
  roles: string[];
}

interface AuthContext {
  userId?: string;
  organizationId?: string;
  roles: string[];
  subscriptions: string[];
}

const DEFAULT_LOGIN = "/login";
const DEFAULT_ORG = "/onboarding";
const DEFAULT_BILLING = "/billing";
const DEFAULT_UNAUTHORIZED = "Unauthorized";

const parseListHeader = (value?: string | null): string[] => {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

const getAuthContext = (request: NextRequest): AuthContext => {
  return {
    userId: request.headers.get("x-user-id") ?? undefined,
    organizationId: request.headers.get("x-org-id") ?? undefined,
    roles: parseListHeader(request.headers.get("x-roles")),
    subscriptions: parseListHeader(request.headers.get("x-subscriptions")),
  };
};

const respondUnauthorized = (request: NextRequest, options?: GuardOptions): NextResponse => {
  const statusCode = options?.statusCode ?? 401;
  const message = options?.message ?? DEFAULT_UNAUTHORIZED;

  if (request.nextUrl.pathname.startsWith("/api")) {
    return NextResponse.json({ message }, { status: statusCode });
  }

  const redirectTo = options?.redirectTo ?? DEFAULT_LOGIN;
  const redirectUrl = new URL(redirectTo, request.url);
  redirectUrl.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(redirectUrl);
};

const respondForbidden = (request: NextRequest, options?: GuardOptions): NextResponse => {
  const statusCode = options?.statusCode ?? 403;
  const message = options?.message ?? "Forbidden";

  if (request.nextUrl.pathname.startsWith("/api")) {
    return NextResponse.json({ message }, { status: statusCode });
  }

  const redirectTo = options?.redirectTo ?? DEFAULT_BILLING;
  return NextResponse.redirect(new URL(redirectTo, request.url));
};

export const requireAuth = (request: NextRequest, options?: GuardOptions): GuardResult => {
  const context = getAuthContext(request);

  if (!context.userId) {
    return respondUnauthorized(request, options);
  }

  return null;
};

export const requireOrganization = (
  request: NextRequest,
  options?: GuardOptions
): GuardResult => {
  const context = getAuthContext(request);

  if (!context.organizationId) {
    const redirectTo = options?.redirectTo ?? DEFAULT_ORG;
    return respondForbidden(request, {
      ...options,
      redirectTo,
      message: options?.message ?? "Organization required",
    });
  }

  return null;
};

export const requireSubscription = (appId: string) => {
  return (request: NextRequest, options?: GuardOptions): GuardResult => {
    const context = getAuthContext(request);

    if (!context.subscriptions.includes(appId)) {
      const redirectTo = options?.redirectTo ?? `${DEFAULT_BILLING}?app=${appId}`;
      return respondForbidden(request, {
        ...options,
        redirectTo,
        message: options?.message ?? "Subscription required",
      });
    }

    return null;
  };
};

export const requireRole = (appId: string) => {
  return (request: NextRequest, options: RequireRoleOptions): GuardResult => {
    const context = getAuthContext(request);

    const hasRole = options.roles.some((role) =>
      context.roles.includes(`${appId}:${role}`)
    );

    if (!hasRole) {
      return respondForbidden(request, {
        ...options,
        message: options.message ?? "Role required",
      });
    }

    return null;
  };
};
