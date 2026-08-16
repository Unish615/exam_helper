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
  HelpCircle,
  BookOpen,
  Zap,
  Tag
} from 'lucide-react';
import { QuestionItem } from '../lib/types';

interface QuestionCardProps {
  question: QuestionItem;
  index: number;
  onToggleLearned: (id: string) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  index,
  onToggleLearned,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const textToCopy = `Q${index + 1}: ${question.question}\nAnswer: ${question.answer}\nExplanation: ${question.explanation}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Easy': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Hard': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default: return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'MCQ': return { label: 'Multiple Choice', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' };
      case 'Short': return { label: 'Short Answer', color: 'bg-violet-500/10 text-violet-400 border-violet-500/20' };
      case 'Essay': return { label: 'Essay Question', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' };
      case 'Definition': return { label: 'Definition', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' };
      case 'FillBlank': return { label: 'Fill-in-Blank', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' };
      default: return { label: type, color: 'bg-slate-800 text-slate-300 border-slate-700' };
    }
  };

  const badge = getTypeBadge(question.type);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
        question.learned
          ? 'bg-slate-900/60 border-emerald-500/30 shadow-sm'
          : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 shadow-xl'
      }`}
    >
      {/* Header Bar */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-4 sm:p-5 flex items-start gap-3 sm:gap-4 cursor-pointer select-none group"
      >
        {/* Learned Checkbox */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleLearned(question.id);
          }}
          className="mt-0.5 text-slate-500 hover:text-emerald-400 transition-colors shrink-0"
          title={question.learned ? "Mark as Needs Revision" : "Mark as Learned"}
        >
          {question.learned ? (
            <CheckSquare className="w-5 h-5 text-emerald-400" />
          ) : (
            <Square className="w-5 h-5 text-slate-600 group-hover:text-slate-400" />
          )}
        </button>

        {/* Main Content */}
        <div className="flex-1 space-y-2">
          
          {/* Question Meta Badges */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="font-mono font-bold text-slate-400">
              Q{index + 1}
            </span>
            
            <span className={`px-2 py-0.5 rounded-full border font-semibold text-[11px] ${badge.color}`}>
              {badge.label}
            </span>

            <span className={`px-2 py-0.5 rounded-full border font-semibold text-[11px] ${getDifficultyColor(question.difficulty)}`}>
              {question.difficulty}
            </span>

            {question.topicTag && (
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[11px] flex items-center gap-1 border border-slate-700/60">
                <Tag className="w-3 h-3 text-indigo-400" />
                <span>{question.topicTag}</span>
              </span>
            )}
          </div>

          {/* Question Text */}
          <h3 className={`text-sm sm:text-base font-semibold transition-colors ${
            question.learned ? 'text-slate-400 line-through' : 'text-slate-100 group-hover:text-indigo-300'
          }`}>
            {question.question}
          </h3>

        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-indigo-300 transition-colors"
            title="Copy question & answer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            className="p-1.5 rounded-lg bg-slate-800/60 text-slate-400 group-hover:text-indigo-300 transition-transform duration-300"
            style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Accordion Expandable Answer Body */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="border-t border-slate-800/80 bg-slate-950/70 p-4 sm:p-5 space-y-4 text-sm"
          >
            
            {/* MCQ Options Display if available */}
            {question.options && question.options.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Options:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {question.options.map((opt) => (
                    <div
                      key={opt.id}
                      className={`p-3 rounded-xl border text-xs font-medium flex items-center justify-between transition-all ${
                        opt.isCorrect
                          ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 font-bold'
                          : 'bg-slate-900/80 border-slate-800 text-slate-300'
                      }`}
                    >
                      <span>{opt.text}</span>
                      {opt.isCorrect && (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold uppercase">
                          Correct Answer
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Direct Simplified Answer Box */}
            <div className="p-4 rounded-xl bg-indigo-600/10 border border-indigo-500/20 space-y-1.5">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Ultra-Simple Solution & Answer:</span>
              </div>
              <p className="text-slate-200 font-medium leading-relaxed">
                {question.answer}
              </p>
            </div>

            {/* Detailed Explanation */}
            {question.explanation && (
              <div className="space-y-1.5 text-slate-300">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Detailed Concept Breakdown:
                </span>
                <p className="text-slate-300 leading-relaxed text-xs sm:text-sm">
                  {question.explanation}
                </p>
              </div>
            )}

            {/* Key Takeaways Highlights */}
            {question.keyTakeaways && question.keyTakeaways.length > 0 && (
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  <span>Key Exam Takeaways:</span>
                </span>
                <ul className="list-disc list-inside space-y-1 text-xs text-slate-300">
                  {question.keyTakeaways.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Memory Mnemonic Hook if present */}
            {question.mnemonic && (
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center gap-2 text-xs text-purple-300">
                <Zap className="w-4 h-4 text-purple-400 shrink-0" />
                <span><strong>Memory Hook (Mnemonic):</strong> {question.mnemonic}</span>
              </div>
            )}

          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};
