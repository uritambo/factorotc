'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

type SessionUser = { id: string; role?: string };

async function requireUser(): Promise<SessionUser> {
  const session = await auth();
  const user = session?.user as SessionUser | undefined;
  if (!user?.id) throw new Error('No autoritzat');
  return user;
}

const positionSchema = z.object({
  ticker: z.string().trim().min(1).max(15).transform((s) => s.toUpperCase()),
  companyName: z.string().trim().min(1).max(100),
  quantity: z.coerce.number().positive(),
  avgBuyPrice: z.coerce.number().positive(),
});

export async function addPosition(formData: FormData) {
  const user = await requireUser();

  // Un admin pot afegir posicions a la cartera de qualsevol usuari
  const targetUserId = (formData.get('targetUserId') as string) || user.id;
  if (targetUserId !== user.id && user.role !== 'ADMIN') {
    throw new Error('No autoritzat');
  }

  const parsed = positionSchema.parse({
    ticker: formData.get('ticker'),
    companyName: formData.get('companyName'),
    quantity: formData.get('quantity'),
    avgBuyPrice: formData.get('avgBuyPrice'),
  });

  const portfolio = await prisma.portfolio.upsert({
    where: { userId: targetUserId },
    update: {},
    create: { userId: targetUserId },
  });

  await prisma.position.create({
    data: { ...parsed, portfolioId: portfolio.id },
  });

  revalidatePath('/', 'layout');
}

export async function deletePosition(formData: FormData) {
  const user = await requireUser();
  const positionId = formData.get('positionId') as string;
  if (!positionId) throw new Error('Falta positionId');

  const position = await prisma.position.findUnique({
    where: { id: positionId },
    include: { portfolio: { select: { userId: true } } },
  });
  if (!position) return;

  if (position.portfolio.userId !== user.id && user.role !== 'ADMIN') {
    throw new Error('No autoritzat');
  }

  await prisma.position.delete({ where: { id: positionId } });
  revalidatePath('/', 'layout');
}
