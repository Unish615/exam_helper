'use client';

import React, { useState } from 'react';
import { Layers, CheckCircle2, Tag, Search } from 'lucide-react';
import { VisualAidDiagram } from '../lib/types';

interface VisualAidCardProps {
  diagram: VisualAidDiagram;
}

export const VisualAidCard: React.FC<VisualAidCardProps> = ({ diagram }) => {
  const [activeComponentIndex, setActiveComponentIndex] = useState<number | null>(0);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-6 shadow-xl overflow-hidden relative">
      
      {/* Header & Teal Search Tag */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/20 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-teal-400" />
              <span>Visual Concept Card</span>
            </span>
            <span className="text-xs text-slate-400 capitalize">{diagram.type} Concept</span>
          </div>
          
          <h3 className="text-xl font-bold text-white tracking-tight">
            {diagram.title}
          </h3>
          
          <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
            {diagram.description}
          </p>
        </div>

        {/* Recommended Image Search Tag Badge */}
        <div className="flex flex-col items-end gap-1.5">
          <div className="px-3 py-1 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-mono font-bold flex items-center gap-1.5 shadow-sm">
            <Search className="w-3.5 h-3.5 text-teal-400" />
            <span>{diagram.searchQueryTag || "Diagram: Concept Visualizer"}</span>
          </div>

          <div className="flex flex-wrap gap-1">
            {diagram.tags.map((tag, idx) => (
              <span key={idx} className="px-2 py-0.5 rounded bg-slate-950 text-slate-400 text-[10px] font-mono border border-slate-800">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* SVG Interactive Teal Placeholder Block */}
      <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 relative overflow-hidden flex flex-col items-center justify-center min-h-[260px] group">
        
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-30" />

        <div className="relative z-10 w-full max-w-2xl">
          {diagram.svgType === 'heart' ? (
            /* Human Heart Blood Flow Labeled SVG */
            <svg viewBox="0 0 600 160" className="w-full h-auto">
              <g className="cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setActiveComponentIndex(0)}>
                <rect x="30" y="25" width="110" height="45" rx="8" fill="#1e1b4b" stroke="#ef4444" strokeWidth="2" />
                <text x="85" y="50" textAnchor="middle" fill="#fca5a5" fontSize="11" fontWeight="bold">1. Right Atrium</text>
                <text x="85" y="62" textAnchor="middle" fill="#9ca3af" fontSize="9">(Superior Vena Cava)</text>
              </g>
              <path d="M 140 47 L 180 47" stroke="#ef4444" strokeWidth="3" />

              <g className="cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setActiveComponentIndex(1)}>
                <rect x="180" y="25" width="120" height="45" rx="8" fill="#1e1b4b" stroke="#f97316" strokeWidth="2" />
                <text x="240" y="50" textAnchor="middle" fill="#fdba74" fontSize="11" fontWeight="bold">2. Right Ventricle</text>
                <text x="240" y="62" textAnchor="middle" fill="#9ca3af" fontSize="9">(Tricuspid Valve)</text>
              </g>
              <path d="M 300 47 L 350 47" stroke="#f97316" strokeWidth="3" />

              <g className="cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setActiveComponentIndex(2)}>
                <ellipse cx="400" cy="47" rx="50" ry="28" fill="#1e1b4b" stroke="#a1a1aa" strokeWidth="2" />
                <text x="400" y="45" textAnchor="middle" fill="#f4f4f5" fontSize="11" fontWeight="bold">3. Lungs</text>
                <text x="400" y="58" textAnchor="middle" fill="#d4d4d8" fontSize="9">(Gas Exchange)</text>
              </g>
              <path d="M 400 75 L 400 105 M 400 105 L 300 105" stroke="#3b82f6" strokeWidth="3" />

              <g className="cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setActiveComponentIndex(3)}>
                <rect x="180" y="88" width="120" height="45" rx="8" fill="#1e1b4b" stroke="#3b82f6" strokeWidth="2" />
                <text x="240" y="113" textAnchor="middle" fill="#93c5fd" fontSize="11" fontWeight="bold">4. Left Atrium</text>
                <text x="240" y="125" textAnchor="middle" fill="#9ca3af" fontSize="9">(Pulmonary Veins)</text>
              </g>
              <path d="M 180 110 L 140 110" stroke="#3b82f6" strokeWidth="3" />

              <g className="cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setActiveComponentIndex(4)}>
                <rect x="30" y="88" width="110" height="45" rx="8" fill="#1e1b4b" stroke="#22c55e" strokeWidth="2.5" />
                <text x="85" y="110" textAnchor="middle" fill="#86efac" fontSize="11" fontWeight="bold">5. Left Ventricle</text>
                <text x="85" y="122" textAnchor="middle" fill="#d4d4d8" fontSize="9">(Aorta to Body Tissues)</text>
              </g>
            </svg>
          ) : (
            /* Generic Flowchart SVG */
            <svg viewBox="0 0 600 120" className="w-full h-auto">
              <g className="cursor-pointer" onClick={() => setActiveComponentIndex(0)}>
                <rect x="40" y="35" width="130" height="50" rx="10" fill="#1e1b4b" stroke="#6366f1" strokeWidth="2" />
                <text x="105" y="65" textAnchor="middle" fill="#e0e7ff" fontSize="12" fontWeight="bold">Foundational Concept</text>
              </g>
              <path d="M 170 60 L 220 60" stroke="#6366f1" strokeWidth="3" />
              <g className="cursor-pointer" onClick={() => setActiveComponentIndex(1)}>
                <rect x="220" y="35" width="150" height="50" rx="10" fill="#4c1d95" stroke="#a855f7" strokeWidth="2" />
                <text x="295" y="65" textAnchor="middle" fill="#f3e8ff" fontSize="12" fontWeight="bold">Process Flow</text>
              </g>
              <path d="M 370 60 L 420 60" stroke="#71717a" strokeWidth="2" />
              <g className="cursor-pointer" onClick={() => setActiveComponentIndex(2)}>
                <rect x="420" y="35" width="140" height="50" rx="10" fill="#064e3b" stroke="#10b981" strokeWidth="2" />
                <text x="490" y="65" textAnchor="middle" fill="#d1fae5" fontSize="12" fontWeight="bold">Target Solution</text>
              </g>
            </svg>
          )}
        </div>

      </div>

      {/* Component Details Legend */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {diagram.keyComponents.map((comp, idx) => {
          const isSelected = activeComponentIndex === idx;
          return (
            <div
              key={idx}
              onClick={() => setActiveComponentIndex(idx)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-teal-500/20 border-teal-500/50 text-teal-200 shadow-md ring-1 ring-teal-500/30'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-xs">
                <CheckCircle2 className={`w-3.5 h-3.5 ${isSelected ? 'text-teal-400' : 'text-slate-600'}`} />
                <span>{comp.label}</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                {comp.detail}
              </p>
            </div>
          );
        })}
      </div>

    </div>
  );
};
