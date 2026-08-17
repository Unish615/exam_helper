import { GeneratedStudyKit, GeneratorOptions, QuestionItem, Flashcard, VisualAidDiagram, Difficulty, MCQOption } from './types';

const genId = (prefix: string) => `${prefix}_${Math.random().toString(36).substring(2, 9)}`;

// String-similarity helper for strict deduplication
function isDuplicateQuestion(newQ: string, existingQs: string[]): boolean {
  const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, ' ').split(/\s+/).filter(w => w.length > 3);
  const newTokens = new Set(normalize(newQ));
  
  for (const existing of existingQs) {
    const existingTokens = normalize(existing);
    let matchCount = 0;
    for (const token of existingTokens) {
      if (newTokens.has(token)) matchCount++;
    }
    const overlapRatio = matchCount / Math.max(newTokens.size, existingTokens.length);
    if (overlapRatio > 0.5) return true; // Filter out duplicates
  }
  return false;
}

export function generateStudyKit(text: string, options: GeneratorOptions): GeneratedStudyKit {
  const cleanText = text.trim();
  
  // Extract sentences from user text
  const sentences = cleanText
    .split(/(?<=[.?!])\s+|\n+/)
    .map(s => s.trim())
    .filter(s => s.length > 15);

  const title = extractTitle(cleanText);
  const questions: QuestionItem[] = [];
  const flashcards: Flashcard[] = [];
  const diagrams: VisualAidDiagram[] = [];

  const targetCount = options.questionCount || 10;
  const requestedTypes = options.questionTypes.length > 0 
    ? options.questionTypes 
    : ['MCQ', 'Short', 'Essay', 'Definition', 'FillBlank'];

  // Track question texts for strict deduplication
  const generatedQuestionTexts: string[] = [];

  for (let i = 0; i < targetCount * 2; i++) {
    if (questions.length >= targetCount) break;

    const qType = requestedTypes[questions.length % requestedTypes.length];
    const sentence = sentences[i % sentences.length] || cleanText.substring(0, 80);
    
    let candidateQ: QuestionItem | null = null;
    if (qType === 'MCQ') {
      candidateQ = buildContentMCQ(questions.length, sentence, sentences, options.difficulty);
    } else if (qType === 'Short') {
      candidateQ = buildContentShort(questions.length, sentence, sentences, options.difficulty);
    } else if (qType === 'Essay') {
      candidateQ = buildContentEssay(questions.length, sentence, title, options.difficulty);
    } else if (qType === 'Definition') {
      candidateQ = buildContentDefinition(questions.length, sentence, sentences, options.difficulty);
    } else if (qType === 'FillBlank') {
      candidateQ = buildContentFillBlank(questions.length, sentence, options.difficulty);
    }

    if (candidateQ && !isDuplicateQuestion(candidateQ.question, generatedQuestionTexts)) {
      generatedQuestionTexts.push(candidateQ.question);
      questions.push(candidateQ);
    }
  }

  if (options.includeFlashcards) {
    flashcards.push(...buildContentFlashcards(cleanText, sentences));
  }

  if (options.includeDiagrams) {
    diagrams.push(...buildContentDiagram(title, sentences));
  }

  return {
    id: genId('kit'),
    title: title,
    summary: `Extracted ${questions.length} deduplicated exam items strictly from your provided content (${questions.filter(q => q.type === 'MCQ').length} interactive MCQs), ${flashcards.length} flashcards, and ${diagrams.length} visual diagrams.`,
    createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    difficulty: options.difficulty,
    questions,
    flashcards,
    diagrams,
    originalText: cleanText,
  };
}

