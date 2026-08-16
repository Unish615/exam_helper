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
  const lowerText = cleanText.toLowerCase();

  let theme: 'heart' | 'photosynthesis' | 'biology' | 'cs' | 'general' = 'general';
  if (lowerText.includes('heart') || lowerText.includes('atrium') || lowerText.includes('ventricle') || lowerText.includes('aorta') || lowerText.includes('valve')) {
    theme = 'heart';
  } else if (lowerText.includes('photosynthesis') || lowerText.includes('calvin') || lowerText.includes('thylakoid') || lowerText.includes('rubisco')) {
    theme = 'photosynthesis';
  } else if (lowerText.includes('cell') || lowerText.includes('mitosis') || lowerText.includes('chromosome') || lowerText.includes('prophase')) {
    theme = 'biology';
  } else if (lowerText.includes('tcp') || lowerText.includes('network') || lowerText.includes('protocol') || lowerText.includes('layer') || lowerText.includes('port')) {
    theme = 'cs';
  }

  const sentences = cleanText
    .split(/(?<=[.?!])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 15);

  const title = extractTitle(cleanText, theme);
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
    const sentence = sentences[i % sentences.length] || `Core concept #${i + 1} from your provided study material.`;
    
    let candidateQ: QuestionItem | null = null;
    if (qType === 'MCQ') {
      candidateQ = buildMCQ(questions.length, sentence, theme, options.difficulty);
    } else if (qType === 'Short') {
      candidateQ = buildShortAnswer(questions.length, sentence, theme, options.difficulty);
    } else if (qType === 'Essay') {
      candidateQ = buildEssay(questions.length, sentence, theme, options.difficulty);
    } else if (qType === 'Definition') {
      candidateQ = buildDefinition(questions.length, sentence, theme, options.difficulty);
    } else if (qType === 'FillBlank') {
      candidateQ = buildFillBlank(questions.length, sentence, theme, options.difficulty);
    }

    if (candidateQ && !isDuplicateQuestion(candidateQ.question, generatedQuestionTexts)) {
      generatedQuestionTexts.push(candidateQ.question);
      questions.push(candidateQ);
    }
  }

  if (options.includeFlashcards) {
    flashcards.push(...buildFlashcards(cleanText, theme, sentences));
  }

  if (options.includeDiagrams) {
    diagrams.push(...buildDiagrams(theme, title));
  }

  return {
    id: genId('kit'),
    title: title,
    summary: `Extracted ${questions.length} deduplicated exam items (${questions.filter(q => q.type === 'MCQ').length} interactive MCQs), ${flashcards.length} flashcards, and ${diagrams.length} visual diagrams.`,
    createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    difficulty: options.difficulty,
    questions,
    flashcards,
    diagrams,
    originalText: cleanText,
  };
}

