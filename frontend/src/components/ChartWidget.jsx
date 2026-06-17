import React from 'react';
import { PieChart as PieChartIcon } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function ChartWidget({ summary, theme, activePieIndex, setActivePieIndex }) {
  // Premium Monochrome Emerald Scale (Strictly 3 colors rule using shades)
  const CHART_COLORS = ['#10b981', '#059669', '#047857', '#065f46', '#022c22', '#34d399', '#a7f3d0'];

  return (
    <div className="bg-white dark:bg-zinc-900/60 backdrop-blur-md p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 w-full shadow-sm md:col-span-1 flex flex-col justify-between">
      <div className="flex items-center gap-3 mb-2">
        <div className="text-emerald-600 dark:text-emerald-400 p-2 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl"><PieChartIcon size={18} /></div>
        <h4 className="font-bold text-sm text-zinc-800 dark:text-zinc-200">Proporsi Alokasi</h4>
      </div>
      
      <div className="h-52 w-full flex items-center justify-center relative my-1">
        {summary.category_expenses.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={summary.category_expenses} dataKey="total" nameKey="category" cx="50%" cy="50%" innerRadius={50} outerRadius={65} paddingAngle={4} label={({ category }) => `${category}`} labelLine={{ strokeWidth: 1, stroke: theme === 'dark' ? '#27272a' : '#e4e4e7' }} onMouseEnter={(_, index) => setActivePieIndex(index)} onMouseLeave={() => setActivePieIndex(-1)} onClick={(_, index) => setActivePieIndex(activePieIndex === index ? -1 : index)}>
                  {summary.category_expenses.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} className="focus:outline-none" />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center pointer-events-none text-center px-2 max-w-[90px]">
              {activePieIndex !== -1 && summary.category_expenses[activePieIndex] ? (
                <>
                  <p className="text-[10px] font-extrabold text-emerald-500 uppercase truncate max-w-full">{summary.category_expenses[activePieIndex].category}</p>
                  <p className="text-[11px] font-bold text-zinc-700 dark:text-zinc-200 mt-0.5 tracking-tight tabular-nums">Rp {Math.round(summary.category_expenses[activePieIndex].total).toLocaleString('id-ID')}</p>
                </>
              ) : (
                <>
                  <p className="text-[9px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">Burn Rate</p>
                  <p className="text-xl font-extrabold text-zinc-800 dark:text-zinc-100">{summary.burn_rate}%</p>
                </>
              )}
            </div>
          </>
        ) : (
          <p className="text-xs text-zinc-400 italic font-medium">Belum ada data pengeluaran</p>
        )}
      </div>
      <div className="bg-zinc-50 dark:bg-zinc-950 p-3 rounded-xl border border-zinc-100 dark:border-zinc-850 text-center flex flex-col justify-center">
         <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1">Pengeluaran Terbesar</p>
         <p className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 capitalize truncate px-1">{summary.top_category}</p>
      </div>
    </div>
  );
}