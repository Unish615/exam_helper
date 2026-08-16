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
      <div className="bg-[#2F1A13]/95 border border-[#4A2C21] rounded-2xl p-6 shadow-2xl space-y-6 relative overflow-hidden">
        
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="px-2.5 py-0.5 rounded-full bg-[#1C4632] text-[#F8D5C2] border border-[#F8D5C2]/30 font-bold uppercase tracking-wider">
                Nyoria Study Pack
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#123022] text-[#FBF2EB] border border-[#1C4632] font-semibold">
                Difficulty: {kit.difficulty}
              </span>
              <span className="text-[#F8D5C2]/70">Created: {kit.createdAt}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-[#FBF2EB] tracking-tight">
              {kit.title}
            </h2>

            <p className="text-xs sm:text-sm text-[#F8D5C2]/80 leading-relaxed">
              {kit.summary}
            </p>
          </div>

          {/* Export Menu Buttons */}
          <div className="flex items-center gap-2 flex-wrap no-print">
            
            <button
              onClick={() => onSaveToLibrary(kit)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                isSavedInLibrary
                  ? 'bg-[#1C4632] text-[#F8D5C2] border border-[#F8D5C2]/40'
                  : 'bg-[#F8D5C2] text-[#2F1A13] shadow-md shadow-[#1C4632]/20 font-black'
              }`}
            >
              <span>{isSavedInLibrary ? '✓ Saved in Library' : 'Save Set to Library'}</span>
            </button>

            <button
              onClick={handleCopyAllText}
              className="px-3.5 py-2 rounded-xl bg-[#123022] hover:bg-[#1C4632] text-[#FBF2EB] text-xs sm:text-sm font-semibold border border-[#1C4632] transition-colors shadow-sm"
              title="Copy all text to clipboard"
            >
              <span>{copiedAll ? 'Copied Text!' : 'Copy All Text'}</span>
            </button>

            <button
              onClick={handlePrintPDF}
              className="px-3.5 py-2 rounded-xl bg-[#123022] hover:bg-[#1C4632] text-[#FBF2EB] text-xs sm:text-sm font-semibold border border-[#1C4632] transition-colors shadow-sm"
              title="Download PDF Summary"
            >
              <span>Download PDF Summary</span>
            </button>

          </div>
        </div>

        {/* Real-time Progress Bar & Score Counter */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-[#123022] border border-[#1C4632]">
          
          {/* Tracker 1: Solved MCQs & Correct Answer Counter */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-[#FBF2EB]">
                MCQs Answered Correctly
              </span>
              <span className="font-mono text-[#F8D5C2]">
                <strong className="text-[#F8D5C2]">{correctMCQsCount} / {solvedMCQs.length} Correct</strong> ({accuracyPercentage}%)
              </span>
            </div>
            <div className="w-full h-2.5 bg-[#2F1A13] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#1C4632] transition-all duration-500 rounded-full"
                style={{ width: `${accuracyPercentage}%` }}
              />
            </div>
          </div>

          {/* Tracker 2: Overall Topics Mastered */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-[#FBF2EB]">
                Overall Topics Mastered
              </span>
              <span className="font-mono text-[#F8D5C2]">
                <strong className="text-[#F8D5C2]">{masteredCount} / {totalQuestions} Topics</strong> ({overallMasteryPercentage}%)
              </span>
            </div>
            <div className="w-full h-2.5 bg-[#2F1A13] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#1C4632] to-[#F8D5C2] transition-all duration-500 rounded-full"
                style={{ width: `${overallMasteryPercentage}%` }}
              />
            </div>
          </div>

        </div>

      </div>

      {/* Tabs Toolbar & Live Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#4A2C21] pb-4 no-print">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 bg-[#2F1A13] p-1.5 rounded-xl border border-[#4A2C21] overflow-x-auto w-full sm:w-auto">
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
                  ? 'bg-[#1C4632] text-[#F8D5C2] shadow-md border border-[#F8D5C2]/30'
                  : 'text-[#F8D5C2]/60 hover:text-[#FBF2EB]'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === tab.id ? 'bg-[#F8D5C2] text-[#2F1A13]' : 'bg-[#123022] text-[#F8D5C2]'
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
              className="w-full px-3 py-1.5 rounded-xl bg-[#123022] border border-[#1C4632] text-[#FBF2EB] placeholder-[#F8D5C2]/40 text-xs focus:outline-none focus:ring-2 focus:ring-[#F8D5C2]/50"
            />
          </div>

          <select
            value={selectedTypeFilter}
            onChange={(e) => setSelectedTypeFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#123022] border border-[#1C4632] text-[#F8D5C2] text-xs focus:outline-none"
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
              <h3 className="text-xl font-bold text-[#FBF2EB] flex items-center gap-2">
                <span>Exam Practice Questions & Simple Explanations</span>
                <span className="text-xs text-[#F8D5C2]/70 font-mono font-normal">
                  ({filteredQuestions.length} items)
                </span>
              </h3>
            </div>

            {filteredQuestions.length === 0 ? (
              <div className="p-8 text-center bg-[#2F1A13] border border-[#4A2C21] rounded-2xl text-[#F8D5C2]/70 text-xs">
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
