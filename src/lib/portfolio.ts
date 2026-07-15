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
  let rows: { id: string; ticker: string; companyName: string; quantity: number; avgBuyPrice: number }[];
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
 * Si cap posició té dades de mercat, es retorna la sèrie simulada.
 */
export async function getUserPortfolioHistory(
  positions: PortfolioPosition[]
): Promise<PortfolioHistoryPoint[]> {
  const livePositions = positions.filter((p) => p.isLive);
  if (livePositions.length === 0) return getMockHistory();

  const histories = await Promise.all(
    livePositions.map(async (pos) => ({
      pos,
      history: await getPriceHistory(pos.ticker),
      rate: await getEurRate(pos.currency),
    }))
  );

  const usable = histories.filter((h) => h.history && h.history.length > 1);
  if (usable.length === 0) return getMockHistory();

  // Conjunt ordenat de dates a partir de la sèrie més llarga
  const dates = usable
    .reduce((best, h) => (h.history!.length > best.length ? h.history! : best), usable[0].history!)
    .map((p) => p.date);

  return dates.map((date) => {
    let value = 0;
    for (const { pos, history, rate } of usable) {
      // Últim tancament conegut fins a la data (forward-fill)
      let close: number | undefined;
      for (const point of history!) {
        if (point.date <= date) close = point.close;
        else break;
      }
      value += pos.quantity * (close ?? pos.avgCost) * rate;
    }
    // Les posicions sense històric es valoren al preu actual
    for (const pos of positions.filter((p) => !usable.some((u) => u.pos.id === p.id))) {
      value += pos.quantity * pos.currentPrice;
    }
    return { date, value: Math.round(value) };
  });
}
