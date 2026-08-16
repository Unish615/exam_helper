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
          className="fixed inset-0 bg-[#123022]/85 backdrop-blur-md"
          onClick={() => {
            if (hasChecked) onClose();
          }}
        />

        {/* Modal Container using Deep Espresso & Forest Green */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg bg-[#2F1A13] border border-[#4A2C21] rounded-2xl shadow-2xl overflow-hidden z-10"
        >
          {/* Accent Bar */}
          <div className="h-2 w-full bg-gradient-to-r from-[#1C4632] via-[#F8D5C2] to-[#4A2C21]" />

          <div className="p-6 sm:p-7 space-y-6">
            
            {/* Header */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-[#F8D5C2]/15 text-[#F8D5C2] border border-[#F8D5C2]/30 uppercase tracking-wider">
                  Important Notice
                </span>
                <span className="text-xs text-[#FBF2EB]/70">Academic Guidelines</span>
              </div>
              <h3 className="text-xl font-bold text-[#FBF2EB] tracking-tight">
                Accuracy & Verification Notice
              </h3>
            </div>

            {/* Disclaimer Text Box */}
            <div className="p-4 rounded-xl bg-[#123022] border border-[#1C4632] text-[#FBF2EB] text-sm leading-relaxed space-y-3">
              <p className="font-medium text-[#FBF2EB]">
                &ldquo;Notice: Nyoria converts your notes into practice questions and simplified summaries. AI-generated responses can occasionally contain errors. Please cross-verify critical information with official textbooks.&rdquo;
              </p>
              <div className="pt-2 border-t border-[#1C4632] text-xs text-[#F8D5C2]/80">
                Nyoria is built to empower active recall, concept revision, and self-testing.
              </div>
            </div>

            {/* Checkbox Acknowledgment */}
            <label className="flex items-start gap-3 p-3 rounded-xl bg-[#123022]/60 hover:bg-[#123022] border border-[#4A2C21] cursor-pointer transition-colors select-none">
              <input
                type="checkbox"
                checked={hasChecked}
                onChange={(e) => setHasChecked(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-[#4A2C21] bg-[#2F1A13] text-[#1C4632] focus:ring-[#1C4632]"
              />
              <span className="text-xs text-[#FBF2EB]/90">
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
                    ? 'bg-gradient-to-r from-[#1C4632] to-[#2F1A13] hover:from-[#1C4632] hover:to-[#4A2C21] text-[#F8D5C2] border border-[#F8D5C2]/50 shadow-lg scale-[1.02] cursor-pointer glow-forest'
                    : 'bg-[#123022] text-[#FBF2EB]/40 cursor-not-allowed border border-[#4A2C21]/50'
                }`}
              >
                <span>I Understand & Continue</span>
              </button>
            </div>

          </div>

          {/* Footer Note */}
          <div className="px-6 py-3 bg-[#123022] border-t border-[#4A2C21] flex items-center justify-between text-xs text-[#F8D5C2]/70">
            <span>Nyoria Privacy & Study Safety</span>
            <span className="text-[11px]">Re-open anytime via top navigation</span>
          </div>

        </motion.div>

      </div>
    </AnimatePresence>
  );
};
