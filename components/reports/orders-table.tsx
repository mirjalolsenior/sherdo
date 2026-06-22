'use client';

import { useState, useMemo } from 'react';
import { Event } from '@/lib/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface OrdersTableProps {
  events: (Event & { paid: number; remaining: number })[];
  loading?: boolean;
}

export function OrdersTable({ events, loading }: OrdersTableProps) {
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const paginatedEvents = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return events.slice(start, start + itemsPerPage);
  }, [events, page]);

  const totalPages = Math.ceil(events.length / itemsPerPage);

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background border-b border-border">
              <tr>
                {Array(9)
                  .fill(0)
                  .map((_, i) => (
                    <th key={i} className="px-4 py-3 text-left">
                      <Skeleton className="h-4 w-16" />
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <tr key={i} className="border-b border-border">
                    {Array(9)
                      .fill(0)
                      .map((_, j) => (
                        <td key={j} className="px-4 py-3">
                          <Skeleton className="h-4 w-20" />
                        </td>
                      ))}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-12 text-center">
        <div className="inline-flex p-3 rounded-full bg-primary/10 mb-3">
          <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-foreground font-semibold">Ma'lumot yo'q</p>
        <p className="text-muted-foreground text-sm mt-1">Hozircha buyurtmalar mavjud emas</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-background border-b border-border">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">ID</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Mijoz</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Telefon</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Turi</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Sana</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Vaqt</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">Narx</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">To'langan</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">Qarzdorlik</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Holati</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedEvents.map((event) => {
              const isPaid = event.paid >= Number(event.total_price);
              const isPartial = event.paid > 0 && event.paid < Number(event.total_price);

              return (
                <tr key={event.id} className="hover:bg-background/50 transition-colors">
                  <td className="px-4 py-3 text-sm font-mono text-muted-foreground">{event.id.slice(0, 8)}...</td>
                  <td className="px-4 py-3 text-sm font-medium text-foreground">{event.client_name}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{event.phone}</td>
                  <td className="px-4 py-3 text-sm">
                    <Badge variant="outline">{event.type}</Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{new Date(event.date).toLocaleDateString('uz-UZ')}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{event.time}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-foreground text-right">{(Number(event.total_price) / 1000000).toFixed(1)}M</td>
                  <td className="px-4 py-3 text-sm font-semibold text-green-600 text-right">{(event.paid / 1000000).toFixed(1)}M</td>
                  <td className="px-4 py-3 text-sm font-semibold text-orange-600 text-right">{(event.remaining / 1000000).toFixed(1)}M</td>
                  <td className="px-4 py-3 text-sm">
                    <Badge variant={isPaid ? 'default' : isPartial ? 'secondary' : 'destructive'}>
                      {isPaid ? 'To\'langan' : isPartial ? 'Qisman' : 'Kutilmoqda'}
                    </Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-background">
          <div className="text-sm text-muted-foreground">
            {(page - 1) * itemsPerPage + 1} - {Math.min(page * itemsPerPage, events.length)} / {events.length}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-3 py-1 text-sm rounded border border-border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-background/50 transition-colors"
            >
              Oldingi
            </button>
            <div className="flex items-center gap-1 px-2">
              <span className="text-sm font-semibold">{page}</span>
              <span className="text-muted-foreground">/</span>
              <span className="text-sm text-muted-foreground">{totalPages}</span>
            </div>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 text-sm rounded border border-border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-background/50 transition-colors"
            >
              Keyingi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
