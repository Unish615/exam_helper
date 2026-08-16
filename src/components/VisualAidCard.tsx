'use client';

import React, { useState } from 'react';
import { VisualAidDiagram } from '../lib/types';

interface VisualAidCardProps {
  diagram: VisualAidDiagram;
}

export const VisualAidCard: React.FC<VisualAidCardProps> = ({ diagram }) => {
  const [activeComponentIndex, setActiveComponentIndex] = useState<number | null>(0);

  return (
    <div className="bg-[#2F1A13]/95 border border-[#4A2C21] rounded-2xl p-5 sm:p-6 space-y-6 shadow-xl overflow-hidden relative">
      
      {/* Header & Tag */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-[#1C4632] text-[#F8D5C2] border border-[#F8D5C2]/30 text-xs font-bold uppercase tracking-wider">
              Visual Concept Card
            </span>
            <span className="text-xs text-[#F8D5C2]/70 capitalize">{diagram.type} Concept</span>
          </div>
          
          <h3 className="text-xl font-bold text-[#FBF2EB] tracking-tight">
            {diagram.title}
          </h3>
          
          <p className="text-xs text-[#F8D5C2]/80 max-w-xl leading-relaxed">
            {diagram.description}
          </p>
        </div>

        {/* Recommended Image Search Tag Badge */}
        <div className="flex flex-col items-end gap-1.5">
          <div className="px-3 py-1 rounded-xl bg-[#123022] border border-[#1C4632] text-[#F8D5C2] text-xs font-mono font-bold shadow-sm">
            Search: &ldquo;{diagram.searchQueryTag || "Diagram: Concept Visualizer"}&rdquo;
          </div>

          <div className="flex flex-wrap gap-1">
            {diagram.tags.map((tag, idx) => (
              <span key={idx} className="px-2 py-0.5 rounded bg-[#123022] text-[#FBF2EB]/80 text-[10px] font-mono border border-[#1C4632]">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* SVG Interactive Block */}
      <div className="p-6 rounded-2xl bg-[#123022] border border-[#1C4632] relative overflow-hidden flex flex-col items-center justify-center min-h-[260px] group">
        
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1C4632_1px,transparent_1px),linear-gradient(to_bottom,#1C4632_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-30" />

        <div className="relative z-10 w-full max-w-2xl">
          {diagram.svgType === 'heart' ? (
            /* Human Heart Blood Flow Labeled SVG */
            <svg viewBox="0 0 600 160" className="w-full h-auto">
              <g className="cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setActiveComponentIndex(0)}>
                <rect x="30" y="25" width="110" height="45" rx="8" fill="#2F1A13" stroke="#F8D5C2" strokeWidth="2" />
                <text x="85" y="50" textAnchor="middle" fill="#F8D5C2" fontSize="11" fontWeight="bold">1. Right Atrium</text>
                <text x="85" y="62" textAnchor="middle" fill="#FBF2EB" fontSize="9">(Superior Vena Cava)</text>
              </g>
              <path d="M 140 47 L 180 47" stroke="#F8D5C2" strokeWidth="3" />

              <g className="cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setActiveComponentIndex(1)}>
                <rect x="180" y="25" width="120" height="45" rx="8" fill="#2F1A13" stroke="#F8D5C2" strokeWidth="2" />
                <text x="240" y="50" textAnchor="middle" fill="#F8D5C2" fontSize="11" fontWeight="bold">2. Right Ventricle</text>
                <text x="240" y="62" textAnchor="middle" fill="#FBF2EB" fontSize="9">(Tricuspid Valve)</text>
              </g>
              <path d="M 300 47 L 350 47" stroke="#F8D5C2" strokeWidth="3" />

              <g className="cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setActiveComponentIndex(2)}>
                <ellipse cx="400" cy="47" rx="50" ry="28" fill="#1C4632" stroke="#F8D5C2" strokeWidth="2" />
                <text x="400" y="45" textAnchor="middle" fill="#FBF2EB" fontSize="11" fontWeight="bold">3. Lungs</text>
                <text x="400" y="58" textAnchor="middle" fill="#F8D5C2" fontSize="9">(Gas Exchange)</text>
              </g>
              <path d="M 400 75 L 400 105 M 400 105 L 300 105" stroke="#F8D5C2" strokeWidth="3" />

              <g className="cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setActiveComponentIndex(3)}>
                <rect x="180" y="88" width="120" height="45" rx="8" fill="#2F1A13" stroke="#F8D5C2" strokeWidth="2" />
                <text x="240" y="113" textAnchor="middle" fill="#F8D5C2" fontSize="11" fontWeight="bold">4. Left Atrium</text>
                <text x="240" y="125" textAnchor="middle" fill="#FBF2EB" fontSize="9">(Pulmonary Veins)</text>
              </g>
              <path d="M 180 110 L 140 110" stroke="#F8D5C2" strokeWidth="3" />

              <g className="cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setActiveComponentIndex(4)}>
                <rect x="30" y="88" width="110" height="45" rx="8" fill="#1C4632" stroke="#F8D5C2" strokeWidth="2.5" />
                <text x="85" y="110" textAnchor="middle" fill="#F8D5C2" fontSize="11" fontWeight="bold">5. Left Ventricle</text>
                <text x="85" y="122" textAnchor="middle" fill="#FBF2EB" fontSize="9">(Aorta to Body Tissues)</text>
              </g>
            </svg>
          ) : (
            /* Generic Flowchart SVG */
            <svg viewBox="0 0 600 120" className="w-full h-auto">
              <g className="cursor-pointer" onClick={() => setActiveComponentIndex(0)}>
                <rect x="40" y="35" width="130" height="50" rx="10" fill="#2F1A13" stroke="#F8D5C2" strokeWidth="2" />
                <text x="105" y="65" textAnchor="middle" fill="#F8D5C2" fontSize="12" fontWeight="bold">Foundational Concept</text>
              </g>
              <path d="M 170 60 L 220 60" stroke="#F8D5C2" strokeWidth="3" />
              <g className="cursor-pointer" onClick={() => setActiveComponentIndex(1)}>
                <rect x="220" y="35" width="150" height="50" rx="10" fill="#1C4632" stroke="#F8D5C2" strokeWidth="2" />
                <text x="295" y="65" textAnchor="middle" fill="#FBF2EB" fontSize="12" fontWeight="bold">Process Flow</text>
              </g>
              <path d="M 370 60 L 420 60" stroke="#F8D5C2" strokeWidth="2" />
              <g className="cursor-pointer" onClick={() => setActiveComponentIndex(2)}>
                <rect x="420" y="35" width="140" height="50" rx="10" fill="#4A2C21" stroke="#F8D5C2" strokeWidth="2" />
                <text x="490" y="65" textAnchor="middle" fill="#F8D5C2" fontSize="12" fontWeight="bold">Target Solution</text>
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
                  ? 'bg-[#1C4632] border-[#F8D5C2] text-[#F8D5C2] shadow-md ring-1 ring-[#F8D5C2]/40'
                  : 'bg-[#123022] border-[#1C4632] text-[#F8D5C2]/80 hover:text-[#FBF2EB]'
              }`}
            >
              <div className="font-bold text-xs">
                {isSelected ? '✓ ' : ''}{comp.label}
              </div>
              <p className="text-[11px] text-[#FBF2EB] mt-1 leading-snug">
                {comp.detail}
              </p>
            </div>
          );
        })}
      </div>

    </div>
  );
};
