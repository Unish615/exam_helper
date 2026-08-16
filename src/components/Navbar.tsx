'use client';

import React from 'react';
import { GraduationCap, Sparkles, Bookmark, Sun, Moon, Info, RotateCcw, History } from 'lucide-react';

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onOpenSavedKits: () => void;
  onOpenHistory: () => void;
  onOpenDisclaimer: () => void;
  savedKitsCount: number;
  onReset: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  setDarkMode,
  onOpenSavedKits,
  onOpenHistory,
  onOpenDisclaimer,
  savedKitsCount,
  onReset,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-slate-900/85 border-b border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Nyoria Brand Logo with GraduationCap & Sparkles Icon (Zero AI Logos!) */}
        <div 
          onClick={onReset}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-violet-500 to-purple-500 p-0.5 shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 via-violet-500/20 to-purple-500/20 animate-pulse" />
              <div className="relative flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-indigo-300" />
                <Sparkles className="w-3 h-3 text-violet-300 absolute -top-1 -right-1 animate-spin-slow" />
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-indigo-300 transition-colors">
                Nyoria
              </span>
              <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                PRO 2.0
              </span>
            </div>
            <span className="text-xs text-slate-400 font-medium hidden sm:inline-block">
              Interactive Study & Exam Preparation Platform
            </span>
          </div>
        </div>

        {/* Action Controls Header */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Practice History Tab */}
          <button
            onClick={onOpenHistory}
            className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold hidden sm:flex items-center gap-1.5 transition-all"
            title="View Practice History"
          >
            <History className="w-4 h-4 text-purple-400" />
            <span>Practice History</span>
          </button>

          {/* Saved Sets Drawer */}
          <button
            onClick={onOpenSavedKits}
            className="relative px-3.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all shadow-sm"
            title="View Saved Study Sets"
          >
            <Bookmark className="w-4 h-4 text-indigo-400" />
            <span className="hidden xs:inline">Saved Sets</span>
            {savedKitsCount > 0 && (
              <span className="px-1.5 py-0.2 bg-indigo-600 text-white rounded-full text-[10px] font-bold">
                {savedKitsCount}
              </span>
            )}
          </button>

          {/* Disclaimer Info */}
          <button
            onClick={onOpenDisclaimer}
            className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-400 hover:text-indigo-400 border border-slate-800 transition-all"
            title="Disclaimer & Safety Notice"
          >
            <Info className="w-4 h-4" />
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-400 hover:text-amber-400 border border-slate-800 transition-all"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* New Session */}
          <button
            onClick={onReset}
            className="hidden md:flex px-3 py-1.5 rounded-xl bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold items-center gap-1.5 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Session</span>
          </button>

        </div>

      </div>
    </header>
  );
};
