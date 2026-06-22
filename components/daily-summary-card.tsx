'use client';

interface DailySummaryCardProps {
  date: string;
  totalEvents: number;
  totalRevenue: number;
  totalPaid: number;
  totalRemaining: number;
  onClick?: () => void;
}

export function DailySummaryCard({
  date,
  totalEvents,
  totalRevenue,
  totalPaid,
  totalRemaining,
  onClick,
}: DailySummaryCardProps) {
  const collectionRate = totalRevenue > 0 ? (totalPaid / totalRevenue) * 100 : 0;
  const dateObj = new Date(date);
  const dayName = dateObj.toLocaleDateString('uz-UZ', { weekday: 'long', month: 'short', day: 'numeric' });

  return (
    <div
      onClick={onClick}
      className="bg-card border border-border rounded-lg p-4 hover:border-primary hover:shadow-lg transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-semibold text-foreground capitalize">{dayName}</p>
          <p className="text-xs text-muted-foreground">{date}</p>
        </div>
        <div className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
          {totalEvents} ta'dbir
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-background/50 rounded p-2">
          <p className="text-xs text-muted-foreground">Jami tushum</p>
          <p className="text-sm font-bold text-foreground">{(totalRevenue / 1000000).toFixed(1)}M</p>
        </div>
        <div className="bg-background/50 rounded p-2">
          <p className="text-xs text-muted-foreground">To'langan</p>
          <p className="text-sm font-bold text-green-500">{(totalPaid / 1000000).toFixed(1)}M</p>
        </div>
        <div className="bg-background/50 rounded p-2">
          <p className="text-xs text-muted-foreground">Qolgan</p>
          <p className="text-sm font-bold text-orange-500">{(totalRemaining / 1000000).toFixed(1)}M</p>
        </div>
        <div className="bg-background/50 rounded p-2">
          <p className="text-xs text-muted-foreground">To'plash %</p>
          <p className="text-sm font-bold text-cyan-500">{collectionRate.toFixed(0)}%</p>
        </div>
      </div>
    </div>
  );
}
