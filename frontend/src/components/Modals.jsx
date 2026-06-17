import React from 'react';
import { X, Camera, UploadCloud, Loader2, Layers, Tag, Calendar, Edit3, Trash2 } from 'lucide-react';

export function InputModal({ isOpen, onClose, formData, setFormData, handleSubmit, handleScanReceipt, isScanning, categories, showAddCategoryInput, setShowAddCategoryInput, customCategoryName, setCustomCategoryName, handleAddCustomCategory }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-slate-900/40 dark:bg-black/80 flex items-center justify-center p-4 z-50 w-full h-full">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 border-slate-800 w-full max-w-[90vw] sm:max-w-md rounded-2xl p-6 relative shadow-2xl transition-colors">
         <button onClick={onClose} className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"><X size={20} /></button>
         <h3 className="text-base font-mono font-black mb-6 text-slate-800 dark:text-slate-200">Log Fin-Core</h3>
         <div className="mb-5 p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 border-purple-500/30 rounded-xl flex items-center justify-between">
           <div className="flex items-center gap-2">
             <Camera className="text-purple-600 dark:text-purple-400" size={16} />
             <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Auto-Fill by Gemini 1.5 Flash</span>
           </div>
           <label className={`cursor-pointer px-3 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm transition-all ${isScanning ? 'opacity-60 cursor-not-allowed scale-95' : 'active:scale-95'}`}>
             {isScanning ? <Loader2 className="animate-spin" size={14} /> : <UploadCloud size={14} />}
             {isScanning ? 'AI READING...' : 'UPLOAD QRIS / STRUK'}
             <input type="file" accept="image/*" className="hidden" onChange={handleScanReceipt} disabled={isScanning} />
           </label>
         </div>
         <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
           <div>
             <label className="block font-bold text-slate-500 uppercase mb-2">Nominal Uang (Rp)</label>
             <input type="number" required placeholder="Contoh: 50000" className="w-full p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 border-slate-800 text-cyan-600 dark:text-cyan-400 font-bold text-sm" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} />
           </div>
           <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-500 uppercase mb-2">Arus Data</label>
                <select className="w-full p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 border-slate-800 text-slate-800 dark:text-slate-300 text-sm focus:outline-none" value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                  <option value="expense">OUTFLOW</option><option value="income">INFLOW</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-500 uppercase mb-2">Kategori</label>
                <select className="w-full p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 border-slate-800 text-slate-800 dark:text-slate-300 text-sm focus:outline-none" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <button type="button" onClick={() => setShowAddCategoryInput(!showAddCategoryInput)} className={`w-full mt-2 p-3 rounded-xl border font-black text-[11px] text-center tracking-wider transition-all block active:scale-95 ${showAddCategoryInput ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/30 text-rose-600 dark:text-rose-400' : 'bg-cyan-50/50 dark:bg-cyan-950/20 border-dashed border-cyan-200 border-cyan-100 text-cyan-600 dark:text-cyan-400'}`}>
                  {showAddCategoryInput ? '✕ BATAL KATEGORI' : '+ TAMBAH KATEGORI'}
                </button>
              </div>
           </div>
           {showAddCategoryInput && (
             <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 border-slate-100 flex gap-2">
               <input type="text" placeholder="Nama kategori baru..." className="w-full p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 border-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none" value={customCategoryName} onChange={(e) => setCustomCategoryName(e.target.value)} />
               <button type="button" onClick={handleAddCustomCategory} className="px-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold shrink-0 transition-colors">ADD</button>
             </div>
           )}
           <div>
             <label className="block font-bold text-slate-500 uppercase mb-2">Deskripsi</label>
             <input type="text" placeholder="Rincian catatan..." className="w-full p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 border-slate-800 text-slate-800 dark:text-slate-300 text-sm" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
           </div>
           <div className="flex gap-3 pt-4">
             <button type="button" onClick={onClose} className="w-1/2 p-3 bg-slate-100 dark:bg-slate-950 border border-slate-200 border-slate-800 text-slate-600 dark:text-slate-400 rounded-xl font-bold">BATAL</button>
             <button type="submit" className="w-1/2 p-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold">SIMPAN LOG</button>
           </div>
         </form>
      </div>
    </div>
  );
}

