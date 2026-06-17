import React from 'react';
import { Wallet, TrendingUp } from 'lucide-react';

export default function SummaryCards({ summary, prediction }) {
  return (
    <div className="md:col-span-3 grid grid-cols-1 gap-4 w-full">
      <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg flex items-center justify-between w-full">
        <div className="truncate pr-2">
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest font-mono mb-1">Core Balance</p>
          <h3 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 truncate">
            Rp {summary.balance.toLocaleString('id-ID')}
          </h3>
        </div>
        <div className="bg-cyan-50 dark:bg-cyan-950/60 p-4 rounded-xl border border-cyan-200 dark:border-cyan-500/20 text-cyan-600 dark:text-cyan-400 shrink-0"><Wallet size={28} /></div>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full">
        <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg flex flex-col w-full">
          <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest font-mono mb-2">Inflow Stream</p>
          <h3 className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 truncate">
            Rp {summary.total_income.toLocaleString('id-ID')}
          </h3>
        </div>
        <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg flex flex-col w-full">
          <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest font-mono mb-2">Outflow Burn</p>
          <h3 className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-600 dark:from-pink-400 dark:to-rose-400 truncate">
            Rp {summary.total_expense.toLocaleString('id-ID')}
          </h3>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-transparent border border-cyan-500/20 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs transition-all">
        <div className="flex-1">
          <div className="flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400 font-black tracking-wider uppercase mb-1">
            <TrendingUp size={14} /> Fin-Core Runway Engine
          </div>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-sans">{prediction.statusMessage}</p>
        </div>
        <div className="bg-slate-900/5 dark:bg-white/5 p-3 rounded-xl border border-slate-200 dark:border-white/5 text-center sm:text-right shrink-0 min-w-[120px]">
          <p className="text-[9px] text-slate-400 uppercase font-bold tracking-widest">Sisa Runway</p>
          <p className="text-lg font-black text-cyan-600 dark:text-cyan-400">{prediction.runwayDays}</p>
        </div>
      </div>
    </div>
  );
}