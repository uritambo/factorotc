import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getStripe, isStripeConfigured } from '@/lib/stripe';

// Obre el Stripe Customer Portal perquè l'usuari gestioni pagament i factures
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: 'Stripe no està configurat. Afegeix STRIPE_SECRET_KEY a .env' },
      { status: 501 }
    );
  }

  const userId = (session.user as { id: string }).id;
  const subscription = await prisma.subscription.findUnique({ where: { userId } });

  if (!subscription?.stripeCustomerId) {
    return NextResponse.json(
      { error: 'Aquest usuari encara no té cap client de Stripe associat' },
      { status: 400 }
    );
  }

  const origin = new URL(request.url).origin;
  const stripe = getStripe();
  const portal = await stripe.billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: `${origin}/ca/subscripcio`,
  });

  return NextResponse.json({ url: portal.url });
}
