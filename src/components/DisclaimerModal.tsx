'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle2, ShieldCheck, BookOpen, ExternalLink } from 'lucide-react';

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
        
        {/* Animated Subtle Blur Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
          onClick={() => {
            if (hasChecked) onClose();
          }}
        />

        {/* Animated Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-10"
        >
          {/* Top Decorative Gradient Line */}
          <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-indigo-500 to-purple-500" />

          <div className="p-6 sm:p-7 space-y-6">
            
            {/* Header Badge & Title */}
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
                <AlertTriangle className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-wider">
                    Important Notice
                  </span>
                  <span className="text-xs text-slate-400">Academic Disclaimer</span>
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  Accuracy & Verification Guidelines
                </h3>
              </div>
            </div>

            {/* Disclaimer Content Box */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-300 text-sm leading-relaxed space-y-3">
              <p className="font-medium text-slate-200">
                &ldquo;Important Notice: While Nyoria uses advanced processing to generate helpful exam questions and simple explanations, AI-generated content may not be 100% accurate. Please cross-verify critical information with your official textbooks.&rdquo;
              </p>
              <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2 text-xs text-slate-400">
                <BookOpen className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Designed to empower active recall, revision, and self-testing.</span>
              </div>
            </div>

            {/* Checkbox Acknowledgment */}
            <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800/70 border border-slate-700/50 cursor-pointer transition-colors select-none">
              <input
                type="checkbox"
                checked={hasChecked}
                onChange={(e) => setHasChecked(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900"
              />
              <span className="text-xs text-slate-300">
                I acknowledge that AI study tools supplement—rather than replace—official syllabus reading and instructor guidance.
              </span>
            </label>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                disabled={!hasChecked}
                onClick={onClose}
                className={`w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-lg transition-all duration-300 ${
                  hasChecked
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-600/30 scale-[1.02] cursor-pointer'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/40'
                }`}
              >
                <CheckCircle2 className={`w-4 h-4 ${hasChecked ? 'text-emerald-300 animate-bounce' : 'text-slate-500'}`} />
                <span>I Understand & Agree</span>
              </button>
            </div>

          </div>

          {/* Footer Note */}
          <div className="px-6 py-3 bg-slate-950/90 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>Nyoria Privacy & Study Safety First</span>
            </div>
            <span className="text-[11px] text-slate-400">You can re-open this anytime</span>
          </div>

        </motion.div>

      </div>
    </AnimatePresence>
  );
};
