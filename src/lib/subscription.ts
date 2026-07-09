import { prisma } from '@/lib/prisma';

export type SubscriptionInfo = {
  status: 'ACTIVE' | 'INACTIVE' | 'CANCELLED';
  plan: string;
  renewalDate: Date | null;
  stripeCustomerId: string | null;
};

/**
 * Fetches the current subscription state for a user straight from the
 * database (the JWT copy can go stale after Stripe webhooks update it).
 * Returns null when the user has no subscription row yet, or when the
 * database is unreachable (callers decide how to degrade).
 */
export async function getSubscription(userId: string): Promise<SubscriptionInfo | null> {
  try {
    const sub = await prisma.subscription.findUnique({ where: { userId } });
    if (!sub) return null;
    return {
      status: sub.status,
      plan: sub.plan,
      renewalDate: sub.renewalDate,
      stripeCustomerId: sub.stripeCustomerId,
    };
  } catch {
    return null;
  }
}

export async function hasActiveSubscription(userId: string): Promise<boolean> {
  const sub = await getSubscription(userId);
  return sub?.status === 'ACTIVE';
}
