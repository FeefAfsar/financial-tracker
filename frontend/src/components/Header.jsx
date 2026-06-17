import React from 'react';
import { Sparkles, Sun, Moon } from 'lucide-react';

export default function Header({ theme, toggleTheme }) {
  return (
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
  );
}