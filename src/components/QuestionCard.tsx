'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuestionItem } from '../lib/types';

interface QuestionCardProps {
  question: QuestionItem;
  index: number;
  onToggleLearned: (id: string) => void;
  onToggleMarkForReview?: (id: string) => void;
  onSelectMCQOption?: (questionId: string, optionId: string) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  index,
  onToggleLearned,
  onToggleMarkForReview,
  onSelectMCQOption
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(
    question.userSelectedOptionId || null
  );
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const isMCQ = question.type === 'MCQ';
  const hasSelected = selectedOptionId !== null;

  const handleSelectOption = (optId: string) => {
    if (selectedOptionId !== null) return; // Lock options to prevent re-selection
    setSelectedOptionId(optId);
    if (onSelectMCQOption) {
      onSelectMCQOption(question.id, optId);
    }
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const textToCopy = `Q${index + 1}: ${question.question}\nAnswer: ${question.answer}\nExplanation: ${question.explanation}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'MCQ': return { label: 'Interactive MCQ', color: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20' };
      case 'Short': return { label: 'Short Note', color: 'bg-violet-500/10 text-violet-300 border-violet-500/20' };
      case 'Essay': return { label: 'Long Answer', color: 'bg-purple-500/10 text-purple-300 border-purple-500/20' };
      case 'Definition': return { label: 'Key Concept', color: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20' };
      case 'FillBlank': return { label: 'Fill-in-Blank', color: 'bg-teal-500/10 text-teal-300 border-teal-500/20' };
      default: return { label: type, color: 'bg-slate-800 text-slate-300 border-slate-700' };
    }
  };

  const badge = getTypeBadge(question.type);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
        question.learned
          ? 'bg-slate-900/60 border-emerald-500/30 shadow-sm'
          : question.markedForReview
          ? 'bg-slate-900/90 border-amber-500/50 shadow-lg'
          : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 shadow-xl'
      }`}
    >
      {/* Header Bar */}
      <div className="p-4 sm:p-5 space-y-4">
        
