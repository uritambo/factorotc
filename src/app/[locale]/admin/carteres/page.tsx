import { getTranslations } from 'next-intl/server';
import { PieChart, TrendingUp, TrendingDown } from 'lucide-react';
import { getPortfolioData, getTotalPortfolioValue, getTotalReturnPct } from '@/lib/mockData';

const mockUserPortfolios = [
  { userId: '2', userName: 'Joan Garcia', positions: 6, totalValue: 42150, returnPct: 12.5 },
  { userId: '4', userName: 'Pere Martínez', positions: 4, totalValue: 28900, returnPct: -3.2 },
  { userId: '3', userName: 'Maria López', positions: 2, totalValue: 8500, returnPct: 5.8 },
];

export default async function CarteresAdminPage() {
  const t = await getTranslations('admin');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-grotesk text-3xl font-bold text-[#F2F2F0]">{t('portfolios')}</h1>
        <p className="text-[#9CA3AF] mt-1">{t('portfolioList')}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-5 mb-6">
        <div className="border border-white/5 bg-[#15171C] rounded-xl p-5">
          <p className="text-sm text-[#9CA3AF] mb-2">Carteres actives</p>
          <p className="font-grotesk text-2xl font-bold text-[#F2F2F0] tabular-nums">{mockUserPortfolios.length}</p>
        </div>
        <div className="border border-white/5 bg-[#15171C] rounded-xl p-5">
          <p className="text-sm text-[#9CA3AF] mb-2">Valor total gestionat</p>
          <p className="font-grotesk text-2xl font-bold text-[#F2F2F0] tabular-nums">
            {new Intl.NumberFormat('ca-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(
              mockUserPortfolios.reduce((sum, p) => sum + p.totalValue, 0)
            )}
          </p>
        </div>
        <div className="border border-white/5 bg-[#15171C] rounded-xl p-5">
          <p className="text-sm text-[#9CA3AF] mb-2">Rendiment mitjà</p>
          <p className="font-grotesk text-2xl font-bold text-[#00D9A3] tabular-nums">
            +{(mockUserPortfolios.reduce((sum, p) => sum + p.returnPct, 0) / mockUserPortfolios.length).toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="border border-white/5 bg-[#15171C] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left text-xs font-medium text-[#9CA3AF] px-6 py-4">Usuari</th>
              <th className="text-left text-xs font-medium text-[#9CA3AF] px-6 py-4">Posicions</th>
              <th className="text-left text-xs font-medium text-[#9CA3AF] px-6 py-4">Valor total</th>
              <th className="text-left text-xs font-medium text-[#9CA3AF] px-6 py-4">Rendiment</th>
            </tr>
          </thead>
          <tbody>
            {mockUserPortfolios.map((portfolio) => (
              <tr key={portfolio.userId} className="border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#00D9A3]/10 flex items-center justify-center">
                      <PieChart size={14} className="text-[#00D9A3]" />
                    </div>
                    <span className="text-sm font-medium text-[#F2F2F0]">{portfolio.userName}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm tabular-nums text-[#F2F2F0]">{portfolio.positions}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-semibold tabular-nums text-[#F2F2F0]">
                    {new Intl.NumberFormat('ca-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(portfolio.totalValue)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5">
                    {portfolio.returnPct >= 0 ? (
                      <TrendingUp size={14} className="text-[#00D9A3]" />
                    ) : (
                      <TrendingDown size={14} className="text-[#FF5C5C]" />
                    )}
                    <span
                      className="text-sm font-semibold tabular-nums"
                      style={{ color: portfolio.returnPct >= 0 ? '#00D9A3' : '#FF5C5C' }}
                    >
                      {portfolio.returnPct >= 0 ? '+' : ''}{portfolio.returnPct.toFixed(1)}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
