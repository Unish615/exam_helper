import { GeneratedStudyKit, GeneratorOptions, QuestionItem, Flashcard, VisualAidDiagram, Difficulty, MCQOption } from './types';

const genId = (prefix: string) => `${prefix}_${Math.random().toString(36).substring(2, 9)}`;

// Algorithmic string similarity helper for deduplication
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
    if (overlapRatio > 0.55) return true; // Duplicate detected
  }
  return false;
}

export function generateStudyKit(text: string, options: GeneratorOptions): GeneratedStudyKit {
  const cleanText = text.trim();
  const lowerText = cleanText.toLowerCase();

  // Detect subject theme
  let theme: 'photosynthesis' | 'heart' | 'biology' | 'cs' | 'general' = 'general';
  if (lowerText.includes('photosynthesis') || lowerText.includes('calvin') || lowerText.includes('thylakoid') || lowerText.includes('rubisco') || lowerText.includes('chloroplast')) {
    theme = 'photosynthesis';
  } else if (lowerText.includes('heart') || lowerText.includes('atrium') || lowerText.includes('ventricle') || lowerText.includes('aorta') || lowerText.includes('valve')) {
    theme = 'heart';
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

  // Algorithmic Deduplication Tracker
  const generatedQuestionTexts: string[] = [];

  for (let i = 0; i < targetCount * 2; i++) {
    if (questions.length >= targetCount) break;

    const qType = requestedTypes[questions.length % requestedTypes.length];
    const sentence = sentences[i % sentences.length] || `Core concept #${i + 1} from study material.`;
    
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
    case 'photosynthesis': return 'Photosynthesis & Calvin Cycle Plant Physiology';
    case 'heart': return 'Human Heart Anatomy & Blood Flow Circulation';
    case 'biology': return 'Cell Division & Mitotic Cycle Study Kit';
    case 'cs': return 'TCP/IP Network Stack & Protocol Architecture';
    default: return 'Custom Nyoria Study Pack & Exam Kit';
  }
}

function buildMCQ(index: number, sentence: string, theme: string, difficulty: Difficulty): QuestionItem {
  if (theme === 'photosynthesis') {
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
      },
      {
        q: "Which enzyme is responsible for catalyzing the initial fixation of atmospheric carbon dioxide onto RuBP during the Calvin cycle?",
        ans: "RuBisCO",
        opts: [
          { id: 'a', label: 'A' as const, text: "ATP Synthase", isCorrect: false },
          { id: 'b', label: 'B' as const, text: "NADPH Reductase", isCorrect: false },
          { id: 'c', label: 'C' as const, text: "RuBisCO", isCorrect: true },
          { id: 'd', label: 'D' as const, text: "DNA Polymerase III", isCorrect: false },
        ],
        expl: "RuBisCO (Ribulose-1,5-bisphosphate carboxylase-oxygenase) is the primary enzyme in the stroma that fixes CO2 onto 5-carbon RuBP to initiate the Calvin cycle.",
        mnemonic: "RuBisCO = Carbon Fixing Champion in the Stroma!",
        takeaways: ["RuBisCO is the most abundant enzyme on Earth.", "Operates during the light-independent Calvin cycle."]
      },
      {
        q: "What molecule is produced as a direct byproduct of water photolysis in Photosystem II?",
        ans: "Oxygen Gas (O2)",
        opts: [
          { id: 'a', label: 'A' as const, text: "Carbon Dioxide (CO2)", isCorrect: false },
          { id: 'b', label: 'B' as const, text: "Oxygen Gas (O2)", isCorrect: true },
          { id: 'c', label: 'C' as const, text: "Methane (CH4)", isCorrect: false },
          { id: 'd', label: 'D' as const, text: "Glucose (C6H12O6)", isCorrect: false },
        ],
        expl: "Photolysis splits water (H2O -> 2 H+ + 2 e- + 1/2 O2), providing electrons to replace those lost by Chlorophyll P680 and releasing O2 into the atmosphere.",
        mnemonic: "H2O split = Oxygen release!",
        takeaways: ["Oxygen released during photosynthesis comes from water splitting.", "Occurs at Photosystem II."]
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
  } else if (theme === 'heart') {
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
  }

  // Fallback MCQ
  return {
    id: genId('mcq'),
    type: 'MCQ',
    difficulty,
    question: `Based on your study notes: "${sentence.substring(0, 70)}...", which statement is accurate?`,
    answer: "Statement correctly highlights the core mechanism described in your text.",
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
  if (theme === 'photosynthesis') {
    return {
      id: genId('short'),
      type: 'Short',
      difficulty,
      question: "Differentiate between the Light-Dependent Reactions and the Calvin Cycle in photosynthesis.",
      answer: "Light-Dependent Reactions occur in thylakoid membranes, require sunlight to split water, release O2, and produce ATP & NADPH. The Calvin Cycle occurs in the stroma, does not directly require light, and uses ATP & NADPH to fix CO2 into G3P/glucose.",
      explanation: "Light reactions convert solar energy to chemical energy (ATP/NADPH). Dark reactions (Calvin cycle) use that chemical energy to build sugar molecules.",
      mnemonic: "Light = Thylakoids & Energy. Calvin = Stroma & Sugar!",
      keyTakeaways: [
        "Light reactions split H2O releasing O2.",
        "Calvin cycle fixes CO2 using RuBisCO."
      ],
      topicTag: 'Photosynthesis Stages'
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
    question: theme === 'photosynthesis'
      ? "Comprehensive Analysis: Trace the flow of energy and carbon fixation from photon absorption in Photosystem II to glucose synthesis in the Calvin Cycle."
      : `Synthesize and critically evaluate the primary mechanisms detailed in your study notes regarding: "${sentence.substring(0, 65)}..."`,
    answer: "Essay Response Outline:\n1. Light Absorption & Photolysis: P680 excitation and H2O splitting.\n2. Electron Transport & Photophosphorylation: Proton gradient driving ATP Synthase and NADPH production.\n3. Carbon Fixation: RuBisCO fixes CO2 onto RuBP creating 3-PGA.\n4. Reduction & Sugar Output: ATP/NADPH convert 3-PGA to G3P for glucose synthesis and RuBP regeneration.",
    explanation: "High-scoring essay responses demonstrate clear logical flow, accurate technical vocabulary, and thorough explanation of cause-and-effect relationships.",
    keyTakeaways: ["Use thematic headings to structure your essay response.", "Include specific chemical equations and cellular locations."],
    topicTag: 'Comprehensive Essay'
  };
}

function buildDefinition(index: number, sentence: string, theme: string, difficulty: Difficulty): QuestionItem {
  return {
    id: genId('def'),
    type: 'Definition',
    difficulty,
    question: theme === 'photosynthesis' ? "Define Photolysis of Water in plant photosynthesis." : `Define the key technical term in: "${sentence.substring(0, 50)}..."`,
    answer: theme === 'photosynthesis' ? "Photolysis is the light-driven splitting of water molecules (2 H2O -> 4 H+ + 4 e- + O2) in Photosystem II during light-dependent reactions." : sentence,
    explanation: "Photolysis supplies replacement electrons to chlorophyll P680 while generating atmospheric oxygen and thylakoid protons.",
    keyTakeaways: ["Essential for replacing lost chlorophyll electrons.", "Releases O2 gas as a byproduct."],
    topicTag: 'Definitions'
  };
}

function buildFillBlank(index: number, sentence: string, theme: string, difficulty: Difficulty): QuestionItem {
  return {
    id: genId('blank'),
    type: 'FillBlank',
    difficulty,
    question: theme === 'photosynthesis'
      ? "The primary carbon-fixing enzyme operating in the chloroplast stroma is ________."
      : "The principle of conservation of ________ states that energy cannot be created or destroyed.",
    blankAnswer: theme === 'photosynthesis' ? "rubisco" : "energy",
    answer: theme === 'photosynthesis' ? "RuBisCO" : "energy",
    explanation: "RuBisCO fixes atmospheric CO2 onto RuBP.",
    keyTakeaways: ["Fill-in-the-blank questions test exact terminology recall."],
    topicTag: 'Active Recall'
  };
}

function buildFlashcards(text: string, theme: string, sentences: string[]): Flashcard[] {
  if (theme === 'photosynthesis') {
    return [
      { id: genId('fc'), front: "Thylakoid Membrane", back: "Site of Light-Dependent Reactions containing chlorophyll, photosystems, and ATP Synthase.", category: "Photosynthesis" },
      { id: genId('fc'), front: "Stroma", back: "Fluid-filled interior of chloroplast where the Calvin Cycle (light-independent reactions) occurs.", category: "Photosynthesis" },
      { id: genId('fc'), front: "RuBisCO", back: "Enzyme that fixes CO2 onto RuBP in the Calvin cycle to produce 3-PGA.", category: "Enzymes" },
      { id: genId('fc'), front: "Photolysis", back: "Light-driven splitting of water molecules releasing electrons, protons, and oxygen gas.", category: "Reactions" },
      { id: genId('fc'), front: "G3P", back: "3-carbon sugar precursor produced in Calvin cycle used to assemble glucose.", category: "Molecules" },
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
  if (theme === 'photosynthesis') {
    return [{
      id: genId('diag'),
      title: "Photosynthesis Two-Stage Biochemical Architecture",
      description: "Visual roadmap illustrating photon absorption in Thylakoids, Water Photolysis, O2 release, and Stroma Calvin Cycle CO2 fixation.",
      type: 'flowchart',
      svgType: 'photosynthesis',
      tags: ['Diagram: Photosynthesis Process Labeled', 'Thylakoid', 'Calvin Cycle', 'RuBisCO', 'Stroma'],
      searchQueryTag: "Diagram: Photosynthesis Process Labeled",
      keyComponents: [
        { label: "1. Thylakoid Membrane", detail: "Absorbs photons; photolysis splits H2O releasing O2 gas." },
        { label: "2. Electron Transport & ATP", detail: "Generates ATP and NADPH chemical energy carriers." },
        { label: "3. Chloroplast Stroma", detail: "Calvin cycle uses ATP & NADPH to fix CO2 via RuBisCO." },
        { label: "4. Glucose Output", detail: "Produces G3P precursors for glucose and plant biomass." },
      ]
    }];
  } else if (theme === 'heart') {
    return [{
      id: genId('diag'),
      title: "Human Heart Blood Circulation & Valve Flow",
      description: "Visual roadmap showing step-by-step deoxygenated vs oxygenated blood flow through heart chambers, valves, and systemic vessels.",
      type: 'flowchart',
      svgType: 'heart',
      tags: ['Diagram: Human Heart Circulation', 'Cardiology', 'Vena Cava', 'Pulmonary Circuit', 'Aorta'],
      searchQueryTag: "Diagram: Human Heart Circulation",
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
    searchQueryTag: "Diagram: System Overview",
    keyComponents: [
      { label: "Foundational Principles", detail: "Core definitions and baseline rules" },
      { label: "Intermediate Dynamics", detail: "Process interactions and transformations" },
      { label: "Advanced Applications", detail: "Exam synthesis and problem solving" }
    ]
  }];
}
