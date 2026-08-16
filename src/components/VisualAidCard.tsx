'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Layers, Eye, Download, Info, CheckCircle2 } from 'lucide-react';
import { VisualAidDiagram } from '../lib/types';

interface VisualAidCardProps {
  diagram: VisualAidDiagram;
}

export const VisualAidCard: React.FC<VisualAidCardProps> = ({ diagram }) => {
  const [activeComponentIndex, setActiveComponentIndex] = useState<number | null>(0);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-6 shadow-xl overflow-hidden relative">
      
      {/* Header & Tag Badge */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" />
              <span>Visual Concept Aid</span>
            </span>
            <span className="text-xs text-slate-400 capitalize">{diagram.type} Map</span>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            {diagram.title}
          </h3>
          <p className="text-xs text-slate-400 max-w-xl">
            {diagram.description}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {diagram.tags.map((tag, idx) => (
            <span key={idx} className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-mono border border-slate-700/60">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* SVG Interactive Diagram Render Container */}
      <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 relative overflow-hidden flex flex-col items-center justify-center min-h-[260px] group">
        
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-30" />

        {/* Dynamic SVG Visuals based on svgType */}
        <div className="relative z-10 w-full max-w-2xl">
          {diagram.svgType === 'mitosis' ? (
            /* Mitosis Phases Flowchart SVG */
            <svg viewBox="0 0 600 150" className="w-full h-auto text-indigo-400">
              {/* Stage 1: Prophase */}
              <g className="cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setActiveComponentIndex(0)}>
                <circle cx="60" cy="75" r="45" fill="#1e1b4b" stroke="#6366f1" strokeWidth="3" />
                <circle cx="60" cy="75" r="25" fill="none" stroke="#818cf8" strokeDasharray="3,3" />
                <path d="M 48 65 Q 60 85 72 65" stroke="#c084fc" strokeWidth="3" fill="none" />
                <path d="M 52 85 Q 60 65 68 85" stroke="#38bdf8" strokeWidth="3" fill="none" />
                <text x="60" y="138" textAnchor="middle" fill="#94a3b8" fontSize="12" fontWeight="bold">1. Prophase</text>
              </g>
              <path d="M 115 75 L 145 75" stroke="#475569" strokeWidth="3" markerEnd="url(#arrow)" />

              {/* Stage 2: Metaphase */}
              <g className="cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setActiveComponentIndex(1)}>
                <circle cx="195" cy="75" r="45" fill="#1e1b4b" stroke="#8b5cf6" strokeWidth="3" />
                <line x1="195" y1="35" x2="195" y2="115" stroke="#a855f7" strokeWidth="2" strokeDasharray="2,2" />
                <path d="M 190 60 L 200 60 M 190 75 L 200 75 M 190 90 L 200 90" stroke="#f43f5e" strokeWidth="4" />
                <text x="195" y="138" textAnchor="middle" fill="#94a3b8" fontSize="12" fontWeight="bold">2. Metaphase</text>
              </g>
              <path d="M 250 75 L 280 75" stroke="#475569" strokeWidth="3" />

              {/* Stage 3: Anaphase */}
              <g className="cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setActiveComponentIndex(2)}>
                <ellipse cx="330" cy="75" rx="45" ry="40" fill="#1e1b4b" stroke="#ec4899" strokeWidth="3" />
                <path d="M 305 60 Q 300 75 305 90 M 355 60 Q 360 75 355 90" stroke="#fb7185" strokeWidth="4" fill="none" />
                <text x="330" y="138" textAnchor="middle" fill="#94a3b8" fontSize="12" fontWeight="bold">3. Anaphase</text>
              </g>
              <path d="M 385 75 L 415 75" stroke="#475569" strokeWidth="3" />

              {/* Stage 4: Telophase & Cytokinesis */}
              <g className="cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setActiveComponentIndex(3)}>
                <circle cx="475" cy="55" r="30" fill="#1e1b4b" stroke="#10b981" strokeWidth="3" />
                <circle cx="475" cy="95" r="30" fill="#1e1b4b" stroke="#10b981" strokeWidth="3" />
                <text x="475" y="138" textAnchor="middle" fill="#94a3b8" fontSize="12" fontWeight="bold">4. Cytokinesis</text>
              </g>
            </svg>
          ) : diagram.svgType === 'tcpip' ? (
            /* TCP/IP 4-Layer Stack SVG */
            <svg viewBox="0 0 600 160" className="w-full h-auto">
              <g className="cursor-pointer" onClick={() => setActiveComponentIndex(0)}>
                <rect x="50" y="10" width="500" height="30" rx="8" fill="#312e81" stroke="#6366f1" strokeWidth="2" />
                <text x="300" y="30" textAnchor="middle" fill="#e0e7ff" fontSize="13" fontWeight="bold">Layer 4: Application Layer (HTTP, HTTPS, DNS, SSH)</text>
              </g>
              <g className="cursor-pointer" onClick={() => setActiveComponentIndex(1)}>
                <rect x="50" y="48" width="500" height="30" rx="8" fill="#4c1d95" stroke="#8b5cf6" strokeWidth="2" />
                <text x="300" y="68" textAnchor="middle" fill="#ede9fe" fontSize="13" fontWeight="bold">Layer 3: Transport Layer (TCP - Reliable / UDP - Fast)</text>
              </g>
              <g className="cursor-pointer" onClick={() => setActiveComponentIndex(2)}>
                <rect x="50" y="86" width="500" height="30" rx="8" fill="#831843" stroke="#ec4899" strokeWidth="2" />
                <text x="300" y="106" textAnchor="middle" fill="#fce7f3" fontSize="13" fontWeight="bold">Layer 2: Internet Layer (IP Routing, ICMP Diagnostics)</text>
              </g>
              <g className="cursor-pointer" onClick={() => setActiveComponentIndex(3)}>
                <rect x="50" y="124" width="500" height="30" rx="8" fill="#064e3b" stroke="#10b981" strokeWidth="2" />
                <text x="300" y="144" textAnchor="middle" fill="#d1fae5" fontSize="13" fontWeight="bold">Layer 1: Network Access / Link (Ethernet, Wi-Fi MAC)</text>
              </g>
            </svg>
          ) : (
            /* Generic Flowchart SVG */
            <svg viewBox="0 0 600 130" className="w-full h-auto">
              <g className="cursor-pointer" onClick={() => setActiveComponentIndex(0)}>
                <rect x="40" y="40" width="130" height="50" rx="10" fill="#1e1b4b" stroke="#6366f1" strokeWidth="2" />
                <text x="105" y="70" textAnchor="middle" fill="#e0e7ff" fontSize="12" fontWeight="bold">Core Concept</text>
              </g>
              <path d="M 170 65 L 220 65" stroke="#6366f1" strokeWidth="3" />
              <g className="cursor-pointer" onClick={() => setActiveComponentIndex(1)}>
                <rect x="220" y="40" width="150" height="50" rx="10" fill="#4c1d95" stroke="#a855f7" strokeWidth="2" />
                <text x="295" y="70" textAnchor="middle" fill="#f3e8ff" fontSize="12" fontWeight="bold">Process Transformation</text>
              </g>
              <path d="M 370 65 L 420 65" stroke="#a855f7" strokeWidth="3" />
              <g className="cursor-pointer" onClick={() => setActiveComponentIndex(2)}>
                <rect x="420" y="40" width="140" height="50" rx="10" fill="#064e3b" stroke="#10b981" strokeWidth="2" />
                <text x="490" y="70" textAnchor="middle" fill="#d1fae5" fontSize="12" fontWeight="bold">Target Outcome</text>
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
              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-200 shadow-md ring-1 ring-indigo-500/30'
                  : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-xs">
                <CheckCircle2 className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-400' : 'text-slate-600'}`} />
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
