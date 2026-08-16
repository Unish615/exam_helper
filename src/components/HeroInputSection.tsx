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
      
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[300px] bg-indigo-600/15 blur-[130px] rounded-full pointer-events-none -z-10" />

      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto mb-8 sm:mb-10">
        
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold">
          <Zap className="w-3.5 h-3.5 text-indigo-400" />
          <span>Interactive Study & Exam Preparation Platform</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          Supercharge Your Exams with <br className="hidden sm:inline" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-violet-300 to-purple-400">
            Smart Question Generation
          </span>
        </h1>

        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Upload PDF/Text files or paste study notes. Nyoria generates 100% deduplicated MCQs with instant feedback, simple solutions, visual diagrams, and 3D flashcards.
        </p>

        {/* Sample Topics */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs font-medium text-slate-400 flex items-center gap-1 mr-1">
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
            <span>Sample Topics:</span>
          </span>
          {SAMPLE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset)}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-indigo-600/20 hover:border-indigo-500/40 text-slate-300 text-xs font-medium border border-slate-800 transition-all flex items-center gap-1.5"
            >
              <span>{preset.title.split(':')[0]}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-semibold">
                {preset.category}
              </span>
            </button>
          ))}
        </div>

      </div>

      {/* Main Dual-Input Box */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-6">
        
        {/* Dual Input Tabs Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-3">
          
          <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('text')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                activeTab === 'text'
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Note Textarea</span>
            </button>

            <button
              onClick={() => setActiveTab('file')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                activeTab === 'file'
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileUp className="w-4 h-4" />
              <span>Drag-and-Drop PDF/File Upload</span>
              {uploadedFile && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              )}
            </button>
          </div>

          {/* Word / Character Counter */}
          <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
            <span>Words: <strong className="text-indigo-300">{wordCount}</strong></span>
            <span>Chars: <strong className="text-slate-300">{charCount}</strong></span>
            {inputText.trim() && (
              <button
                onClick={() => { setInputText(''); setUploadedFile(null); }}
                className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
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
              placeholder="Paste your study notes, textbook chapters, or exam topics here... (e.g. Human Heart Circulation, Photosynthesis Calvin Cycle, Mitosis phases, TCP/IP Stack)"
              rows={8}
              className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-sans leading-relaxed resize-y"
            />
            
            {!inputText && (
              <div className="absolute bottom-4 right-4 flex items-center gap-2">
                <button
                  onClick={handlePasteClipboard}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 border border-slate-700 transition-colors shadow-sm"
                >
                  <Clipboard className="w-3.5 h-3.5 text-indigo-400" />
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
                  ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01]'
                  : uploadedFile
                  ? 'border-emerald-500/50 bg-emerald-500/5'
                  : 'border-slate-800 hover:border-slate-700 bg-slate-950'
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
                <div className="p-4 rounded-2xl bg-indigo-600/10 text-indigo-400 border border-indigo-500/20">
                  <FileUp className="w-8 h-8 animate-bounce" />
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-semibold text-slate-200">
                    Drag & Drop your PDF or Text files here or click to browse
                  </p>
                  <p className="text-xs text-slate-400">
                    Supports PDF, TXT, Word Documents (.docx), and Markdown (.md)
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              {isUploading && (
                <div className="mt-4 max-w-xs mx-auto space-y-2">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Uploading & parsing file...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Uploaded File Info */}
              {uploadedFile && !isUploading && (
                <div className="mt-4 inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-900 border border-emerald-500/30 text-emerald-400 text-xs font-medium shadow-md">
                  <FileCheck className="w-4 h-4 text-emerald-400" />
                  <span>{uploadedFile.name} ({uploadedFile.size}) — {uploadedFile.count} words extracted</span>
                </div>
              )}
            </div>

            {inputText && uploadedFile && (
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 max-h-32 overflow-y-auto space-y-1">
                <span className="font-semibold text-slate-300">Extracted text preview:</span>
                <p className="line-clamp-3 italic text-slate-400">&ldquo;{inputText}&rdquo;</p>
              </div>
            )}
          </div>
        )}

        {/* Control Bar: Select Difficulty Level & Content Options */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
          
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
            <Sliders className="w-4 h-4 text-indigo-400" />
            <span>Control Bar Options</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Difficulty Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 block">
                Select Difficulty Level:
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800">
                {(['Easy', 'Medium', 'Hard'] as Difficulty[]).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setDifficulty(level)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-extrabold transition-all ${
                      difficulty === level
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Options */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-semibold text-slate-400 block">
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
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                        isSelected
                          ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40 shadow-sm'
                          : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-300'
                      }`}
                    >
                      <Check className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-400 opacity-100' : 'opacity-0'}`} />
                      <span>{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Question Count Slider */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between flex-wrap gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-3">
              <span>Question Quantity:</span>
              <div className="flex gap-1.5">
                {[5, 10, 15, 20].map((num) => (
                  <button
                    key={num}
                    onClick={() => setQuestionCount(num)}
                    className={`px-2.5 py-1 rounded-md font-mono font-bold text-xs transition-all ${
                      questionCount === num
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 text-slate-300">
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" /> 100% Unique MCQs
              </span>
              <span className="flex items-center gap-1 text-teal-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" /> Visual Diagram Cards
              </span>
            </div>
          </div>

        </div>

        {/* Prominent CTA Button: "Generate Nyoria Study Pack" */}
        <div className="pt-2">
          <button
            disabled={!inputText.trim() || isGenerating}
            onClick={handleSubmit}
            className={`w-full py-4 rounded-xl font-extrabold text-base tracking-wide flex items-center justify-center gap-3 transition-all duration-300 shadow-xl ${
              inputText.trim() && !isGenerating
                ? 'bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-600/30 hover:scale-[1.005] glow-primary cursor-pointer'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
            }`}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-indigo-300" />
                <span>{generationStep || "Generating Nyoria Study Pack..."}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-indigo-300 animate-pulse" />
                <span>Generate Nyoria Study Pack</span>
              </>
            )}
          </button>
        </div>

      </div>

    </section>
  );
};
