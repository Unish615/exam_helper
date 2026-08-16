'use client';

import React from 'react';
import { Sparkles, Bookmark, Sun, Moon, Info, RotateCcw } from 'lucide-react';

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onOpenSavedKits: () => void;
  onOpenDisclaimer: () => void;
  savedKitsCount: number;
  onReset: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  setDarkMode,
  onOpenSavedKits,
  onOpenDisclaimer,
  savedKitsCount,
  onReset,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-slate-900/80 border-b border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <div 
          onClick={onReset}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          {/* Custom Modern Geometric Nyoria Logo Icon (NO 3rd party AI logos!) */}
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-purple-500 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center relative overflow-hidden">
              {/* Inner glowing geometric design */}
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 animate-pulse" />
              <div className="relative flex items-center justify-center">
                <span className="font-black text-xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-violet-300 to-purple-300 tracking-tighter">
                  N
                </span>
                <Sparkles className="w-3 h-3 text-indigo-400 absolute -top-1 -right-1.5 animate-spin-slow" />
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-indigo-300 transition-colors">
                Nyoria
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                v2.0 PRO
              </span>
            </div>
            <span className="text-xs text-slate-400 font-medium hidden sm:inline-block">
              Smart Study Assistant & Exam Question Generator
            </span>
          </div>
        </div>

        {/* Right Navigation Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Saved Kits Drawer Button */}
          <button
            onClick={onOpenSavedKits}
            className="relative px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 text-xs sm:text-sm font-medium flex items-center gap-2 transition-all"
            title="View Saved Study Kits"
          >
            <Bookmark className="w-4 h-4 text-indigo-400" />
            <span className="hidden xs:inline">Saved Kits</span>
            {savedKitsCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 bg-indigo-600 text-white rounded-full text-[10px] font-bold">
                {savedKitsCount}
              </span>
            )}
          </button>

          {/* Info / Disclaimer Re-open Button */}
          <button
            onClick={onOpenDisclaimer}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-indigo-400 border border-slate-700/60 transition-all"
            title="Disclaimer & AI Usage Policy"
          >
            <Info className="w-4 h-4" />
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-amber-400 border border-slate-700/60 transition-all"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Reset / New Session */}
          <button
            onClick={onReset}
            className="hidden md:flex px-3 py-1.5 rounded-lg bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 text-xs font-semibold items-center gap-1.5 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Session</span>
          </button>

        </div>

      </div>
    </header>
  );
};
