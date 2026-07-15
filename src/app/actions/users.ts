'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function requireAdmin() {
  const session = await auth();
  const user = session?.user as { id: string; role?: string } | undefined;
  if (!user?.id || user.role !== 'ADMIN') throw new Error('No autoritzat');
  return user;
}

const newUserSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email(),
  password: z.string().min(8).max(100),
  phone: z.string().trim().max(30).optional(),
});

export async function createUserAction(
  formData: FormData
): Promise<{ ok: boolean; message: string }> {
  await requireAdmin();

  const parsed = newUserSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    phone: (formData.get('phone') as string) || undefined,
  });
  if (!parsed.success) {
    return { ok: false, message: 'Dades no vàlides (contrasenya mínim 8 caràcters)' };
  }

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) return { ok: false, message: 'Ja existeix un usuari amb aquest correu' };

  const activateSubscription = formData.get('activateSubscription') === 'on';
  const hashed = await bcrypt.hash(parsed.data.password, 12);

  const user = await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      password: hashed,
      phone: parsed.data.phone ?? null,
      preferredLanguage: 'ca',
    },
  });

  if (activateSubscription) {
    const renewalDate = new Date();
    renewalDate.setMonth(renewalDate.getMonth() + 1);
    await prisma.subscription.create({
      data: {
        userId: user.id,
        status: 'ACTIVE',
        plan: 'monthly',
        startDate: new Date(),
        renewalDate,
      },
    });
  }

  revalidatePath('/', 'layout');
  return { ok: true, message: `Usuari ${user.email} creat correctament` };
}

export async function toggleSubscription(formData: FormData) {
  await requireAdmin();
  const userId = formData.get('userId') as string;
  const activate = formData.get('activate') === 'true';
  if (!userId) return;

  const renewalDate = new Date();
  renewalDate.setMonth(renewalDate.getMonth() + 1);

  await prisma.subscription.upsert({
    where: { userId },
    update: {
      status: activate ? 'ACTIVE' : 'INACTIVE',
      ...(activate ? { startDate: new Date(), renewalDate } : {}),
    },
    create: {
      userId,
      status: activate ? 'ACTIVE' : 'INACTIVE',
      plan: 'monthly',
      ...(activate ? { startDate: new Date(), renewalDate } : {}),
    },
  });

  revalidatePath('/', 'layout');
}
