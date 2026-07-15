import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { PositionForm } from '@/components/portfolio/PositionForm';
import { DeletePositionButton } from '@/components/portfolio/DeletePositionButton';
import { ArrowLeft, User } from 'lucide-react';

export default async function AdminCarteraUsuariPage({
  params,
}: {
  params: Promise<{ locale: string; userId: string }>;
}) {
  const { locale, userId } = await params;

  const user = await prisma.user
    .findUnique({
      where: { id: userId },
      include: { portfolio: { include: { positions: { orderBy: { createdAt: 'asc' } } } } },
    })
    .catch(() => null);

  if (!user) notFound();

  const positions = user.portfolio?.positions ?? [];
  const formatEur = (value: number) =>
    new Intl.NumberFormat('ca-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 }).format(value);

  return (
    <div className="space-y-8">
      <div>
        <Link
          href={`/${locale}/admin/carteres`}
          className="inline-flex items-center gap-2 text-[#9CA3AF] hover:text-[#F2F2F0] text-sm mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          Tornar a carteres
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#00D9A3]/10 flex items-center justify-center">
            <User size={18} className="text-[#00D9A3]" />
          </div>
          <div>
            <h1 className="font-grotesk text-2xl font-bold text-[#F2F2F0]">{user.name ?? user.email}</h1>
            <p className="text-sm text-[#9CA3AF]">{user.email}</p>
          </div>
        </div>
      </div>

      <PositionForm targetUserId={user.id} />

      <div className="border border-white/5 bg-[#15171C] rounded-xl overflow-hidden">
        {positions.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-[#9CA3AF]">
            Aquest usuari encara no té posicions. Afegeix-ne amb el formulari de dalt.
          </p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-xs font-medium text-[#9CA3AF] px-6 py-4">Ticker</th>
                <th className="text-left text-xs font-medium text-[#9CA3AF] px-6 py-4">Empresa</th>
                <th className="text-right text-xs font-medium text-[#9CA3AF] px-6 py-4">Quantitat</th>
                <th className="text-right text-xs font-medium text-[#9CA3AF] px-6 py-4">Preu de compra</th>
                <th className="text-right text-xs font-medium text-[#9CA3AF] px-6 py-4">Data compra</th>
                <th className="text-right text-xs font-medium text-[#9CA3AF] px-6 py-4">Cost total</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {positions.map((position) => (
                <tr key={position.id} className="border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-grotesk font-bold text-[#F2F2F0]">{position.ticker}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#9CA3AF]">{position.companyName}</td>
                  <td className="px-6 py-4 text-right text-sm tabular-nums text-[#F2F2F0]">{position.quantity}</td>
                  <td className="px-6 py-4 text-right text-sm tabular-nums text-[#F2F2F0]">
                    {formatEur(position.avgBuyPrice)}
                  </td>
                  <td className="px-6 py-4 text-right text-sm tabular-nums text-[#9CA3AF]">
                    {position.purchaseDate ? position.purchaseDate.toLocaleDateString('ca-ES') : '—'}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-semibold tabular-nums text-[#F2F2F0]">
                    {formatEur(position.quantity * position.avgBuyPrice)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <DeletePositionButton positionId={position.id} />
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
