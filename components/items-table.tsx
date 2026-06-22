'use client';

interface Item {
  id: string;
  name: string;
  category: string;
  totalUsed: number;
  eventCount: number;
  lastUsed: string;
  condition: 'good' | 'fair' | 'needsRepair';
}

interface ItemsTableProps {
  items: Item[];
  loading?: boolean;
}

const conditionLabels = {
  good: { label: 'Yaxshi', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-500/10' },
  fair: { label: "O'rtacha", color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-500/10' },
  needsRepair: { label: 'Ta\'mirlash kerak', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-500/10' },
};

export function ItemsTable({ items, loading }: ItemsTableProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-flex p-3 rounded-full bg-primary/10 mb-3">
            <svg className="w-6 h-6 text-primary animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <p className="text-muted-foreground">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-12 rounded-lg border border-border bg-card/50">
        <svg className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <p className="text-foreground font-semibold">Tovarlar yo'q</p>
        <p className="text-sm text-muted-foreground mt-1">Birinchi tovarni qo'shish uchun tugmasini bosing</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 font-semibold text-foreground text-sm">Tovar nomi</th>
            <th className="text-left py-3 px-4 font-semibold text-foreground text-sm">Kategoriya</th>
            <th className="text-left py-3 px-4 font-semibold text-foreground text-sm">Jami ishlatilgan</th>
            <th className="text-left py-3 px-4 font-semibold text-foreground text-sm">Jadvallar</th>
            <th className="text-left py-3 px-4 font-semibold text-foreground text-sm">Holat</th>
            <th className="text-left py-3 px-4 font-semibold text-foreground text-sm">Oxirgi foydalanish</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {items.map((item) => {
            const conditionConfig = conditionLabels[item.condition];
            return (
              <tr key={item.id} className="hover:bg-background/50 transition-colors">
                <td className="py-3 px-4 text-foreground font-medium">{item.name}</td>
                <td className="py-3 px-4 text-muted-foreground text-sm">{item.category}</td>
                <td className="py-3 px-4">
                  <span className="px-2.5 py-1 rounded bg-primary/10 text-primary text-sm font-semibold">
                    {item.totalUsed}
                  </span>
                </td>
                <td className="py-3 px-4 text-muted-foreground text-sm">{item.eventCount} ta'dbir</td>
                <td className="py-3 px-4">
                  <span className={`px-2.5 py-1 rounded text-xs font-semibold ${conditionConfig.color} ${conditionConfig.bg}`}>
                    {conditionConfig.label}
                  </span>
                </td>
                <td className="py-3 px-4 text-muted-foreground text-sm">{item.lastUsed}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
