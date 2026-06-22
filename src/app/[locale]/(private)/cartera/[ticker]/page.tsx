import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPositionByTicker } from '@/lib/mockData';
import { StatBadge } from '@/components/ui/StatBadge';
import { ArrowLeft, TrendingUp, TrendingDown, BarChart2, Info } from 'lucide-react';

export default async function TickerPage({
  params,
}: {
  params: Promise<{ locale: string; ticker: string }>;
}) {
  const { locale, ticker } = await params;
  const t = await getTranslations('portfolio');

  const positionData = getPositionByTicker(ticker.toUpperCase());

  if (!positionData) {
    notFound();
  }

  const position = positionData;

  const value = position.quantity * position.currentPrice;
  const cost = position.quantity * position.avgCost;
  const returnValue = value - cost;
  const returnPct = ((value - cost) / cost) * 100;
  const isPositive = returnValue >= 0;

  const details = [
    { label: 'Preu actual', value: new Intl.NumberFormat('ca-ES', { style: 'currency', currency: position.currency, minimumFractionDigits: 2 }).format(position.currentPrice) },
    { label: 'Cost mitjà', value: new Intl.NumberFormat('ca-ES', { style: 'currency', currency: position.currency, minimumFractionDigits: 2 }).format(position.avgCost) },
    { label: 'Quantitat', value: position.quantity.toString() },
    { label: 'Valor total', value: new Intl.NumberFormat('ca-ES', { style: 'currency', currency: position.currency, minimumFractionDigits: 0 }).format(value) },
    { label: 'Cost total', value: new Intl.NumberFormat('ca-ES', { style: 'currency', currency: position.currency, minimumFractionDigits: 0 }).format(cost) },
    { label: 'Guany/Pèrdua', value: new Intl.NumberFormat('ca-ES', { style: 'currency', currency: position.currency, minimumFractionDigits: 0 }).format(returnValue) },
  ];

  const fundamentals = [
    { label: 'P/E Ratio', value: position.peRatio.toFixed(1) },
    { label: 'Dividend Yield', value: `${position.dividendYield.toFixed(1)}%` },
    { label: '52W Alt', value: new Intl.NumberFormat('ca-ES', { style: 'currency', currency: position.currency, minimumFractionDigits: 2 }).format(position.week52High) },
    { label: '52W Baix', value: new Intl.NumberFormat('ca-ES', { style: 'currency', currency: position.currency, minimumFractionDigits: 2 }).format(position.week52Low) },
    { label: 'Cap. Mercat', value: position.marketCap },
    { label: 'Sector', value: position.sector },
  ];

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
            <p className="text-sm text-[#9CA3AF]/60 mt-1">{position.sector}</p>
          </div>
          <div className="text-right">
            <p className="font-grotesk text-3xl font-bold text-[#F2F2F0] tabular-nums">
              {new Intl.NumberFormat('ca-ES', { style: 'currency', currency: position.currency, minimumFractionDigits: 2 }).format(position.currentPrice)}
            </p>
            <div className="mt-1">
              <StatBadge value={returnPct} size="md" />
            </div>
          </div>
        </div>
      </div>

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

            <div className="mt-5 p-4 rounded-lg border" style={{
              borderColor: isPositive ? 'rgba(0,217,163,0.2)' : 'rgba(255,92,92,0.2)',
              backgroundColor: isPositive ? 'rgba(0,217,163,0.05)' : 'rgba(255,92,92,0.05)',
            }}>
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
                  <p className="font-grotesk font-bold tabular-nums" style={{ color: isPositive ? '#00D9A3' : '#FF5C5C' }}>
                    {isPositive ? '+' : ''}{new Intl.NumberFormat('ca-ES', { style: 'currency', currency: position.currency, minimumFractionDigits: 0 }).format(returnValue)}
                  </p>
                  <StatBadge value={returnPct} size="sm" />
                </div>
              </div>
            </div>
          </div>

          {/* About */}
          <div className="border border-white/5 bg-[#15171C] rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Info size={18} className="text-[#3D7FFF]" />
              <h2 className="font-grotesk text-lg font-semibold text-[#F2F2F0]">Sobre l'empresa</h2>
            </div>
            <p className="text-[#9CA3AF] leading-relaxed">{position.description}</p>
          </div>
        </div>

        {/* Fundamentals */}
        <div className="border border-white/5 bg-[#15171C] rounded-xl p-6 h-fit">
          <h2 className="font-grotesk text-lg font-semibold text-[#F2F2F0] mb-5">Fonamentals</h2>
          <div className="space-y-4">
            {fundamentals.map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <span className="text-sm text-[#9CA3AF]">{item.label}</span>
                <span className="text-sm font-semibold text-[#F2F2F0] tabular-nums">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
