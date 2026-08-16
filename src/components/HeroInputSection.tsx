'use client';

import React, { useState, useRef } from 'react';
import { Difficulty, QuestionType, GeneratorOptions } from '../lib/types';
import { SAMPLE_PRESETS, SamplePreset } from '../lib/sampleData';

interface HeroInputSectionProps {
  onGenerate: (text: string, options: GeneratorOptions) => void;
  isGenerating: boolean;
  generationStep: string;
}

export const HeroInputSection: React.FC<HeroInputSectionProps> = ({
  onGenerate,
  isGenerating,
  generationStep
}) => {
  const [activeTab, setActiveTab] = useState<'text' | 'file'>('text');
  const [inputText, setInputText] = useState('');
  
  // File upload state
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string; count: number } | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generator Options state
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium');
  const [selectedTypes, setSelectedTypes] = useState<QuestionType[]>([
    'MCQ', 'Short', 'Essay', 'Definition', 'FillBlank'
  ]);
  const [questionCount, setQuestionCount] = useState<number>(10);

  const handleSelectPreset = (preset: SamplePreset) => {
    setActiveTab('text');
    setInputText(preset.text);
    setUploadedFile(null);
  };

  const toggleType = (type: QuestionType) => {
    if (selectedTypes.includes(type)) {
      if (selectedTypes.length > 1) {
        setSelectedTypes(selectedTypes.filter(t => t !== type));
      }
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    setIsUploading(true);
    setUploadProgress(15);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 100;
        }
        return prev + 25;
      });
    }, 150);

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string || '';
      setTimeout(() => {
        setIsUploading(false);
        setUploadedFile({
          name: file.name,
          size: (file.size / 1024).toFixed(1) + ' KB',
          count: content.split(/\s+/).filter(Boolean).length
        });
        setInputText(content);
      }, 700);
    };

    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setInputText(text);
    } catch {
      // Fallback
    }
  };

  const handleSubmit = () => {
    if (!inputText.trim()) return;
    onGenerate(inputText, {
      difficulty,
      questionTypes: selectedTypes,
      questionCount,
      includeFlashcards: true,
      includeDiagrams: true
    });
  };

  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
  const charCount = inputText.length;

  return (
    <section className="relative py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[300px] bg-[#1C4632]/25 blur-[130px] rounded-full pointer-events-none -z-10" />

      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto mb-8 sm:mb-10">
        
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1C4632] border border-[#F8D5C2]/30 text-[#F8D5C2] text-xs font-bold shadow-md">
          <span>Interactive Study & Exam Preparation Platform</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-[#FBF2EB] tracking-tight leading-tight">
          Supercharge Your Exams with <br className="hidden sm:inline" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#F8D5C2] via-[#FBF2EB] to-[#F8D5C2]">
            Smart Question Generation
          </span>
        </h1>

        <p className="text-[#F8D5C2]/80 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Upload PDF/Text files or paste study notes. Nyoria generates 100% deduplicated MCQs with instant feedback, simple solutions, visual diagrams, and 3D flashcards.
        </p>

        {/* Sample Topics */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs font-medium text-[#FBF2EB]/70 mr-1">
            Sample Topics:
          </span>
          {SAMPLE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset)}
              className="px-2.5 py-1 rounded-lg bg-[#2F1A13] hover:bg-[#1C4632] text-[#FBF2EB] text-xs font-medium border border-[#4A2C21] transition-all flex items-center gap-1.5 shadow-sm"
            >
              <span>{preset.title.split(':')[0]}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#F8D5C2] text-[#2F1A13] font-bold">
                {preset.category}
              </span>
            </button>
          ))}
        </div>

      </div>

      {/* Main Dual-Input Box */}
      <div className="bg-[#2F1A13]/95 border border-[#4A2C21] rounded-2xl p-4 sm:p-6 shadow-2xl space-y-6">
        
        {/* Dual Input Tabs Header */}
        <div className="flex items-center justify-between border-b border-[#4A2C21] pb-3 flex-wrap gap-3">
          
          <div className="flex items-center gap-2 bg-[#123022] p-1 rounded-xl border border-[#1C4632]">
            <button
              onClick={() => setActiveTab('text')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'text'
                  ? 'bg-[#1C4632] text-[#F8D5C2] shadow-md border border-[#F8D5C2]/30'
                  : 'text-[#FBF2EB]/70 hover:text-[#FBF2EB]'
              }`}
            >
              Note Textarea
            </button>

            <button
              onClick={() => setActiveTab('file')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'file'
                  ? 'bg-[#1C4632] text-[#F8D5C2] shadow-md border border-[#F8D5C2]/30'
                  : 'text-[#FBF2EB]/70 hover:text-[#FBF2EB]'
              }`}
            >
              <span>Drag-and-Drop PDF/File Upload</span>
              {uploadedFile && (
                <span className="w-2 h-2 rounded-full bg-[#F8D5C2] animate-ping" />
              )}
            </button>
          </div>

          {/* Word / Character Counter */}
          <div className="flex items-center gap-3 text-xs text-[#F8D5C2]/80 font-mono">
            <span>Words: <strong className="text-[#F8D5C2]">{wordCount}</strong></span>
            <span>Chars: <strong className="text-[#FBF2EB]">{charCount}</strong></span>
            {inputText.trim() && (
              <button
                onClick={() => { setInputText(''); setUploadedFile(null); }}
                className="text-[#F8D5C2]/60 hover:text-[#F8D5C2] px-2 py-0.5 rounded bg-[#123022] text-[11px] transition-colors"
                title="Clear input"
              >
                Clear
              </button>
            )}
          </div>

        </div>

        {/* Input Content Box */}
        {activeTab === 'text' ? (
          <div className="relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste your study notes, textbook chapters, or exam topics here... (e.g. Human Heart Circulation, Photosynthesis Calvin Cycle, Mitosis phases, TCP/IP Stack)"
              rows={8}
              className="w-full p-4 rounded-xl bg-[#123022] border border-[#1C4632] text-[#FBF2EB] placeholder-[#F8D5C2]/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#F8D5C2]/50 focus:border-[#F8D5C2] transition-all font-sans leading-relaxed resize-y"
            />
            
            {!inputText && (
              <div className="absolute bottom-4 right-4 flex items-center gap-2">
                <button
                  onClick={handlePasteClipboard}
                  className="px-3 py-1.5 rounded-lg bg-[#2F1A13] hover:bg-[#4A2C21] text-[#F8D5C2] text-xs font-semibold border border-[#4A2C21] transition-colors shadow-sm"
                >
                  Paste from Clipboard
                </button>
              </div>
            )}
          </div>
        ) : (
          /* File Drag and Drop Zone */
          <div className="space-y-4">
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
                dragActive
                  ? 'border-[#F8D5C2] bg-[#1C4632]/50 scale-[1.01]'
                  : uploadedFile
                  ? 'border-[#1C4632] bg-[#123022]'
                  : 'border-[#4A2C21] hover:border-[#1C4632] bg-[#123022]'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt,.md,.doc,.docx"
                onChange={handleFileInputChange}
                className="hidden"
              />

              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="px-4 py-2 rounded-xl bg-[#1C4632] text-[#F8D5C2] font-bold border border-[#F8D5C2]/30 text-xs uppercase tracking-wider">
                  File Dropper Zone
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-semibold text-[#FBF2EB]">
                    Drag & Drop your PDF or Text files here or click to browse
                  </p>
                  <p className="text-xs text-[#F8D5C2]/70">
                    Supports PDF, TXT, Word Documents (.docx), and Markdown (.md)
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              {isUploading && (
                <div className="mt-4 max-w-xs mx-auto space-y-2">
                  <div className="flex justify-between text-xs text-[#FBF2EB]">
                    <span>Uploading & parsing file...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-[#2F1A13] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#1C4632] via-[#4A2C21] to-[#F8D5C2] transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Uploaded File Info */}
              {uploadedFile && !isUploading && (
                <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2F1A13] border border-[#F8D5C2]/30 text-[#F8D5C2] text-xs font-medium shadow-md">
                  <span>✓ {uploadedFile.name} ({uploadedFile.size}) — {uploadedFile.count} words extracted</span>
                </div>
              )}
            </div>

            {inputText && uploadedFile && (
              <div className="p-3 rounded-xl bg-[#123022] border border-[#1C4632] text-xs text-[#F8D5C2]/80 max-h-32 overflow-y-auto space-y-1">
                <span className="font-semibold text-[#FBF2EB]">Extracted text preview:</span>
                <p className="line-clamp-3 italic text-[#F8D5C2]/70">&ldquo;{inputText}&rdquo;</p>
              </div>
            )}
          </div>
        )}

        {/* Control Bar */}
        <div className="p-4 rounded-xl bg-[#123022] border border-[#1C4632] space-y-4">
          
          <div className="text-xs font-bold text-[#F8D5C2] uppercase tracking-wider">
            Control Bar Options
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Difficulty Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#FBF2EB]/80 block">
                Select Difficulty Level:
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#2F1A13] rounded-xl border border-[#4A2C21]">
                {(['Easy', 'Medium', 'Hard'] as Difficulty[]).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setDifficulty(level)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-extrabold transition-all ${
                      difficulty === level
                        ? 'bg-[#1C4632] text-[#F8D5C2] shadow-sm border border-[#F8D5C2]/30'
                        : 'text-[#F8D5C2]/60 hover:text-[#FBF2EB]'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Options */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-semibold text-[#FBF2EB]/80 block">
                Content Options:
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'MCQ', label: 'MCQs (Interactive)' },
                  { id: 'Short', label: 'Short Notes' },
                  { id: 'Essay', label: 'Long Answers' },
                  { id: 'Definition', label: 'Definitions' },
                  { id: 'FillBlank', label: 'Fill-in-Blanks' },
                ].map((type) => {
                  const isSelected = selectedTypes.includes(type.id as QuestionType);
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => toggleType(type.id as QuestionType)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                        isSelected
                          ? 'bg-[#1C4632] text-[#F8D5C2] border-[#F8D5C2]/40 shadow-sm'
                          : 'bg-[#2F1A13] text-[#F8D5C2]/60 border-[#4A2C21] hover:text-[#FBF2EB]'
                      }`}
                    >
                      <span>{isSelected ? '✓ ' : ''}{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Question Count Slider */}
          <div className="pt-2 border-t border-[#1C4632] flex items-center justify-between flex-wrap gap-4 text-xs text-[#F8D5C2]/80">
            <div className="flex items-center gap-3">
              <span>Question Quantity:</span>
              <div className="flex gap-1.5">
                {[5, 10, 15, 20].map((num) => (
                  <button
                    key={num}
                    onClick={() => setQuestionCount(num)}
                    className={`px-2.5 py-1 rounded-md font-mono font-bold text-xs transition-all ${
                      questionCount === num
                        ? 'bg-[#1C4632] text-[#F8D5C2] border border-[#F8D5C2]/30'
                        : 'bg-[#2F1A13] text-[#F8D5C2]/60 hover:text-[#FBF2EB]'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 text-[#FBF2EB]">
              <span className="text-[#F8D5C2] font-medium">
                ✓ 100% Unique MCQs
              </span>
              <span className="text-[#F8D5C2] font-medium">
                ✓ Visual Diagram Cards
              </span>
            </div>
          </div>

        </div>

        {/* Prominent CTA Button in Warm Peach & Espresso */}
        <div className="pt-2">
          <button
            disabled={!inputText.trim() || isGenerating}
            onClick={handleSubmit}
            className={`w-full py-4 rounded-xl font-extrabold text-base tracking-wide flex items-center justify-center gap-3 transition-all duration-300 shadow-xl ${
              inputText.trim() && !isGenerating
                ? 'bg-[#F8D5C2] hover:bg-[#FBF2EB] text-[#2F1A13] shadow-[#1C4632]/30 hover:scale-[1.005] cursor-pointer font-black'
                : 'bg-[#123022] text-[#FBF2EB]/40 cursor-not-allowed border border-[#1C4632]'
            }`}
          >
            {isGenerating ? (
              <span>{generationStep || "Generating Nyoria Study Pack..."}</span>
            ) : (
              <span>Generate Nyoria Study Pack</span>
            )}
          </button>
        </div>

      </div>

    </section>
  );
};
