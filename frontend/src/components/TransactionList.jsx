import React from 'react';
import { Search, Download, Trash2 } from 'lucide-react';
import { downloadTransactionsAsCSV } from '../utils/csvExporter';

export default function TransactionList({ searchQuery, setSearchQuery, filterType, setFilterType, filteredTransactions, setSelectedTxDetail, handleDelete, transactions }) {
  return (
    <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md p-5 md:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 w-full shadow-lg">
      <div className="flex flex-col sm:flex-row gap-3 w-full mb-4">
        <div className="relative flex-1">
          <input type="text" placeholder="Cari log catatan..." className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs md:text-sm rounded-xl focus:outline-none w-full font-mono text-slate-800 dark:text-slate-300" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex bg-slate-50 dark:bg-slate-950 p-1.5 rounded-xl border border-slate-200 border-slate-200 text-[10px] md:text-xs font-mono font-bold transition-colors">
            <button onClick={() => setFilterType('all')} className={`px-3 py-1.5 rounded-lg ${filterType === 'all' ? 'bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 shadow-sm' : 'text-slate-500'}`}>ALL</button>
            <button onClick={() => setFilterType('income')} className={`px-3 py-1.5 rounded-lg ${filterType === 'income' ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 shadow-sm' : 'text-slate-500'}`}>IN</button>
            <button onClick={() => setFilterType('expense')} className={`px-3 py-1.5 rounded-lg ${filterType === 'expense' ? 'bg-pink-100 dark:bg-pink-950/50 text-pink-700 dark:text-pink-400 shadow-sm' : 'text-slate-500'}`}>OUT</button>
          </div>
          <button onClick={() => downloadTransactionsAsCSV(transactions)} title="Download data untuk Python Analytics (.csv)" className="p-2.5 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-200 rounded-xl text-slate-600 dark:text-slate-400 hover:text-cyan-500 dark:hover:text-cyan-400 hover:border-cyan-200 dark:hover:border-cyan-900/50 active:scale-95 transition-all shadow-sm flex items-center gap-1.5 font-mono text-xs font-bold">
            <Download size={15} /> <span className="hidden sm:inline">EXPORT</span>
          </button>
        </div>
      </div>
      
      <div className="space-y-3 w-full max-h-64 overflow-y-auto pr-2 custom-scrollbar">
        {filteredTransactions.map((t) => (
          <div key={t.id} onClick={() => setSelectedTxDetail(t)} className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-950/40 hover:bg-slate-100 dark:hover:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-900 w-full gap-3 cursor-pointer transition-colors group">
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-slate-800 dark:text-slate-200 truncate group-hover:text-cyan-500 transition-colors">{t.description || t.category}</p>
              <p className="text-[10px] text-slate-500 font-mono mt-1 truncate">{t.date} • <span className="text-purple-500 dark:text-purple-400 font-bold uppercase">{t.category}</span></p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className={`font-mono font-black text-sm ${t.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-pink-600 dark:text-pink-400'}`}>
                {t.type === 'income' ? '+' : '-'} Rp {parseFloat(t.amount).toLocaleString('id-ID')}
              </span>
              <button onClick={(e) => handleDelete(t.id, e)} className="text-slate-400 hover:text-rose-500 p-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        {filteredTransactions.length === 0 && (
          <p className="text-xs text-slate-500 italic text-center py-4 font-mono">Belum ada riwayat transaksi</p>
        )}
      </div>
    </div>
  );
}