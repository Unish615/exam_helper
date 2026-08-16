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

  // Load initial settings and saved kits on mount
  useEffect(() => {
    // Check disclaimer agreement
    const agreed = localStorage.getItem('nyoria_disclaimer_agreed');
    if (!agreed) {
      setIsDisclaimerOpen(true);
    }

    // Load saved kits from localStorage
    try {
      const stored = localStorage.getItem('nyoria_saved_kits');
      if (stored) {
        setSavedKits(JSON.parse(stored));
      }
    } catch {
      // Fallback
    }

    // Pre-populate demo kit on first view if user wants immediate preview
    const sampleKit = generateStudyKit(SAMPLE_PRESETS[0].text, {
      difficulty: 'Medium',
      questionTypes: ['MCQ', 'Short', 'Essay', 'Definition', 'FillBlank'],
      questionCount: 8,
      includeFlashcards: true,
      includeDiagrams: true
    });
    setCurrentKit(sampleKit);
  }, []);

  // Save Disclaimer agreement state
  const handleCloseDisclaimer = () => {
    localStorage.setItem('nyoria_disclaimer_agreed', 'true');
    setIsDisclaimerOpen(false);
  };

  // Generate Study Material CTA handler
  const handleGenerate = (text: string, options: GeneratorOptions) => {
    setIsGenerating(true);
    setGenerationStep('Reading study notes & analyzing syntax...');

    setTimeout(() => {
      setGenerationStep('Extracting key concepts & definitions...');
    }, 600);

    setTimeout(() => {
      setGenerationStep('Synthesizing exam questions & mnemonics...');
    }, 1200);

    setTimeout(() => {
      setGenerationStep('Generating visual diagrams & 3D flashcards...');
    }, 1800);

    setTimeout(() => {
      const generated = generateStudyKit(text, options);
      setCurrentKit(generated);
      setIsGenerating(false);
      
      // Scroll smoothly to output
      window.scrollTo({ top: 500, behavior: 'smooth' });
    }, 2400);
  };

  // Update current kit (e.g. marking questions learned)
  const handleUpdateKit = (updated: GeneratedStudyKit) => {
    setCurrentKit(updated);
    // Also update if saved in library
    const exists = savedKits.some(k => k.id === updated.id);
    if (exists) {
      const updatedList = savedKits.map(k => k.id === updated.id ? updated : k);
      setSavedKits(updatedList);
      localStorage.setItem('nyoria_saved_kits', JSON.stringify(updatedList));
    }
  };

  // Save to Library
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

  // Delete from Library
  const handleDeleteSavedKit = (id: string) => {
    const updatedList = savedKits.filter(k => k.id !== id);
    setSavedKits(updatedList);
    localStorage.setItem('nyoria_saved_kits', JSON.stringify(updatedList));
  };

  // New Session / Reset
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
        onOpenDisclaimer={() => setIsDisclaimerOpen(true)}
        savedKitsCount={savedKits.length}
        onReset={handleReset}
      />

      {/* Hero Input & Options Section */}
      <main className="space-y-8 pb-16">
        <HeroInputSection
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
          generationStep={generationStep}
        />

        {/* Output Dashboard Container */}
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
      <footer className="w-full border-t border-slate-800/80 bg-slate-950/80 py-8 text-center text-xs text-slate-500 space-y-2 no-print">
        <div className="flex items-center justify-center gap-2">
          <span className="font-extrabold text-slate-300 tracking-tight">Nyoria</span>
          <span>•</span>
          <span>Smart Study Assistant & Exam Question Generator</span>
        </div>
        <p className="text-slate-600">
          Crafted for students, educators, and lifelong learners. Always verify critical facts with official course material.
        </p>
      </footer>

      {/* Disclaimer Animated Modal */}
      <DisclaimerModal
        isOpen={isDisclaimerOpen}
        onClose={handleCloseDisclaimer}
      />

      {/* Saved Study Kits Drawer */}
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
