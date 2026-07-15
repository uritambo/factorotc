import { getTranslations } from 'next-intl/server';
import { auth } from '@/lib/auth';
import { getUserPositions, computeTotals } from '@/lib/portfolio';
import { PositionCard } from '@/components/cards/PositionCard';
import { PositionForm } from '@/components/portfolio/PositionForm';
import { DeletePositionButton } from '@/components/portfolio/DeletePositionButton';
import { StatBadge } from '@/components/ui/StatBadge';

export default async function CarteraPage() {
  const t = await getTranslations('portfolio');
  const session = await auth();
  const userId = (session?.user as { id: string } | undefined)?.id ?? '';

  const positions = await getUserPositions(userId);
  const totals = await computeTotals(positions);

  const formatEur = (value: number) =>
    new Intl.NumberFormat('ca-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(value);

  const summaryStats = [
    { label: t('totalValue'), value: formatEur(totals.totalValueEur) },
    { label: t('totalCost'), value: formatEur(totals.totalCostEur) },
    { label: t('totalReturn'), value: formatEur(totals.pnlEur), change: totals.pnlPct },
    { label: t('positions'), value: positions.length.toString() },
  ];

  const hasLivePrices = positions.some((p) => p.isLive);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-grotesk text-3xl font-bold text-[#F2F2F0]">{t('title')}</h1>
        <p className="text-[#9CA3AF] mt-1">
          Totes les teves posicions actuals
          {positions.length > 0 && !hasLivePrices && (
            <span className="text-xs ml-2 text-[#FF5C5C]/80">
              (sense connexió amb el mercat — es mostren preus de compra)
            </span>
          )}
        </p>
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

      {/* Add position */}
      <PositionForm />

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
              <div key={position.id} className="relative group/card">
                <PositionCard position={position} />
                <div className="absolute top-2 right-2 opacity-0 group-hover/card:opacity-100 transition-opacity">
                  <DeletePositionButton positionId={position.id} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
