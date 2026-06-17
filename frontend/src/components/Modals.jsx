import React from 'react';
import { X, Camera, UploadCloud, Loader2, Layers, Tag, Calendar, Edit3, Trash2 } from 'lucide-react';

export function InputModal({ isOpen, onClose, formData, setFormData, handleSubmit, handleScanReceipt, isScanning, categories, showAddCategoryInput, setShowAddCategoryInput, customCategoryName, setCustomCategoryName, handleAddCustomCategory }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-zinc-900/40 dark:bg-black/70 flex items-center justify-center p-4 z-50 w-full h-full animate-overlay-show">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 w-full max-w-[90vw] sm:max-w-md rounded-2xl p-6 relative shadow-xl animate-modal-show">
         <button onClick={onClose} className="absolute top-5 right-5 text-zinc-400 hover:text-zinc-600 p-1 rounded-lg hover:bg-zinc-100 click-feedback"><X size={20} /></button>
         <h3 className="text-base font-extrabold mb-5 text-zinc-800 dark:text-zinc-200 uppercase tracking-tight">Log Fin-Core</h3>
         <div className="mb-5 p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl flex items-center justify-between">
           <div className="flex items-center gap-2">
             <Camera className="text-emerald-500" size={16} />
             <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Auto-Fill by Gemini 1.5 Flash</span>
           </div>
           <label className={`cursor-pointer px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm click-feedback ${isScanning ? 'opacity-60 cursor-not-allowed' : ''}`}>
             {isScanning ? <Loader2 className="animate-spin" size={14} /> : <UploadCloud size={14} />}
             {isScanning ? 'AI READING...' : 'UPLOAD RECEIPT'}
             <input type="file" accept="image/*" className="hidden" onChange={handleScanReceipt} disabled={isScanning} />
           </label>
         </div>
         <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
           <div>
             <label className="block font-bold text-zinc-400 uppercase mb-1.5">Nominal Uang (Rp)</label>
             <input type="number" required placeholder="Contoh: 50000" className="w-full p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 text-emerald-500 font-extrabold text-sm focus:outline-none focus:border-emerald-500 fluid-bounce" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} />
           </div>
           <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-zinc-400 uppercase mb-1.5">Arus Data</label>
                <select className="w-full p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-bold focus:outline-none" value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                  <option value="expense">OUTFLOW</option><option value="income">INFLOW</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-zinc-400 uppercase mb-1.5">Kategori</label>
                <select className="w-full p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-bold focus:outline-none" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <button type="button" onClick={() => setShowAddCategoryInput(!showAddCategoryInput)} className={`w-full mt-2 p-2.5 rounded-xl border font-bold text-[11px] text-center tracking-wide block click-feedback ${showAddCategoryInput ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/20 text-rose-600 dark:text-rose-400' : 'bg-zinc-100 dark:bg-zinc-950 border-dashed border-zinc-300 dark:border-zinc-800 text-zinc-500 dark:text-cyan-400'}`}>
                  {showAddCategoryInput ? '✕ BATAL' : '+ KATEGORI BARU'}
                </button>
              </div>
           </div>
           {showAddCategoryInput && (
             <div className="p-2.5 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-850 flex gap-2 animate-dashboard-load">
               <input type="text" placeholder="Nama kategori..." className="w-full p-2 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none" value={customCategoryName} onChange={(e) => setCustomCategoryName(e.target.value)} />
               <button type="button" onClick={handleAddCustomCategory} className="px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold shrink-0 click-feedback">ADD</button>
             </div>
           )}
           <div>
             <label className="block font-bold text-zinc-400 uppercase mb-1.5">Deskripsi</label>
             <input type="text" placeholder="Rincian catatan..." className="w-full p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs focus:outline-none focus:border-emerald-500 fluid-bounce" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
           </div>
           <div className="flex gap-3 pt-3">
             <button type="button" onClick={onClose} className="w-1/2 p-3 bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-500 rounded-xl font-bold click-feedback">BATAL</button>
             <button type="submit" className="w-1/2 p-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold click-feedback shadow-sm">SIMPAN</button>
           </div>
         </form>
      </div>
    </div>
  );
}

