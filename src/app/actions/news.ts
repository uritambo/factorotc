'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { importNews } from '@/lib/newsImport';

async function requireAdmin() {
  const session = await auth();
  const user = session?.user as { id: string; role?: string } | undefined;
  if (!user?.id || user.role !== 'ADMIN') throw new Error('No autoritzat');
  return user;
}

export async function importNewsAction(): Promise<{ ok: boolean; message: string }> {
  await requireAdmin();
  try {
    const { imported, translated } = await importNews();
    revalidatePath('/', 'layout');
    return {
      ok: true,
      message: `${imported} notícies importades (${translated} traduïdes al català)`,
    };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : 'Error important notícies' };
  }
}

export async function setArticleStatus(formData: FormData) {
  await requireAdmin();
  const id = formData.get('articleId') as string;
  const status = formData.get('status') as string;
  if (!id || (status !== 'PUBLISHED' && status !== 'PENDING')) return;

  await prisma.newsArticle.update({ where: { id }, data: { status } });
  revalidatePath('/', 'layout');
}

export async function deleteArticle(formData: FormData) {
  await requireAdmin();
  const id = formData.get('articleId') as string;
  if (!id) return;
  await prisma.newsArticle.delete({ where: { id } });
  revalidatePath('/', 'layout');
}

const articleSchema = z.object({
  title: z.string().trim().min(1).max(300),
  summary: z.string().trim().min(1).max(2000),
  source: z.string().trim().min(1).max(100),
  url: z.string().trim().max(500),
  relatedTickers: z.string().trim().max(200),
});

export async function createArticle(formData: FormData) {
  await requireAdmin();
  const parsed = articleSchema.parse({
    title: formData.get('title'),
    summary: formData.get('summary'),
    source: formData.get('source') || 'Factor OTC',
    url: formData.get('url') || '#',
    relatedTickers: formData.get('relatedTickers') || '',
  });

  await prisma.newsArticle.create({
    data: {
      title: parsed.title,
      summary: parsed.summary,
      source: parsed.source,
      url: parsed.url,
      relatedTickers: parsed.relatedTickers
        .split(',')
        .map((t) => t.trim().toUpperCase())
        .filter(Boolean),
      status: 'PUBLISHED',
    },
  });
  revalidatePath('/', 'layout');
}
