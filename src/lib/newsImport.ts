// Importació de notícies reals via Finnhub (clau gratuïta a https://finnhub.io).
// Les notícies s'importen com a PENDING i l'admin les revisa/publica a /admin/noticies.
// Si hi ha ANTHROPIC_API_KEY, es tradueixen automàticament al català.

import { prisma } from '@/lib/prisma';
import { translateNewsToCatalan } from '@/lib/translate';

interface FinnhubArticle {
  headline?: string;
  summary?: string;
  source?: string;
  url?: string;
  datetime?: number;
  related?: string;
}

export function isNewsImportConfigured(): boolean {
  return Boolean(process.env.FINNHUB_API_KEY);
}

async function fetchFinnhub(path: string): Promise<FinnhubArticle[]> {
  const key = process.env.FINNHUB_API_KEY;
  const res = await fetch(`https://finnhub.io/api/v1${path}${path.includes('?') ? '&' : '?'}token=${key}`, {
    cache: 'no-store',
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) throw new Error(`Finnhub ${res.status}`);
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export async function importNews(): Promise<{ imported: number; translated: number }> {
  if (!isNewsImportConfigured()) {
    throw new Error('FINNHUB_API_KEY no està configurada a .env');
  }

  // Notícies generals de mercat + notícies dels tickers presents a les carteres
  const articles: { article: FinnhubArticle; tickers: string[] }[] = [];

  const general = await fetchFinnhub('/news?category=general');
  for (const article of general.slice(0, 8)) {
    articles.push({ article, tickers: [] });
  }

  try {
    const positions = await prisma.position.findMany({
      select: { ticker: true },
      distinct: ['ticker'],
      take: 5,
    });
    const to = new Date().toISOString().split('T')[0];
    const from = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
    for (const { ticker } of positions) {
      // Finnhub cobreix sobretot símbols USA; per a tickers europeus pot no retornar res
      const symbol = ticker.split('.')[0];
      try {
        const companyNews = await fetchFinnhub(`/company-news?symbol=${symbol}&from=${from}&to=${to}`);
        for (const article of companyNews.slice(0, 3)) {
          articles.push({ article, tickers: [ticker] });
        }
      } catch {
        // símbol sense cobertura — continuem
      }
    }
  } catch {
    // sense accés a posicions — només notícies generals
  }

  // Dedupliquem contra el que ja hi ha a la base de dades (per URL)
  const urls = articles.map((a) => a.article.url).filter((u): u is string => Boolean(u));
  const existing = await prisma.newsArticle.findMany({
    where: { url: { in: urls } },
    select: { url: true },
  });
  const existingUrls = new Set(existing.map((e) => e.url));

  let imported = 0;
  let translated = 0;

  for (const { article, tickers } of articles) {
    if (!article.headline || !article.url || existingUrls.has(article.url)) continue;
    existingUrls.add(article.url);

    const original = {
      title: article.headline,
      summary: article.summary || article.headline,
    };
    const catalan = await translateNewsToCatalan(original);
    if (catalan) translated++;

    await prisma.newsArticle.create({
      data: {
        title: catalan?.title ?? original.title,
        summary: catalan?.summary ?? original.summary,
        source: article.source ?? 'Finnhub',
        url: article.url,
        publishedAt: article.datetime ? new Date(article.datetime * 1000) : new Date(),
        relatedTickers: tickers,
        status: 'PENDING',
      },
    });
    imported++;
  }

  return { imported, translated };
}
