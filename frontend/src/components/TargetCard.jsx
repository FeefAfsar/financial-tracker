import React from 'react';
import { Target } from 'lucide-react';

export default function TargetCard({ savingTarget, targetProgress, prediction, setIsTargetModalOpen }) {
  return (
    <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-slate-200 dark:border-slate-800 w-full shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div className="text-purple-600 dark:text-purple-400 p-2 bg-purple-50 dark:bg-purple-950/50 rounded-xl"><Target size={18} /></div>
          <h4 className="font-bold text-sm md:text-base text-slate-800 dark:text-slate-200">Target Akumulasi</h4>
        </div>
        <button onClick={() => setIsTargetModalOpen(true)} className="px-3 py-1.5 bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 font-mono text-[10px] font-bold rounded-lg border border-purple-200 dark:border-purple-500/30">CONFIG</button>
      </div>
      <div className="bg-slate-50 dark:bg-slate-950/50 p-4 rounded-xl border border-slate-100 border-slate-200 w-full">
        <div className="flex justify-between mb-3 gap-2">
          <p className="text-xs md:text-sm font-black text-slate-800 dark:text-slate-100 truncate">{savingTarget.name}</p>
          <p className="text-xs md:text-sm font-bold text-purple-600 dark:text-purple-400 shrink-0">Rp {savingTarget.price.toLocaleString('id-ID')}</p>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-900 rounded-full h-3 border border-slate-300 dark:border-slate-800 overflow-hidden">
          <div className="bg-gradient-to-r from-cyan-500 to-purple-500 h-full rounded-full" style={{ width: `${targetProgress}%` }}></div>
        </div>
        <div className="mt-3 flex justify-between items-center text-[10px] font-mono border-t border-slate-200/50 dark:border-slate-800/60 pt-2.5">
          <span className="text-slate-400 font-bold">ESTIMASI TIMELINE ACCUMULATION:</span>
          <span className="text-purple-600 dark:text-purple-400 font-black tracking-wider uppercase bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 rounded">{prediction.targetDays}</span>
        </div>
      </div>
    </div>
  );
}