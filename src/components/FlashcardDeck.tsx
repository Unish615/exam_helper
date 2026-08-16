'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Flashcard } from '../lib/types';

interface FlashcardDeckProps {
  flashcards: Flashcard[];
}

export const FlashcardDeck: React.FC<FlashcardDeckProps> = ({ flashcards: initialCards }) => {
  const [cards, setCards] = useState<Flashcard[]>(initialCards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  if (!cards || cards.length === 0) return null;

  const currentCard = cards[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
  };

  const toggleMastered = (e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = [...cards];
    updated[currentIndex].learned = !updated[currentIndex].learned;
    setCards(updated);
  };

  const learnedCount = cards.filter(c => c.learned).length;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-7 space-y-6 shadow-xl relative overflow-hidden">
      
      {/* Header (No Lucide Icons) */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 text-xs font-bold uppercase tracking-wider">
              3D Revision Flashcards
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Card {currentIndex + 1} of {cards.length}
            </span>
          </div>
          
          <h3 className="text-xl font-bold text-white tracking-tight">
            Rapid Term & Definition Deck
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-300">
            Mastered: <strong className="text-emerald-400 font-mono">{learnedCount}/{cards.length}</strong>
          </div>

          <button
            onClick={handleShuffle}
            className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 transition-colors"
            title="Shuffle deck"
          >
            Shuffle Deck
          </button>
        </div>
      </div>

      {/* 3D Flip Card Container */}
      <div className="perspective-1000 w-full max-w-2xl mx-auto h-[260px] sm:h-[280px]">
        <motion.div
          onClick={() => setIsFlipped(!isFlipped)}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="w-full h-full relative transform-style-3d cursor-pointer select-none rounded-2xl shadow-2xl"
        >
          
          {/* FRONT OF CARD */}
          <div className={`absolute inset-0 w-full h-full rounded-2xl p-6 sm:p-8 border flex flex-col justify-between backface-hidden transition-all duration-300 ${
            currentCard.learned
              ? 'bg-slate-950 border-emerald-500/40 glow-emerald'
              : 'bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950/40 border-slate-700/80 hover:border-indigo-500/50 glow-indigo'
          }`}>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold px-2.5 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700">
                {currentCard.category || 'Term'}
              </span>
              <span className="text-slate-400">
                Click card to flip
              </span>
            </div>

            <div className="my-auto text-center space-y-2 px-4">
              <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest block">
                [ Key Term / Concept ]
              </span>
              <h4 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
                {currentCard.front}
              </h4>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <button
                onClick={toggleMastered}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors border ${
                  currentCard.learned
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200 border-slate-700'
                }`}
              >
                {currentCard.learned ? '✓ Mastered' : 'Mark Mastered'}
              </button>

              <span className="text-xs text-slate-400">Front (1/2)</span>
            </div>
          </div>

          {/* BACK OF CARD */}
          <div className="absolute inset-0 w-full h-full rounded-2xl p-6 sm:p-8 border bg-slate-900 border-indigo-500/50 flex flex-col justify-between rotate-y-180 backface-hidden shadow-2xl">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-emerald-400">
                Definition & Explanation
              </span>
              <span className="text-slate-400">Click to flip back</span>
            </div>

            <div className="my-auto space-y-2 text-center px-4">
              <p className="text-base sm:text-lg font-medium text-slate-100 leading-relaxed">
                {currentCard.back}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <span className="text-xs text-indigo-300 font-mono">
                {currentCard.front}
              </span>
              <span className="text-xs text-slate-400">Back (2/2)</span>
            </div>
          </div>

        </motion.div>
      </div>

      {/* Controls (No Lucide Icons) */}
      <div className="flex items-center justify-center gap-4 pt-2">
        <button
          onClick={handlePrev}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm border border-slate-700 transition-all shadow-md"
        >
          ← Previous Card
        </button>

        <button
          onClick={() => setIsFlipped(!isFlipped)}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs sm:text-sm transition-all shadow-md"
        >
          Flip Card
        </button>

        <button
          onClick={handleNext}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm border border-slate-700 transition-all shadow-md"
        >
          Next Card →
        </button>
      </div>

    </div>
  );
};
