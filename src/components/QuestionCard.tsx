'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  CheckSquare, 
  Square, 
  Lightbulb, 
  Sparkles, 
  Copy, 
  Check, 
  X,
  HelpCircle,
  BookOpen,
  Zap,
  Tag,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { QuestionItem } from '../lib/types';

interface QuestionCardProps {
  question: QuestionItem;
  index: number;
  onToggleLearned: (id: string) => void;
  onSelectMCQOption?: (questionId: string, optionId: string) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  index,
  onToggleLearned,
  onSelectMCQOption
}) => {
  // Local state for interactive option choice selection
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(
    question.userSelectedOptionId || null
  );
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const isMCQ = question.type === 'MCQ';
  const hasSelected = selectedOptionId !== null;

  const handleSelectOption = (optId: string) => {
    if (selectedOptionId !== null) return; // Prevent changing choice once picked
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
      case 'MCQ': return { label: 'Interactive MCQ', color: 'bg-zinc-800 text-zinc-200 border-zinc-700' };
      case 'Short': return { label: 'Short Question', color: 'bg-zinc-800 text-zinc-300 border-zinc-700' };
      case 'Essay': return { label: 'Long Answer', color: 'bg-zinc-800 text-zinc-300 border-zinc-700' };
      case 'Definition': return { label: 'Key Concept', color: 'bg-zinc-800 text-zinc-300 border-zinc-700' };
      case 'FillBlank': return { label: 'Fill-in-Blank', color: 'bg-zinc-800 text-zinc-300 border-zinc-700' };
      default: return { label: type, color: 'bg-zinc-800 text-zinc-300 border-zinc-700' };
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
          ? 'bg-zinc-950/80 border-emerald-500/40 shadow-sm'
          : 'bg-zinc-900/90 border-zinc-800/90 hover:border-zinc-700 shadow-xl'
      }`}
    >
      {/* Question Header Bar */}
      <div className="p-4 sm:p-5 space-y-4">
        
        {/* Top Badges & Actions */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="font-mono font-bold text-zinc-400">
              Q{index + 1}
            </span>
            
            <span className={`px-2.5 py-0.5 rounded-full border font-semibold text-[11px] ${badge.color}`}>
              {badge.label}
            </span>

            <span className="px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700 font-semibold text-[11px]">
              {question.difficulty}
            </span>

            {question.topicTag && (
              <span className="px-2.5 py-0.5 rounded-full bg-zinc-950 text-zinc-400 text-[11px] flex items-center gap-1 border border-zinc-800">
                <Tag className="w-3 h-3 text-zinc-400" />
                <span>{question.topicTag}</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Mark as Learned Checkbox */}
            <button
              onClick={() => onToggleLearned(question.id)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
                question.learned
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200 border-zinc-700'
              }`}
              title={question.learned ? "Mark as Needs Revision" : "Mark as Mastered"}
            >
              {question.learned ? (
                <>
                  <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Mastered</span>
                </>
              ) : (
                <>
                  <Square className="w-3.5 h-3.5" />
                  <span>Mark Mastered</span>
                </>
              )}
            </button>

            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-100 transition-colors border border-zinc-700"
              title="Copy question & solution"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Question Text */}
        <h3 className={`text-base sm:text-lg font-bold leading-snug transition-colors ${
          question.learned ? 'text-zinc-400 line-through' : 'text-zinc-100'
        }`}>
          {question.question}
        </h3>

        {/* ======================================================== */}
        {/* INTERACTIVE MCQ PRACTICE SYSTEM (4 Selectable Options)     */}
        {/* ======================================================== */}
        {isMCQ && question.options && question.options.length > 0 && (
          <div className="space-y-3 pt-2">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
              Select an Option to Practice:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {question.options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                const isCorrectOption = opt.isCorrect;

                // Dynamic option styling based on interaction state
                let optionStyle = 'bg-zinc-950 border-zinc-800 text-zinc-200 hover:border-zinc-700 hover:bg-zinc-900/80 cursor-pointer';

                if (hasSelected) {
                  if (isCorrectOption) {
                    // Soft green for the true correct answer
                    optionStyle = 'bg-emerald-950/50 border-emerald-500/80 text-emerald-200 font-bold glow-success';
                  } else if (isSelected && !isCorrectOption) {
                    // Soft red for incorrect selection
                    optionStyle = 'bg-rose-950/50 border-rose-500/80 text-rose-200 font-bold glow-danger';
                  } else {
                    // Dimmed non-selected incorrect choices
                    optionStyle = 'bg-zinc-950/40 border-zinc-900 text-zinc-600 opacity-50 cursor-default';
                  }
                }

                return (
                  <button
                    key={opt.id}
                    disabled={hasSelected}
                    onClick={() => handleSelectOption(opt.id)}
                    className={`p-3.5 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all duration-200 flex items-center justify-between gap-3 ${optionStyle}`}
                  >
                    <span className="leading-snug">{opt.text}</span>

                    {/* Status Icons on Interaction */}
                    {hasSelected && (
                      <span className="shrink-0">
                        {isCorrectOption ? (
                          <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold uppercase">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Correct</span>
                          </div>
                        ) : isSelected ? (
                          <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-extrabold uppercase">
                            <XCircle className="w-3.5 h-3.5 text-rose-400" />
                            <span>Incorrect</span>
                          </div>
                        ) : null}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation Card revealed upon selecting an option */}
            <AnimatePresence>
              {hasSelected && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2 mt-3"
                >
                  <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-zinc-300">
                    <Sparkles className="w-4 h-4 text-zinc-200" />
                    <span>Explanation & Core Concept Solution:</span>
                  </div>
                  
                  <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed font-medium">
                    {question.explanation}
                  </p>

                  {question.mnemonic && (
                    <div className="pt-2 flex items-center gap-2 text-xs text-zinc-400 border-t border-zinc-800/80">
                      <Zap className="w-3.5 h-3.5 text-zinc-300 shrink-0" />
                      <span><strong>Memory Mnemonic:</strong> {question.mnemonic}</span>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Collapsible Accordion for Non-MCQ Questions (Short, Essay, Definitions) */}
        {!isMCQ && (
          <div className="pt-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full py-2.5 px-4 rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-xs font-bold text-zinc-300 flex items-center justify-between transition-colors"
            >
              <span>{isExpanded ? "Hide Answer & Explanation" : "Reveal Answer & Explanation"}</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="mt-3 p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3 text-xs sm:text-sm"
                >
                  <div className="p-3 rounded-lg bg-zinc-900/80 border border-zinc-800 space-y-1">
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                      Simple Answer Solution:
                    </span>
                    <p className="text-zinc-200 font-medium leading-relaxed">
                      {question.answer}
                    </p>
                  </div>

                  {question.explanation && (
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                        Detailed Explanation:
                      </span>
                      <p className="text-zinc-300 leading-relaxed">
                        {question.explanation}
                      </p>
                    </div>
                  )}

                  {question.keyTakeaways && question.keyTakeaways.length > 0 && (
                    <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 space-y-1.5">
                      <span className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                        <Lightbulb className="w-3.5 h-3.5 text-zinc-200" />
                        <span>Key Takeaways:</span>
                      </span>
                      <ul className="list-disc list-inside space-y-1 text-xs text-zinc-300">
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
