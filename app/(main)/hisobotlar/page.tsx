'use client';

import { useState, useEffect } from 'react';
import { getReportStats, getEventsByType } from '@/lib/supabase/events';
import { useLanguage } from '@/hooks/use-language';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

type Stats = {
  total_events: number;
  total_money: number;
  total_paid: number;
  remaining: number;
};

type PaymentData = {
  name: string;
  value: number;
  color: string;
};

type DailyData = {
  date: string;
  orders: number;
};

const months = [
  'Januar', 'Februar', 'Mart', 'Aprel', 'May', 'Iyun',
  'Iyul', 'Avgust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'
];

export default function HisobotlarPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'monthly' | 'general'>('monthly');
  const [selectedMonth, setSelectedMonth] = useState(2); // March (0-indexed)
  const [selectedYear, setSelectedYear] = useState(2026);
  const [stats, setStats] = useState<Stats>({
    total_events: 0,
    total_money: 0,
    total_paid: 0,
    remaining: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [selectedMonth, selectedYear, activeTab]);

  async function loadData() {
    setLoading(true);
    try {
      const statsData = await getReportStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error loading reports:', error);
    }
    setLoading(false);
  }

  const paymentCollectionRate = stats.total_money > 0 
    ? Math.round((stats.total_paid / stats.total_money) * 100) 
    : 0;

  const averageOrderValue = stats.total_events > 0
    ? Math.round(stats.total_money / stats.total_events)
    : 0;

  const paymentData: PaymentData[] = [
    { name: t('paid') || 'Tolandi', value: stats.total_paid, color: '#10b981' },
    { name: t('remaining') || 'Qoldi', value: Math.max(0, stats.total_money - stats.total_paid), color: '#ef4444' },
  ];

  const dailyData: DailyData[] = [
    { date: 'Mar 1', orders: 5 },
    { date: 'Mar 2', orders: 8 },
    { date: 'Mar 3', orders: 6 },
    { date: 'Mar 4', orders: 12 },
    { date: 'Mar 5', orders: 9 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary text-center">{t('hisobotlar')}</h1>
          <p className="text-center text-muted-foreground mt-2">{t('reports')}</p>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex gap-4">
          <button
            onClick={() => setActiveTab('monthly')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'monthly'
                ? 'bg-primary text-primary-foreground shadow-lg'
                : 'bg-card border border-border text-foreground hover:border-primary/50'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            {t('monthlyAnalysis') || 'Oylik tahlil'}
          </button>
          <button
            onClick={() => setActiveTab('general')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'general'
                ? 'bg-primary text-primary-foreground shadow-lg'
                : 'bg-card border border-border text-foreground hover:border-primary/50'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {t('generalReports') || 'Umumiy hisobotlar'}
          </button>
        </div>

        {activeTab === 'monthly' && (
          <>
            {/* Filters */}
            <div className="bg-card border border-border rounded-xl p-6 mb-8 shadow-lg backdrop-blur-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">{t('month') || 'Oy'}</label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                  >
                    {months.map((month, idx) => (
                      <option key={idx} value={idx}>{month}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">{t('year') || 'Yil'}</label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                  >
                    {[2024, 2025, 2026, 2027].map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-accent animate-spin opacity-75" style={{ mask: 'radial-gradient(farthest-side, transparent calc(100% - 4px), black calc(100% - 4px))' }} />
            </div>
            <p className="text-muted-foreground font-medium">{t('loading')}</p>
          </div>
        ) : (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {/* Total Orders */}
              <div className="bg-card border border-border rounded-xl p-6 shadow-lg backdrop-blur-sm">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-sm font-semibold text-foreground">{t('totalOrders') || 'Jami zakazlar'}</h3>
                  <div className="p-2 rounded-lg bg-blue-500/20">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                </div>
                <p className="text-4xl font-bold text-blue-400 mb-2">{stats.total_events}</p>
                <p className="text-xs text-muted-foreground">O'sha oyda yaratilgan</p>
              </div>

              {/* Used Items */}
              <div className="bg-card border border-border rounded-xl p-6 shadow-lg backdrop-blur-sm">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-sm font-semibold text-foreground">{t('usedItems') || 'Ishlatilgan tovarlar'}</h3>
                  <div className="p-2 rounded-lg bg-purple-500/20">
                    <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10l8-4" />
                    </svg>
                  </div>
                </div>
                <p className="text-4xl font-bold text-purple-400 mb-2">0</p>
                <p className="text-xs text-muted-foreground">Jami miqdor</p>
              </div>

              {/* Total Revenue */}
              <div className="bg-card border border-border rounded-xl p-6 shadow-lg backdrop-blur-sm">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-sm font-semibold text-foreground">{t('totalRevenue') || 'Jami tushum'}</h3>
                  <div className="p-2 rounded-lg bg-green-500/20">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-4xl font-bold text-green-400 mb-2">{(stats.total_money / 1000000).toFixed(1)}M</p>
                <p className="text-xs text-muted-foreground">so'm</p>
              </div>

              {/* Total Debt */}
              <div className="bg-card border border-border rounded-xl p-6 shadow-lg backdrop-blur-sm">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-sm font-semibold text-foreground">{t('totalDebt') || 'Jami qarzdorlik'}</h3>
                  <div className="p-2 rounded-lg bg-red-500/20">
                    <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-4xl font-bold text-red-400 mb-2">{(stats.remaining / 1000000).toFixed(1)}M</p>
                <p className="text-xs text-muted-foreground">so'm</p>
              </div>

              {/* Payment Rate */}
              <div className="bg-card border border-border rounded-xl p-6 shadow-lg backdrop-blur-sm">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-sm font-semibold text-foreground">{t('paymentRate') || "To'lov to'plash darajasi"}</h3>
                  <div className="p-2 rounded-lg bg-cyan-500/20">
                    <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
                <p className="text-4xl font-bold text-cyan-400 mb-2">{paymentCollectionRate.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">To'landilar / To'lanmadi</p>
                <p className="text-xs text-muted-foreground mt-2">{stats.total_paid.toLocaleString()} / {stats.remaining.toLocaleString()}</p>
              </div>

              {/* Average Order Value */}
              <div className="bg-card border border-border rounded-xl p-6 shadow-lg backdrop-blur-sm">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-sm font-semibold text-foreground">{t('avgOrderValue') || "O'rtacha zakaz qiymati"}</h3>
                  <div className="p-2 rounded-lg bg-orange-500/20">
                    <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>
                <p className="text-4xl font-bold text-orange-400 mb-2">{(averageOrderValue / 1000).toFixed(0)}K</p>
                <p className="text-xs text-muted-foreground">so'm</p>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Daily Orders Chart */}
              <div className="bg-card border border-border rounded-xl p-6 shadow-lg backdrop-blur-sm">
                <h3 className="text-lg font-bold text-foreground mb-6">{t('dailyOrders') || 'Kunlik zakazlar'}</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="date" stroke="#cbd5e1" />
                    <YAxis stroke="#cbd5e1" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                      labelStyle={{ color: '#f1f5f9' }}
                    />
                    <Bar dataKey="orders" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Payment Status Chart */}
              <div className="bg-card border border-border rounded-xl p-6 shadow-lg backdrop-blur-sm">
                <h3 className="text-lg font-bold text-foreground mb-6">{t('paymentStatus') || "To'lov holati"}</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={paymentData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value.toLocaleString()}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {paymentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                      labelStyle={{ color: '#f1f5f9' }}
                      formatter={(value: number) => value.toLocaleString()}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {activeTab === 'general' && (
          <div className="text-center py-16 rounded-lg border border-border bg-card/50 backdrop-blur-sm">
            <div className="inline-flex p-4 rounded-full bg-primary/10 mb-4">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-foreground font-semibold">{t('generalReports') || 'Umumiy hisobotlar'}</p>
            <p className="text-muted-foreground text-sm mt-2">Coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
}