function extractTitle(text: string): string {
  const firstLine = text.split('\n')[0].replace(/^#+\s*/, '').trim();
  if (firstLine && firstLine.length > 5 && firstLine.length < 65) {
    return firstLine;
  }
  const words = text.split(/\s+/).slice(0, 6).join(' ');
  return `${words}... Study Kit`;
}

// Build MCQ strictly from user provided paragraph sentences
function buildContentMCQ(index: number, sentence: string, sentences: string[], difficulty: Difficulty): QuestionItem {
  // Extract key concept words or clause
  const words = sentence.split(/\s+/);
  const coreFact = sentence;

  // Distractors from other sentences or word perturbations
  const otherSentences = sentences.filter(s => s !== sentence);
  const distractor1 = otherSentences[0] 
    ? (otherSentences[0].length > 60 ? otherSentences[0].substring(0, 60) + '...' : otherSentences[0]) 
    : "This process operates independently without regulation.";
  const distractor2 = otherSentences[1] 
    ? (otherSentences[1].length > 60 ? otherSentences[1].substring(0, 60) + '...' : otherSentences[1]) 
    : "The mechanism is completely reversed during standard phase.";
  const distractor3 = "This condition occurs only under non-standard laboratory settings.";

  // Shuffle options
  const correctOptionText = sentence.length > 80 ? sentence.substring(0, 80) + '...' : sentence;
  const rawOpts = [
    { text: correctOptionText, isCorrect: true },
    { text: distractor1, isCorrect: false },
    { text: distractor2, isCorrect: false },
    { text: distractor3, isCorrect: false },
  ];

  const labels: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];
  // Deterministic shift based on index
  const shifted = [...rawOpts];
  const shiftAmt = index % 4;
  for (let s = 0; s < shiftAmt; s++) {
    shifted.push(shifted.shift()!);
  }

  const options: MCQOption[] = shifted.map((opt, idx) => ({
    id: genId('opt'),
    label: labels[idx],
    text: opt.text,
    isCorrect: opt.isCorrect,
  }));

  // Create question text
  let qText = "";
  if (sentence.toLowerCase().includes("is") || sentence.toLowerCase().includes("are")) {
    const parts = sentence.split(/\s+(?:is|are|refers to|consists of|functions as)\s+/i);
    if (parts[0] && parts[0].length < 50) {
      qText = `According to your provided notes, what is the primary role or definition of "${parts[0].replace(/^[A-Z0-9.#*\-\s]+/, '').trim()}"?`;
    }
  }
  
  if (!qText) {
    qText = `Based on your provided study content: "${sentence.length > 70 ? sentence.substring(0, 70) + '...' : sentence}", which of the following statements is accurate?`;
  }

  const correctAnswer = options.find(o => o.isCorrect)?.text || correctOptionText;

  return {
    id: genId('mcq'),
    type: 'MCQ',
    difficulty,
    question: qText,
    answer: correctAnswer,
    explanation: `Direct quote/concept from your notes: "${sentence}". This statement directly satisfies the requirement.`,
    mnemonic: `Remember: ${words.slice(0, 3).join(' ')} is essential to this section of your study text.`,
    keyTakeaways: [
      `Key fact directly stated in paragraph: "${sentence.length > 60 ? sentence.substring(0, 60) + '...' : sentence}"`,
      `Cross-verify distractor options against paragraph details.`
    ],
    options,
    topicTag: 'Content Fact'
  };
}

function buildContentShort(index: number, sentence: string, sentences: string[], difficulty: Difficulty): QuestionItem {
  const nextSentence = sentences[(index + 1) % sentences.length] || sentence;
  return {
    id: genId('short'),
    type: 'Short',
    difficulty,
    question: `Explain the key principle described in your paragraph: "${sentence.length > 60 ? sentence.substring(0, 60) + '...' : sentence}"`,
    answer: `${sentence} ${nextSentence !== sentence ? nextSentence : ''}`,
    explanation: `Extracted directly from your provided text. This passage summarizes a core mechanism required for exam recall.`,
    keyTakeaways: [
      `Main takeaway: ${sentence.length > 50 ? sentence.substring(0, 50) + '...' : sentence}`,
      `Review key relationships described in your notes.`
    ],
    topicTag: 'Short Summary'
  };
}

function buildContentEssay(index: number, sentence: string, title: string, difficulty: Difficulty): QuestionItem {
  return {
    id: genId('essay'),
    type: 'Essay',
    difficulty,
    question: `Provide a detailed essay synthesis on "${title}", critically analyzing the mechanisms discussed in: "${sentence.length > 60 ? sentence.substring(0, 60) + '...' : sentence}"`,
    answer: `Essay Response Outline derived from your content:\n1. Introduction: Define main topic ("${title}") and introduce core thesis.\n2. Key Component Analysis: Elaborate on "${sentence}".\n3. Systemic Implications: Discuss broader context and application.\n4. Conclusion: Summarize essential takeaways.`,
    explanation: "This essay outline synthesizes the key concepts directly provided in your study notes.",
    keyTakeaways: [
      `Structure essay using paragraph main points.`,
      `Incorporate technical terms directly from your notes.`
    ],
    topicTag: 'Long Essay'
  };
}

function buildContentDefinition(index: number, sentence: string, sentences: string[], difficulty: Difficulty): QuestionItem {
  const words = sentence.split(/\s+/);
  const term = words.slice(0, 3).join(' ').replace(/[^a-zA-Z0-9\s]/g, '');

  return {
    id: genId('def'),
    type: 'Definition',
    difficulty,
    question: `Define the concept "${term}" based on your provided study notes.`,
    answer: sentence,
    explanation: `Definition extracted directly from your paragraph: "${sentence}".`,
    keyTakeaways: [
      `Definition term: ${term}`,
      `Exact context: ${sentence.length > 50 ? sentence.substring(0, 50) + '...' : sentence}`
    ],
    topicTag: 'Key Term'
  };
}

