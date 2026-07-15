// Cartera de l'usuari: posicions de la base de dades + preus reals de mercat.
// Si la base de dades no està disponible (entorn de demo), es fa servir mockData.

import { prisma } from '@/lib/prisma';
import { getQuote, getPriceHistory, getEurRate } from '@/lib/market';
import {
  getPortfolioData as getMockPositions,
  getPortfolioHistory as getMockHistory,
  type PortfolioHistoryPoint,
} from '@/lib/mockData';

export interface PortfolioPosition {
  id: string;
  ticker: string;
  name: string;
  quantity: number;
  avgCost: number;
  currentPrice: number;
  currency: string;
  purchaseDate: Date | null;
  /** true si el preu ve d'una API de mercat; false si és el preu de compra (sense connexió) */
  isLive: boolean;
}

export interface PortfolioTotals {
  totalValueEur: number;
  totalCostEur: number;
  pnlEur: number;
  pnlPct: number;
}

export async function getUserPositions(userId: string): Promise<PortfolioPosition[]> {
  let rows: {
    id: string;
    ticker: string;
    companyName: string;
    quantity: number;
    avgBuyPrice: number;
    purchaseDate: Date | null;
  }[];
  try {
    rows = await prisma.position.findMany({
      where: { portfolio: { userId } },
      orderBy: { createdAt: 'asc' },
    });
  } catch {
    // Base de dades no disponible → mode demo amb dades simulades
    return getMockPositions().map((p) => ({
      id: p.id,
      ticker: p.ticker,
      name: p.name,
      quantity: p.quantity,
      avgCost: p.avgCost,
      currentPrice: p.currentPrice,
      currency: p.currency,
      purchaseDate: null,
      isLive: false,
    }));
  }

  return Promise.all(
    rows.map(async (row) => {
      const quote = await getQuote(row.ticker);
      return {
        id: row.id,
        ticker: row.ticker,
        name: row.companyName,
        quantity: row.quantity,
        avgCost: row.avgBuyPrice,
        currentPrice: quote?.price ?? row.avgBuyPrice,
        currency: quote?.currency ?? 'EUR',
        purchaseDate: row.purchaseDate,
        isLive: Boolean(quote),
      };
    })
  );
}

export async function computeTotals(positions: PortfolioPosition[]): Promise<PortfolioTotals> {
  let totalValueEur = 0;
  let totalCostEur = 0;
  for (const pos of positions) {
    const rate = await getEurRate(pos.currency);
    totalValueEur += pos.quantity * pos.currentPrice * rate;
    totalCostEur += pos.quantity * pos.avgCost * rate;
  }
  const pnlEur = totalValueEur - totalCostEur;
  const pnlPct = totalCostEur > 0 ? (pnlEur / totalCostEur) * 100 : 0;
  return { totalValueEur, totalCostEur, pnlEur, pnlPct };
}

/**
 * Evolució de la cartera (30 dies) agregant l'històric real de cada posició.
 * Amb posicions reals SEMPRE construeix una sèrie real (mai dades simulades):
 *  - si hi ha històric de mercat, l'agrega dia a dia (amb forward-fill);
 *  - per a posicions sense històric (o abans de la data de compra), es valoren
 *    al cost, de manera que el valor reflecteix les tinences reals de l'usuari.
 * Només retorna la sèrie mock quan NO hi ha cap posició (mode demo pur).
 */
export async function getUserPortfolioHistory(
  positions: PortfolioPosition[]
): Promise<PortfolioHistoryPoint[]> {
  if (positions.length === 0) return getMockHistory();

  const histories = await Promise.all(
    positions.map(async (pos) => ({
      pos,
      history: await getPriceHistory(pos.ticker),
      rate: await getEurRate(pos.currency),
    }))
  );

  const withHistory = histories.filter((h) => h.history && h.history.length > 1);

  // Conjunt de dates: la sèrie de mercat més llarga, o els últims 30 dies si
  // cap posició té històric (així el gràfic segueix sent real, no mock).
  let dates: string[];
  if (withHistory.length > 0) {
    dates = withHistory
      .reduce((best, h) => (h.history!.length > best.length ? h.history! : best), withHistory[0].history!)
      .map((p) => p.date);
  } else {
    dates = Array.from({ length: 30 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (29 - i));
      return d.toISOString().split('T')[0];
    });
  }

  return dates.map((date) => {
    let value = 0;
    for (const { pos, history, rate } of histories) {
      // La posició encara no s'havia comprat en aquesta data → no compta
      if (pos.purchaseDate && date < pos.purchaseDate.toISOString().split('T')[0]) {
        continue;
      }
      // Últim tancament conegut fins a la data (forward-fill); si no hi ha
      // històric, es fa servir el preu actual (posició valorada a mercat)
      let close: number | undefined;
      if (history) {
        for (const point of history) {
          if (point.date <= date) close = point.close;
          else break;
        }
      }
      value += pos.quantity * (close ?? pos.currentPrice) * rate;
    }
    return { date, value: Math.round(value) };
  });
}
