'use client';

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatBadgeProps {
  value: number;
  suffix?: string;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function StatBadge({ value, suffix = '%', showIcon = true, size = 'md' }: StatBadgeProps) {
  const isPositive = value > 0;
  const isNegative = value < 0;
  const isNeutral = value === 0;

  const colorClass = isPositive
    ? 'text-[#00D9A3]'
    : isNegative
    ? 'text-[#FF5C5C]'
    : 'text-[#9CA3AF]';

  const bgClass = isPositive
    ? 'bg-[#00D9A3]/10'
    : isNegative
    ? 'bg-[#FF5C5C]/10'
    : 'bg-white/5';

  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : size === 'lg' ? 'text-base px-3 py-1.5' : 'text-sm px-2.5 py-1';
  const iconSize = size === 'sm' ? 12 : size === 'lg' ? 18 : 14;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md font-medium tabular-nums ${colorClass} ${bgClass} ${sizeClass}`}
    >
      {showIcon && (
        <>
          {isPositive && <TrendingUp size={iconSize} />}
          {isNegative && <TrendingDown size={iconSize} />}
          {isNeutral && <Minus size={iconSize} />}
        </>
      )}
      {isPositive ? '+' : ''}
      {value.toFixed(2)}
      {suffix}
    </span>
  );
}
