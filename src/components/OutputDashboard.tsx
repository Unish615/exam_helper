'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Download, 
  Copy, 
  Check, 
  BookmarkCheck, 
  Layers, 
  Sparkles, 
  Award, 
  FileText,
  BarChart3,
  CheckCircle2,
  FileCheck
} from 'lucide-react';
import { GeneratedStudyKit, QuestionItem } from '../lib/types';
import { QuestionCard } from './QuestionCard';
import { VisualAidCard } from './VisualAidCard';
import { FlashcardDeck } from './FlashcardDeck';

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
  const [activeTab, setActiveTab] = useState<'all' | 'mcq' | 'accordions' | 'diagrams' | 'flashcards'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [copiedAll, setCopiedAll] = useState(false);

  // Toggle Mastered state on a question
  const handleToggleLearned = (id: string) => {
    const updatedQuestions = kit.questions.map(q => 
      q.id === id ? { ...q, learned: !q.learned } : q
    );
    onUpdateKit({ ...kit, questions: updatedQuestions });
  };

  // Track MCQ options selection state
  const handleSelectMCQOption = (questionId: string, optionId: string) => {
    const updatedQuestions = kit.questions.map(q => 
      q.id === questionId ? { ...q, userSelectedOptionId: optionId } : q
    );
    onUpdateKit({ ...kit, questions: updatedQuestions });
  };

  // Filtered questions
  const filteredQuestions = kit.questions.filter((q) => {
    const matchesSearch = 
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.topicTag.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = selectedTypeFilter === 'all' || q.type === selectedTypeFilter;
    return matchesSearch && matchesType;
  });

  // Calculate real-time stats
  const mcqQuestions = kit.questions.filter(q => q.type === 'MCQ');
  const solvedMCQsCount = mcqQuestions.filter(q => q.userSelectedOptionId !== undefined && q.userSelectedOptionId !== null).length;
  const totalMCQsCount = mcqQuestions.length;
  const mcqPercentage = totalMCQsCount > 0 ? Math.round((solvedMCQsCount / totalMCQsCount) * 100) : 0;

  const masteredCount = kit.questions.filter(q => q.learned).length;
  const totalQuestions = kit.questions.length;
  const overallMasteryPercentage = Math.round((masteredCount / totalQuestions) * 100) || 0;

  // Copy All / Export to Text
  const handleCopyAll = () => {
    const fullText = `=== NYORIA EXAM PREPARATION GUIDE ===\nTitle: ${kit.title}\nDifficulty: ${kit.difficulty}\n\n` + 
      kit.questions.map((q, i) => (
        `Q${i + 1} [${q.type} - ${q.difficulty}]: ${q.question}\nSOLUTION: ${q.answer}\nEXPLANATION: ${q.explanation}\n\n`
      )).join('');
    
    navigator.clipboard.writeText(fullText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  // Export / Print PDF Sheet
  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Top Banner & Progress Tracking */}
      <div className="bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-6 shadow-2xl space-y-6 relative overflow-hidden">
        
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-200 border border-zinc-700 font-bold uppercase tracking-wider">
                Exam Guide Set
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-zinc-950 text-zinc-400 border border-zinc-800 font-medium">
                Difficulty: {kit.difficulty}
              </span>
              <span className="text-zinc-500">Created: {kit.createdAt}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-zinc-100 tracking-tight">
              {kit.title}
            </h2>

            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              {kit.summary}
            </p>
          </div>

          {/* Action Utilities: Save, Export to Text, Download PDF */}
          <div className="flex items-center gap-2 flex-wrap no-print">
            
            <button
              onClick={() => onSaveToLibrary(kit)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                isSavedInLibrary
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-zinc-100 hover:bg-white text-zinc-950 shadow-sm'
              }`}
            >
              <BookmarkCheck className="w-4 h-4" />
              <span>{isSavedInLibrary ? 'Saved in Library' : 'Save Set to Library'}</span>
            </button>

            <button
              onClick={handleCopyAll}
              className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs sm:text-sm font-semibold flex items-center gap-1.5 border border-zinc-700 transition-colors shadow-sm"
              title="Export all questions and answers to text"
            >
              {copiedAll ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-zinc-300" />}
              <span>{copiedAll ? 'Copied Text!' : 'Export to Text'}</span>
            </button>

            <button
              onClick={handlePrintPDF}
              className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs sm:text-sm font-semibold flex items-center gap-1.5 border border-zinc-700 transition-colors shadow-sm"
              title="Download PDF printable exam sheet"
            >
              <Download className="w-4 h-4 text-zinc-300" />
              <span>Download PDF Exam Sheet</span>
            </button>

          </div>
        </div>

        {/* Real-time Progress Tracker Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-zinc-950 border border-zinc-800">
          
          {/* Tracker 1: Interactive MCQs Solved */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-zinc-300">
                <BarChart3 className="w-4 h-4 text-zinc-400" />
                <span>Interactive MCQs Practiced</span>
              </span>
              <span className="font-mono text-zinc-400">
                <strong className="text-emerald-400">{solvedMCQsCount}</strong> / {totalMCQsCount} Solved ({mcqPercentage}%)
              </span>
            </div>
            <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-500 rounded-full"
                style={{ width: `${mcqPercentage}%` }}
              />
            </div>
          </div>

          {/* Tracker 2: Overall Topics Mastered */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-zinc-300">
                <Award className="w-4 h-4 text-zinc-400" />
                <span>Overall Topics Mastered</span>
              </span>
              <span className="font-mono text-zinc-400">
                <strong className="text-zinc-100">{masteredCount}</strong> / {totalQuestions} Topics ({overallMasteryPercentage}%)
              </span>
            </div>
            <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-zinc-200 transition-all duration-500 rounded-full"
                style={{ width: `${overallMasteryPercentage}%` }}
              />
            </div>
          </div>

        </div>

      </div>

      {/* Tabs Toolbar & Search Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-zinc-800 pb-4 no-print">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 bg-zinc-900 p-1.5 rounded-xl border border-zinc-800 overflow-x-auto w-full sm:w-auto">
          {[
            { id: 'all', label: 'All Exam Material', count: kit.questions.length + kit.diagrams.length },
            { id: 'mcq', label: 'Interactive MCQs', count: kit.questions.filter(q => q.type === 'MCQ').length },
            { id: 'accordions', label: 'Short & Long Answers', count: kit.questions.filter(q => q.type !== 'MCQ').length },
            { id: 'diagrams', label: 'Visual Diagrams', count: kit.diagrams.length },
            { id: 'flashcards', label: '3D Flashcards', count: kit.flashcards.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-zinc-100 text-zinc-950 shadow-md'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === tab.id ? 'bg-zinc-800 text-zinc-100' : 'bg-zinc-950 text-zinc-400'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Input & Format Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics or keywords..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 placeholder-zinc-500 text-xs focus:outline-none focus:ring-2 focus:ring-zinc-500/50"
            />
          </div>

          <select
            value={selectedTypeFilter}
            onChange={(e) => setSelectedTypeFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs focus:outline-none"
          >
            <option value="all">All Formats</option>
            <option value="MCQ">Interactive MCQs</option>
            <option value="Short">Short Questions</option>
            <option value="Essay">Long Answers</option>
            <option value="Definition">Key Concepts</option>
            <option value="FillBlank">Fill-in-Blanks</option>
          </select>

        </div>

      </div>

      {/* DASHBOARD DISPLAY CONTENT */}
      <div className="space-y-8">
        
        {/* 1. FLASHCARDS SECTION */}
        {(activeTab === 'all' || activeTab === 'flashcards') && kit.flashcards.length > 0 && (
          <div className="no-print">
            <FlashcardDeck flashcards={kit.flashcards} />
          </div>
        )}

        {/* 2. VISUAL DIAGRAM CARDS SECTION */}
        {(activeTab === 'all' || activeTab === 'diagrams') && kit.diagrams.length > 0 && (
          <div className="space-y-6">
            {kit.diagrams.map((diag) => (
              <VisualAidCard key={diag.id} diagram={diag} />
            ))}
          </div>
        )}

        {/* 3. QUESTIONS LIST SECTION */}
        {(activeTab === 'all' || activeTab === 'mcq' || activeTab === 'accordions') && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
                <FileText className="w-5 h-5 text-zinc-300" />
                <span>Exam Practice Questions & Solutions</span>
                <span className="text-xs text-zinc-400 font-mono font-normal">
                  ({filteredQuestions.length} items)
                </span>
              </h3>
            </div>

            {filteredQuestions.length === 0 ? (
              <div className="p-8 text-center bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-400 text-xs">
                No questions match your current search query or format filter.
              </div>
            ) : (
              filteredQuestions
                .filter(q => {
                  if (activeTab === 'mcq') return q.type === 'MCQ';
                  if (activeTab === 'accordions') return q.type !== 'MCQ';
                  return true;
                })
                .map((q, idx) => (
                  <QuestionCard
                    key={q.id}
                    question={q}
                    index={idx}
                    onToggleLearned={handleToggleLearned}
                    onSelectMCQOption={handleSelectMCQOption}
                  />
                ))
            )}
          </div>
        )}

      </div>

    </section>
  );
};