function buildContentFillBlank(index: number, sentence: string, difficulty: Difficulty): QuestionItem {
  const words = sentence.split(/\s+/).filter(w => w.length > 4);
  const blankWord = words[Math.floor(words.length / 2)] || "concept";
  const maskedSentence = sentence.replace(new RegExp(`\\b${blankWord}\\b`, 'i'), '________');

  return {
    id: genId('blank'),
    type: 'FillBlank',
    difficulty,
    question: `Fill in the missing word from your text: "${maskedSentence}"`,
    blankAnswer: blankWord.toLowerCase(),
    answer: blankWord,
    explanation: `Original sentence from your notes: "${sentence}". Missing keyword: "${blankWord}".`,
    keyTakeaways: [
      `Target key term: ${blankWord}`,
      `Full context: ${sentence.length > 50 ? sentence.substring(0, 50) + '...' : sentence}`
    ],
    topicTag: 'Active Recall'
  };
}

// Build 6 3D Revision Flashcards strictly from user content
function buildContentFlashcards(text: string, sentences: string[]): Flashcard[] {
  const cards: Flashcard[] = [];
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 5);

  // 1. Check explicit colon or dash lines (Term: Definition)
  for (const line of lines) {
    const colonMatch = line.match(/^([^:\-\(\)]{3,40})\s*[:\-\u2013]\s*(.+)$/);
    if (colonMatch && colonMatch[1] && colonMatch[2]) {
      const term = colonMatch[1].replace(/^[0-9.#*\-\s]+/, '').trim();
      const def = colonMatch[2].trim();
      if (term.length > 2 && def.length > 8 && cards.length < 6) {
        cards.push({
          id: genId('fc'),
          front: term,
          back: def,
          category: 'Key Term'
        });
      }
    }
  }

  // 2. Extract from sentences (Subject is Definition)
  if (cards.length < 6) {
    sentences.forEach((sent) => {
      if (cards.length >= 6) return;
      const parts = sent.split(/\s+(?:is|are|refers to|consists of|produces|functions as)\s+/i);
      if (parts.length >= 2 && parts[0].length < 45 && parts[1].length > 10) {
        cards.push({
          id: genId('fc'),
          front: parts[0].replace(/^[A-Z0-9.#*\-\s]+/, '').trim(),
          back: parts[1].trim(),
          category: 'Concept'
        });
      } else if (sent.length > 20) {
        const words = sent.split(/\s+/);
        const term = words.slice(0, 4).join(' ');
        cards.push({
          id: genId('fc'),
          front: term,
          back: sent,
          category: 'Study Note'
        });
      }
    });
  }

  // Guarantee at least 6 flashcards if content allows
  while (cards.length < 6 && sentences.length > 0) {
    const s = sentences[cards.length % sentences.length];
    const words = s.split(/\s+/);
    cards.push({
      id: genId('fc'),
      front: words.slice(0, 3).join(' ') || `Concept #${cards.length + 1}`,
      back: s,
      category: 'Provided Notes'
    });
  }

  return cards.slice(0, 6);
}

// Build Visual Aid Diagram card strictly from user content
function buildContentDiagram(title: string, sentences: string[]): VisualAidDiagram[] {
  const steps = sentences.slice(0, 5).map((s, idx) => ({
    label: `Step ${idx + 1}: ${s.split(/\s+/).slice(0, 4).join(' ')}`,
    detail: s
  }));

  if (steps.length === 0) {
    steps.push(
      { label: "Phase 1: Input Analysis", detail: "Primary concept definition extracted from text." },
      { label: "Phase 2: Core Mechanism", detail: "Key interactions and functional rules." },
      { label: "Phase 3: Final Synthesis", detail: "Summary conclusions and exam key points." }
    );
  }

  const cleanTitle = title.replace(/[^a-zA-Z0-9\s]/g, '').trim();

  return [{
    id: genId('diag'),
    title: `Visual Concept Flow: ${title}`,
    description: `Interactive diagram map extracted directly from your provided study paragraph notes.`,
    type: 'flowchart',
    svgType: 'generic',
    tags: [`Diagram: ${cleanTitle}`, 'Extracted Flow', 'User Notes'],
    searchQueryTag: `Diagram: ${cleanTitle} Process Labeled`,
    keyComponents: steps
  }];
}
