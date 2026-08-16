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
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-zinc-950/85 border-b border-zinc-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <div 
          onClick={onReset}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          {/* Custom Modern Geometric Nyoria Logo Emblem (NO 3rd party AI logos!) */}
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-zinc-700 via-zinc-400 to-zinc-100 p-0.5 shadow-lg shadow-zinc-900/40 group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-zinc-800/30 to-zinc-500/20" />
              <div className="relative flex items-center justify-center">
                <span className="font-black text-xl bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 via-zinc-300 to-zinc-400 tracking-tighter">
                  N
                </span>
                <Sparkles className="w-3 h-3 text-zinc-300 absolute -top-1 -right-1.5 animate-spin-slow" />
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-zinc-100 group-hover:text-zinc-300 transition-colors">
                Nyoria
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-zinc-800/90 text-zinc-300 border border-zinc-700/80">
                PRO 2.0
              </span>
            </div>
            <span className="text-xs text-zinc-400 font-medium hidden sm:inline-block">
              Interactive Study & Exam Preparation Platform
            </span>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Saved Study Sets Tab */}
          <button
            onClick={onOpenSavedKits}
            className="relative px-3.5 py-1.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-zinc-100 border border-zinc-800/80 text-xs sm:text-sm font-medium flex items-center gap-2 transition-all shadow-sm"
            title="View Saved Study Sets"
          >
            <Bookmark className="w-4 h-4 text-zinc-300" />
            <span className="hidden xs:inline">Saved Study Sets</span>
            {savedKitsCount > 0 && (
              <span className="px-1.5 py-0.2 bg-zinc-100 text-zinc-950 rounded-full text-[10px] font-bold">
                {savedKitsCount}
              </span>
            )}
          </button>

          {/* Disclaimer Info Button */}
          <button
            onClick={onOpenDisclaimer}
            className="p-2 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800/80 transition-all"
            title="Disclaimer & Academic Guidelines"
          >
            <Info className="w-4 h-4" />
          </button>

          {/* Theme Switcher */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-zinc-400 hover:text-amber-400 border border-zinc-800/80 transition-all"
            title={darkMode ? "Switch to Light Gray Mode" : "Switch to Dark Gray Mode"}
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* New Session Button */}
          <button
            onClick={onReset}
            className="hidden md:flex px-3 py-1.5 rounded-xl bg-zinc-800/60 hover:bg-zinc-800 text-zinc-300 border border-zinc-700/60 text-xs font-semibold items-center gap-1.5 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Session</span>
          </button>

        </div>

      </div>
    </header>
  );
};
