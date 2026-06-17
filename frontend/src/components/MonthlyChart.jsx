// src/components/MonthlyChart.jsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

export default function MonthlyChart({ transactions }) {
  // Fungsi mengelompokkan data berdasarkan Bulan & Tahun
  const prepareChartData = () => {
    const monthlyMap = {};

    // Proses data dari transaksi terbalik (urutkan kronologis dari lama ke baru khusus untuk chart)
    [...transactions].reverse().forEach(t => {
      if (!t.date) return;
      const dateObj = new Date(t.date);
      // Ambil format "Jan 2026", "Feb 2026", dst.
      const monthLabel = dateObj.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });

      if (!monthlyMap[monthLabel]) {
        monthlyMap[monthLabel] = { name: monthLabel, Pemasukan: 0, Pengeluaran: 0 };
      }

      if (t.type === 'income') {
        monthlyMap[monthLabel].Pemasukan += parseFloat(t.amount);
      } else if (t.type === 'expense') {
        monthlyMap[monthLabel].Pengeluaran += parseFloat(t.amount);
      }
    });

    return Object.values(monthlyMap);
  };

  const chartData = prepareChartData();

  return (
    <div className="bg-white dark:bg-zinc-900/60 backdrop-blur-md p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm md:col-span-3 hover:shadow-md fluid-bounce animate-dashboard-load">
      <div className="flex items-center gap-3 mb-6">
        <div className="text-emerald-600 dark:text-emerald-400 p-2 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl">
          <TrendingUp size={18} />
        </div>
        <div>
          <h4 className="font-bold text-sm text-zinc-800 dark:text-zinc-200">Tren Cashflow Bulanan</h4>
          <p className="text-[11px] text-zinc-400 dark:text-zinc-500">Perbandingan total inflow dan outflow stream</p>
        </div>
      </div>

      <div className="h-64 w-full text-xs font-medium">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(113, 113, 122, 0.1)" vertical={false} />
              <XAxis dataKey="name" stroke="#71717a" tickLine={false} axisLine={false} />
              <YAxis stroke="#71717a" tickLine={false} axisLine={false} tickFormatter={(value) => `Rp ${value >= 1000000 ? (value / 1000000).toFixed(1) + 'M' : value.toLocaleString('id-ID')}`} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(9, 9, 11, 0.95)', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.2)', color: '#fff' }}
                itemStyle={{ color: '#fff' }}
                formatter={(value) => `Rp ${value.toLocaleString('id-ID')}`}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} />
              {/* Warna Hijau Emerald Premium & Gray Muted Zinc */}
              <Bar dataKey="Pemasukan" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
              <Bar dataKey="Pengeluaran" fill="#71717a" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-zinc-400 italic">Belum ada akumulasi data bulanan</div>
        )}
      </div>
    </div>
  );
}