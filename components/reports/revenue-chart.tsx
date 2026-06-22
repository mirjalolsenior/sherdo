'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

interface RevenueChartProps {
  data: Array<{ month: string; revenue: number }>;
  loading?: boolean;
  title?: string;
}

export function RevenueChart({ data, loading, title = 'Oylik daromad' }: RevenueChartProps) {
  if (loading) {
    return (
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <Skeleton className="h-6 w-32 mb-4" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="month" stroke="var(--muted-foreground)" style={{ fontSize: '12px' }} />
          <YAxis stroke="var(--muted-foreground)" style={{ fontSize: '12px' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--background)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              color: 'var(--foreground)',
            }}
            formatter={(value) => (typeof value === 'number' ? (value / 1000000).toFixed(1) + 'M' : value)}
          />
          <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} isAnimationActive={true} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
