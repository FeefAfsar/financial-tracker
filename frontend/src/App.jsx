// src/App.jsx
import React, { useState, useEffect } from 'react';
import { Plus, Loader2 } from 'lucide-react';

// IMPORT CLIENT DAN SERVICES
import { supabase } from './lib/supabaseClient';
import { scanReceiptWithGemini } from './services/geminiService';

// IMPORT SUB-KOMPONEN UI
import Header from './components/Header';
import SummaryCards from './components/SummaryCards';
import ChartWidget from './components/ChartWidget';
import TargetCard from './components/TargetCard';
import TransactionList from './components/TransactionList';
import MonthlyChart from './components/MonthlyChart'; // <-- IMPORT BARU
import { InputModal, DetailModal, TargetModal } from './components/Modals';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState({ balance: 0, total_income: 0, total_expense: 0, category_expenses: [], top_category: 'Belum Ada', burn_rate: 0 });
  const [prediction, setPrediction] = useState({ runwayDays: '∞', targetDays: 'Calculating...', statusMessage: 'Mengumpulkan data...' });
  const [activePieIndex, setActivePieIndex] = useState(-1);

  // 📅 State Baru Filter Rentang Tanggal Kalender
  const [dateFilter, setDateFilter] = useState({ startDate: '', endDate: '' });

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('afif_categories');
    return saved ? JSON.parse(saved) : ['Makanan', 'Kos', 'Kuliah', 'Shopping', 'Lainnya'];
  });
  const [showAddCategoryInput, setShowAddCategoryInput] = useState(false);
  const [customCategoryName, setCustomCategoryName] = useState('');
  
  const [selectedTxDetail, setSelectedTxDetail] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editFormData, setEditFormData] = useState({ amount: '', type: 'expense', category: 'Makanan', description: '', date: '' });

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
    const link = document.querySelector("link[rel~='icon']") || document.createElement('link');
    link.rel = 'icon';
    link.href = '/logo.svg'; // Pastikan file logo.svg ada di folder 'public'
    document.head.appendChild(link);
    document.title = "Fin-Core | Dashboard";
  }, []);

  useEffect(() => {
    localStorage.setItem('afif_categories', JSON.stringify(categories));
  }, [categories]);

  const fetchTransactions = async () => {
      setIsLoading(true);
      console.log("Mencoba memanggil Supabase...");
      const { data, error } = await supabase.from('transactions').select('*').order('id', { ascending: false });
      console.log("Hasil:", { data, error }); // <--- LIHAT DI CONSOLE BROWSER
      if (!error) setTransactions(data || []);
      setIsLoading(false);
  };

  useEffect(() => {
    calculateSummary(transactions);
  }, [transactions, savingTarget]);

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
    allTransactions.filter(t => t.type === 'expense').forEach(t => { expenseMap[t.category] = (expenseMap[t.category] || 0) + parseFloat(t.amount); });
    const categoryExpenses = Object.keys(expenseMap).map(cat => ({ category: cat, total: expenseMap[cat] }));

    let topCategory = 'Belum Ada';
    if (categoryExpenses.length > 0) {
      const maxExpense = Math.max(...categoryExpenses.map(c => c.total));
      const topCatObj = categoryExpenses.find(c => c.total === maxExpense);
      if (topCatObj) topCategory = topCatObj.category;
    }

    const burnRate = totalIncome > 0 ? Math.min(Math.round((totalExpense / totalIncome) * 100), 100) : 0;
    setSummary({ balance, total_income: totalIncome, total_expense: totalExpense, category_expenses: categoryExpenses, top_category: topCategory, burn_rate: burnRate });

    const uniqueDates = [...new Set(allTransactions.map(t => t.date))];
    const totalDaysSpan = Math.max(1, uniqueDates.length);
    const avgDailyExpense = totalExpense / ([...new Set(allTransactions.filter(t => t.type === 'expense').map(t => t.date))].length || 1);
    
    let runwayDays = 'Aman (∞)', statusMessage = 'Arus keuangan sehat. Saldo inti stabil.';
    if (balance <= 0) { runwayDays = '0 hari'; statusMessage = '⚠️ Saldo kritis! Segera isi pemasukan.'; }
    else if (avgDailyExpense > 0) { const calculatedDays = Math.floor(balance / avgDailyExpense); runwayDays = `${calculatedDays} hari`; statusMessage = `Berdasarkan tren jajan harianmu, saldo diprediksi aman hingga ${calculatedDays} hari ke depan.`; }

    const remainingTargetAmount = savingTarget.price - balance;
    const avgDailyNetSavings = (totalIncome - totalExpense) / totalDaysSpan;
    let targetDays = 'Butuh surplus tabungan';
    if (remainingTargetAmount <= 0) targetDays = 'Target Tercapai! 🎉';
    else if (avgDailyNetSavings > 0) targetDays = `${Math.ceil(remainingTargetAmount / avgDailyNetSavings)} hari lagi`;
    else targetDays = 'Cashflow minus, hemat yuk!';
    
    setPrediction({ runwayDays, targetDays, statusMessage });
  };

  const handleAddCustomCategory = (e) => {
    e.preventDefault();
    if (customCategoryName.trim() && !categories.includes(customCategoryName.trim())) {
      setCategories([...categories, customCategoryName.trim()]);
      setFormData({ ...formData, category: customCategoryName.trim() });
      setCustomCategoryName('');
      setShowAddCategoryInput(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.from('transactions').insert([{ amount: parseFloat(formData.amount), type: formData.type, category: formData.category, description: formData.description, date: formData.date }]).select();
    if (!error && data) { setTransactions([data[0], ...transactions]); setIsModalOpen(false); setFormData({ ...formData, amount: '', description: '' }); }
  };

  const handleStartEdit = () => {
    setEditFormData({ amount: selectedTxDetail.amount, type: selectedTxDetail.type, category: selectedTxDetail.category, description: selectedTxDetail.description || '', date: selectedTxDetail.date });
    setIsEditMode(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.from('transactions').update({ amount: parseFloat(editFormData.amount), type: editFormData.type, category: editFormData.category, description: editFormData.description, date: editFormData.date }).eq('id', selectedTxDetail.id).select();
    if (!error && data) { setTransactions(transactions.map(t => t.id === selectedTxDetail.id ? data[0] : t)); setIsEditMode(false); setSelectedTxDetail(null); }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm("Hapus dari database cloud?")) {
      const { error } = await supabase.from('transactions').delete().eq('id', id);
      if (!error) { setTransactions(transactions.filter(t => t.id !== id)); if (selectedTxDetail?.id === id) setSelectedTxDetail(null); }
    }
  };

  const handleTargetSubmit = (e) => {
    e.preventDefault();
    setSavingTarget({ name: targetFormData.name, price: parseFloat(targetFormData.price) });
    setIsTargetModalOpen(false);
  };

  const handleScanReceipt = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsScanning(true);
    try {
      const parsedAiData = await scanReceiptWithGemini(file, categories);
      setFormData({ ...formData, amount: parsedAiData.amount || '', type: 'expense', category: categories.includes(parsedAiData.category) ? parsedAiData.category : 'Lainnya', description: parsedAiData.description || 'Hasil Otomatis AI', date: new Date().toISOString().split('T')[0] });
    } catch (err) { alert(err.message); }
    setIsScanning(false);
  };

  // 📅 LOGIKA FILTER MULTI-DIMENSI (Search + Type + Kalender Date Range)
  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = (t.description || t.category).toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || t.type === filterType;
    
    // Validasi range tanggal kalender
    let matchesDate = true;
    if (dateFilter.startDate) matchesDate = matchesDate && t.date >= dateFilter.startDate;
    if (dateFilter.endDate) matchesDate = matchesDate && t.date <= dateFilter.endDate;

    return matchesSearch && matchesType && matchesDate;
  });

  const targetProgress = Math.min(Math.round((summary.balance / savingTarget.price) * 100), 100);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-neutral-950 text-zinc-900 dark:text-zinc-100 p-4 pb-28 md:p-8 transition-colors duration-500 relative w-full max-w-[100vw] overflow-x-hidden selection:bg-emerald-500/20" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        body { font-family: 'Plus Jakarta Sans', sans-serif; -webkit-font-smoothing: antialiased; }
        .fluid-bounce { transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
        .click-feedback { transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1); }
        .click-feedback:active { transform: scale(0.96); }
        @keyframes fluidFadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes overlayFade { from { opacity: 0; backdrop-filter: blur(0px); } to { opacity: 1; backdrop-filter: blur(8px); } }
        @keyframes modalSpring { from { opacity: 0; transform: scale(0.96) translateY(12px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        .animate-dashboard-load { animation: fluidFadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-overlay-show { animation: overlayFade 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-modal-show { animation: modalSpring 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .delay-card-1 { animation-delay: 50ms; opacity: 0; }
        .delay-card-2 { animation-delay: 120ms; opacity: 0; }
        .delay-card-3 { animation-delay: 180ms; opacity: 0; }
        .delay-card-4 { animation-delay: 240ms; opacity: 0; }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e4e4e7; border-radius: 99px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; }
      `}</style>
      
      <div className="absolute top-0 left-0 w-full h-96 bg-emerald-500/[0.03] dark:bg-emerald-500/[0.02] rounded-full blur-3xl pointer-events-none"></div>

      <Header theme={theme} toggleTheme={toggleTheme} />

      {isLoading ? (
        <div className="max-w-6xl mx-auto flex flex-col items-center justify-center py-24 text-zinc-400 font-mono text-sm gap-4">
          {/* Logo Loading dengan efek pulse */}
          <img src="/logo.svg" alt="Loading" className="w-12 h-12 animate-pulse opacity-80" />
          <span className="tracking-widest animate-pulse font-bold text-emerald-500">SYNCING CORE...</span>
        </div>
      ) : (
        <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5 relative z-10 w-full">
          <SummaryCards summary={summary} prediction={prediction} />
          
          {/* 📊 GRAFIK TREN BULANAN BARU (Ditempatkan Sejajar Atas Layout) */}
          <MonthlyChart transactions={transactions} />

          <ChartWidget summary={summary} theme={theme} activePieIndex={activePieIndex} setActivePieIndex={setActivePieIndex} />
          <div className="md:col-span-2 grid grid-cols-1 gap-5">
            <TargetCard savingTarget={savingTarget} targetProgress={targetProgress} prediction={prediction} setIsTargetModalOpen={setIsTargetModalOpen} />
            <TransactionList searchQuery={searchQuery} setSearchQuery={setSearchQuery} filterType={filterType} setFilterType={setFilterType} filteredTransactions={filteredTransactions} setSelectedTxDetail={setSelectedTxDetail} handleDelete={handleDelete} transactions={transactions} dateFilter={dateFilter} setDateFilter={setDateFilter} />
          </div>
        </main>
      )}

      <button onClick={() => setIsModalOpen(true)} className="fixed bottom-6 right-6 bg-emerald-600 dark:bg-emerald-500 text-white p-4 rounded-full shadow-lg z-50 hover:scale-110 active:scale-90 shadow-emerald-600/20 transition-transform duration-300 ease-out"><Plus size={26} /></button>

      <InputModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} formData={formData} setFormData={setFormData} handleSubmit={handleSubmit} handleScanReceipt={handleScanReceipt} isScanning={isScanning} categories={categories} showAddCategoryInput={showAddCategoryInput} setShowAddCategoryInput={setShowAddCategoryInput} customCategoryName={customCategoryName} setCustomCategoryName={setCustomCategoryName} handleAddCustomCategory={handleAddCustomCategory} />
      <DetailModal selectedTxDetail={selectedTxDetail} onClose={() => { setSelectedTxDetail(null); setIsEditMode(false); }} isEditMode={isEditMode} setIsEditMode={setIsEditMode} editFormData={editFormData} setEditFormData={setEditFormData} handleEditSubmit={handleEditSubmit} categories={categories} handleDelete={handleDelete} />
      <TargetModal isOpen={isTargetModalOpen} onClose={() => setIsTargetModalOpen(false)} targetFormData={targetFormData} setTargetFormData={setTargetFormData} handleTargetSubmit={handleTargetSubmit} />
    </div>
  );
}

export default App;