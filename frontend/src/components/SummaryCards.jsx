import React from 'react';
import { Wallet, TrendingUp } from 'lucide-react';

export default function SummaryCards({ summary, prediction }) {
  return (
    <div className="md:col-span-3 grid grid-cols-1 gap-4 w-full animate-dashboard-load delay-card-1">
      {/* Core Balance Card */}
      <div className="bg-white dark:bg-zinc-900/60 backdrop-blur-md p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between w-full hover:-translate-y-1 hover:border-emerald-500/20 dark:hover:border-emerald-400/20 hover:shadow-md fluid-bounce group">
        <div className="truncate pr-2">
          <p className="text-xs text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider mb-1">Core Balance</p>
          <h3 className="text-3xl md:text-4xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums tracking-tight group-hover:scale-[1.01] transition-transform duration-300 origin-left">
            Rp {summary.balance.toLocaleString('id-ID')}
          </h3>
        </div>
        <div className="bg-emerald-50 dark:bg-emerald-950/40 p-4 rounded-xl text-emerald-600 dark:text-emerald-400 shrink-0 group-hover:rotate-6 transition-transform duration-300"><Wallet size={26} /></div>
      </div>

      {/* Grid In/Out */}
      <div className="grid grid-cols-2 gap-4 w-full">
        <div className="bg-white dark:bg-zinc-900/60 backdrop-blur-md p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col w-full hover:-translate-y-0.5 hover:shadow-md fluid-bounce">
          <p className="text-[10px] md:text-xs text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider mb-1.5">Inflow Stream</p>
          <h3 className="text-xl md:text-2xl font-bold text-zinc-800 dark:text-zinc-200 tabular-nums tracking-tight">
            Rp {summary.total_income.toLocaleString('id-ID')}
          </h3>
        </div>
        <div className="bg-white dark:bg-zinc-900/60 backdrop-blur-md p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col w-full hover:-translate-y-0.5 hover:shadow-md fluid-bounce">
          <p className="text-[10px] md:text-xs text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider mb-1.5">Outflow Burn</p>
          <h3 className="text-xl md:text-2xl font-bold text-zinc-500 dark:text-zinc-400 tabular-nums tracking-tight">
            Rp {summary.total_expense.toLocaleString('id-ID')}
          </h3>
        </div>
      </div>

      {/* Runway Banner */}
      <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-850 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:border-zinc-300 dark:hover:border-zinc-700 fluid-bounce">
        <div className="flex-1">
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold tracking-wide uppercase mb-0.5">
            <TrendingUp size={15} /> Fin-Core Runway Engine
          </div>
          <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">{prediction.statusMessage}</p>
        </div>
        <div className="bg-zinc-100 dark:bg-zinc-950 p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-850 text-center sm:text-right shrink-0 min-w-[110px]">
          <p className="text-[9px] text-zinc-400 uppercase font-bold tracking-wider">Sisa Runway</p>
          <p className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">{prediction.runwayDays}</p>
        </div>
      </div>
    </div>
  );
}