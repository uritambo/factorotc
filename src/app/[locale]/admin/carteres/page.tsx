import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { PieChart, ChevronRight } from 'lucide-react';

async function getPortfolios() {
  try {
    return await prisma.user.findMany({
      where: { role: 'USER' },
      select: {
        id: true,
        name: true,
        email: true,
        portfolio: { select: { positions: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  } catch {
    return [];
  }
}

export default async function CarteresAdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('admin');
  const users = await getPortfolios();

  const rows = users.map((user) => {
    const positions = user.portfolio?.positions ?? [];
    const costValue = positions.reduce((sum, p) => sum + p.quantity * p.avgBuyPrice, 0);
    return { user, positionCount: positions.length, costValue };
  });

  const formatEur = (value: number) =>
    new Intl.NumberFormat('ca-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(value);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-grotesk text-3xl font-bold text-[#F2F2F0]">{t('portfolios')}</h1>
        <p className="text-[#9CA3AF] mt-1">
          Selecciona un usuari per introduir o editar les posicions de la seva cartera
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        <div className="border border-white/5 bg-[#15171C] rounded-xl p-5">
          <p className="text-sm text-[#9CA3AF] mb-2">Usuaris amb cartera</p>
          <p className="font-grotesk text-2xl font-bold text-[#F2F2F0] tabular-nums">
            {rows.filter((r) => r.positionCount > 0).length}
          </p>
        </div>
        <div className="border border-white/5 bg-[#15171C] rounded-xl p-5">
          <p className="text-sm text-[#9CA3AF] mb-2">Posicions totals</p>
          <p className="font-grotesk text-2xl font-bold text-[#F2F2F0] tabular-nums">
            {rows.reduce((sum, r) => sum + r.positionCount, 0)}
          </p>
        </div>
        <div className="border border-white/5 bg-[#15171C] rounded-xl p-5">
          <p className="text-sm text-[#9CA3AF] mb-2">Capital invertit (cost)</p>
          <p className="font-grotesk text-2xl font-bold text-[#F2F2F0] tabular-nums">
            {formatEur(rows.reduce((sum, r) => sum + r.costValue, 0))}
          </p>
        </div>
      </div>

      <div className="border border-white/5 bg-[#15171C] rounded-xl overflow-hidden">
        {rows.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-[#9CA3AF]">
            No hi ha usuaris (o la base de dades no està disponible)
          </p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-xs font-medium text-[#9CA3AF] px-6 py-4">Usuari</th>
                <th className="text-left text-xs font-medium text-[#9CA3AF] px-6 py-4">Posicions</th>
                <th className="text-left text-xs font-medium text-[#9CA3AF] px-6 py-4">Capital invertit</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ user, positionCount, costValue }) => (
                <tr key={user.id} className="border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors">
                  <td className="px-6 py-4">
                    <Link href={`/${locale}/admin/carteres/${user.id}`} className="flex items-center gap-3 group">
                      <div className="w-8 h-8 rounded-full bg-[#00D9A3]/10 flex items-center justify-center">
                        <PieChart size={14} className="text-[#00D9A3]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#F2F2F0] group-hover:text-[#00D9A3] transition-colors">
                          {user.name ?? user.email}
                        </p>
                        <p className="text-xs text-[#9CA3AF]">{user.email}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm tabular-nums text-[#F2F2F0]">{positionCount}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold tabular-nums text-[#F2F2F0]">{formatEur(costValue)}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/${locale}/admin/carteres/${user.id}`}
                      className="inline-flex items-center gap-1 text-sm text-[#00D9A3] hover:text-[#00D9A3]/80 transition-colors"
                    >
                      Editar cartera <ChevronRight size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