function extractTitle(text: string, theme: string): string {
  const firstLine = text.split('\n')[0].replace(/^#+\s*/, '').trim();
  if (firstLine && firstLine.length < 60) return firstLine;
  switch (theme) {
    case 'heart': return 'Human Heart Anatomy & Blood Flow Circulation';
    case 'photosynthesis': return 'Photosynthesis & Calvin Cycle Plant Physiology';
    case 'biology': return 'Cell Division & Mitotic Cycle Study Kit';
    case 'cs': return 'TCP/IP Network Stack & Protocol Architecture';
    default: return 'Custom Nyoria Study Pack & Exam Kit';
  }
}

function buildMCQ(index: number, sentence: string, theme: string, difficulty: Difficulty): QuestionItem {
  if (theme === 'heart') {
    const questionsPool = [
      {
        q: "Which chamber of the human heart receives oxygenated blood directly from the lungs via the pulmonary veins?",
        ans: "Left Atrium",
        opts: [
          { id: 'a', label: 'A' as const, text: "Right Atrium", isCorrect: false },
          { id: 'b', label: 'B' as const, text: "Right Ventricle", isCorrect: false },
          { id: 'c', label: 'C' as const, text: "Left Atrium", isCorrect: true },
          { id: 'd', label: 'D' as const, text: "Left Ventricle", isCorrect: false },
        ],
        expl: "Freshly oxygenated blood returns from pulmonary capillaries into the Left Atrium. It then passes through the Bicuspid (Mitral) valve into the Left Ventricle to be pumped systemically.",
        mnemonic: "Left side = Lungs & Oxygenated blood! Right side = Returning deoxygenated blood.",
        takeaways: ["Pulmonary veins carry oxygen-rich blood.", "Left Atrium acts as the receiving chamber for oxygenated blood."]
      },
      {
        q: "Why does the Left Ventricle have a significantly thicker muscular wall (myocardium) than the Right Ventricle?",
        ans: "It must generate high pressure to pump blood throughout the entire systemic body circulation.",
        opts: [
          { id: 'a', label: 'A' as const, text: "It stores deoxygenated blood under high carbon dioxide pressure.", isCorrect: false },
          { id: 'b', label: 'B' as const, text: "It must generate high pressure to pump blood throughout the entire systemic body circulation.", isCorrect: true },
          { id: 'c', label: 'C' as const, text: "It prevents pulmonary valve prolapse during cardiac resting phase.", isCorrect: false },
          { id: 'd', label: 'D' as const, text: "It filters blood before passing it to the Sinoatrial Node.", isCorrect: false },
        ],
        expl: "The Right Ventricle only pumps blood a short distance to the lungs (pulmonary circuit), whereas the Left Ventricle must pump blood against high systemic resistance to the entire body via the Aorta.",
        mnemonic: "Left Ventricle = Heavy Lifter for systemic body pressure!",
        takeaways: ["Systemic circuit requires higher pressure than pulmonary circuit.", "Left Ventricle myocardium is 3x thicker than Right Ventricle."]
      },
      {
        q: "Which heart valve prevents backflow of blood from the Right Ventricle back into the Right Atrium?",
        ans: "Tricuspid Valve",
        opts: [
          { id: 'a', label: 'A' as const, text: "Bicuspid (Mitral) Valve", isCorrect: false },
          { id: 'b', label: 'B' as const, text: "Aortic Valve", isCorrect: false },
          { id: 'c', label: 'C' as const, text: "Tricuspid Valve", isCorrect: true },
          { id: 'd', label: 'D' as const, text: "Pulmonary Valve", isCorrect: false },
        ],
        expl: "The Tricuspid Valve located between the Right Atrium and Right Ventricle closes during ventricular contraction (systole) to prevent regurgitation.",
        mnemonic: "TRI before you BI! Tricuspid is on the Right, Bicuspid is on the Left.",
        takeaways: ["Atrioventricular (AV) valves prevent backflow into atria.", "Tricuspid valve has 3 cusps."]
      }
    ];
    const picked = questionsPool[index % questionsPool.length];
    return {
      id: genId('mcq'),
      type: 'MCQ',
      difficulty,
      question: picked.q,
      answer: picked.ans,
      explanation: picked.expl,
      mnemonic: picked.mnemonic,
      keyTakeaways: picked.takeaways,
      options: picked.opts,
      topicTag: 'Heart Anatomy'
    };
  } else if (theme === 'photosynthesis') {
    const questionsPool = [
      {
        q: "In which specific chloroplast structure do the Light-Dependent reactions of photosynthesis take place?",
        ans: "Thylakoid Membranes",
        opts: [
          { id: 'a', label: 'A' as const, text: "Chloroplast Stroma", isCorrect: false },
          { id: 'b', label: 'B' as const, text: "Thylakoid Membranes", isCorrect: true },
          { id: 'c', label: 'C' as const, text: "Mitochondrial Matrix", isCorrect: false },
          { id: 'd', label: 'D' as const, text: "Outer Envelope Membrane", isCorrect: false },
        ],
        expl: "Light-dependent reactions occur in the thylakoid membranes where chlorophyll photosystems II and I absorb photons, split water molecules, and generate ATP and NADPH.",
        mnemonic: "Thylakoid = Traps light! Stroma = Sugar synthesis.",
        takeaways: ["Thylakoids house chlorophyll pigments and photosystems.", "Photolysis of water releases oxygen gas in thylakoids."]
      }
    ];
    const picked = questionsPool[index % questionsPool.length];
    return {
      id: genId('mcq'),
      type: 'MCQ',
      difficulty,
      question: picked.q,
      answer: picked.ans,
      explanation: picked.expl,
      mnemonic: picked.mnemonic,
      keyTakeaways: picked.takeaways,
      options: picked.opts,
      topicTag: 'Photosynthesis'
    };
  }

  // Fallback MCQ
  return {
    id: genId('mcq'),
    type: 'MCQ',
    difficulty,
    question: `Based on your material: "${sentence.substring(0, 70)}...", which statement is accurate?`,
    answer: "Statement correctly highlights the core mechanism described in the text.",
    explanation: `Detailed analysis of: ${sentence}. Cross-verify with key terminology in your notes.`,
    mnemonic: "Focus on key noun-verb relationships in exam options.",
    keyTakeaways: ["Key insight directly matches provided study text.", "Pay attention to context clues in test questions."],
    options: [
      { id: 'a', label: 'A', text: sentence.length > 50 ? sentence.substring(0, 50) + "..." : sentence, isCorrect: true },
      { id: 'b', label: 'B', text: "Process operates in reverse without requiring energy or regulation.", isCorrect: false },
      { id: 'c', label: 'C', text: "Phenomenon only applies to isolated laboratory conditions.", isCorrect: false },
      { id: 'd', label: 'D', text: "Component is permanently disabled during initial phase.", isCorrect: false },
    ],
    topicTag: 'Key Concepts'
  };
}

function buildShortAnswer(index: number, sentence: string, theme: string, difficulty: Difficulty): QuestionItem {
  if (theme === 'heart') {
    return {
      id: genId('short'),
      type: 'Short',
      difficulty,
      question: "Trace the exact flow path of oxygenated blood from the lungs back to the systemic body tissues.",
      answer: "Lungs -> Pulmonary Veins -> Left Atrium -> Bicuspid (Mitral) Valve -> Left Ventricle -> Aortic Valve -> Aorta -> Systemic Body Tissues.",
      explanation: "Oxygenated blood returns from pulmonary capillaries into the Left Atrium, enters the Left Ventricle, and is pumped under high pressure through the Aorta to nourish systemic body tissues.",
      mnemonic: "PV -> LA -> LV -> Aorta -> Body!",
      keyTakeaways: [
        "Pulmonary veins are the only veins carrying oxygen-rich blood.",
        "Left Ventricle contracts forcefully to distribute blood via Aorta."
      ],
      topicTag: 'Circulation Path'
    };
  }

  return {
    id: genId('short'),
    type: 'Short',
    difficulty,
    question: `Summarize the principal concept discussed regarding: "${sentence.substring(0, 60)}..."`,
    answer: sentence,
    explanation: "This concept represents a foundational principle in your study material. Understanding its key mechanism is vital for short-answer exam questions.",
    keyTakeaways: ["Core definition matches textbook reference.", "Review supporting evidence and examples."],
    topicTag: 'Summary'
  };
}

function buildEssay(index: number, sentence: string, theme: string, difficulty: Difficulty): QuestionItem {
  return {
    id: genId('essay'),
    type: 'Essay',
    difficulty,
    question: theme === 'heart'
      ? "Compare and contrast Systemic Circulation and Pulmonary Circulation in human cardiac physiology."
      : `Synthesize and critically evaluate the primary mechanisms detailed in your study notes regarding: "${sentence.substring(0, 65)}..."`,
    answer: "Structuring your response:\n1. Introduction: Define core terms and state main thesis.\n2. Body Paragraph 1: Discuss primary mechanisms and structural rules.\n3. Body Paragraph 2: Evaluate real-world applications and edge cases.\n4. Conclusion: Summarize findings and overall significance.",
    explanation: "High-scoring essay responses demonstrate clear logical flow, accurate technical vocabulary, and thorough explanation of cause-and-effect relationships.",
    keyTakeaways: ["Use thematic headings to structure your essay response.", "Include specific examples from your notes to validate claims."],
    topicTag: 'Comprehensive Essay'
  };
}

function buildDefinition(index: number, sentence: string, theme: string, difficulty: Difficulty): QuestionItem {
  return {
    id: genId('def'),
    type: 'Definition',
    difficulty,
    question: theme === 'heart' ? "Define Sinoatrial (SA) Node in human heart physiology." : `Define the key technical term in: "${sentence.substring(0, 50)}..."`,
    answer: theme === 'heart' ? "The Sinoatrial (SA) Node is the natural cardiac pacemaker located in the upper wall of the Right Atrium that generates spontaneous electrical impulses setting the heart rhythm." : sentence,
    explanation: "Precise definitions require stating both the anatomical or technical term and its functional biological role.",
    keyTakeaways: ["SA Node initiates electrical action potentials.", "Propagates signal to AV Node and Purkinje fibers."],
    topicTag: 'Definitions'
  };
}

function buildFillBlank(index: number, sentence: string, theme: string, difficulty: Difficulty): QuestionItem {
  return {
    id: genId('blank'),
    type: 'FillBlank',
    difficulty,
    question: theme === 'heart'
      ? "Oxygenated blood exits the Left Ventricle into the ________, the largest artery in the human body."
      : "The principle of conservation of ________ states that energy cannot be created or destroyed.",
    blankAnswer: theme === 'heart' ? "aorta" : "energy",
    answer: theme === 'heart' ? "aorta" : "energy",
    explanation: theme === 'heart'
      ? "The Aorta branches into major systemic arteries distributing oxygenated blood throughout the body."
      : "First Law of Thermodynamics.",
    keyTakeaways: ["Fill-in-the-blank questions test exact terminology recall."],
    topicTag: 'Active Recall'
  };
}

function buildFlashcards(text: string, theme: string, sentences: string[]): Flashcard[] {
  if (theme === 'heart') {
    return [
      { id: genId('fc'), front: "Right Atrium", back: "Receives deoxygenated blood from Superior and Inferior Vena Cava.", category: "Heart Anatomy" },
      { id: genId('fc'), front: "Right Ventricle", back: "Pumps deoxygenated blood through pulmonary arteries to the lungs.", category: "Heart Anatomy" },
      { id: genId('fc'), front: "Left Atrium", back: "Receives oxygenated blood returning from the lungs via pulmonary veins.", category: "Heart Anatomy" },
      { id: genId('fc'), front: "Left Ventricle", back: "Pumps oxygenated blood through the Aorta to systemic body tissues; thickest myocardium.", category: "Heart Anatomy" },
    ];
  }

  return sentences.slice(0, 5).map((s, idx) => ({
    id: genId('fc'),
    front: `Key Term #${idx + 1}`,
    back: s,
    category: 'Study Notes'
  }));
}

function buildDiagrams(theme: string, title: string): VisualAidDiagram[] {
  if (theme === 'heart') {
    return [{
      id: genId('diag'),
      title: "Human Heart Blood Circulation & Valve Flow",
      description: "Visual roadmap showing step-by-step deoxygenated vs oxygenated blood flow through heart chambers, valves, and systemic vessels.",
      type: 'flowchart',
      svgType: 'heart',
      tags: ['Diagram: Human Heart Blood Flow Labeled', 'Cardiology', 'Vena Cava', 'Pulmonary Circuit', 'Aorta'],
      searchQueryTag: "Diagram: Human Heart Blood Flow Labeled",
      keyComponents: [
        { label: "1. Vena Cava -> Right Atrium", detail: "Deoxygenated blood enters Right Atrium from systemic body." },
        { label: "2. Tricuspid Valve -> Right Ventricle", detail: "Passes through Tricuspid valve into Right Ventricle." },
        { label: "3. Pulmonary Artery -> Lungs", detail: "Pumps through Pulmonary Valve to lungs for gas exchange." },
        { label: "4. Pulmonary Veins -> Left Atrium", detail: "Oxygenated blood returns into Left Atrium." },
        { label: "5. Mitral Valve -> Left Ventricle -> Aorta", detail: "Enters Left Ventricle and pumps via Aorta to body tissues." },
      ]
    }];
  }

  return [{
    id: genId('diag'),
    title: "Concept Relationships & System Flow",
    description: "Visual summary map of key topic dependencies extracted from your study notes.",
    type: 'flowchart',
    svgType: 'generic',
    tags: ['Diagram: System Overview', 'Key Concepts', 'Study Flow'],
    searchQueryTag: "Diagram: System Overview Labeled",
    keyComponents: [
      { label: "Foundational Principles", detail: "Core definitions and baseline rules" },
      { label: "Intermediate Dynamics", detail: "Process interactions and transformations" },
      { label: "Advanced Applications", detail: "Exam synthesis and problem solving" }
    ]
  }];
}
