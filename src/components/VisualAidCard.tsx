'use client';

import React, { useState } from 'react';
import { Layers, CheckCircle2, Tag } from 'lucide-react';
import { VisualAidDiagram } from '../lib/types';

interface VisualAidCardProps {
  diagram: VisualAidDiagram;
}

export const VisualAidCard: React.FC<VisualAidCardProps> = ({ diagram }) => {
  const [activeComponentIndex, setActiveComponentIndex] = useState<number | null>(0);

  return (
    <div className="bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-5 sm:p-6 space-y-6 shadow-xl overflow-hidden relative">
      
      {/* Header & Search Tag Badges */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-200 border border-zinc-700 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" />
              <span>Visual Diagram Card</span>
            </span>
            <span className="text-xs text-zinc-400 capitalize">{diagram.type} Concept</span>
          </div>
          
          <h3 className="text-xl font-bold text-zinc-100 tracking-tight">
            {diagram.title}
          </h3>
          
          <p className="text-xs text-zinc-400 max-w-xl leading-relaxed">
            {diagram.description}
          </p>
        </div>

        {/* Visual Search Tags (e.g. Diagram: Human Heart Blood Flow) */}
        <div className="flex flex-wrap gap-1.5">
          {diagram.tags.map((tag, idx) => (
            <span key={idx} className="px-2.5 py-0.5 rounded-full bg-zinc-950 text-zinc-300 text-[11px] font-mono border border-zinc-800 flex items-center gap-1">
              <Tag className="w-3 h-3 text-zinc-400" />
              <span>{tag}</span>
            </span>
          ))}
        </div>
      </div>

      {/* SVG Interactive Visual Diagram Container */}
      <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 relative overflow-hidden flex flex-col items-center justify-center min-h-[260px] group">
        
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-25" />

        <div className="relative z-10 w-full max-w-2xl">
          {diagram.svgType === 'heart' ? (
            /* Human Heart Blood Flow SVG */
            <svg viewBox="0 0 600 170" className="w-full h-auto">
              {/* Right Atrium / Right Ventricle Deoxygenated Flow */}
              <g className="cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setActiveComponentIndex(0)}>
                <rect x="30" y="30" width="110" height="45" rx="8" fill="#18181b" stroke="#ef4444" strokeWidth="2" />
                <text x="85" y="55" textAnchor="middle" fill="#fca5a5" fontSize="11" fontWeight="bold">1. Right Atrium</text>
                <text x="85" y="67" textAnchor="middle" fill="#9ca3af" fontSize="9">(Superior Vena Cava)</text>
              </g>
              <path d="M 140 52 L 180 52" stroke="#ef4444" strokeWidth="3" markerEnd="url(#arrow)" />

              <g className="cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setActiveComponentIndex(1)}>
                <rect x="180" y="30" width="120" height="45" rx="8" fill="#18181b" stroke="#f97316" strokeWidth="2" />
                <text x="240" y="55" textAnchor="middle" fill="#fdba74" fontSize="11" fontWeight="bold">2. Right Ventricle</text>
                <text x="240" y="67" textAnchor="middle" fill="#9ca3af" fontSize="9">(Tricuspid Valve)</text>
              </g>
              <path d="M 300 52 L 340 52" stroke="#f97316" strokeWidth="3" />

              {/* Lungs Gas Exchange */}
              <g className="cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setActiveComponentIndex(2)}>
                <ellipse cx="400" cy="52" rx="55" ry="30" fill="#18181b" stroke="#a1a1aa" strokeWidth="2" />
                <text x="400" y="50" textAnchor="middle" fill="#f4f4f5" fontSize="11" fontWeight="bold">3. Lungs</text>
                <text x="400" y="63" textAnchor="middle" fill="#d4d4d8" fontSize="9">(Pulmonary Gas Exchange)</text>
              </g>
              <path d="M 400 82 L 400 115 M 400 115 L 300 115" stroke="#3b82f6" strokeWidth="3" />

              {/* Left Atrium / Left Ventricle Oxygenated Flow */}
              <g className="cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setActiveComponentIndex(3)}>
                <rect x="180" y="95" width="120" height="45" rx="8" fill="#18181b" stroke="#3b82f6" strokeWidth="2" />
                <text x="240" y="120" textAnchor="middle" fill="#93c5fd" fontSize="11" fontWeight="bold">4. Left Atrium</text>
                <text x="240" y="132" textAnchor="middle" fill="#9ca3af" fontSize="9">(Pulmonary Veins)</text>
              </g>
              <path d="M 180 117 L 140 117" stroke="#3b82f6" strokeWidth="3" />

              <g className="cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setActiveComponentIndex(4)}>
                <rect x="30" y="95" width="110" height="45" rx="8" fill="#18181b" stroke="#22c55e" strokeWidth="2.5" />
                <text x="85" y="117" textAnchor="middle" fill="#86efac" fontSize="11" fontWeight="bold">5. Left Ventricle</text>
                <text x="85" y="130" textAnchor="middle" fill="#d4d4d8" fontSize="9">(Aorta to Body Tissues)</text>
              </g>
            </svg>
          ) : diagram.svgType === 'mitosis' ? (
            /* Mitosis Phases SVG */
            <svg viewBox="0 0 600 140" className="w-full h-auto">
              <g className="cursor-pointer" onClick={() => setActiveComponentIndex(0)}>
                <circle cx="60" cy="70" r="40" fill="#18181b" stroke="#a1a1aa" strokeWidth="2" />
                <text x="60" y="125" textAnchor="middle" fill="#e4e4e7" fontSize="11" fontWeight="bold">1. Prophase</text>
              </g>
              <path d="M 110 70 L 140 70" stroke="#71717a" strokeWidth="2" />

              <g className="cursor-pointer" onClick={() => setActiveComponentIndex(1)}>
                <circle cx="190" cy="70" r="40" fill="#18181b" stroke="#a1a1aa" strokeWidth="2" />
                <line x1="190" y1="35" x2="190" y2="105" stroke="#d4d4d8" strokeDasharray="2,2" />
                <text x="190" y="125" textAnchor="middle" fill="#e4e4e7" fontSize="11" fontWeight="bold">2. Metaphase</text>
              </g>
              <path d="M 240 70 L 270 70" stroke="#71717a" strokeWidth="2" />

              <g className="cursor-pointer" onClick={() => setActiveComponentIndex(2)}>
                <ellipse cx="320" cy="70" rx="42" ry="35" fill="#18181b" stroke="#a1a1aa" strokeWidth="2" />
                <text x="320" y="125" textAnchor="middle" fill="#e4e4e7" fontSize="11" fontWeight="bold">3. Anaphase</text>
              </g>
              <path d="M 370 70 L 400 70" stroke="#71717a" strokeWidth="2" />

              <g className="cursor-pointer" onClick={() => setActiveComponentIndex(3)}>
                <circle cx="460" cy="50" r="25" fill="#18181b" stroke="#22c55e" strokeWidth="2" />
                <circle cx="460" cy="90" r="25" fill="#18181b" stroke="#22c55e" strokeWidth="2" />
                <text x="460" y="132" textAnchor="middle" fill="#86efac" fontSize="11" fontWeight="bold">4. Cytokinesis</text>
              </g>
            </svg>
          ) : (
            /* Generic Concept Flow SVG */
            <svg viewBox="0 0 600 120" className="w-full h-auto">
              <g className="cursor-pointer" onClick={() => setActiveComponentIndex(0)}>
                <rect x="40" y="35" width="130" height="50" rx="10" fill="#18181b" stroke="#a1a1aa" strokeWidth="2" />
                <text x="105" y="65" textAnchor="middle" fill="#f4f4f5" fontSize="12" fontWeight="bold">Foundational Concept</text>
              </g>
              <path d="M 170 60 L 220 60" stroke="#71717a" strokeWidth="2" />
              <g className="cursor-pointer" onClick={() => setActiveComponentIndex(1)}>
                <rect x="220" y="35" width="150" height="50" rx="10" fill="#18181b" stroke="#d4d4d8" strokeWidth="2" />
                <text x="295" y="65" textAnchor="middle" fill="#f4f4f5" fontSize="12" fontWeight="bold">Process Flow</text>
              </g>
              <path d="M 370 60 L 420 60" stroke="#71717a" strokeWidth="2" />
              <g className="cursor-pointer" onClick={() => setActiveComponentIndex(2)}>
                <rect x="420" y="35" width="140" height="50" rx="10" fill="#18181b" stroke="#22c55e" strokeWidth="2" />
                <text x="490" y="65" textAnchor="middle" fill="#86efac" fontSize="12" fontWeight="bold">Target Solution</text>
              </g>
            </svg>
          )}
        </div>

      </div>

      {/* Component Details Legend Box */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {diagram.keyComponents.map((comp, idx) => {
          const isSelected = activeComponentIndex === idx;
          return (
            <div
              key={idx}
              onClick={() => setActiveComponentIndex(idx)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-zinc-800 border-zinc-600 text-zinc-100 shadow-md'
                  : 'bg-zinc-950/70 border-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-xs">
                <CheckCircle2 className={`w-3.5 h-3.5 ${isSelected ? 'text-zinc-100' : 'text-zinc-600'}`} />
                <span>{comp.label}</span>
              </div>
              <p className="text-[11px] text-zinc-300 mt-1 leading-snug">
                {comp.detail}
              </p>
            </div>
          );
        })}
      </div>

    </div>
  );
};