export function DetailModal({ selectedTxDetail, onClose, isEditMode, setIsEditMode, editFormData, setEditFormData, handleEditSubmit, categories, handleDelete }) {
  if (!selectedTxDetail) return null;
  return (
    <div className="fixed inset-0 bg-slate-900/40 dark:bg-black/80 flex items-center justify-center p-4 z-50 w-full h-full" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 border border-slate-200 border-slate-800 w-full max-w-sm rounded-2xl p-6 relative shadow-2xl transition-all" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"><X size={18} /></button>
        <h3 className="text-sm font-mono font-black mb-5 text-slate-500 uppercase tracking-widest">{isEditMode ? 'Edit Mutasi Cloud' : 'Detail Transaksi'}</h3>
        
        {isEditMode ? (
          <form onSubmit={handleEditSubmit} className="space-y-4 text-xs font-mono">
            <div>
              <label className="block font-bold text-slate-400 uppercase mb-1.5">Nominal Uang (Rp)</label>
              <input type="number" required className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-cyan-500 font-bold" value={editFormData.amount} onChange={(e) => setEditFormData({...editFormData, amount: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-400 uppercase mb-1.5">Arus Data</label>
                <select className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-300 focus:outline-none" value={editFormData.type} onChange={(e) => setEditFormData({...editFormData, type: e.target.value})}>
                  <option value="expense">OUTFLOW</option><option value="income">INFLOW</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-400 uppercase mb-1.5">Kategori</label>
                <select className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-300 focus:outline-none" value={editFormData.category} onChange={(e) => setEditFormData({...editFormData, category: e.target.value})}>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block font-bold text-slate-400 uppercase mb-1.5">Tanggal Mutasi</label>
              <input type="date" required className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-300" value={editFormData.date} onChange={(e) => setEditFormData({...editFormData, date: e.target.value})} />
            </div>
            <div>
              <label className="block font-bold text-slate-400 uppercase mb-1.5">Deskripsi</label>
              <input type="text" className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-300" value={editFormData.description} onChange={(e) => setEditFormData({...editFormData, description: e.target.value})} />
            </div>
            <div className="pt-2 flex gap-2">
              <button type="button" onClick={() => setIsEditMode(false)} className="w-1/2 py-2.5 bg-slate-100 dark:bg-slate-950 text-slate-400 rounded-xl font-bold border border-slate-200 dark:border-slate-800">BATAL</button>
              <button type="submit" className="w-1/2 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold">SIMPAN</button>
            </div>
          </form>
        ) : (
          <div className="space-y-4 text-xs font-mono">
            <div className="bg-slate-50 dark:bg-slate-950/60 p-4 rounded-xl border border-slate-100 border-slate-900 text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Nominal Mutasi</p>
              <p className={`text-2xl font-black ${selectedTxDetail.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-pink-600 dark:text-pink-400'}`}>
                {selectedTxDetail.type === 'income' ? '+' : '-'} Rp {parseFloat(selectedTxDetail.amount).toLocaleString('id-ID')}
              </p>
            </div>
            <div className="space-y-2.5 px-1">
              <div className="flex justify-between border-b border-slate-100 border-slate-200 pb-2">
                <span className="text-slate-400 font-bold flex items-center gap-1.5"><Layers size={14} /> Arus Data</span>
                <span className={`font-black text-[11px] px-2 py-0.5 rounded ${selectedTxDetail.type === 'income' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400' : 'bg-pink-50 text-pink-600 dark:bg-pink-950/40 dark:text-pink-400'}`}>{selectedTxDetail.type === 'income' ? 'INFLOW' : 'OUTFLOW'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 border-slate-200 pb-2">
                <span className="text-slate-400 font-bold flex items-center gap-1.5"><Tag size={14} /> Kategori</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 capitalize">{selectedTxDetail.category}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 border-slate-200 pb-2">
                <span className="text-slate-400 font-bold flex items-center gap-1.5"><Calendar size={14} /> Tanggal</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedTxDetail.date}</span>
              </div>
              <div className="pt-1">
                <span className="text-slate-400 font-bold block mb-1">Rincian Deskripsi:</span>
                <p className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl text-slate-800 dark:text-slate-300 font-sans text-sm leading-relaxed border border-slate-100 border-slate-900 break-words">
                  {selectedTxDetail.description || <span className="italic text-xs text-slate-400 font-mono">Tidak ada keterangan deskripsi</span>}
                </p>
              </div>
            </div>
            <div className="pt-3 flex gap-2">
              <button onClick={() => setIsEditMode(true)} className="w-1/3 py-2.5 bg-cyan-50 dark:bg-cyan-950/30 text-cyan-600 dark:text-cyan-400 rounded-xl font-bold border border-cyan-200 dark:border-cyan-900/30 hover:bg-cyan-100 flex items-center justify-center gap-1"><Edit3 size={14} /> EDIT</button>
              <button onClick={(e) => handleDelete(selectedTxDetail.id, e)} className="w-1/3 py-2.5 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 rounded-xl font-bold border border-rose-200 dark:border-rose-100 hover:bg-rose-100 flex items-center justify-center gap-1"><Trash2 size={14} /> HAPUS</button>
              <button onClick={onClose} className="w-1/3 py-2.5 bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-400 rounded-xl font-bold border border-slate-200 dark:border-slate-800">TUTUP</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function TargetModal({ isOpen, onClose, targetFormData, setTargetFormData, handleTargetSubmit }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-slate-900/40 dark:bg-black/80 flex items-center justify-center p-4 z-50 w-full h-full">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 border-slate-800 w-full max-w-[90vw] sm:max-w-md rounded-2xl p-6 relative shadow-2xl transition-colors font-mono text-xs">
        <button onClick={onClose} className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"><X size={20} /></button>
        <h3 className="text-base font-mono font-black mb-6 text-slate-800 dark:text-slate-200">Config Target</h3>
        <form onSubmit={handleTargetSubmit} className="space-y-4">
           <div>
             <label className="block font-bold text-slate-500 uppercase mb-2">Nama Target</label>
             <input type="text" required placeholder="Contoh: Laptop Baru" className="w-full p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 border-slate-800 text-slate-800 dark:text-slate-200 text-sm focus:outline-none" value={targetFormData.name} onChange={(e) => setTargetFormData({...targetFormData, name: e.target.value})} />
           </div>
           <div>
             <label className="block font-bold text-slate-500 uppercase mb-2">Nilai Target (Rp)</label>
             <input type="number" required placeholder="Contoh: 15000000" className="w-full p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 border-slate-800 text-purple-600 dark:text-purple-400 font-bold text-sm focus:outline-none" value={targetFormData.price} onChange={(e) => setTargetFormData({...targetFormData, price: e.target.value})} />
           </div>
           <div className="flex gap-3 pt-4">
             <button type="button" onClick={onClose} className="w-1/2 p-3 bg-slate-100 dark:bg-slate-950 text-slate-600 border border-slate-200 dark:border-slate-800 rounded-xl font-bold">BATAL</button>
             <button type="submit" className="w-1/2 p-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold">UPDATE</button>
           </div>
        </form>
      </div>
    </div>
  );
}