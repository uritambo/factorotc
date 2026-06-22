import { getTranslations } from 'next-intl/server';
import {
  getPortfolioData,
  getTotalPortfolioValue,
  getTotalCost,
  getTotalReturn,
  getTotalReturnPct,
} from '@/lib/mockData';
import { PositionCard } from '@/components/cards/PositionCard';
import { StatBadge } from '@/components/ui/StatBadge';

export default async function CarteraPage() {
  const t = await getTranslations('portfolio');
  const positions = getPortfolioData();
  const totalValue = getTotalPortfolioValue();
  const totalCost = getTotalCost();
  const totalReturn = getTotalReturn();
  const totalReturnPct = getTotalReturnPct();

  const summaryStats = [
    {
      label: t('totalValue'),
      value: new Intl.NumberFormat('ca-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(totalValue),
    },
    {
      label: t('totalCost'),
      value: new Intl.NumberFormat('ca-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(totalCost),
    },
    {
      label: t('totalReturn'),
      value: new Intl.NumberFormat('ca-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(totalReturn),
      change: totalReturnPct,
    },
    {
      label: t('positions'),
      value: positions.length.toString(),
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-grotesk text-3xl font-bold text-[#F2F2F0]">{t('title')}</h1>
        <p className="text-[#9CA3AF] mt-1">Totes les teves posicions actuals</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryStats.map((stat) => (
          <div key={stat.label} className="border border-white/5 bg-[#15171C] rounded-xl p-5">
            <p className="text-sm text-[#9CA3AF] mb-2">{stat.label}</p>
            <p className="font-grotesk text-xl font-bold text-[#F2F2F0] tabular-nums">{stat.value}</p>
            {stat.change !== undefined && (
              <div className="mt-1">
                <StatBadge value={stat.change} size="sm" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Positions Grid */}
      <div>
        <h2 className="font-grotesk text-xl font-semibold text-[#F2F2F0] mb-5">{t('positions')}</h2>
        {positions.length === 0 ? (
          <div className="border border-white/5 bg-[#15171C] rounded-xl p-12 text-center">
            <p className="text-[#9CA3AF]">{t('noPositions')}</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {positions.map((position) => (
              <PositionCard key={position.ticker} position={position} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
