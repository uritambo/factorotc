import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { auth } from '@/lib/auth';
import { getUserPositions } from '@/lib/portfolio';
import { getPriceHistory, getQuote } from '@/lib/market';
import { getNewsForTicker } from '@/lib/news';
import { StatBadge } from '@/components/ui/StatBadge';
import { PortfolioChart } from '@/components/charts/PortfolioChart';
import { NewsCard } from '@/components/cards/NewsCard';
import { ArrowLeft, TrendingUp, TrendingDown, BarChart2, Newspaper } from 'lucide-react';

export default async function TickerPage({
  params,
}: {
  params: Promise<{ locale: string; ticker: string }>;
}) {
  const { locale, ticker: rawTicker } = await params;
  const ticker = decodeURIComponent(rawTicker).toUpperCase();
  const t = await getTranslations('portfolio');
  const session = await auth();
  const userId = (session?.user as { id: string } | undefined)?.id ?? '';

  const positions = await getUserPositions(userId);
  const position = positions.find((p) => p.ticker.toUpperCase() === ticker);

  if (!position) {
    notFound();
  }

  const [quote, priceHistory, relatedNews] = await Promise.all([
    getQuote(position.ticker),
    getPriceHistory(position.ticker, '1mo'),
    getNewsForTicker(position.ticker),
  ]);

  const value = position.quantity * position.currentPrice;
  const cost = position.quantity * position.avgCost;
  const returnValue = value - cost;
  const returnPct = cost > 0 ? ((value - cost) / cost) * 100 : 0;
  const isPositive = returnValue >= 0;

  const formatMoney = (v: number, digits = 2) =>
    new Intl.NumberFormat('ca-ES', {
      style: 'currency',
      currency: position.currency,
      minimumFractionDigits: digits,
    }).format(v);

  const details = [
    { label: 'Preu actual', value: formatMoney(position.currentPrice) },
    { label: 'Cost mitjà', value: formatMoney(position.avgCost) },
    { label: 'Quantitat', value: position.quantity.toString() },
    { label: 'Valor total', value: formatMoney(value, 0) },
    { label: 'Cost total', value: formatMoney(cost, 0) },
    { label: 'Guany/Pèrdua', value: formatMoney(returnValue, 0) },
  ];

  const marketData = [
    quote?.previousClose != null && { label: 'Tancament anterior', value: formatMoney(quote.previousClose) },
    quote?.fiftyTwoWeekHigh != null && { label: '52 setmanes — màxim', value: formatMoney(quote.fiftyTwoWeekHigh) },
    quote?.fiftyTwoWeekLow != null && { label: '52 setmanes — mínim', value: formatMoney(quote.fiftyTwoWeekLow) },
    { label: 'Divisa', value: position.currency },
    { label: 'Font de preu', value: position.isLive ? 'Mercat (temps quasi real)' : 'Preu de compra (sense connexió)' },
  ].filter(Boolean) as { label: string; value: string }[];

  const chartData = (priceHistory ?? []).map((p) => ({ date: p.date, value: p.close }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Link
          href={`/${locale}/cartera`}
          className="inline-flex items-center gap-2 text-[#9CA3AF] hover:text-[#F2F2F0] text-sm mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          {t('detail.back')}
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="font-grotesk text-4xl font-bold text-[#F2F2F0]">{position.ticker}</h1>
              <span className="bg-white/5 text-[#9CA3AF] text-sm px-2 py-1 rounded-md">{position.currency}</span>
            </div>
            <p className="text-[#9CA3AF] text-lg">{position.name}</p>
          </div>
          <div className="text-right">
            <p className="font-grotesk text-3xl font-bold text-[#F2F2F0] tabular-nums">
              {formatMoney(position.currentPrice)}
            </p>
            <div className="mt-1">
              <StatBadge value={returnPct} size="md" />
            </div>
          </div>
        </div>
      </div>

      {/* Price chart */}
      {chartData.length > 1 && (
        <div className="border border-white/5 bg-[#15171C] rounded-xl p-6">
          <h2 className="font-grotesk text-lg font-semibold text-[#F2F2F0] mb-6">Evolució del preu (30 dies)</h2>
          <PortfolioChart data={chartData} />
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {/* Position Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="border border-white/5 bg-[#15171C] rounded-xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <BarChart2 size={18} className="text-[#00D9A3]" />
              <h2 className="font-grotesk text-lg font-semibold text-[#F2F2F0]">La meva posició</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {details.map((detail) => (
                <div key={detail.label} className="bg-white/3 rounded-lg p-4">
                  <p className="text-xs text-[#9CA3AF] mb-1">{detail.label}</p>
                  <p className="font-semibold text-[#F2F2F0] tabular-nums">{detail.value}</p>
                </div>
              ))}
            </div>

            <div
              className="mt-5 p-4 rounded-lg border"
              style={{
                borderColor: isPositive ? 'rgba(0,217,163,0.2)' : 'rgba(255,92,92,0.2)',
                backgroundColor: isPositive ? 'rgba(0,217,163,0.05)' : 'rgba(255,92,92,0.05)',
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isPositive ? (
                    <TrendingUp size={18} className="text-[#00D9A3]" />
                  ) : (
                    <TrendingDown size={18} className="text-[#FF5C5C]" />
                  )}
                  <span className="font-medium" style={{ color: isPositive ? '#00D9A3' : '#FF5C5C' }}>
                    {isPositive ? 'Guany' : 'Pèrdua'} no realitzada
                  </span>
                </div>
                <div className="text-right">
                  <p
                    className="font-grotesk font-bold tabular-nums"
                    style={{ color: isPositive ? '#00D9A3' : '#FF5C5C' }}
                  >
                    {isPositive ? '+' : ''}
                    {formatMoney(returnValue, 0)}
                  </p>
                  <StatBadge value={returnPct} size="sm" />
                </div>
              </div>
            </div>
          </div>

          {/* Related news */}
          {relatedNews.length > 0 && (
            <div className="border border-white/5 bg-[#15171C] rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Newspaper size={18} className="text-[#3D7FFF]" />
                <h2 className="font-grotesk text-lg font-semibold text-[#F2F2F0]">Notícies relacionades</h2>
              </div>
              <div className="space-y-4">
                {relatedNews.slice(0, 4).map((article) => (
                  <NewsCard key={article.id} article={article} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Market data */}
        <div className="border border-white/5 bg-[#15171C] rounded-xl p-6 h-fit">
          <h2 className="font-grotesk text-lg font-semibold text-[#F2F2F0] mb-5">Dades de mercat</h2>
          <div className="space-y-4">
            {marketData.map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <span className="text-sm text-[#9CA3AF]">{item.label}</span>
                <span className="text-sm font-semibold text-[#F2F2F0] tabular-nums text-right">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
