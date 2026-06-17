import React from 'react';
import { Download, Trash2 } from 'lucide-react';
import { downloadTransactionsAsCSV } from '../utils/csvExporter';

export default function TransactionList({ searchQuery, setSearchQuery, filterType, setFilterType, filteredTransactions, setSelectedTxDetail, handleDelete, transactions }) {
  return (
    <div className="bg-white dark:bg-zinc-900/60 backdrop-blur-md p-5 md:p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 w-full shadow-sm">
      <div className="flex flex-col sm:flex-row gap-3 w-full mb-4">
        <div className="relative flex-1">
          <input type="text" placeholder="Cari log catatan..." className="px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 text-xs md:text-sm rounded-xl focus:outline-none w-full text-zinc-800 dark:text-zinc-200 font-medium" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex bg-zinc-50 dark:bg-zinc-950 p-1.5 rounded-xl border border-zinc-200 dark:border-zinc-850 text-[10px] md:text-xs font-bold transition-colors">
            <button onClick={() => setFilterType('all')} className={`px-3 py-1.5 rounded-lg ${filterType === 'all' ? 'bg-white dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 shadow-sm border border-zinc-200/50 dark:border-zinc-700' : 'text-zinc-400 dark:text-zinc-500'}`}>ALL</button>
            <button onClick={() => setFilterType('income')} className={`px-3 py-1.5 rounded-lg ${filterType === 'income' ? 'bg-white dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 shadow-sm border border-zinc-200/50 dark:border-zinc-700' : 'text-zinc-400 dark:text-zinc-500'}`}>IN</button>
            <button onClick={() => setFilterType('expense')} className={`px-3 py-1.5 rounded-lg ${filterType === 'expense' ? 'bg-white dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 shadow-sm border border-zinc-200/50 dark:border-zinc-700' : 'text-zinc-400 dark:text-zinc-500'}`}>OUT</button>
          </div>
          <button onClick={() => downloadTransactionsAsCSV(transactions)} className="p-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl text-zinc-600 dark:text-zinc-400 hover:text-emerald-500 hover:border-emerald-200 dark:hover:border-emerald-900/40 active:scale-95 transition-all shadow-sm flex items-center gap-1.5 text-xs font-bold">
            <Download size={15} /> <span className="hidden sm:inline">EXPORT</span>
          </button>
        </div>
      </div>
      
      <div className="space-y-2.5 w-full max-h-64 overflow-y-auto pr-2 custom-scrollbar">
        {filteredTransactions.map((t) => (
          <div key={t.id} onClick={() => setSelectedTxDetail(t)} className="flex justify-between items-center p-4 bg-zinc-50/50 dark:bg-zinc-950/40 hover:bg-zinc-100/50 dark:hover:bg-zinc-900/60 rounded-xl border border-zinc-100/80 dark:border-zinc-900 w-full gap-3 cursor-pointer transition-colors group">
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-zinc-800 dark:text-zinc-200 truncate group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">{t.description || t.category}</p>
              <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium mt-1 truncate">{t.date} • <span className="text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-wider">{t.category}</span></p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              {/* Pro-Figma tabular-nums diterapkan di sini */}
              <span className={`font-mono font-extrabold text-sm tabular-nums ${t.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-500 dark:text-zinc-400'}`}>
                {t.type === 'income' ? '+' : '-'} Rp {parseFloat(t.amount).toLocaleString('id-ID')}
              </span>
              <button onClick={(e) => handleDelete(t.id, e)} className="text-zinc-400 hover:text-rose-500 p-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        {filteredTransactions.length === 0 && (
          <p className="text-xs text-zinc-400 dark:text-zinc-500 italic text-center py-4 font-medium">Belum ada riwayat transaksi</p>
        )}
      </div>
    </div>
  );
}