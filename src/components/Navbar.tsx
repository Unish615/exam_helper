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
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#090D16]/90 border-b border-[#1E293B] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Sleek Cyber Cyan & Obsidian Logo */}
        <div 
          onClick={onReset}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#00F2FE] via-[#4FACFE] to-[#10B981] p-0.5 shadow-lg shadow-[#00F2FE]/25 group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-[#090D16] rounded-[10px] flex items-center justify-center font-black text-[#00F2FE] text-sm tracking-wider">
              NY
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-black text-xl tracking-tight text-white group-hover:text-[#00F2FE] transition-colors">
                Nyoria
              </span>
              <span className="text-[10px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded-full bg-[#00F2FE]/10 text-[#00F2FE] border border-[#00F2FE]/30">
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
            className="px-3.5 py-1.5 rounded-xl bg-[#0D1322] hover:bg-[#1E293B] text-slate-300 hover:text-white border border-[#1E293B] hover:border-[#00F2FE]/40 text-xs font-bold hidden sm:flex items-center gap-1.5 transition-all"
            title="View Practice History"
          >
            Practice History
          </button>

          {/* Saved Sets Drawer */}
          <button
            onClick={onOpenSavedKits}
            className="relative px-3.5 py-1.5 rounded-xl bg-[#0D1322] hover:bg-[#1E293B] text-slate-300 hover:text-white border border-[#1E293B] hover:border-[#00F2FE]/40 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-sm"
            title="View Saved Study Sets"
          >
            <span>Saved Sets</span>
            {savedKitsCount > 0 && (
              <span className="px-1.5 py-0.2 bg-gradient-to-r from-[#00F2FE] to-[#4FACFE] text-[#090D16] rounded-full text-[10px] font-black">
                {savedKitsCount}
              </span>
            )}
          </button>

          {/* Disclaimer Info */}
          <button
            onClick={onOpenDisclaimer}
            className="px-3 py-1.5 rounded-xl bg-[#0D1322] hover:bg-[#1E293B] text-slate-300 hover:text-[#00F2FE] border border-[#1E293B] text-xs font-bold transition-all"
            title="Disclaimer & Safety Notice"
          >
            Notice
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-3 py-1.5 rounded-xl bg-[#0D1322] hover:bg-[#1E293B] text-slate-300 hover:text-[#00F2FE] border border-[#1E293B] text-xs font-bold transition-all"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? "Light" : "Dark"}
          </button>

          {/* New Session */}
          <button
            onClick={onReset}
            className="hidden md:flex px-3 py-1.5 rounded-xl bg-[#00F2FE]/10 hover:bg-[#00F2FE]/20 text-[#00F2FE] border border-[#00F2FE]/30 text-xs font-bold items-center gap-1.5 transition-all"
          >
            New Session
          </button>

        </div>

      </div>
    </header>
  );
};