export function DetailModal({ selectedTxDetail, onClose, isEditMode, setIsEditMode, editFormData, setEditFormData, handleEditSubmit, categories, handleDelete }) {
  if (!selectedTxDetail) return null;
  return (
    <div className="fixed inset-0 bg-zinc-900/40 dark:bg-black/70 flex items-center justify-center p-4 z-50 w-full h-full animate-overlay-show" onClick={onClose}>
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 w-full max-w-sm rounded-2xl p-6 relative shadow-xl animate-modal-show" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-5 right-5 text-zinc-400 hover:text-zinc-600 p-1 rounded-lg hover:bg-slate-100 click-feedback"><X size={18} /></button>
        <h3 className="text-xs font-bold mb-5 text-zinc-400 uppercase tracking-widest">{isEditMode ? 'Edit Mutasi Cloud' : 'Detail Transaksi'}</h3>
        
        {isEditMode ? (
          <form onSubmit={handleEditSubmit} className="space-y-4 text-xs font-medium animate-dashboard-load">
            <div>
              <label className="block font-bold text-zinc-400 uppercase mb-1.5">Nominal Uang (Rp)</label>
              <input type="number" required className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 text-emerald-500 font-extrabold" value={editFormData.amount} onChange={(e) => setEditFormData({...editFormData, amount: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-zinc-400 uppercase mb-1.5">Arus Data</label>
                <select className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 focus:outline-none" value={editFormData.type} onChange={(e) => setEditFormData({...editFormData, type: e.target.value})}>
                  <option value="expense">OUTFLOW</option><option value="income">INFLOW</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-zinc-400 uppercase mb-1.5">Kategori</label>
                <select className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 focus:outline-none" value={editFormData.category} onChange={(e) => setEditFormData({...editFormData, category: e.target.value})}>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block font-bold text-zinc-400 uppercase mb-1.5">Tanggal Mutasi</label>
              <input type="date" required className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300" value={editFormData.date} onChange={(e) => setEditFormData({...editFormData, date: e.target.value})} />
            </div>
            <div>
              <label className="block font-bold text-zinc-400 uppercase mb-1.5">Deskripsi</label>
              <input type="text" className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 focus:outline-none" value={editFormData.description} onChange={(e) => setEditFormData({...editFormData, description: e.target.value})} />
            </div>
            <div className="pt-2 flex gap-2">
              <button type="button" onClick={() => setIsEditMode(false)} className="w-1/2 py-2.5 bg-zinc-100 dark:bg-zinc-950 text-zinc-400 rounded-xl font-bold border border-zinc-200 dark:border-zinc-800 click-feedback">BATAL</button>
              <button type="submit" className="w-1/2 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold click-feedback">SIMPAN</button>
            </div>
          </form>
        ) : (
          <div className="space-y-4 text-xs font-medium">
            <div className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-xl border border-zinc-100 dark:border-zinc-900 text-center">
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Nominal Mutasi</p>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums tracking-tight">
                {selectedTxDetail.type === 'income' ? '+' : '-'} Rp {parseFloat(selectedTxDetail.amount).toLocaleString('id-ID')}
              </p>
            </div>
            <div className="space-y-2.5 px-0.5">
              <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-850 pb-2">
                <span className="text-zinc-400 font-bold flex items-center gap-1.5"><Layers size={14} /> Arus Data</span>
                <span className="font-extrabold text-[11px] px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded">{selectedTxDetail.type === 'income' ? 'INFLOW' : 'OUTFLOW'}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-850 pb-2">
                <span className="text-zinc-400 font-bold flex items-center gap-1.5"><Tag size={14} /> Kategori</span>
                <span className="font-bold text-zinc-800 dark:text-zinc-200 capitalize">{selectedTxDetail.category}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-850 pb-2">
                <span className="text-zinc-400 font-bold flex items-center gap-1.5"><Calendar size={14} /> Tanggal</span>
                <span className="font-bold text-zinc-800 dark:text-zinc-200">{selectedTxDetail.date}</span>
              </div>
              <div className="pt-1">
                <span className="text-zinc-400 font-bold block mb-1">Rincian Deskripsi:</span>
                <p className="p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl text-zinc-700 dark:text-zinc-300 text-xs leading-relaxed border border-zinc-100 dark:border-zinc-900 break-words font-sans">
                  {selectedTxDetail.description || <span className="italic text-zinc-400 font-mono">Tidak ada keterangan deskripsi</span>}
                </p>
              </div>
            </div>
            <div className="pt-2 flex gap-2">
              <button onClick={() => setIsEditMode(true)} className="w-1/3 py-2.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-xl font-bold border border-emerald-100 dark:border-emerald-900/30 hover:bg-emerald-100 click-feedback flex items-center justify-center gap-1"><Edit3 size={14} /> EDIT</button>
              <button onClick={(e) => handleDelete(selectedTxDetail.id, e)} className="w-1/3 py-2.5 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-xl font-bold border border-rose-100 click-feedback flex items-center justify-center gap-1"><Trash2 size={14} /> HAPUS</button>
              <button onClick={onClose} className="w-1/3 py-2.5 bg-zinc-100 dark:bg-zinc-950 text-zinc-500 rounded-xl font-bold border border-zinc-200 dark:border-zinc-800 click-feedback">TUTUP</button>
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
    <div className="fixed inset-0 bg-zinc-900/40 dark:bg-black/80 flex items-center justify-center p-4 z-50 w-full h-full animate-overlay-show">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 w-full max-w-[90vw] sm:max-w-md rounded-2xl p-6 relative shadow-xl animate-modal-show">
        <button onClick={onClose} className="absolute top-5 right-5 text-zinc-400 hover:text-zinc-600 p-1 rounded-lg hover:bg-zinc-100 click-feedback"><X size={20} /></button>
        <h3 className="text-base font-sans font-extrabold mb-5 text-zinc-800 dark:text-zinc-200 uppercase tracking-tight">Config Target</h3>
        <form onSubmit={handleTargetSubmit} className="space-y-4 font-sans font-medium">
           <div>
             <label className="block font-bold text-zinc-400 uppercase mb-1.5">Nama Target</label>
             <input type="text" required placeholder="Contoh: Laptop Baru" className="w-full p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs focus:outline-none" value={targetFormData.name} onChange={(e) => setTargetFormData({...targetFormData, name: e.target.value})} />
           </div>
           <div>
             <label className="block font-bold text-zinc-400 uppercase mb-1.5">Nilai Target (Rp)</label>
             <input type="number" required placeholder="Contoh: 15000000" className="w-full p-3 bg-zinc-50 dark:bg-slate-950 rounded-xl border border-zinc-200 dark:border-zinc-800 text-emerald-500 font-extrabold text-sm focus:outline-none" value={targetFormData.price} onChange={(e) => setTargetFormData({...targetFormData, price: e.target.value})} />
           </div>
           <div className="flex gap-3 pt-3">
             <button type="button" onClick={onClose} className="w-1/2 p-3 bg-zinc-100 dark:bg-zinc-950 text-zinc-500 border border-zinc-200 dark:border-zinc-800 rounded-xl font-bold click-feedback">BATAL</button>
             <button type="submit" className="w-1/2 p-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold click-feedback shadow-sm">UPDATE</button>
           </div>
        </form>
      </div>
    </div>
  );
}