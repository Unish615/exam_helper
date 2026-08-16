'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Bookmark, 
  Trash2, 
  BookOpen, 
  Clock, 
  ChevronRight,
  FolderOpen
} from 'lucide-react';
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
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
        />

        {/* Drawer Panel */}
        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col justify-between z-10"
          >
            {/* Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-indigo-600/10 text-indigo-400 border border-indigo-500/20">
                  <Bookmark className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Saved Study Kits</h3>
                  <p className="text-xs text-slate-400">Stored locally in browser</p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content List */}
            <div className="p-5 flex-1 overflow-y-auto space-y-3">
              {savedKits.length === 0 ? (
                <div className="text-center py-12 space-y-3 text-slate-400">
                  <FolderOpen className="w-10 h-10 mx-auto text-slate-600" />
                  <p className="text-sm font-semibold">No Saved Kits Yet</p>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Generate study materials and click &ldquo;Save Kit to Library&rdquo; to access them anytime.
                  </p>
                </div>
              ) : (
                savedKits.map((kit) => (
                  <div
                    key={kit.id}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/40 transition-all space-y-2 group"
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
                        className="text-slate-500 hover:text-rose-400 p-1 transition-colors shrink-0"
                        title="Delete saved kit"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2">
                      {kit.summary}
                    </p>

                    <div className="pt-2 flex items-center justify-between border-t border-slate-800/80 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-indigo-400" />
                        <span>{kit.createdAt}</span>
                      </span>

                      <button
                        onClick={() => {
                          onSelectKit(kit);
                          onClose();
                        }}
                        className="px-3 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 font-semibold flex items-center gap-1 transition-colors"
                      >
                        <span>Load Kit</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950 text-center text-xs text-slate-400">
              {savedKits.length} study session{savedKits.length === 1 ? '' : 's'} saved
            </div>

          </motion.div>
        </div>

      </div>
    </AnimatePresence>
  );
};
