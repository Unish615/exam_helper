'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { DisclaimerModal } from '../components/DisclaimerModal';
import { HeroInputSection } from '../components/HeroInputSection';
import { OutputDashboard } from '../components/OutputDashboard';
import { SavedKitsDrawer } from '../components/SavedKitsDrawer';
import { GeneratedStudyKit, GeneratorOptions } from '../lib/types';
import { generateStudyKit } from '../lib/generatorEngine';
import { SAMPLE_PRESETS } from '../lib/sampleData';

export default function Home() {
  const [darkMode, setDarkMode] = useState(true);
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);
  const [isSavedKitsOpen, setIsSavedKitsOpen] = useState(false);
  const [savedKits, setSavedKits] = useState<GeneratedStudyKit[]>([]);
  const [currentKit, setCurrentKit] = useState<GeneratedStudyKit | null>(null);
  
  // Generation loading states
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');

  useEffect(() => {
    // Check disclaimer agreement
    const agreed = localStorage.getItem('nyoria_disclaimer_agreed');
    if (!agreed) {
      setIsDisclaimerOpen(true);
    }

    // Load saved sets from localStorage
    try {
      const stored = localStorage.getItem('nyoria_saved_kits');
      if (stored) {
        setSavedKits(JSON.parse(stored));
      }
    } catch {
      // Fallback
    }

    // Pre-populate sample Photosynthesis study kit for instant preview
    const sampleKit = generateStudyKit(SAMPLE_PRESETS[0].text, {
      difficulty: 'Intermediate',
      questionTypes: ['MCQ', 'Short', 'Essay', 'Definition', 'FillBlank'],
      questionCount: 8,
      includeFlashcards: true,
      includeDiagrams: true
    });
    setCurrentKit(sampleKit);
  }, []);

  const handleCloseDisclaimer = () => {
    localStorage.setItem('nyoria_disclaimer_agreed', 'true');
    setIsDisclaimerOpen(false);
  };

  const handleGenerate = (text: string, options: GeneratorOptions) => {
    setIsGenerating(true);
    setGenerationStep('Reading study material & analyzing key concepts...');

    setTimeout(() => {
      setGenerationStep('Applying Zero-Duplication filtering rule...');
    }, 600);

    setTimeout(() => {
      setGenerationStep('Synthesizing deduplicated MCQs & simple solutions...');
    }, 1200);

    setTimeout(() => {
      setGenerationStep('Building visual diagram cards & 3D flashcards...');
    }, 1800);

    setTimeout(() => {
      const generated = generateStudyKit(text, options);
      setCurrentKit(generated);
      setIsGenerating(false);
      
      window.scrollTo({ top: 480, behavior: 'smooth' });
    }, 2400);
  };

  const handleUpdateKit = (updated: GeneratedStudyKit) => {
    setCurrentKit(updated);
    const exists = savedKits.some(k => k.id === updated.id);
    if (exists) {
      const updatedList = savedKits.map(k => k.id === updated.id ? updated : k);
      setSavedKits(updatedList);
      localStorage.setItem('nyoria_saved_kits', JSON.stringify(updatedList));
    }
  };

  const handleSaveToLibrary = (kitToSave: GeneratedStudyKit) => {
    const exists = savedKits.some(k => k.id === kitToSave.id);
    let updatedList: GeneratedStudyKit[];
    if (exists) {
      updatedList = savedKits.map(k => k.id === kitToSave.id ? kitToSave : k);
    } else {
      updatedList = [kitToSave, ...savedKits];
    }
    setSavedKits(updatedList);
    localStorage.setItem('nyoria_saved_kits', JSON.stringify(updatedList));
  };

  const handleDeleteSavedKit = (id: string) => {
    const updatedList = savedKits.filter(k => k.id !== id);
    setSavedKits(updatedList);
    localStorage.setItem('nyoria_saved_kits', JSON.stringify(updatedList));
  };

  const handleReset = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isSavedInLibrary = currentKit ? savedKits.some(k => k.id === currentKit.id) : false;

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${
      darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* Navigation Header */}
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenSavedKits={() => setIsSavedKitsOpen(true)}
        onOpenHistory={() => setIsSavedKitsOpen(true)}
        onOpenDisclaimer={() => setIsDisclaimerOpen(true)}
        savedKitsCount={savedKits.length}
        onReset={handleReset}
      />

      {/* Main Content */}
      <main className="space-y-8 pb-16">
        <HeroInputSection
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
          generationStep={generationStep}
        />

        {currentKit && (
          <OutputDashboard
            kit={currentKit}
            onUpdateKit={handleUpdateKit}
            onSaveToLibrary={handleSaveToLibrary}
            isSavedInLibrary={isSavedInLibrary}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-950 py-8 text-center text-xs text-slate-500 space-y-2 no-print">
        <div className="flex items-center justify-center gap-2">
          <span className="font-extrabold text-slate-300 tracking-tight">Nyoria</span>
          <span>•</span>
          <span>Interactive AI Exam Preparation & Concept Visualizer</span>
        </div>
        <p className="text-slate-600 max-w-md mx-auto">
          Crafted for students, educators, and exam candidates. Always cross-verify critical facts with official textbooks.
        </p>
      </footer>

      {/* First-Load Disclaimer Animated Modal */}
      <DisclaimerModal
        isOpen={isDisclaimerOpen}
        onClose={handleCloseDisclaimer}
      />

      {/* Saved Study Sets Drawer */}
      <SavedKitsDrawer
        isOpen={isSavedKitsOpen}
        onClose={() => setIsSavedKitsOpen(false)}
        savedKits={savedKits}
        onSelectKit={(kit) => setCurrentKit(kit)}
        onDeleteKit={handleDeleteSavedKit}
      />

    </div>
  );
}
