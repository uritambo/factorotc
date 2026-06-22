'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { PortfolioHistoryPoint } from '@/lib/mockData';

interface PortfolioChartProps {
  data: PortfolioHistoryPoint[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#15171C] border border-white/10 rounded-lg p-3 shadow-xl">
        <p className="text-xs text-[#9CA3AF] mb-1">{label}</p>
        <p className="text-[#00D9A3] font-semibold tabular-nums">
          {new Intl.NumberFormat('ca-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

export function PortfolioChart({ data }: PortfolioChartProps) {
  const isPositive = data.length > 1 && data[data.length - 1].value >= data[0].value;
  const color = isPositive ? '#00D9A3' : '#FF5C5C';

  const formattedData = data.map((d) => ({
    ...d,
    date: new Date(d.date).toLocaleDateString('ca-ES', { month: 'short', day: 'numeric' }),
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={formattedData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.15} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis
          dataKey="date"
          tick={{ fill: '#9CA3AF', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          interval={4}
        />
        <YAxis
          tick={{ fill: '#9CA3AF', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${(v / 1000).toFixed(0)}k€`}
          width={55}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          fill="url(#colorValue)"
          dot={false}
          activeDot={{ r: 4, fill: color, stroke: '#0A0B0D', strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
