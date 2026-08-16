'use client';

import React, { useState, useRef } from 'react';
import { 
  FileUp, 
  FileText, 
  Sparkles, 
  Sliders, 
  Check, 
  Trash2, 
  Clipboard, 
  Zap, 
  BookOpen, 
  CheckCircle2, 
  Loader2,
  FileCheck
} from 'lucide-react';
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
      
      {/* Background Subtle Gray Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[300px] bg-zinc-700/10 blur-[130px] rounded-full pointer-events-none -z-10" />

      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto mb-8 sm:mb-10">
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800/80 border border-zinc-700/80 text-zinc-300 text-xs font-semibold">
          <Zap className="w-3.5 h-3.5 text-zinc-200" />
          <span>Interactive Study & Exam Preparation Platform</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-zinc-100 tracking-tight leading-tight">
          Transform Notes into <br className="hidden sm:inline" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 via-zinc-300 to-zinc-400">
            Interactive Exam Guides
          </span>
        </h1>

        <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Upload PDF/Text files or paste study notes. Nyoria generates interactive MCQs with instant feedback, clear answers, visual diagrams, and 3D flashcards.
        </p>

        {/* Quick Sample Presets */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs font-medium text-zinc-400 flex items-center gap-1 mr-1">
            <BookOpen className="w-3.5 h-3.5 text-zinc-300" />
            <span>Try Sample Notes:</span>
          </span>
          {SAMPLE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset)}
              className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 hover:border-zinc-600 text-zinc-300 text-xs font-medium border border-zinc-800 transition-all flex items-center gap-1.5"
            >
              <span>{preset.title.split(':')[0]}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300 font-semibold border border-zinc-700/60">
                {preset.category}
              </span>
            </button>
          ))}
        </div>

      </div>

      {/* Main Dual-Input Box */}
      <div className="bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-6">
        
        {/* Dual Input Tabs Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3 flex-wrap gap-3">
          
          <div className="flex items-center gap-2 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
            <button
              onClick={() => setActiveTab('text')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                activeTab === 'text'
                  ? 'bg-zinc-100 text-zinc-950 shadow-md shadow-zinc-500/10'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Note Editor</span>
            </button>

            <button
              onClick={() => setActiveTab('file')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                activeTab === 'file'
                  ? 'bg-zinc-100 text-zinc-950 shadow-md shadow-zinc-500/10'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <FileUp className="w-4 h-4" />
              <span>Drag-and-Drop Zone</span>
              {uploadedFile && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              )}
            </button>
          </div>

          {/* Stats info */}
          <div className="flex items-center gap-3 text-xs text-zinc-400 font-mono">
            <span>Words: <strong className="text-zinc-200">{wordCount}</strong></span>
            <span>Chars: <strong className="text-zinc-300">{charCount}</strong></span>
            {inputText.trim() && (
              <button
                onClick={() => { setInputText(''); setUploadedFile(null); }}
                className="text-zinc-500 hover:text-rose-400 p-1 transition-colors"
                title="Clear input"
              >
                <Trash2 className="w-4 h-4" />
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
              placeholder="Paste your lecture notes, textbook chapters, or exam topics here... (e.g. Human Heart Circulation, Mitosis stages, TCP/IP Layers, Laws of Thermodynamics)"
              rows={8}
              className="w-full p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500/50 focus:border-zinc-500 transition-all font-sans leading-relaxed resize-y"
            />
            
            {!inputText && (
              <div className="absolute bottom-4 right-4 flex items-center gap-2">
                <button
                  onClick={handlePasteClipboard}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium flex items-center gap-1.5 border border-zinc-700 transition-colors shadow-sm"
                >
                  <Clipboard className="w-3.5 h-3.5 text-zinc-300" />
                  <span>Paste from Clipboard</span>
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
                  ? 'border-zinc-400 bg-zinc-800/40 scale-[1.01]'
                  : uploadedFile
                  ? 'border-emerald-500/50 bg-emerald-500/5'
                  : 'border-zinc-800 hover:border-zinc-700 bg-zinc-950'
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
                <div className="p-4 rounded-2xl bg-zinc-800/80 text-zinc-200 border border-zinc-700">
                  <FileUp className="w-8 h-8 animate-bounce" />
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-semibold text-zinc-200">
                    Drag & Drop your PDF or Text files here or click to browse
                  </p>
                  <p className="text-xs text-zinc-400">
                    Supports PDF, TXT, Markdown, and Word Documents (.pdf, .txt, .md)
                  </p>
                </div>
              </div>

              {/* Upload Progress Bar */}
              {isUploading && (
                <div className="mt-4 max-w-xs mx-auto space-y-2">
                  <div className="flex justify-between text-xs text-zinc-300">
                    <span>Extracting file notes...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-zinc-500 to-zinc-200 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Uploaded File Info */}
              {uploadedFile && !isUploading && (
                <div className="mt-4 inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-zinc-900 border border-emerald-500/30 text-emerald-400 text-xs font-medium shadow-md">
                  <FileCheck className="w-4 h-4 text-emerald-400" />
                  <span>{uploadedFile.name} ({uploadedFile.size}) — {uploadedFile.count} words extracted</span>
                </div>
              )}
            </div>

            {inputText && uploadedFile && (
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-400 max-h-32 overflow-y-auto space-y-1">
                <span className="font-semibold text-zinc-300">Extracted notes preview:</span>
                <p className="line-clamp-3 italic text-zinc-400">&ldquo;{inputText}&rdquo;</p>
              </div>
            )}
          </div>
        )}

        {/* Custom Controls Options Panel */}
        <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-4">
          
          <div className="flex items-center gap-2 text-xs font-bold text-zinc-300 uppercase tracking-wider">
            <Sliders className="w-4 h-4 text-zinc-300" />
            <span>Customize Exam Options</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Difficulty Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 block">
                Difficulty Level:
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-zinc-900 rounded-xl border border-zinc-800">
                {(['Easy', 'Medium', 'Hard'] as Difficulty[]).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setDifficulty(level)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                      difficulty === level
                        ? 'bg-zinc-100 text-zinc-950 shadow-sm'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Types */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-semibold text-zinc-400 block">
                Content Types:
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'MCQ', label: 'Interactive MCQs' },
                  { id: 'Short', label: 'Short Questions' },
                  { id: 'Essay', label: 'Long Answers' },
                  { id: 'Definition', label: 'Key Concepts' },
                  { id: 'FillBlank', label: 'Fill-in-Blanks' },
                ].map((type) => {
                  const isSelected = selectedTypes.includes(type.id as QuestionType);
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => toggleType(type.id as QuestionType)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                        isSelected
                          ? 'bg-zinc-800 text-zinc-100 border-zinc-600 shadow-sm'
                          : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:text-zinc-300'
                      }`}
                    >
                      <Check className={`w-3.5 h-3.5 ${isSelected ? 'text-zinc-100 opacity-100' : 'opacity-0'}`} />
                      <span>{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Question Count Selector & Badges */}
          <div className="pt-2 border-t border-zinc-800 flex items-center justify-between flex-wrap gap-4 text-xs text-zinc-400">
            <div className="flex items-center gap-3">
              <span>Question Quantity:</span>
              <div className="flex gap-1.5">
                {[5, 10, 15, 20].map((num) => (
                  <button
                    key={num}
                    onClick={() => setQuestionCount(num)}
                    className={`px-2.5 py-1 rounded-md font-mono font-bold text-xs transition-all ${
                      questionCount === num
                        ? 'bg-zinc-100 text-zinc-950'
                        : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 text-zinc-300">
              <span className="flex items-center gap-1 text-zinc-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-zinc-400" /> 3D Flashcards
              </span>
              <span className="flex items-center gap-1 text-zinc-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-zinc-400" /> Visual Diagram Cards
              </span>
            </div>
          </div>

        </div>

        {/* CTA Button: "Generate Exam Guide" with glowing gray border effect */}
        <div className="pt-2">
          <button
            disabled={!inputText.trim() || isGenerating}
            onClick={handleSubmit}
            className={`w-full py-4 rounded-xl font-extrabold text-base tracking-wide flex items-center justify-center gap-3 transition-all duration-300 shadow-xl ${
              inputText.trim() && !isGenerating
                ? 'bg-zinc-100 hover:bg-white text-zinc-950 border border-zinc-300 shadow-zinc-500/10 hover:scale-[1.005] glow-gray cursor-pointer'
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700/40'
            }`}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-zinc-950" />
                <span>{generationStep || "Building Exam Guide..."}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-zinc-950 animate-pulse" />
                <span>Generate Exam Guide</span>
              </>
            )}
          </button>
        </div>

      </div>

    </section>
  );
};
