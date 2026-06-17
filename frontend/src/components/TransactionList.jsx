// src/components/TransactionList.jsx
import React from 'react';
import { Download, Trash2, Calendar } from 'lucide-react';
import { downloadTransactionsAsCSV } from '../utils/csvExporter';

export default function TransactionList({ 
  searchQuery, setSearchQuery, 
  filterType, setFilterType, 
  filteredTransactions, setSelectedTxDetail, 
  handleDelete, transactions,
  dateFilter, setDateFilter // State baru dikirim dari App.jsx
}) {
  return (
    <div className="bg-white dark:bg-zinc-900/60 backdrop-blur-md p-5 md:p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 w-full shadow-sm animate-dashboard-load delay-card-4">
      
      {/* BARIS 1: Search & Filter Arus & Export */}
      <div className="flex flex-col sm:flex-row gap-3 w-full mb-3">
        <div className="relative flex-1">
          <input type="text" placeholder="Cari log catatan..." className="px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 text-xs md:text-sm rounded-xl focus:outline-none w-full text-zinc-800 dark:text-zinc-200 font-medium focus:border-emerald-500/40 dark:focus:border-emerald-400/40 fluid-bounce" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex bg-zinc-50 dark:bg-zinc-950 p-1.5 rounded-xl border border-zinc-200 dark:border-zinc-850 text-[10px] md:text-xs font-bold transition-colors">
            <button onClick={() => setFilterType('all')} className={`px-3 py-1.5 rounded-lg font-bold click-feedback ${filterType === 'all' ? 'bg-white dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 shadow-sm border border-zinc-200/50 dark:border-zinc-700' : 'text-zinc-400 dark:text-zinc-500'}`}>ALL</button>
            <button onClick={() => setFilterType('income')} className={`px-3 py-1.5 rounded-lg font-bold click-feedback ${filterType === 'income' ? 'bg-white dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 shadow-sm border border-zinc-200/50 dark:border-zinc-700' : 'text-zinc-400 dark:text-zinc-500'}`}>IN</button>
            <button onClick={() => setFilterType('expense')} className={`px-3 py-1.5 rounded-lg font-bold click-feedback ${filterType === 'expense' ? 'bg-white dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 shadow-sm border border-zinc-200/50 dark:border-zinc-700' : 'text-zinc-400 dark:text-zinc-500'}`}>OUT</button>
          </div>
          <button onClick={() => downloadTransactionsAsCSV(transactions)} className="p-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl text-zinc-600 dark:text-zinc-400 hover:text-emerald-500 hover:border-emerald-200 dark:hover:border-emerald-900/40 active:scale-95 text-xs font-bold fluid-bounce shadow-sm flex items-center gap-1.5">
            <Download size={15} /> <span className="hidden sm:inline">EXPORT</span>
          </button>
        </div>
      </div>

      {/* 📅 BARIS 2 BARU: Filter Kalender Rentang Tanggal Premium */}
      <div className="flex flex-wrap items-center gap-2 p-3 mb-4 bg-zinc-50 dark:bg-zinc-950/60 rounded-xl border border-zinc-100 dark:border-zinc-900 text-[11px] font-medium text-zinc-500">
        <div className="flex items-center gap-1.5 text-zinc-400 dark:text-zinc-500">
          <Calendar size={13} />
          <span>Filter Periode:</span>
        </div>
        <div className="flex items-center gap-2 flex-1 sm:flex-none">
          <input type="date" className="p-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-700 dark:text-zinc-300 focus:outline-none focus:border-emerald-500/45 text-[10px] w-full" value={dateFilter.startDate} onChange={(e) => setDateFilter({ ...dateFilter, startDate: e.target.value })} />
          <span className="text-zinc-400">s/d</span>
          <input type="date" className="p-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-700 dark:text-zinc-300 focus:outline-none focus:border-emerald-500/45 text-[10px] w-full" value={dateFilter.endDate} onChange={(e) => setDateFilter({ ...dateFilter, endDate: e.target.value })} />
        </div>
        {(dateFilter.startDate || dateFilter.endDate) && (
          <button onClick={() => setDateFilter({ startDate: '', endDate: '' })} className="ml-auto sm:ml-2 text-rose-500 hover:text-rose-400 font-bold tracking-tight active:scale-95 transition-transform">
            Reset Filter
          </button>
        )}
      </div>
      
      {/* LIST TRANSAKSI */}
      <div className="space-y-2.5 w-full max-h-64 overflow-y-auto pr-2 custom-scrollbar">
        {filteredTransactions.map((t) => (
          <div key={t.id} onClick={() => setSelectedTxDetail(t)} className="flex justify-between items-center p-4 bg-zinc-50/50 dark:bg-zinc-950/40 hover:bg-zinc-100/50 dark:hover:bg-zinc-900 rounded-xl border border-zinc-100/80 dark:border-zinc-900 w-full gap-3 cursor-pointer group hover:scale-[1.01] hover:border-emerald-500/20 dark:hover:border-emerald-500/20 hover:shadow-sm fluid-bounce">
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-zinc-800 dark:text-zinc-200 truncate group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors duration-200">{t.description || t.category}</p>
              <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium mt-1 truncate">{t.date} • <span className="text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-wider">{t.category}</span></p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className={`font-mono font-extrabold text-sm tabular-nums group-hover:scale-105 transition-transform duration-300 ${t.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-500 dark:text-zinc-400'}`}>
                {t.type === 'income' ? '+' : '-'} Rp {parseFloat(t.amount).toLocaleString('id-ID')}
              </span>
              <button onClick={(e) => handleDelete(t.id, e)} className="text-zinc-400 hover:text-rose-500 p-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 click-feedback">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        {filteredTransactions.length === 0 && (
          <p className="text-xs text-zinc-400 dark:text-zinc-500 italic text-center py-4 font-medium">Tidak ada riwayat transaksi pada periode ini</p>
        )}
      </div>
    </div>
  );
}