'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/use-language';
import { getMonthOverMonthComparison } from '@/lib/supabase/events';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const months = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'];
const monthsEn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

interface MoMData {
  currentMonth: { count: number; revenue: number; paid: number };
  previousMonth: { count: number; revenue: number; paid: number };
  growth: { countGrowth: number; revenueGrowth: number; paidGrowth: number };
}

export default function HisobotlarPage() {
  const { t, language } = useLanguage();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [momData, setMomData] = useState<MoMData | null>(null);
  const [loading, setLoading] = useState(true);
  const [monthlyChart, setMonthlyChart] = useState<Array<{ month: string; revenue: number; paid: number }>>([]);

  useEffect(() => {
    loadData();
  }, [selectedMonth, selectedYear]);

  async function loadData() {
    setLoading(true);
    try {
      const data = await getMonthOverMonthComparison(selectedYear, selectedMonth);
      setMomData(data);

      // Generate chart data for the year
      const chartData = [];
      for (let m = 0; m < 12; m++) {
        const momComp = await getMonthOverMonthComparison(selectedYear, m);
        const monthName = language === 'uz' ? months[m] : monthsEn[m];
        chartData.push({
          month: monthName,
          revenue: momComp.currentMonth.revenue / 1000000,
          paid: momComp.currentMonth.paid / 1000000,
        });
      }
      setMonthlyChart(chartData);
    } catch (error) {
      console.error('[v0] Error loading reports:', error);
    }
    setLoading(false);
  }

  const currentMonth = momData?.currentMonth;
  const previousMonth = momData?.previousMonth;
  const growth = momData?.growth;

  const collectionRate = currentMonth && currentMonth.revenue > 0 ? (currentMonth.paid / currentMonth.revenue) * 100 : 0;
  const previousCollectionRate = previousMonth && previousMonth.revenue > 0 ? (previousMonth.paid / previousMonth.revenue) * 100 : 0;

  const getGrowthColor = (percentage: number) => {
    if (percentage >= 0) return 'text-green-600';
    return 'text-red-600';
  };

  const getGrowthBgColor = (percentage: number) => {
    if (percentage >= 0) return 'bg-green-500/10';
    return 'bg-red-500/10';
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Oyma-oy Hisobot
          </h1>
          <p className="text-muted-foreground">
            Tadbirlar va to&apos;lovlar tahlili
          </p>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Oy
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            >
              {(language === 'uz' ? months : monthsEn).map((month, idx) => (
                <option key={idx} value={idx}>
                  {month}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Yil
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            >
              {[2024, 2025, 2026, 2027].map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-2 text-muted-foreground">
              <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              <span>Yuklanmoqda...</span>
            </div>
          </div>
        ) : (
          <>
            {/* Main KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Orders Card */}
              <div className="bg-gradient-to-br from-blue-500/5 to-blue-500/10 border border-blue-500/20 rounded-2xl p-6 shadow-lg backdrop-blur-sm">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Tadbirlar
                    </p>
                    <p className="text-4xl font-bold text-foreground">{currentMonth?.count || 0}</p>
                  </div>
                  <div className="p-3 bg-blue-500/10 rounded-lg">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-semibold px-3 py-1 rounded-full ${getGrowthBgColor(growth?.countGrowth || 0)} ${getGrowthColor(growth?.countGrowth || 0)}`}>
                    {growth?.countGrowth && growth.countGrowth >= 0 ? '+' : ''}{growth?.countGrowth?.toFixed(1)}%
                  </span>
                  <span className="text-xs text-muted-foreground">
                    O&apos;ttaning
                  </span>
                </div>
              </div>

              {/* Revenue Card */}
              <div className="bg-gradient-to-br from-amber-500/5 to-amber-500/10 border border-amber-500/20 rounded-2xl p-6 shadow-lg backdrop-blur-sm">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Jami Tushum
                    </p>
                    <p className="text-4xl font-bold text-foreground">{(currentMonth?.revenue || 0) / 1000000}M</p>
                  </div>
                  <div className="p-3 bg-amber-500/10 rounded-lg">
                    <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-semibold px-3 py-1 rounded-full ${getGrowthBgColor(growth?.revenueGrowth || 0)} ${getGrowthColor(growth?.revenueGrowth || 0)}`}>
                    {growth?.revenueGrowth && growth.revenueGrowth >= 0 ? '+' : ''}{growth?.revenueGrowth?.toFixed(1)}%
                  </span>
                  <span className="text-xs text-muted-foreground">
                    O&apos;ttaning
                  </span>
                </div>
              </div>

              {/* Collection Rate Card */}
              <div className="bg-gradient-to-br from-green-500/5 to-green-500/10 border border-green-500/20 rounded-2xl p-6 shadow-lg backdrop-blur-sm">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      To&apos;lov To&apos;plash
                    </p>
                    <p className="text-4xl font-bold text-foreground">{collectionRate.toFixed(0)}%</p>
                  </div>
                  <div className="p-3 bg-green-500/10 rounded-lg">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <div className="w-full bg-background rounded-full h-2 overflow-hidden">
                  <div className="bg-green-600 h-full transition-all duration-500" style={{ width: `${collectionRate}%` }} />
                </div>
              </div>
            </div>

            {/* Comparison Table */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-lg mb-8">
              <h2 className="text-xl font-bold text-foreground mb-6">
                Taqqoslash
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold text-foreground">
                        Ko&apos;rsatkich
                      </th>
                      <th className="text-right py-3 px-4 font-semibold text-foreground">
                        Bu oy
                      </th>
                      <th className="text-right py-3 px-4 font-semibold text-foreground">
                        O&apos;tgan oy
                      </th>
                      <th className="text-right py-3 px-4 font-semibold text-foreground">
                        O&apos;zgarish
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border hover:bg-background/50 transition-colors">
                      <td className="py-3 px-4 text-foreground">Tadbirlar</td>
                      <td className="text-right py-3 px-4 text-foreground font-semibold">{currentMonth?.count}</td>
                      <td className="text-right py-3 px-4 text-muted-foreground">{previousMonth?.count}</td>
                      <td className={`text-right py-3 px-4 font-semibold ${getGrowthColor(growth?.countGrowth || 0)}`}>
                        {growth?.countGrowth && growth.countGrowth >= 0 ? '+' : ''}{growth?.countGrowth?.toFixed(1)}%
                      </td>
                    </tr>
                    <tr className="border-b border-border hover:bg-background/50 transition-colors">
                      <td className="py-3 px-4 text-foreground">Tushum</td>
                      <td className="text-right py-3 px-4 text-foreground font-semibold">{(currentMonth?.revenue || 0) / 1000000}M</td>
                      <td className="text-right py-3 px-4 text-muted-foreground">{(previousMonth?.revenue || 0) / 1000000}M</td>
                      <td className={`text-right py-3 px-4 font-semibold ${getGrowthColor(growth?.revenueGrowth || 0)}`}>
                        {growth?.revenueGrowth && growth.revenueGrowth >= 0 ? '+' : ''}{growth?.revenueGrowth?.toFixed(1)}%
                      </td>
                    </tr>
                    <tr className="border-b border-border hover:bg-background/50 transition-colors">
                      <td className="py-3 px-4 text-foreground">To&apos;langan</td>
                      <td className="text-right py-3 px-4 text-foreground font-semibold">{(currentMonth?.paid || 0) / 1000000}M</td>
                      <td className="text-right py-3 px-4 text-muted-foreground">{(previousMonth?.paid || 0) / 1000000}M</td>
                      <td className={`text-right py-3 px-4 font-semibold ${getGrowthColor(growth?.paidGrowth || 0)}`}>
                        {growth?.paidGrowth && growth.paidGrowth >= 0 ? '+' : ''}{growth?.paidGrowth?.toFixed(1)}%
                      </td>
                    </tr>
                    <tr className="hover:bg-background/50 transition-colors">
                      <td className="py-3 px-4 text-foreground">To&apos;plash %</td>
                      <td className="text-right py-3 px-4 text-foreground font-semibold">{collectionRate.toFixed(1)}%</td>
                      <td className="text-right py-3 px-4 text-muted-foreground">{previousCollectionRate.toFixed(1)}%</td>
                      <td className={`text-right py-3 px-4 font-semibold ${getGrowthColor((collectionRate - previousCollectionRate))}`}>
                        {(collectionRate - previousCollectionRate) >= 0 ? '+' : ''}{(collectionRate - previousCollectionRate).toFixed(1)}%
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Trend */}
              <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-foreground mb-4">
                  Yillik Tushum Trendi
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyChart}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="month" tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }} />
                    <YAxis tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--color-card)', border: 'var(--color-border) 1px solid', borderRadius: '8px' }}
                      cursor={{ fill: 'rgba(0,0,0,0.1)' }}
                    />
                    <Legend />
                    <Bar dataKey="revenue" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Collection Trend */}
              <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-foreground mb-4">
                  Yillik To&apos;plash Trendi
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyChart}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="month" tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }} />
                    <YAxis tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--color-card)', border: 'var(--color-border) 1px solid', borderRadius: '8px' }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="paid" 
                      stroke="var(--color-primary)" 
                      strokeWidth={2}
                      dot={{ fill: 'var(--color-primary)', r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
