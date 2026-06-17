import React, { useState, useEffect } from 'react';
import { Plus, Wallet, ArrowUpRight, ArrowDownRight, X, Trash2, Search, Target, Sparkles, TrendingUp, Sun, Moon, Camera, UploadCloud, Loader2, PieChart as PieChartIcon, Tag, Calendar, Layers } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { createClient } from '@supabase/supabase-js';

// ======================= CONFIGURATION BLOCK =======================
const SUPABASE_URL = 'https://wxietqhqajmgguczcdci.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4aWV0cWhxYWptZ2d1Y3pjZGNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3MDE3MzYsImV4cCI6MjA5NzI3NzczNn0._lKMrJ2aQIaYHU0XJbVt5XbS5AdR4bKxpchCiutAmyc'; 
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
// ===================================================================

function App() {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState({ balance: 0, total_income: 0, total_expense: 0, category_expenses: [], top_category: 'Belum Ada', burn_rate: 0 });
  
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('afif_categories');
    return saved ? JSON.parse(saved) : ['Makanan', 'Kos', 'Kuliah', 'Shopping', 'Lainnya'];
  });
  const [showAddCategoryInput, setShowAddCategoryInput] = useState(false);
  const [customCategoryName, setCustomCategoryName] = useState('');

  const [selectedTxDetail, setSelectedTxDetail] = useState(null);

  const [savingTarget, setSavingTarget] = useState(() => {
    const saved = localStorage.getItem('afif_saving_target');
    return saved ? JSON.parse(saved) : { name: 'Make Over Kamar', price: 2000000 };
  });

  const [theme, setTheme] = useState(() => localStorage.getItem('afif_theme') || 'dark');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTargetModalOpen, setIsTargetModalOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false); 
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  const [formData, setFormData] = useState({ amount: '', type: 'expense', category: 'Makanan', description: '', date: new Date().toISOString().split('T')[0] });
  const [targetFormData, setTargetFormData] = useState({ name: savingTarget.name, price: savingTarget.price });

  useEffect(() => {
    document.title = "Fin-Core Afif's";
    
    const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/svg+xml';
    link.rel = 'shortcut icon';
    link.href = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%2306b6d4" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v12"/><path d="M8 10h8"/></svg>`;
    document.getElementsByTagName('head')[0].appendChild(link);
    
    fetchTransactions();
  }, []);

  useEffect(() => {
    localStorage.setItem('afif_categories', JSON.stringify(categories));
  }, [categories]);

  const fetchTransactions = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.error('Gagal sinkronisasi data cloud:', error.message);
    } else {
      setTransactions(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    calculateSummary(transactions);
  }, [transactions]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem('afif_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('afif_saving_target', JSON.stringify(savingTarget));
  }, [savingTarget]);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  const calculateSummary = (allTransactions) => {
    const totalIncome = allTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const totalExpense = allTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const balance = totalIncome - totalExpense;

    const expenseMap = {};
    allTransactions.filter(t => t.type === 'expense').forEach(t => { 
      expenseMap[t.category] = (expenseMap[t.category] || 0) + parseFloat(t.amount); 
    });
    const categoryExpenses = Object.keys(expenseMap).map(cat => ({ category: cat, total: expenseMap[cat] }));

    let topCategory = 'Belum Ada';
    if (categoryExpenses.length > 0) {
      const maxExpense = Math.max(...categoryExpenses.map(c => c.total));
      const topCatObj = categoryExpenses.find(c => c.total === maxExpense);
      if (topCatObj) topCategory = topCatObj.category;
    }

    const burnRate = totalIncome > 0 ? Math.min(Math.round((totalExpense / totalIncome) * 100), 100) : 0;
    setSummary({ balance, total_income: totalIncome, total_expense: totalExpense, category_expenses: categoryExpenses, top_category: topCategory, burn_rate: burnRate });
  };

  const handleAddCustomCategory = (e) => {
    e.preventDefault();
    if (customCategoryName.trim() && !categories.includes(customCategoryName.trim())) {
      const updatedCats = [...categories, customCategoryName.trim()];
      setCategories(updatedCats);
      setFormData({ ...formData, category: customCategoryName.trim() });
      setCustomCategoryName('');
      setShowAddCategoryInput(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const inputAmount = parseFloat(formData.amount);
    if (formData.type === 'expense' && inputAmount > summary.balance) {
      alert(`⚠️ Finansial Overload! Pengeluaran melebihi sisa saldo inti.`);
      return;
    }

    const newTransaction = {
      amount: inputAmount,
      type: formData.type,
      category: formData.category,
      description: formData.description,
      date: formData.date
    };

    const { data, error } = await supabase
      .from('transactions')
      .insert([newTransaction])
      .select();

    if (error) {
      alert(`Gagal push ke database cloud: ${error.message}`);
    } else if (data) {
      setTransactions([data[0], ...transactions]);
      setIsModalOpen(false);
      setFormData({ ...formData, amount: '', description: '' }); 
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm("Hapus log transaksi ini dari database cloud?")) {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) {
        alert(`Gagal menghapus log cloud: ${error.message}`);
      } else {
        setTransactions(transactions.filter(t => t.id !== id));
        if (selectedTxDetail?.id === id) setSelectedTxDetail(null);
      }
    }
  };

  const handleTargetSubmit = (e) => {
    e.preventDefault();
    setSavingTarget({ name: targetFormData.name, price: parseFloat(targetFormData.price) });
    setIsTargetModalOpen(false);
  };

  const handleScanReceipt = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsScanning(true);
    setTimeout(() => {
      setFormData({
        ...formData,
        amount: '45000',
        type: 'expense',
        category: 'Makanan',
        description: 'Makan Nasi Padang (Hasil Scan QRIS)',
        date: new Date().toISOString().split('T')[0]
      });
      setIsScanning(false);
    }, 2000);
  };

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = (t.description || t.category).toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch && (filterType === 'all' || t.type === filterType);
  });

  const targetProgress = Math.min(Math.round((summary.balance / savingTarget.price) * 100), 100);
  const CHART_COLORS = ['#06b6d4', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#3b82f6', '#f43f5e'];

  const animationStyles = `
    @keyframes overlayShow { from { opacity: 0; backdrop-filter: blur(0px); } to { opacity: 1; backdrop-filter: blur(4px); } }
    @keyframes contentShow { from { opacity: 0; transform: scale(0.95) translateY(15px); } to { opacity: 1; transform: scale(1) translateY(0); } }
    .anim-overlay { animation: overlayShow 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .anim-content { animation: contentShow 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
  `;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 pb-28 md:p-8 font-sans transition-colors duration-300 relative w-full max-w-[100vw] overflow-x-hidden">
      <style>{animationStyles}</style>
      <div className="absolute top-0 left-0 w-full h-96 bg-purple-600/5 dark:bg-purple-600/10 rounded-full blur-3xl pointer-events-none transition-colors"></div>

      {/* HEADER */}
      <header className="max-w-6xl mx-auto mb-8 flex flex-col items-center text-center sm:flex-row sm:text-left sm:items-center sm:justify-between gap-4 relative z-10 w-full">
        <div className="flex flex-col items-center sm:items-start w-full">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl text-white shadow-lg shadow-cyan-500/20">
              <Sparkles size={20} />
            </span>
            <h1 className="text-2xl md:text-3xl font-black tracking-wider bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 dark:from-cyan-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent uppercase">
              Afif Fin-Core
            </h1>
          </div>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 tracking-widest mt-1 uppercase font-mono font-medium">Predictive Finance</p>
        </div>

        <button onClick={toggleTheme} className="p-3 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors shrink-0 shadow-sm">
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </header>

      {/* SINKRONISASI LOADING STATUS */}
      {isLoading ? (
        <div className="max-w-6xl mx-auto flex flex-col items-center justify-center py-24 text-slate-400 font-mono text-sm gap-3">
          <Loader2 className="animate-spin text-cyan-500" size={32} />
          <span>CONNECTING TO FIN-CORE CLABASE...</span>
        </div>
      ) : (
        <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5 relative z-10 w-full">
          {/* TOP CARDS */}
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
          </div>

          {/* CHART WIDGET */}
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
                      <Pie 
                        data={summary.category_expenses} 
                        dataKey="total" 
                        nameKey="category" 
                        cx="50%" 
                        cy="50%" 
                        innerRadius={50} 
                        outerRadius={65} 
                        paddingAngle={4}
                        label={({ category }) => `${category}`} 
                        labelLine={{ strokeWidth: 1, stroke: theme === 'dark' ? '#475569' : '#cbd5e1' }} 
                      >
                        {summary.category_expenses.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: theme === 'dark' ? '#0f172a' : '#fff', borderRadius: '12px', border: '1px solid rgba(147, 51, 234, 0.2)' }} 
                        formatter={(value) => `Rp ${value.toLocaleString('id-ID')}`} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute flex flex-col items-center pointer-events-none">
                    <p className="text-[9px] text-slate-400 font-bold uppercase font-mono tracking-wider">Burn Rate</p>
                    <p className="text-xl font-black text-slate-800 dark:text-white">{summary.burn_rate}%</p>
                  </div>
                </>
              ) : (
                <p className="text-xs text-slate-400 italic font-mono">Belum ada data pengeluaran</p>
              )}
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-950/50 p-3 rounded-xl border border-slate-100 dark:border-slate-850 text-center flex flex-col justify-center">
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono mb-1">Pengeluaran Terbesar</p>
               <p className="text-sm font-black text-cyan-600 dark:text-cyan-400 capitalize truncate px-1">{summary.top_category}</p>
            </div>
          </div>

          {/* TARGET & LOGS */}
          <div className="md:col-span-2 grid grid-cols-1 gap-5">
            <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-slate-200 dark:border-slate-800 w-full shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-purple-600 dark:text-purple-400 p-2 bg-purple-50 dark:bg-purple-950/50 rounded-xl"><Target size={18} /></div>
                  <h4 className="font-bold text-sm md:text-base text-slate-800 dark:text-slate-200">Target Akumulasi</h4>
                </div>
                <button onClick={() => setIsTargetModalOpen(true)} className="px-3 py-1.5 bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 font-mono text-[10px] font-bold rounded-lg border border-purple-200 dark:border-purple-500/30">
                  CONFIG
                </button>
              </div>
              <div className="bg-slate-50 dark:bg-slate-950/50 p-4 rounded-xl border border-slate-100 dark:border-slate-850 w-full">
                <div className="flex justify-between mb-3 gap-2">
                  <p className="text-xs md:text-sm font-black text-slate-800 dark:text-slate-100 truncate">{savingTarget.name}</p>
                  <p className="text-xs md:text-sm font-bold text-purple-600 dark:text-purple-400 shrink-0">Rp {savingTarget.price.toLocaleString('id-ID')}</p>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-900 rounded-full h-3 border border-slate-300 dark:border-slate-800 overflow-hidden">
                  <div className="bg-gradient-to-r from-cyan-500 to-purple-500 h-full rounded-full" style={{ width: `${targetProgress}%` }}></div>
                </div>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md p-5 md:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 w-full shadow-lg">
              <div className="flex flex-col sm:flex-row gap-3 w-full mb-4">
                <input type="text" placeholder="Cari log catatan..." className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs md:text-sm rounded-xl focus:outline-none w-full font-mono text-slate-800 dark:text-slate-300" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                <div className="flex bg-slate-50 dark:bg-slate-950 p-1.5 rounded-xl border border-slate-200 dark:border-slate-850 text-[10px] md:text-xs font-mono font-bold w-full sm:w-auto transition-colors shrink-0">
                  <button onClick={() => setFilterType('all')} className={`px-4 py-2 rounded-lg ${filterType === 'all' ? 'bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 shadow-sm' : 'text-slate-500'}`}>ALL</button>
                  <button onClick={() => setFilterType('income')} className={`px-4 py-2 rounded-lg ${filterType === 'income' ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 shadow-sm' : 'text-slate-500'}`}>IN</button>
                  <button onClick={() => setFilterType('expense')} className={`px-4 py-2 rounded-lg ${filterType === 'expense' ? 'bg-pink-100 dark:bg-pink-950/50 text-pink-700 dark:text-pink-400 shadow-sm' : 'text-slate-500'}`}>OUT</button>
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
          </div>
        </main>
      )}

      {/* FAB */}
      <button onClick={() => setIsModalOpen(true)} className="fixed bottom-6 right-6 bg-gradient-to-r from-cyan-500 to-purple-500 text-white p-4 rounded-full shadow-xl z-50 hover:scale-110 active:scale-95 transition-transform">
        <Plus size={28} />
      </button>

      {/* MODAL INPUT TRANSAKSI */}
      {isModalOpen && (
         <div className="fixed inset-0 bg-slate-900/40 dark:bg-black/80 flex items-center justify-center p-4 z-50 w-full h-full anim-overlay">
           <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-[90vw] sm:max-w-md rounded-2xl p-6 relative shadow-2xl transition-colors anim-content">
              <button onClick={() => { setIsModalOpen(false); setShowAddCategoryInput(false); }} className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"><X size={20} /></button>
              <h3 className="text-base font-mono font-black mb-6 text-slate-800 dark:text-slate-200">Log Fin-Core</h3>
              
              <div className="mb-5 p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-500/30 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Camera className="text-purple-600 dark:text-purple-400" size={16} />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Auto-Fill by AI</span>
                </div>
                <label className="cursor-pointer px-3 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm">
                  {isScanning ? <Loader2 className="animate-spin" size={14} /> : <UploadCloud size={14} />}
                  {isScanning ? 'SCANNING...' : 'UPLOAD QRIS'}
                  <input type="file" accept="image/*" className="hidden" onChange={handleScanReceipt} disabled={isScanning} />
                </label>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-2">Nominal Uang (Rp)</label>
                  <input type="number" required placeholder="Contoh: 50000" className="w-full p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-cyan-600 dark:text-cyan-400 font-bold text-sm" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                   <div>
                     <label className="block font-bold text-slate-500 uppercase mb-2">Arus Data</label>
                     <select className="w-full p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-300 text-sm focus:outline-none" value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                       <option value="expense">OUTFLOW</option><option value="income">INFLOW</option>
                     </select>
                   </div>
                   <div>
                     <label className="block font-bold text-slate-500 uppercase mb-2">Kategori</label>
                     <select className="w-full p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-300 text-sm focus:outline-none" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                       {categories.map(cat => (
                         <option key={cat} value={cat}>{cat}</option>
                       ))}
                     </select>
                     
                     {/* 📱 TOMBOL BARU: Jauh lebih tebal, empuk, berukuran balok pas, dan aman dari salah klik jempol di HP */}
                     <button type="button" onClick={() => setShowAddCategoryInput(!showAddCategoryInput)} className={`w-full mt-2 p-3 rounded-xl border font-black text-[11px] text-center tracking-wider transition-all block active:scale-95 ${showAddCategoryInput ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/30 text-rose-600 dark:text-rose-400' : 'bg-cyan-50/50 dark:bg-cyan-950/20 border-dashed border-cyan-200 dark:border-cyan-800/40 text-cyan-600 dark:text-cyan-400'}`}>
                       {showAddCategoryInput ? '✕ BATAL KATEGORI' : '+ TAMBAH KATEGORI'}
                     </button>
                   </div>
                </div>

                {/* Input kategori baru */}
                {showAddCategoryInput && (
                  <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-850 flex gap-2 animate-content">
                    <input type="text" placeholder="Nama kategori baru..." className="w-full p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none" value={customCategoryName} onChange={(e) => setCustomCategoryName(e.target.value)} />
                    <button type="button" onClick={handleAddCustomCategory} className="px-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold shrink-0 transition-colors">ADD</button>
                  </div>
                )}

                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-2">Deskripsi</label>
                  <input type="text" placeholder="Rincian catatan..." className="w-full p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-300 text-sm" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => { setIsModalOpen(false); setShowAddCategoryInput(false); }} className="w-1/2 p-3 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 rounded-xl font-bold">BATAL</button>
                  <button type="submit" className="w-1/2 p-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold">SIMPAN LOG</button>
                </div>
              </form>
           </div>
         </div>
      )}

      {/* MODAL DETAIL POP-UP */}
      {selectedTxDetail && (
        <div className="fixed inset-0 bg-slate-900/40 dark:bg-black/80 flex items-center justify-center p-4 z-50 w-full h-full anim-overlay" onClick={() => setSelectedTxDetail(null)}>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-sm rounded-2xl p-6 relative shadow-2xl transition-colors anim-content font-mono text-xs" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedTxDetail(null)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"><X size={18} /></button>
            <h3 className="text-sm font-black mb-5 text-slate-500 uppercase tracking-widest">Detail Transaksi</h3>
            
            <div className="space-y-4">
              <div className="bg-slate-50 dark:bg-slate-950/60 p-4 rounded-xl border border-slate-100 dark:border-slate-900 text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Nominal Mutasi</p>
                <p className={`text-2xl font-black ${selectedTxDetail.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-pink-600 dark:text-pink-400'}`}>
                  {selectedTxDetail.type === 'income' ? '+' : '-'} Rp {parseFloat(selectedTxDetail.amount).toLocaleString('id-ID')}
                </p>
              </div>

              <div className="space-y-2.5 px-1">
                <div className="flex justify-between border-b border-slate-100 dark:border-slate-850 pb-2">
                  <span className="text-slate-400 font-bold flex items-center gap-1.5"><Layers size={14} /> Arus Data</span>
                  <span className={`font-black text-[11px] px-2 py-0.5 rounded ${selectedTxDetail.type === 'income' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400' : 'bg-pink-50 text-pink-600 dark:bg-pink-950/40 dark:text-pink-400'}`}>
                    {selectedTxDetail.type === 'income' ? 'INFLOW' : 'OUTFLOW'}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-100 dark:border-slate-850 pb-2">
                  <span className="text-slate-400 font-bold flex items-center gap-1.5"><Tag size={14} /> Kategori</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 capitalize">{selectedTxDetail.category}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 dark:border-slate-850 pb-2">
                  <span className="text-slate-400 font-bold flex items-center gap-1.5"><Calendar size={14} /> Tanggal</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{selectedTxDetail.date}</span>
                </div>
                <div className="pt-1">
                  <span className="text-slate-400 font-bold block mb-1">Rincian Deskripsi:</span>
                  <p className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl text-slate-800 dark:text-slate-300 font-sans text-sm leading-relaxed border border-slate-100 dark:border-slate-900 break-words">
                    {selectedTxDetail.description || <span className="italic text-xs text-slate-400 font-mono">Tidak ada keterangan deskripsi</span>}
                  </p>
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <button onClick={() => setSelectedTxDetail(null)} className="w-2/3 py-2.5 bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-400 rounded-xl font-bold border border-slate-200 dark:border-slate-800 transition-colors">TUTUP</button>
                <button onClick={(e) => handleDelete(selectedTxDetail.id, e)} className="w-1/3 py-2.5 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 rounded-xl font-bold border border-rose-200 dark:border-rose-900/30 hover:bg-rose-100 transition-colors flex items-center justify-center gap-1"><Trash2 size={14} /> HAPUS</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONFIG TARGET IMPIAN */}
      {isTargetModalOpen && (
         <div className="fixed inset-0 bg-slate-900/40 dark:bg-black/80 flex items-center justify-center p-4 z-50 w-full h-full anim-overlay">
           <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-[90vw] sm:max-w-md rounded-2xl p-6 relative shadow-2xl transition-colors anim-content font-mono text-xs">
             <button onClick={() => setIsTargetModalOpen(false)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"><X size={20} /></button>
             <h3 className="text-base font-mono font-black mb-6 text-slate-800 dark:text-slate-200">Config Target</h3>
             <form onSubmit={handleTargetSubmit} className="space-y-4">
                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-2">Nama Target</label>
                  <input type="text" required placeholder="Contoh: Laptop Baru" className="w-full p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-sm focus:outline-none" value={targetFormData.name} onChange={(e) => setTargetFormData({...targetFormData, name: e.target.value})} />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-2">Nilai Target (Rp)</label>
                  <input type="number" required placeholder="Contoh: 15000000" className="w-full p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-purple-600 dark:text-purple-400 font-bold text-sm focus:outline-none" value={targetFormData.price} onChange={(e) => setTargetFormData({...targetFormData, price: e.target.value})} />
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setIsTargetModalOpen(false)} className="w-1/2 p-3 bg-slate-100 dark:bg-slate-950 text-slate-600 border border-slate-200 dark:border-slate-800 rounded-xl font-bold">BATAL</button>
                  <button type="submit" className="w-1/2 p-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold">UPDATE</button>
                </div>
             </form>
           </div>
         </div>
      )}
    </div>
  );
}

export default App;