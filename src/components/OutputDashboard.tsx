'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Download, 
  Copy, 
  Check, 
  BookmarkCheck, 
  Layers, 
  Sparkles, 
  Award, 
  BookOpen, 
  CheckCircle2, 
  BarChart3,
  FileText,
  Share2
} from 'lucide-react';
import { GeneratedStudyKit, QuestionItem, QuestionType } from '../lib/types';
import { QuestionCard } from './QuestionCard';
import { VisualAidCard } from './VisualAidCard';
import { FlashcardDeck } from './FlashcardDeck';
import { InteractiveQuiz } from './InteractiveQuiz';

interface OutputDashboardProps {
  kit: GeneratedStudyKit;
  onUpdateKit: (updated: GeneratedStudyKit) => void;
  onSaveToLibrary: (kit: GeneratedStudyKit) => void;
  isSavedInLibrary: boolean;
}

export const OutputDashboard: React.FC<OutputDashboardProps> = ({
  kit,
  onUpdateKit,
  onSaveToLibrary,
  isSavedInLibrary,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'questions' | 'quiz' | 'flashcards' | 'diagrams'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [copiedAll, setCopiedAll] = useState(false);

  // Toggle Learned status on a question
  const handleToggleLearned = (id: string) => {
    const updatedQuestions = kit.questions.map(q => 
      q.id === id ? { ...q, learned: !q.learned } : q
    );
    onUpdateKit({ ...kit, questions: updatedQuestions });
  };

  // Filtered Questions list
  const filteredQuestions = kit.questions.filter((q) => {
    const matchesSearch = 
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.topicTag.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = selectedTypeFilter === 'all' || q.type === selectedTypeFilter;
    return matchesSearch && matchesType;
  });

  const learnedCount = kit.questions.filter(q => q.learned).length;
  const totalQuestions = kit.questions.length;
  const progressPercent = Math.round((learnedCount / totalQuestions) * 100) || 0;

  // Copy All Answers
  const handleCopyAll = () => {
    const fullText = `=== ${kit.title} ===\n\n` + 
      kit.questions.map((q, i) => (
        `Q${i + 1} (${q.type} - ${q.difficulty}): ${q.question}\nANSWER: ${q.answer}\nEXPLANATION: ${q.explanation}\n\n`
      )).join('');
    
    navigator.clipboard.writeText(fullText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  // Download Printable PDF / HTML sheet
  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Top Kit Summary & Progress Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6 relative overflow-hidden">
        
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-bold uppercase tracking-wider">
                Exam Ready Kit
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700/60 font-medium">
                Difficulty: {kit.difficulty}
              </span>
              <span className="text-slate-400">Created: {kit.createdAt}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {kit.title}
            </h2>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              {kit.summary}
            </p>
          </div>

          {/* Library Save & Export Utility Buttons */}
          <div className="flex items-center gap-2 flex-wrap no-print">
            
            <button
              onClick={() => onSaveToLibrary(kit)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                isSavedInLibrary
                  ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 shadow-sm'
              }`}
            >
              <BookmarkCheck className="w-4 h-4" />
              <span>{isSavedInLibrary ? 'Saved in Library' : 'Save Kit to Library'}</span>
            </button>

            <button
              onClick={handleCopyAll}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors shadow-sm"
              title="Copy all questions & answers"
            >
              {copiedAll ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-indigo-400" />}
              <span>{copiedAll ? 'Copied All!' : 'Copy All'}</span>
            </button>

            <button
              onClick={handlePrintPDF}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors shadow-sm"
              title="Download formatted PDF printout"
            >
              <Download className="w-4 h-4 text-indigo-400" />
              <span>Download PDF</span>
            </button>

          </div>
        </div>

        {/* Progress & Mastery Score Bar */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <div className="flex items-center gap-2 text-slate-300">
              <BarChart3 className="w-4 h-4 text-indigo-400" />
              <span>Exam Revision Mastery Tracker</span>
            </div>
            <div className="text-slate-400 font-mono">
              <strong className="text-emerald-400">{learnedCount}</strong> / {totalQuestions} Questions Mastered ({progressPercent}%)
            </div>
          </div>

          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-emerald-400 transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

      </div>

      {/* Tabs Navigation & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-4 no-print">
        
        {/* Main Section Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-xl border border-slate-800 overflow-x-auto w-full sm:w-auto">
          {[
            { id: 'all', label: 'All Material', count: kit.questions.length + kit.diagrams.length },
            { id: 'questions', label: 'Questions', count: kit.questions.length },
            { id: 'quiz', label: 'Mock Quiz', count: kit.questions.filter(q => q.options).length },
            { id: 'flashcards', label: 'Flashcards', count: kit.flashcards.length },
            { id: 'diagrams', label: 'Visual Aids', count: kit.diagrams.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === tab.id ? 'bg-indigo-700 text-white' : 'bg-slate-800 text-slate-400'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search & Filter Inputs */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics or keywords..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          <select
            value={selectedTypeFilter}
            onChange={(e) => setSelectedTypeFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs focus:outline-none"
          >
            <option value="all">All Formats</option>
            <option value="MCQ">MCQs</option>
            <option value="Short">Short Answer</option>
            <option value="Essay">Essay</option>
            <option value="Definition">Definitions</option>
            <option value="FillBlank">Fill-in-Blanks</option>
          </select>

        </div>

      </div>

      {/* DYNAMIC DASHBOARD SECTIONS */}
      <div className="space-y-8">
        
        {/* 1. FLASHCARDS DECK SECTION */}
        {(activeTab === 'all' || activeTab === 'flashcards') && kit.flashcards.length > 0 && (
          <div className="no-print">
            <FlashcardDeck flashcards={kit.flashcards} />
          </div>
        )}

        {/* 2. VISUAL AID DIAGRAMS SECTION */}
        {(activeTab === 'all' || activeTab === 'diagrams') && kit.diagrams.length > 0 && (
          <div className="space-y-6">
            {kit.diagrams.map((diag) => (
              <VisualAidCard key={diag.id} diagram={diag} />
            ))}
          </div>
        )}

        {/* 3. INTERACTIVE QUIZ MODE */}
        {activeTab === 'quiz' && (
          <div className="no-print">
            <InteractiveQuiz questions={kit.questions} />
          </div>
        )}

        {/* 4. QUESTIONS & ANSWERS LIST */}
        {(activeTab === 'all' || activeTab === 'questions') && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                <span>Exam Questions & Simple Explanations</span>
                <span className="text-xs text-slate-400 font-mono font-normal">
                  ({filteredQuestions.length} items)
                </span>
              </h3>
            </div>

            {filteredQuestions.length === 0 ? (
              <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 text-xs">
                No questions match your current search query or filter.
              </div>
            ) : (
              filteredQuestions.map((q, idx) => (
                <QuestionCard
                  key={q.id}
                  question={q}
                  index={idx}
                  onToggleLearned={handleToggleLearned}
                />
              ))
            )}
          </div>
        )}

      </div>

    </section>
  );
};
