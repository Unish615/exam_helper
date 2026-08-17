'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GeneratedStudyKit } from '../lib/types';

interface SavedKitsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedKits: GeneratedStudyKit[];
  onSelectKit: (kit: GeneratedStudyKit) => void;
  onDeleteKit: (id: string) => void;
}

export const SavedKitsDrawer: React.FC<SavedKitsDrawerProps> = ({
  isOpen,
  onClose,
  savedKits,
  onSelectKit,
  onDeleteKit,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#0B0F19]/85 backdrop-blur-sm"
        />

        {/* Drawer Container */}
        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-screen max-w-md bg-[#111827] border-l border-[#1E293B] shadow-2xl flex flex-col justify-between z-10"
          >
            {/* Header */}
            <div className="p-5 border-b border-[#1E293B] flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Saved Study Sets</h3>
                <p className="text-xs text-slate-400">Stored locally in your browser</p>
              </div>

              <button
                onClick={onClose}
                className="px-2.5 py-1 rounded-lg bg-[#0B0F19] text-slate-400 hover:text-white border border-[#1E293B] text-xs font-bold transition-colors"
              >
                Close
              </button>
            </div>

            {/* List */}
            <div className="p-5 flex-1 overflow-y-auto space-y-3">
              {savedKits.length === 0 ? (
                <div className="text-center py-12 space-y-3 text-slate-400">
                  <p className="text-sm font-semibold text-slate-300">No Saved Sets Yet</p>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Generate exam materials and click &ldquo;Save to Library&rdquo; to store them for offline revision.
                  </p>
                </div>
              ) : (
                savedKits.map((kit) => (
                  <div
                    key={kit.id}
                    className="p-4 rounded-xl bg-[#0B0F19] border border-[#1E293B] hover:border-indigo-500/40 transition-all space-y-2 group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-bold text-slate-100 group-hover:text-indigo-300 transition-colors line-clamp-1">
                        {kit.title}
                      </h4>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteKit(kit.id);
                        }}
                        className="text-slate-500 hover:text-rose-400 text-xs font-semibold px-1.5 py-0.5 transition-colors shrink-0"
                        title="Delete set"
                      >
                        Delete
                      </button>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2">
                      {kit.summary}
                    </p>

                    <div className="pt-2 flex items-center justify-between border-t border-[#1E293B] text-[11px] text-slate-500">
                      <span>{kit.createdAt}</span>

                      <button
                        onClick={() => {
                          onSelectKit(kit);
                          onClose();
                        }}
                        className="px-3 py-1 rounded-lg bg-[#1E293B] hover:bg-indigo-600/20 text-indigo-300 font-semibold transition-colors border border-indigo-500/30"
                      >
                        Load Set →
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[#1E293B] bg-[#0B0F19] text-center text-xs text-slate-400">
              {savedKits.length} study set{savedKits.length === 1 ? '' : 's'} saved
            </div>

          </motion.div>
        </div>

      </div>
    </AnimatePresence>
  );
};
