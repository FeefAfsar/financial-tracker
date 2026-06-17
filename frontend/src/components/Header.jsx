import React from 'react';
import { Sun, Moon } from 'lucide-react';
import Logo from './Logo'; 

export default function Header({ theme, toggleTheme }) {
  return (
    <header className="max-w-6xl mx-auto mb-8 flex flex-col items-center text-center sm:flex-row sm:text-left sm:items-center sm:justify-between gap-4 relative z-10 w-full">
      <div className="flex flex-col items-center sm:items-start w-full">
        <div className="flex items-center gap-2.5">
          {/* Logo dipanggil di sini dengan ukuran yang pas */}
          <span className="p-1.5 bg-emerald-100 dark:bg-emerald-950 rounded-xl shadow-sm border border-emerald-100 dark:border-emerald-900/50">
            <Logo size={28} className="w-7 h-7" />
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 uppercase">
            Afif Fin-Core
          </h1>
        </div>
        <p className="text-xs text-zinc-400 dark:text-zinc-500 tracking-widest mt-1 uppercase font-mono font-bold">Predictive Finance</p>
      </div>
      <button onClick={toggleTheme} className="p-3 rounded-xl bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-850 transition-colors shrink-0 shadow-sm">
        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    </header>
  );
}