// Notícies: lectura des de la base de dades amb fallback a mock data.

import { prisma } from '@/lib/prisma';
import { getNewsArticles as getMockNews, type NewsArticle } from '@/lib/mockData';

export async function getPublishedNews(): Promise<NewsArticle[]> {
  try {
    const rows = await prisma.newsArticle.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
      take: 50,
    });
    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      summary: row.summary,
      source: row.source,
      url: row.url,
      relatedTickers: row.relatedTickers,
      publishedAt: row.publishedAt.toISOString(),
      author: row.source,
    }));
  } catch {
    return getMockNews();
  }
}

export async function getNewsForTicker(ticker: string): Promise<NewsArticle[]> {
  const news = await getPublishedNews();
  return news.filter((n) => n.relatedTickers.includes(ticker.toUpperCase()));
}
