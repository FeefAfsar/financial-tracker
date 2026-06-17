import React from 'react';
import { Target } from 'lucide-react';

export default function TargetCard({ savingTarget, targetProgress, prediction, setIsTargetModalOpen }) {
  return (
    <div className="bg-white dark:bg-zinc-900/60 backdrop-blur-md p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 w-full shadow-sm hover:-translate-y-1 hover:shadow-md fluid-bounce animate-dashboard-load delay-card-3">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div className="text-emerald-600 dark:text-emerald-400 p-2 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl"><Target size={18} /></div>
          <h4 className="font-bold text-sm md:text-base text-zinc-800 dark:text-zinc-200">Target Akumulasi</h4>
        </div>
        <button onClick={() => setIsTargetModalOpen(true)} className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-bold text-[10px] rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-750 fluid-bounce click-feedback shadow-sm">CONFIG</button>
      </div>
      <div className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-xl border border-zinc-100 dark:border-zinc-850 w-full">
        <div className="flex justify-between mb-3 gap-2">
          <p className="text-xs md:text-sm font-bold text-zinc-800 dark:text-zinc-100 truncate">{savingTarget.name}</p>
          <p className="text-xs md:text-sm font-extrabold text-emerald-600 dark:text-emerald-400">Rp {savingTarget.price.toLocaleString('id-ID')}</p>
        </div>
        <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-2.5 overflow-hidden">
          {/* Animasi memanjang dari kiri ke kanan berkat durasi 1000ms */}
          <div className="bg-emerald-500 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${targetProgress}%` }}></div>
        </div>
        <div className="mt-3 flex justify-between items-center text-[10px] border-t border-zinc-200/60 dark:border-zinc-850 pt-2.5">
          <span className="text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">ESTIMASI ACCUMULATION:</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-extrabold tracking-wide uppercase px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 rounded">
            {prediction.targetDays}
          </span>
        </div>
      </div>
    </div>
  );
}