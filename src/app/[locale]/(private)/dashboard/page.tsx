import { auth } from '@/lib/auth';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import {
  getPortfolioData,
  getPortfolioHistory,
  getNewsArticles,
  getTotalPortfolioValue,
  getTotalReturnPct,
} from '@/lib/mockData';
import { PortfolioChart } from '@/components/charts/PortfolioChart';
import { StatBadge } from '@/components/ui/StatBadge';
import { NewsCard } from '@/components/cards/NewsCard';
import { TrendingUp, TrendingDown, PieChart, ArrowRight } from 'lucide-react';

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();
  const t = await getTranslations('dashboard');

  const portfolioData = getPortfolioData();
  const portfolioHistory = getPortfolioHistory();
  const newsArticles = getNewsArticles().slice(0, 3);
  const totalValue = getTotalPortfolioValue();
  const totalReturnPct = getTotalReturnPct();
  const todayChange = portfolioHistory[portfolioHistory.length - 1].value - portfolioHistory[portfolioHistory.length - 2].value;
  const todayChangePct = (todayChange / portfolioHistory[portfolioHistory.length - 2].value) * 100;

  const userName = session?.user?.name?.split(' ')[0] || 'Inversor';

  const stats = [
    {
      label: t('portfolioValue'),
      value: new Intl.NumberFormat('ca-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(totalValue),
      change: totalReturnPct,
      icon: PieChart,
      color: '#00D9A3',
    },
    {
      label: t('todayChange'),
      value: new Intl.NumberFormat('ca-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(Math.abs(todayChange)),
      change: todayChangePct,
      icon: todayChange >= 0 ? TrendingUp : TrendingDown,
      color: todayChange >= 0 ? '#00D9A3' : '#FF5C5C',
    },
    {
      label: t('positions'),
      value: portfolioData.length.toString(),
      change: null,
      icon: PieChart,
      color: '#3D7FFF',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-grotesk text-3xl font-bold text-[#F2F2F0]">
          {t('welcome')}, {userName}
        </h1>
        <p className="text-[#9CA3AF] mt-1">Aquí tens el resum de la teva cartera.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="border border-white/5 bg-[#15171C] rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-[#9CA3AF]">{stat.label}</p>
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${stat.color}15` }}
                >
                  <Icon size={18} style={{ color: stat.color }} />
                </div>
              </div>
              <p className="font-grotesk text-2xl font-bold text-[#F2F2F0] tabular-nums">{stat.value}</p>
              {stat.change !== null && (
                <div className="mt-2">
                  <StatBadge value={stat.change} size="sm" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Chart */}
      <div className="border border-white/5 bg-[#15171C] rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-grotesk text-lg font-semibold text-[#F2F2F0]">{t('performance')}</h2>
          <StatBadge value={totalReturnPct} size="sm" />
        </div>
        <PortfolioChart data={portfolioHistory} />
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Top Positions */}
        <div className="border border-white/5 bg-[#15171C] rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-grotesk text-lg font-semibold text-[#F2F2F0]">{t('topPositions')}</h2>
            <Link
              href={`/${locale}/cartera`}
              className="text-sm text-[#00D9A3] hover:text-[#00D9A3]/80 flex items-center gap-1"
            >
              {t('viewAll')} <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {portfolioData.slice(0, 4).map((pos) => {
              const value = pos.quantity * pos.currentPrice;
              const returnPct = ((pos.currentPrice - pos.avgCost) / pos.avgCost) * 100;
              return (
                <div key={pos.ticker} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <div>
                    <span className="font-semibold text-[#F2F2F0]">{pos.ticker}</span>
                    <span className="text-xs text-[#9CA3AF] ml-2">{pos.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="tabular-nums text-sm text-[#F2F2F0]">
                      {new Intl.NumberFormat('ca-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(value)}
                    </p>
                    <StatBadge value={returnPct} size="sm" showIcon={false} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent News */}
        <div className="border border-white/5 bg-[#15171C] rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-grotesk text-lg font-semibold text-[#F2F2F0]">{t('recentNews')}</h2>
            <Link
              href={`/${locale}/noticies`}
              className="text-sm text-[#00D9A3] hover:text-[#00D9A3]/80 flex items-center gap-1"
            >
              {t('viewAll')} <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-4">
            {newsArticles.map((article) => (
              <div key={article.id} className="py-3 border-b border-white/5 last:border-0">
                <h3 className="text-sm font-medium text-[#F2F2F0] line-clamp-2 mb-1">{article.title}</h3>
                <div className="flex gap-1">
                  {article.relatedTickers.slice(0, 2).map((ticker) => (
                    <span key={ticker} className="text-xs text-[#3D7FFF] bg-[#3D7FFF]/10 px-1.5 py-0.5 rounded">
                      {ticker}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
