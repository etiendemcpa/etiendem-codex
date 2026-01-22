export type SubscriptionStatus =
  | "active"
  | "trialing"
  | "past_due"
  | "canceled"
  | "expired";

export interface OrganizationSubscription {
  appId: string;
  status: SubscriptionStatus;
  startedAt: string;
  endsAt?: string | null;
  planId?: string | null;
  metadata?: Record<string, unknown> | null;
}

export interface Organization {
  id: string;
  name: string;
  subscriptions: Record<string, OrganizationSubscription>;
}

const ACTIVE_STATUSES: ReadonlySet<SubscriptionStatus> = new Set([
  "active",
  "trialing",
  "past_due",
]);

export const hasSubscription = (
  organization: Organization | null | undefined,
  appId: string,
): boolean => {
  if (!organization || !appId) {
    return false;
  }

  const subscription = organization.subscriptions?.[appId];
  if (!subscription) {
    return false;
  }

  return ACTIVE_STATUSES.has(subscription.status);
};
