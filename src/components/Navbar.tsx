'use client';

import React from 'react';

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
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#0B0F19]/90 border-b border-[#1E293B] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Modern SaaS Nyoria Brand Emblem */}
        <div 
          onClick={onReset}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-violet-500 to-purple-500 p-0.5 shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-[#0B0F19] rounded-[10px] flex items-center justify-center font-black text-indigo-300 text-sm tracking-wider">
              NY
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-black text-xl tracking-tight text-white group-hover:text-indigo-300 transition-colors">
                Nyoria
              </span>
              <span className="text-[10px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
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
            className="px-3.5 py-1.5 rounded-xl bg-[#111827] hover:bg-[#1E293B] text-slate-300 hover:text-white border border-[#1E293B] hover:border-indigo-500/40 text-xs font-bold hidden sm:flex items-center gap-1.5 transition-all"
            title="View Practice History"
          >
            Practice History
          </button>

          {/* Saved Sets Drawer */}
          <button
            onClick={onOpenSavedKits}
            className="relative px-3.5 py-1.5 rounded-xl bg-[#111827] hover:bg-[#1E293B] text-slate-300 hover:text-white border border-[#1E293B] hover:border-indigo-500/40 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-sm"
            title="View Saved Study Sets"
          >
            <span>Saved Sets</span>
            {savedKitsCount > 0 && (
              <span className="px-1.5 py-0.2 bg-indigo-600 text-white rounded-full text-[10px] font-black">
                {savedKitsCount}
              </span>
            )}
          </button>

          {/* Disclaimer Info */}
          <button
            onClick={onOpenDisclaimer}
            className="px-3 py-1.5 rounded-xl bg-[#111827] hover:bg-[#1E293B] text-slate-300 hover:text-indigo-400 border border-[#1E293B] text-xs font-bold transition-all"
            title="Disclaimer & Safety Notice"
          >
            Notice
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-3 py-1.5 rounded-xl bg-[#111827] hover:bg-[#1E293B] text-slate-300 hover:text-amber-400 border border-[#1E293B] text-xs font-bold transition-all"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? "Light" : "Dark"}
          </button>

          {/* New Session */}
          <button
            onClick={onReset}
            className="hidden md:flex px-3 py-1.5 rounded-xl bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold items-center gap-1.5 transition-all"
          >
            New Session
          </button>

        </div>

      </div>
    </header>
  );
};