        {/* Badges & Actions (No Icons) */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="font-mono font-bold text-slate-400">
              Q{index + 1}
            </span>
            
            <span className={`px-2.5 py-0.5 rounded-full border font-semibold text-[11px] ${badge.color}`}>
              {badge.label}
            </span>

            <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-semibold text-[11px]">
              {question.difficulty}
            </span>

            {question.topicTag && (
              <span className="px-2.5 py-0.5 rounded-full bg-slate-950 text-slate-400 text-[11px] border border-slate-800">
                #{question.topicTag}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            
            {/* Mark for Review Button */}
            <button
              onClick={() => onToggleMarkForReview && onToggleMarkForReview(question.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors border ${
                question.markedForReview
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200 border-slate-700'
              }`}
              title="Flag question for review"
            >
              {question.markedForReview ? 'Flagged' : 'Flag Review'}
            </button>

            {/* Mark as Mastered Checkbox */}
            <button
              onClick={() => onToggleLearned(question.id)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors border ${
                question.learned
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200 border-slate-700'
              }`}
              title={question.learned ? "Mark as Needs Revision" : "Mark as Mastered"}
            >
              {question.learned ? '✓ Mastered' : 'Mark Mastered'}
            </button>

            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors border border-slate-700"
              title="Copy question & solution"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Question Text */}
        <h3 className={`text-base sm:text-lg font-bold leading-snug transition-colors ${
          question.learned ? 'text-slate-400 line-through' : 'text-slate-100'
        }`}>
          {question.question}
        </h3>

        {/* ======================================================== */}
        {/* INTERACTIVE MCQ QUIZ CARDS (4 Option Buttons A, B, C, D)   */}
        {/* ======================================================== */}
        {isMCQ && question.options && question.options.length > 0 && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
              <span>Select Option (A, B, C, D):</span>
              {hasSelected && <span className="text-emerald-400 font-mono">Options Locked</span>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {question.options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                const isCorrectOption = opt.isCorrect;

                let optionStyle = 'bg-slate-950 border-slate-800 text-slate-200 hover:border-indigo-500/50 hover:bg-slate-900 cursor-pointer';

                if (hasSelected) {
                  if (isCorrectOption) {
                    // Emerald Green (#10B981) for Correct Answer
                    optionStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-200 font-bold glow-emerald';
                  } else if (isSelected && !isCorrectOption) {
                    // Rose Red (#EF4444) for Incorrect Choice
                    optionStyle = 'bg-rose-500/20 border-rose-500 text-rose-200 font-bold glow-rose';
                  } else {
                    // Dimmed options
                    optionStyle = 'bg-slate-950/40 border-slate-900 text-slate-600 opacity-50 cursor-default';
                  }
                }

                return (
                  <button
                    key={opt.id}
                    disabled={hasSelected}
                    onClick={() => handleSelectOption(opt.id)}
                    className={`p-3.5 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all duration-200 flex items-center justify-between gap-3 ${optionStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 border ${
                        hasSelected && isCorrectOption
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                          : hasSelected && isSelected && !isCorrectOption
                          ? 'bg-rose-500 text-slate-950 border-rose-400'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}>
                        {opt.label}
                      </span>
                      <span className="leading-snug">{opt.text}</span>
                    </div>

                    {/* Status Feedback (No Lucide Icons) */}
                    {hasSelected && (
                      <span className="shrink-0">
                        {isCorrectOption ? (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold uppercase">
                            ✓ Correct
                          </motion.div>
                        ) : isSelected ? (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-extrabold uppercase">
                            ✗ Incorrect
                          </motion.div>
                        ) : null}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Smoothly expanded Explanation Box */}
            <AnimatePresence>
              {hasSelected && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 mt-3"
                >
                  <div className="font-bold text-xs uppercase tracking-wider text-indigo-400">
                    Explanation & Solution:
                  </div>
                  
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                    {question.explanation}
                  </p>

                  {question.keyTakeaways && question.keyTakeaways.length > 0 && (
                    <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 space-y-1">
                      <span className="text-xs font-bold text-amber-300">
                        Key Concept Takeaways:
                      </span>
                      <ul className="list-disc list-inside space-y-1 text-xs text-slate-300">
                        {question.keyTakeaways.map((pt, idx) => (
                          <li key={idx}>{pt}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {question.mnemonic && (
                    <div className="pt-2 text-xs text-purple-300 border-t border-slate-800">
                      <strong>Memory Mnemonic:</strong> {question.mnemonic}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Collapsible Accordions for Short / Long Answers */}
        {!isMCQ && (
          <div className="pt-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 flex items-center justify-between transition-colors"
            >
              <span>{isExpanded ? "Hide Answer & Explanation" : "Reveal Answer & Explanation"}</span>
              <span>{isExpanded ? "[-]" : "[+]"}</span>
            </button>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="mt-3 p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs sm:text-sm"
                >
                  <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 space-y-1">
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">
                      Simple Answer Solution:
                    </span>
                    <p className="text-slate-100 font-medium leading-relaxed">
                      {question.answer}
                    </p>
                  </div>

                  {question.explanation && (
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                        Detailed Concept Explanation:
                      </span>
                      <p className="text-slate-300 leading-relaxed">
                        {question.explanation}
                      </p>
                    </div>
                  )}

                  {question.keyTakeaways && question.keyTakeaways.length > 0 && (
                    <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 space-y-1.5">
                      <span className="text-xs font-bold text-amber-300">
                        Bold Key Takeaways:
                      </span>
                      <ul className="list-disc list-inside space-y-1 text-xs text-slate-300">
                        {question.keyTakeaways.map((point, idx) => (
                          <li key={idx}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

      </div>

    </motion.div>
  );
};
