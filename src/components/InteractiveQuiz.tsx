'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  XCircle, 
  Award, 
  RotateCcw, 
  Sparkles, 
  ChevronRight, 
  HelpCircle,
  Trophy
} from 'lucide-react';
import { QuestionItem } from '../lib/types';

interface InteractiveQuizProps {
  questions: QuestionItem[];
}

export const InteractiveQuiz: React.FC<InteractiveQuizProps> = ({ questions }) => {
  // Filter for questions that have options or convert short questions
  const quizQuestions = questions.filter(q => q.options && q.options.length > 0);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ questionId: string; optionId: string; isCorrect: boolean }[]>([]);
  const [quizFinished, setQuizFinished] = useState(false);

  if (quizQuestions.length === 0) {
    return (
      <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
        <HelpCircle className="w-10 h-10 text-indigo-400 mx-auto" />
        <h4 className="text-lg font-bold text-white">No Multiple Choice Questions Available</h4>
        <p className="text-xs text-slate-400">
          Re-generate study material with "MCQs" selected in generator options to use Mock Quiz Mode.
        </p>
      </div>
    );
  }

  const currentQ = quizQuestions[currentIndex];

  const handleSelectOption = (optionId: string, isCorrect: boolean) => {
    if (isAnswered) return;
    setSelectedOptionId(optionId);
    setIsAnswered(true);

    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    setUserAnswers(prev => [...prev, { questionId: currentQ.id, optionId, isCorrect }]);
  };

  const handleNext = () => {
    if (currentIndex + 1 < quizQuestions.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOptionId(null);
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
      // Trigger confetti celebration
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // Fallback
      }
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setIsAnswered(false);
    setScore(0);
    setUserAnswers([]);
    setQuizFinished(false);
  };

  const percentage = Math.round((score / quizQuestions.length) * 100);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-7 space-y-6 shadow-xl">
      
      {/* Header & Score counter */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 flex-wrap gap-3">
        <div className="space-y-1">
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider flex items-center gap-1 w-fit">
            <Trophy className="w-3.5 h-3.5" />
            <span>Interactive Exam Mode</span>
          </span>
          <h3 className="text-xl font-bold text-white">
            Practice Quiz Assessment
          </h3>
        </div>

        {!quizFinished && (
          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono font-bold text-slate-300">
              Score: <span className="text-emerald-400">{score}</span> / {quizQuestions.length}
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Q {currentIndex + 1} of {quizQuestions.length}
            </span>
          </div>
        )}
      </div>

      {!quizFinished ? (
        <div className="space-y-6">
          
          {/* Question Text */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider block">
              Question {currentIndex + 1}:
            </span>
            <p className="text-base sm:text-lg font-bold text-slate-100 leading-snug">
              {currentQ.question}
            </p>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQ.options?.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              let btnStyle = 'bg-slate-950/80 border-slate-800 text-slate-200 hover:border-slate-700';

              if (isAnswered) {
                if (opt.isCorrect) {
                  btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-200 font-bold';
                } else if (isSelected && !opt.isCorrect) {
                  btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-200 font-bold';
                } else {
                  btnStyle = 'bg-slate-950/40 border-slate-900 text-slate-600 opacity-60';
                }
              }

              return (
                <button
                  key={opt.id}
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(opt.id, opt.isCorrect)}
                  className={`p-4 rounded-xl border text-left text-sm transition-all duration-200 flex items-start justify-between gap-3 ${btnStyle}`}
                >
                  <span className="leading-snug">{opt.text}</span>
                  {isAnswered && (
                    <span className="shrink-0">
                      {opt.isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : isSelected ? (
                        <XCircle className="w-5 h-5 text-rose-400" />
                      ) : null}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Solution & Explanation Box after answer */}
          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2"
            >
              <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-indigo-400">
                <Sparkles className="w-4 h-4" />
                <span>Explanation & Solution:</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {currentQ.explanation}
              </p>
            </motion.div>
          )}

          {/* Next Button */}
          {isAnswered && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNext}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm flex items-center gap-2 shadow-lg hover:scale-[1.02] transition-transform"
              >
                <span>{currentIndex + 1 < quizQuestions.length ? 'Next Question' : 'Complete Quiz'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      ) : (
        /* Quiz Results Score Summary Card */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-8 space-y-6 max-w-md mx-auto"
        >
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 p-1 shadow-xl glow-primary flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
              <Trophy className="w-10 h-10 text-amber-400 animate-bounce" />
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-2xl font-black text-white">Quiz Completed!</h4>
            <p className="text-sm text-slate-400">
              You scored <strong className="text-emerald-400 text-base">{score} out of {quizQuestions.length}</strong> ({percentage}%)
            </p>
          </div>

          {/* Score rating badge */}
          <div className="inline-flex px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-300">
            {percentage >= 80 ? '🌟 Outstanding Mastery! Ready for Exam.' : percentage >= 60 ? '👍 Solid Knowledge! Review flagged items.' : '📚 Needs Revision! Re-read chapter notes.'}
          </div>

          <div className="pt-4 flex items-center justify-center gap-3">
            <button
              onClick={handleRestart}
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm flex items-center gap-2 border border-slate-700 transition-colors shadow-md"
            >
              <RotateCcw className="w-4 h-4 text-indigo-400" />
              <span>Retake Quiz</span>
            </button>
          </div>
        </motion.div>
      )}

    </div>
  );
};
