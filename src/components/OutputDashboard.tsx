'use client';

import React, { useState } from 'react';
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

  const handleToggleLearned = (id: string) => {
    const updatedQuestions = kit.questions.map(q => 
      q.id === id ? { ...q, learned: !q.learned } : q
    );
    onUpdateKit({ ...kit, questions: updatedQuestions });
  };

  const handleToggleMarkForReview = (id: string) => {
    const updatedQuestions = kit.questions.map(q => 
      q.id === id ? { ...q, markedForReview: !q.markedForReview } : q
    );
    onUpdateKit({ ...kit, questions: updatedQuestions });
  };

  const handleSelectMCQOption = (questionId: string, optionId: string) => {
    const updatedQuestions = kit.questions.map(q => 
      q.id === questionId ? { ...q, userSelectedOptionId: optionId } : q
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

  // Calculate live score counter & accuracy
  const mcqQuestions = kit.questions.filter(q => q.type === 'MCQ');
  const solvedMCQs = mcqQuestions.filter(q => q.userSelectedOptionId !== undefined && q.userSelectedOptionId !== null);
  const correctMCQsCount = solvedMCQs.filter(q => {
    const selectedOpt = q.options?.find(o => o.id === q.userSelectedOptionId);
    return selectedOpt?.isCorrect === true;
  }).length;
  
  const totalMCQsCount = mcqQuestions.length;
  const accuracyPercentage = solvedMCQs.length > 0 ? Math.round((correctMCQsCount / solvedMCQs.length) * 100) : 0;

  const masteredCount = kit.questions.filter(q => q.learned).length;
  const totalQuestions = kit.questions.length;
  const overallMasteryPercentage = Math.round((masteredCount / totalQuestions) * 100) || 0;

  // Copy All Text Export
  const handleCopyAllText = () => {
    const fullText = `=== NYORIA STUDY PACK SUMMARY ===\nTitle: ${kit.title}\nDifficulty: ${kit.difficulty}\n\n` + 
      kit.questions.map((q, i) => (
        `Q${i + 1} [${q.type} - ${q.difficulty}]: ${q.question}\nANSWER: ${q.answer}\nEXPLANATION: ${q.explanation}\n\n`
      )).join('');
    
    navigator.clipboard.writeText(fullText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  // Download PDF Summary
  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Kit Summary & Progress Counter Banner */}
      <div className="bg-[#111827]/90 border border-[#1E293B] rounded-2xl p-6 shadow-2xl space-y-6 relative overflow-hidden">
        
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 font-bold uppercase tracking-wider">
                Nyoria Study Pack
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#0B0F19] text-slate-400 border border-[#1E293B] font-semibold">
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

          {/* Export Menu Buttons */}
          <div className="flex items-center gap-2 flex-wrap no-print">
            
            <button
              onClick={() => onSaveToLibrary(kit)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                isSavedInLibrary
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 text-white font-black shadow-md shadow-indigo-600/20'
              }`}
            >
              <span>{isSavedInLibrary ? '✓ Saved in Library' : 'Save Set to Library'}</span>
            </button>

            <button
              onClick={handleCopyAllText}
              className="px-3.5 py-2 rounded-xl bg-[#0B0F19] hover:bg-[#1E293B] text-slate-200 text-xs sm:text-sm font-semibold border border-[#1E293B] transition-colors shadow-sm"
              title="Copy all text to clipboard"
            >
              <span>{copiedAll ? 'Copied Text!' : 'Copy All Text'}</span>
            </button>

            <button
              onClick={handlePrintPDF}
              className="px-3.5 py-2 rounded-xl bg-[#0B0F19] hover:bg-[#1E293B] text-slate-200 text-xs sm:text-sm font-semibold border border-[#1E293B] transition-colors shadow-sm"
              title="Download PDF Summary"
            >
              <span>Download PDF Summary</span>
            </button>

          </div>
        </div>

        {/* Real-time Progress Bar & Score Counter */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-[#0B0F19] border border-[#1E293B]">
          
          {/* Tracker 1: Solved MCQs & Correct Answer Counter */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-300">
                MCQs Answered Correctly
              </span>
              <span className="font-mono text-slate-400">
                <strong className="text-emerald-400">{correctMCQsCount} / {solvedMCQs.length} Correct</strong> ({accuracyPercentage}%)
              </span>
            </div>
            <div className="w-full h-2.5 bg-[#111827] rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-500 rounded-full"
                style={{ width: `${accuracyPercentage}%` }}
              />
            </div>
          </div>

          {/* Tracker 2: Overall Topics Mastered */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-300">
                Overall Topics Mastered
              </span>
              <span className="font-mono text-slate-400">
                <strong className="text-indigo-400">{masteredCount} / {totalQuestions} Topics</strong> ({overallMasteryPercentage}%)
              </span>
            </div>
            <div className="w-full h-2.5 bg-[#111827] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-500 rounded-full"
                style={{ width: `${overallMasteryPercentage}%` }}
              />
            </div>
          </div>

        </div>

      </div>

      {/* Tabs Toolbar & Live Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#1E293B] pb-4 no-print">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 bg-[#111827] p-1.5 rounded-xl border border-[#1E293B] overflow-x-auto w-full sm:w-auto">
          {[
            { id: 'all', label: 'All Material', count: kit.questions.length + kit.diagrams.length },
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
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-black shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === tab.id ? 'bg-[#0B0F19] text-indigo-300' : 'bg-[#0B0F19] text-slate-400'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Live Search Bar & Format Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          
          <div className="relative flex-1 sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions or topics..."
              className="w-full px-3 py-1.5 rounded-xl bg-[#0B0F19] border border-[#1E293B] text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          <select
            value={selectedTypeFilter}
            onChange={(e) => setSelectedTypeFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#0B0F19] border border-[#1E293B] text-slate-300 text-xs focus:outline-none"
          >
            <option value="all">All Formats</option>
            <option value="MCQ">Interactive MCQs</option>
            <option value="Short">Short Notes</option>
            <option value="Essay">Long Answers</option>
            <option value="Definition">Key Concepts</option>
            <option value="FillBlank">Fill-in-Blanks</option>
          </select>

        </div>

      </div>

      {/* DASHBOARD DISPLAY CONTENT */}
      <div className="space-y-8">
        
        {/* 1. REVISION FLASHCARDS */}
        {(activeTab === 'all' || activeTab === 'flashcards') && kit.flashcards.length > 0 && (
          <div className="no-print">
            <FlashcardDeck flashcards={kit.flashcards} />
          </div>
        )}

        {/* 2. VISUAL DIAGRAM PLACEHOLDER CARDS */}
        {(activeTab === 'all' || activeTab === 'diagrams') && kit.diagrams.length > 0 && (
          <div className="space-y-6">
            {kit.diagrams.map((diag) => (
              <VisualAidCard key={diag.id} diagram={diag} />
            ))}
          </div>
        )}

        {/* 3. DEDUPLICATED QUESTIONS & ANSWERS */}
        {(activeTab === 'all' || activeTab === 'mcq' || activeTab === 'accordions') && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span>Exam Practice Questions & Simple Explanations</span>
                <span className="text-xs text-slate-400 font-mono font-normal">
                  ({filteredQuestions.length} items)
                </span>
              </h3>
            </div>

            {filteredQuestions.length === 0 ? (
              <div className="p-8 text-center bg-[#111827] border border-[#1E293B] rounded-2xl text-slate-400 text-xs">
                No questions match your current search query or filter.
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
                    onToggleMarkForReview={handleToggleMarkForReview}
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
