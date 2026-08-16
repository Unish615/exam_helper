'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, CheckCircle2, ShieldCheck, BookOpen } from 'lucide-react';

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
        
        {/* Gray-tinted Frosted Backdrop Blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 bg-zinc-950/80 backdrop-blur-md"
          onClick={() => {
            if (hasChecked) onClose();
          }}
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-10"
        >
          {/* Top Decorative Monochrome Accent Line */}
          <div className="h-1.5 w-full bg-gradient-to-r from-zinc-600 via-zinc-400 to-zinc-200" />

          <div className="p-6 sm:p-7 space-y-6">
            
            {/* Header Icon & Title */}
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-300 shrink-0">
                <ShieldAlert className="w-6 h-6 text-zinc-200" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700 uppercase tracking-wider">
                    Important Notice
                  </span>
                  <span className="text-xs text-zinc-400">Academic Guidelines</span>
                </div>
                <h3 className="text-xl font-extrabold text-zinc-100 tracking-tight">
                  Accuracy & Study Safety Policy
                </h3>
              </div>
            </div>

            {/* Disclaimer Exact Text Box */}
            <div className="p-4 rounded-xl bg-zinc-950/90 border border-zinc-800 text-zinc-300 text-sm leading-relaxed space-y-3">
              <p className="font-medium text-zinc-200">
                &ldquo;Important Notice: Nyoria processes your materials to generate exam questions, simple answers, and visual aids. AI-generated content may not be 100% accurate. Please cross-verify critical facts with your official study sources.&rdquo;
              </p>
              <div className="pt-2 border-t border-zinc-800/80 flex items-center gap-2 text-xs text-zinc-400">
                <BookOpen className="w-4 h-4 text-zinc-400 shrink-0" />
                <span>Nyoria is designed for active recall, self-testing, and exam revision.</span>
              </div>
            </div>

            {/* Checkbox Acknowledgment */}
            <label className="flex items-start gap-3 p-3 rounded-xl bg-zinc-950/50 hover:bg-zinc-950/80 border border-zinc-800 cursor-pointer transition-colors select-none">
              <input
                type="checkbox"
                checked={hasChecked}
                onChange={(e) => setHasChecked(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-zinc-100 focus:ring-zinc-500 focus:ring-offset-zinc-900"
              />
              <span className="text-xs text-zinc-300">
                I understand that generated questions are study aids and I agree to cross-verify critical textbook facts.
              </span>
            </label>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                disabled={!hasChecked}
                onClick={onClose}
                className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 ${
                  hasChecked
                    ? 'bg-zinc-100 hover:bg-white text-zinc-950 shadow-lg shadow-zinc-500/10 scale-[1.02] cursor-pointer'
                    : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700/40'
                }`}
              >
                <CheckCircle2 className={`w-4 h-4 ${hasChecked ? 'text-emerald-600 animate-bounce' : 'text-zinc-500'}`} />
                <span>I Understand & Agree</span>
              </button>
            </div>

          </div>

          {/* Footer Note */}
          <div className="px-6 py-3 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
              <span>Nyoria Privacy & Academic Integrity</span>
            </div>
            <span className="text-[11px]">Re-open anytime via top navigation</span>
          </div>

        </motion.div>

      </div>
    </AnimatePresence>
  );
};
