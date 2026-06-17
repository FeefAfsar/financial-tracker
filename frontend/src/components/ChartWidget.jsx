import React from 'react';
import { PieChart as PieChartIcon } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function ChartWidget({ summary, theme, activePieIndex, setActivePieIndex }) {
  const CHART_COLORS = ['#06b6d4', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#3b82f6', '#f43f5e'];

  return (
    <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-slate-200 dark:border-slate-800 w-full shadow-lg md:col-span-1 flex flex-col justify-between">
      <div className="flex items-center gap-3 mb-2">
        <div className="text-cyan-600 dark:text-cyan-400 p-2 bg-cyan-50 dark:bg-cyan-950/50 rounded-xl"><PieChartIcon size={18} /></div>
        <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">Proporsi Alokasi</h4>
      </div>
      
      <div className="h-52 w-full flex items-center justify-center relative my-1">
        {summary.category_expenses.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={summary.category_expenses} dataKey="total" nameKey="category" cx="50%" cy="50%" innerRadius={50} outerRadius={65} paddingAngle={4} label={({ category }) => `${category}`} labelLine={{ strokeWidth: 1, stroke: theme === 'dark' ? '#475569' : '#cbd5e1' }} onMouseEnter={(_, index) => setActivePieIndex(index)} onMouseLeave={() => setActivePieIndex(-1)} onClick={(_, index) => setActivePieIndex(activePieIndex === index ? -1 : index)}>
                  {summary.category_expenses.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center pointer-events-none text-center px-2 max-w-[90px]">
              {activePieIndex !== -1 && summary.category_expenses[activePieIndex] ? (
                <>
                  <p className="text-[10px] font-black text-cyan-500 dark:text-cyan-400 uppercase truncate max-w-full">{summary.category_expenses[activePieIndex].category}</p>
                  <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mt-0.5 tracking-tight">Rp {Math.round(summary.category_expenses[activePieIndex].total).toLocaleString('id-ID')}</p>
                </>
              ) : (
                <>
                  <p className="text-[9px] text-slate-400 font-bold uppercase font-mono tracking-wider">Burn Rate</p>
                  <p className="text-xl font-black text-slate-800 dark:text-white">{summary.burn_rate}%</p>
                </>
              )}
            </div>
          </>
        ) : (
          <p className="text-xs text-slate-400 italic font-mono">Belum ada data pengeluaran</p>
        )}
      </div>
      <div className="bg-slate-50 dark:bg-slate-950/50 p-3 rounded-xl border border-slate-100 border-slate-200 text-center flex flex-col justify-center">
         <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono mb-1">Pengeluaran Terbesar</p>
         <p className="text-sm font-black text-cyan-600 dark:text-cyan-400 capitalize truncate px-1">{summary.top_category}</p>
      </div>
    </div>
  );
}