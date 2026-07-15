'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { StatBadge } from '@/components/ui/StatBadge';

// Camps mínims que necessita la targeta — vàlid tant per a dades reals (lib/portfolio)
// com per a dades simulades (lib/mockData)
interface PositionCardData {
  ticker: string;
  name: string;
  quantity: number;
  avgCost: number;
  currentPrice: number;
  currency: string;
}

interface PositionCardProps {
  position: PositionCardData;
}

export function PositionCard({ position }: PositionCardProps) {
  const params = useParams();
  const locale = params?.locale as string || 'ca';

  const value = position.quantity * position.currentPrice;
  const cost = position.quantity * position.avgCost;
  const returnValue = value - cost;
  const returnPct = ((value - cost) / cost) * 100;

  return (
    <Link
      href={`/${locale}/cartera/${position.ticker}`}
      className="block border border-white/5 bg-[#15171C] rounded-lg p-4 hover:border-white/10 hover:bg-[#1A1D24] transition-all group"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-grotesk font-bold text-[#F2F2F0] text-lg">{position.ticker}</span>
            <span className="text-xs text-[#9CA3AF] bg-white/5 px-2 py-0.5 rounded-md">{position.currency}</span>
          </div>
          <p className="text-sm text-[#9CA3AF] mt-0.5">{position.name}</p>
        </div>
        <ChevronRight
          size={16}
          className="text-[#9CA3AF] group-hover:text-[#F2F2F0] transition-colors mt-1"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-xs text-[#9CA3AF] mb-1">Valor actual</p>
          <p className="tabular-nums font-semibold text-[#F2F2F0]">
            {new Intl.NumberFormat('ca-ES', {
              style: 'currency',
              currency: position.currency,
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(value)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-[#9CA3AF] mb-1">Rendiment</p>
          <StatBadge value={returnPct} size="sm" />
        </div>
        <div>
          <p className="text-xs text-[#9CA3AF] mb-1">Preu actual</p>
          <p className="tabular-nums text-sm text-[#F2F2F0]">
            {new Intl.NumberFormat('ca-ES', {
              style: 'currency',
              currency: position.currency,
              minimumFractionDigits: 2,
            }).format(position.currentPrice)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-[#9CA3AF] mb-1">Quantitat</p>
          <p className="tabular-nums text-sm text-[#F2F2F0]">{position.quantity}</p>
        </div>
      </div>
    </Link>
  );
}
