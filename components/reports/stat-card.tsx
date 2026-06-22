'use client';

import { Skeleton } from '@/components/ui/skeleton';

interface StatCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon?: React.ReactNode;
  loading?: boolean;
  variant?: 'primary' | 'success' | 'warning' | 'danger';
}

const variantColors = {
  primary: 'from-blue-500/10 to-blue-600/5 border-blue-200/50',
  success: 'from-green-500/10 to-green-600/5 border-green-200/50',
  warning: 'from-amber-500/10 to-amber-600/5 border-amber-200/50',
  danger: 'from-red-500/10 to-red-600/5 border-red-200/50',
};

export function StatCard({ title, value, subtext, icon, loading, variant = 'primary' }: StatCardProps) {
  if (loading) {
    return (
      <div className="bg-card rounded-xl p-6 border border-border">
        <Skeleton className="h-4 w-20 mb-3" />
        <Skeleton className="h-8 w-32 mb-2" />
        <Skeleton className="h-3 w-24" />
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-br ${variantColors[variant]} border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <p className="text-3xl font-bold text-foreground">{typeof value === 'number' ? value.toLocaleString() : value}</p>
        </div>
        {icon && <div className="text-2xl opacity-50">{icon}</div>}
      </div>
      {subtext && <p className="text-xs text-muted-foreground">{subtext}</p>}
    </div>
  );
}
