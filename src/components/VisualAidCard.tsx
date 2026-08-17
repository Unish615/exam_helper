'use client';

import React, { useState } from 'react';
import { VisualAidDiagram } from '../lib/types';

interface VisualAidCardProps {
  diagram: VisualAidDiagram;
}

export const VisualAidCard: React.FC<VisualAidCardProps> = ({ diagram }) => {
  const [activeComponentIndex, setActiveComponentIndex] = useState<number | null>(0);

  return (
    <div className="bg-[#111827]/90 border border-[#1E293B] rounded-2xl p-5 sm:p-6 space-y-6 shadow-xl overflow-hidden relative">
      
      {/* Header & Tag */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-xs font-bold uppercase tracking-wider">
              Visual Concept Card
            </span>
            <span className="text-xs text-slate-400 capitalize">{diagram.type} Concept Map</span>
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
          <div className="px-3 py-1 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold shadow-sm">
            Search: &ldquo;{diagram.searchQueryTag || "Diagram: Concept Visualizer"}&rdquo;
          </div>

          <div className="flex flex-wrap gap-1">
            {diagram.tags.map((tag, idx) => (
              <span key={idx} className="px-2 py-0.5 rounded bg-[#0B0F19] text-slate-400 text-[10px] font-mono border border-[#1E293B]">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* SVG Interactive Block */}
      <div className="p-6 rounded-2xl bg-[#0B0F19] border border-[#1E293B] relative overflow-hidden flex flex-col items-center justify-center min-h-[260px] group">
        
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1E293B_1px,transparent_1px),linear-gradient(to_bottom,#1E293B_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-30" />

        <div className="relative z-10 w-full max-w-2xl">
          {/* Dynamic Flowchart SVG extracted from user content */}
          <svg viewBox="0 0 600 120" className="w-full h-auto">
            {diagram.keyComponents.slice(0, 3).map((comp, idx) => {
              const xPos = 40 + idx * 190;
              const isSelected = activeComponentIndex === idx;
              const colors = ["#6366F1", "#8B5CF6", "#10B981"];
              const currentColor = colors[idx % colors.length];

              return (
                <g key={idx} className="cursor-pointer" onClick={() => setActiveComponentIndex(idx)}>
                  <rect
                    x={xPos}
                    y="35"
                    width="150"
                    height="50"
                    rx="10"
                    fill="#111827"
                    stroke={isSelected ? currentColor : "#1E293B"}
                    strokeWidth={isSelected ? "2.5" : "1.5"}
                  />
                  <text x={xPos + 75} y="64" textAnchor="middle" fill={currentColor} fontSize="11" fontWeight="bold">
                    {comp.label.length > 18 ? comp.label.substring(0, 18) + '...' : comp.label}
                  </text>
                  {idx < 2 && (
                    <path d={`M ${xPos + 150} 60 L ${xPos + 190} 60`} stroke={currentColor} strokeWidth="2" strokeDasharray="4 2" />
                  )}
                </g>
              );
            })}
          </svg>
        </div>

      </div>

      {/* Component Details Legend */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {diagram.keyComponents.map((comp, idx) => {
          const isSelected = activeComponentIndex === idx;
          return (
            <div
              key={idx}
              onClick={() => setActiveComponentIndex(idx)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-indigo-600/10 border-indigo-500 text-indigo-300 shadow-md ring-1 ring-indigo-500/30'
                  : 'bg-[#0B0F19] border-[#1E293B] text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="font-bold text-xs">
                {isSelected ? '✓ ' : ''}{comp.label}
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
