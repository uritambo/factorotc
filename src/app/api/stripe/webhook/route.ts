import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { getStripe, isStripeConfigured } from '@/lib/stripe';

// Webhook de Stripe: manté sincronitzat l'estat de la subscripció a la BD.
// Configura l'endpoint a https://dashboard.stripe.com/test/webhooks apuntant
// a /api/stripe/webhook amb els esdeveniments checkout.session.completed,
// customer.subscription.updated i customer.subscription.deleted.
export async function POST(request: Request) {
  if (!isStripeConfigured() || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Stripe webhook not configured' }, { status: 501 });
  }

  const stripe = getStripe();
  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const payload = await request.text();
    event = stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const checkout = event.data.object;
      const userId = checkout.metadata?.userId;
      if (userId) {
        await prisma.subscription.upsert({
          where: { userId },
          create: {
            userId,
            status: 'ACTIVE',
            plan: 'monthly',
            startDate: new Date(),
            stripeCustomerId: (checkout.customer as string) ?? null,
            stripeSubscriptionId: (checkout.subscription as string) ?? null,
          },
          update: {
            status: 'ACTIVE',
            startDate: new Date(),
            stripeCustomerId: (checkout.customer as string) ?? null,
            stripeSubscriptionId: (checkout.subscription as string) ?? null,
          },
        });
      }
      break;
    }
    case 'customer.subscription.updated': {
      const sub = event.data.object;
      const item = sub.items.data[0];
      await prisma.subscription.updateMany({
        where: { stripeSubscriptionId: sub.id },
        data: {
          status: sub.status === 'active' ? 'ACTIVE' : 'INACTIVE',
          renewalDate: item?.current_period_end
            ? new Date(item.current_period_end * 1000)
            : undefined,
        },
      });
      break;
    }
    case 'customer.subscription.deleted': {
      const sub = event.data.object;
      await prisma.subscription.updateMany({
        where: { stripeSubscriptionId: sub.id },
        data: { status: 'CANCELLED' },
      });
      break;
    }
  }

  return NextResponse.json({ received: true });
}
