import { NextRequest, NextResponse } from "next/server";

import {
  requireAuth,
  requireOrganization,
  requireRole,
  requireSubscription,
} from "./src/guards";

const subscriptionGuard = requireSubscription("analytics");
const roleGuard = requireRole("analytics");

export const middleware = (request: NextRequest) => {
  const guardResult =
    requireAuth(request) ??
    requireOrganization(request) ??
    subscriptionGuard(request) ??
    roleGuard(request, { roles: ["admin", "owner"] });

  return guardResult ?? NextResponse.next();
};

export const config = {
  matcher: ["/app/:path*", "/api/private/:path*"],
};
