'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DisclaimerModal: React.FC<DisclaimerModalProps> = ({ isOpen, onClose }) => {
  const [hasChecked, setHasChecked] = useState(false);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 bg-[#090D16]/85 backdrop-blur-md"
          onClick={() => {
            if (hasChecked) onClose();
          }}
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg bg-[#0D1322] border border-[#1E293B] rounded-2xl shadow-2xl overflow-hidden z-10"
        >
          {/* Top Gradient Accent Bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#00F2FE] via-[#10B981] to-[#4FACFE]" />

          <div className="p-6 sm:p-7 space-y-6">
            
            {/* Header */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-[#00F2FE]/10 text-[#00F2FE] border border-[#00F2FE]/30 uppercase tracking-wider">
                  Important Notice
                </span>
                <span className="text-xs text-slate-400">Academic Guidelines</span>
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                Accuracy & Verification Notice
              </h3>
            </div>

            {/* Disclaimer Text Box */}
            <div className="p-4 rounded-xl bg-[#090D16] border border-[#1E293B] text-slate-300 text-sm leading-relaxed space-y-3">
              <p className="font-medium text-slate-100">
                &ldquo;Notice: Nyoria converts your notes into practice questions and simplified summaries. AI-generated responses can occasionally contain errors. Please cross-verify critical information with official textbooks.&rdquo;
              </p>
              <div className="pt-2 border-t border-[#1E293B] text-xs text-slate-400">
                Nyoria is built to empower active recall, concept revision, and self-testing.
              </div>
            </div>

            {/* Checkbox Acknowledgment */}
            <label className="flex items-start gap-3 p-3 rounded-xl bg-[#090D16]/60 hover:bg-[#090D16] border border-[#1E293B] cursor-pointer transition-colors select-none">
              <input
                type="checkbox"
                checked={hasChecked}
                onChange={(e) => setHasChecked(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-slate-700 bg-[#0D1322] text-[#00F2FE] focus:ring-[#00F2FE]"
              />
              <span className="text-xs text-slate-300">
                I understand that generated study materials supplement official textbook reading and instructor guidance.
              </span>
            </label>

            {/* Button: "I Understand & Continue" */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                disabled={!hasChecked}
                onClick={onClose}
                className={`w-full sm:w-auto px-6 py-3 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all duration-300 ${
                  hasChecked
                    ? 'bg-gradient-to-r from-[#00F2FE] to-[#4FACFE] text-[#090D16] font-black shadow-lg shadow-[#00F2FE]/25 scale-[1.02] cursor-pointer glow-cyber'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                }`}
              >
                <span>I Understand & Continue</span>
              </button>
            </div>

          </div>

          {/* Footer Note */}
          <div className="px-6 py-3 bg-[#090D16] border-t border-[#1E293B] flex items-center justify-between text-xs text-slate-400">
            <span>Nyoria Privacy & Study Safety</span>
            <span className="text-[11px]">Re-open anytime via top navigation</span>
          </div>

        </motion.div>

      </div>
    </AnimatePresence>
  );
};
