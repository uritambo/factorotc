import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getStripe, isStripeConfigured } from '@/lib/stripe';

// Crea una sessió de Stripe Checkout per al pla mensual (10€/mes, mode test)
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isStripeConfigured() || !process.env.STRIPE_MONTHLY_PRICE_ID) {
    return NextResponse.json(
      { error: 'Stripe no està configurat. Afegeix STRIPE_SECRET_KEY i STRIPE_MONTHLY_PRICE_ID a .env' },
      { status: 501 }
    );
  }

  const userId = (session.user as { id: string }).id;
  const origin = new URL(request.url).origin;

  const stripe = getStripe();
  const subscription = await prisma.subscription.findUnique({ where: { userId } });

  const checkout = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: subscription?.stripeCustomerId ?? undefined,
    customer_email: subscription?.stripeCustomerId ? undefined : session.user.email ?? undefined,
    line_items: [{ price: process.env.STRIPE_MONTHLY_PRICE_ID, quantity: 1 }],
    success_url: `${origin}/ca/subscripcio?checkout=success`,
    cancel_url: `${origin}/ca/preus`,
    metadata: { userId },
  });

  return NextResponse.json({ url: checkout.url });
}
