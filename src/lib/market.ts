// Servei de dades de mercat (server-side).
// Cadena de fonts: Financial Modeling Prep (si hi ha FMP_API_KEY) → Yahoo Finance
// (sense clau) → fallback (el component fa servir el preu de compra).
// Cache en memòria per no exhaurir límits d'API.

export interface Quote {
  symbol: string;
  price: number;
  currency: string;
  previousClose: number | null;
  fiftyTwoWeekHigh: number | null;
  fiftyTwoWeekLow: number | null;
}

export interface HistoryPoint {
  date: string; // YYYY-MM-DD
  close: number;
}

// Tickers "curts" habituals → símbol de Yahoo Finance.
// Per a valors nous, introduïu directament el símbol de Yahoo (ITX.MC, MC.PA, AAPL…).
const YAHOO_SYMBOL_MAP: Record<string, string> = {
  ITX: 'ITX.MC',
  IBE: 'IBE.MC',
  SAN: 'SAN.MC',
  MC: 'MC.PA',
};

const QUOTE_TTL_MS = 5 * 60 * 1000; // 5 min
const HISTORY_TTL_MS = 60 * 60 * 1000; // 1 h

const cache = new Map<string, { value: unknown; expires: number }>();

function cacheGet<T>(key: string): T | undefined {
  const hit = cache.get(key);
  if (hit && hit.expires > Date.now()) return hit.value as T;
  cache.delete(key);
  return undefined;
}

function cacheSet(key: string, value: unknown, ttl: number) {
  cache.set(key, { value, expires: Date.now() + ttl });
}

export function toYahooSymbol(ticker: string): string {
  return YAHOO_SYMBOL_MAP[ticker.toUpperCase()] ?? ticker.toUpperCase();
}

async function fetchJson(url: string): Promise<unknown | null> {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; FactorOTC/1.0)' },
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
async function yahooChart(symbol: string, range: string, interval: string): Promise<any | null> {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=${range}&interval=${interval}`;
  const data: any = await fetchJson(url);
  return data?.chart?.result?.[0] ?? null;
}

async function quoteFromFmp(symbol: string): Promise<Quote | null> {
  const key = process.env.FMP_API_KEY;
  if (!key) return null;
  const data: any = await fetchJson(
    `https://financialmodelingprep.com/api/v3/quote/${encodeURIComponent(symbol)}?apikey=${key}`
  );
  const q = Array.isArray(data) ? data[0] : null;
  if (!q?.price) return null;
  return {
    symbol,
    price: q.price,
    currency: 'EUR', // FMP no retorna divisa al quote bàsic; Yahoo és la font preferida per a això
    previousClose: q.previousClose ?? null,
    fiftyTwoWeekHigh: q.yearHigh ?? null,
    fiftyTwoWeekLow: q.yearLow ?? null,
  };
}

async function quoteFromYahoo(symbol: string): Promise<Quote | null> {
  const result = await yahooChart(symbol, '1d', '1d');
  const meta = result?.meta;
  if (!meta?.regularMarketPrice) return null;
  return {
    symbol,
    price: meta.regularMarketPrice,
    currency: meta.currency ?? 'EUR',
    previousClose: meta.chartPreviousClose ?? meta.previousClose ?? null,
    fiftyTwoWeekHigh: meta.fiftyTwoWeekHigh ?? null,
    fiftyTwoWeekLow: meta.fiftyTwoWeekLow ?? null,
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export async function getQuote(ticker: string): Promise<Quote | null> {
  const symbol = toYahooSymbol(ticker);
  const cached = cacheGet<Quote | null>(`q:${symbol}`);
  if (cached !== undefined) return cached;

  const quote = (await quoteFromYahoo(symbol)) ?? (await quoteFromFmp(symbol));
  cacheSet(`q:${symbol}`, quote, QUOTE_TTL_MS);
  return quote;
}

export async function getPriceHistory(ticker: string, range = '1mo'): Promise<HistoryPoint[] | null> {
  const symbol = toYahooSymbol(ticker);
  const cacheKey = `h:${symbol}:${range}`;
  const cached = cacheGet<HistoryPoint[] | null>(cacheKey);
  if (cached !== undefined) return cached;

  const result = await yahooChart(symbol, range, '1d');
  const timestamps: number[] | undefined = result?.timestamp;
  const closes: (number | null)[] | undefined = result?.indicators?.quote?.[0]?.close;

  let history: HistoryPoint[] | null = null;
  if (timestamps && closes && timestamps.length === closes.length) {
    history = timestamps
      .map((ts, i) => ({
        date: new Date(ts * 1000).toISOString().split('T')[0],
        close: closes[i],
      }))
      .filter((p): p is HistoryPoint => p.close != null);
    if (history.length === 0) history = null;
  }

  cacheSet(cacheKey, history, HISTORY_TTL_MS);
  return history;
}

// Aproximacions fixes com a últim recurs si el mercat de divises no respon
const FX_FALLBACK: Record<string, number> = { USD: 0.93, GBP: 1.17, CHF: 1.06 };

/** Factor per convertir 1 unitat de `currency` a EUR. */
export async function getEurRate(currency: string): Promise<number> {
  if (!currency || currency === 'EUR') return 1;
  const cacheKey = `fx:${currency}`;
  const cached = cacheGet<number>(cacheKey);
  if (cached !== undefined) return cached;

  // EURUSD=X cotitza "USD per 1 EUR" → per passar d'USD a EUR dividim
  const result = await yahooChart(`EUR${currency}=X`, '1d', '1d');
  const perEur = result?.meta?.regularMarketPrice;
  const rate = perEur ? 1 / perEur : FX_FALLBACK[currency] ?? 1;
  cacheSet(cacheKey, rate, HISTORY_TTL_MS);
  return rate;
}
