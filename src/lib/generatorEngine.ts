import { GeneratedStudyKit, GeneratorOptions, QuestionItem, Flashcard, VisualAidDiagram, Difficulty } from './types';

const genId = (prefix: string) => `${prefix}_${Math.random().toString(36).substring(2, 9)}`;

export function generateStudyKit(text: string, options: GeneratorOptions): GeneratedStudyKit {
  const cleanText = text.trim();
  const lowerText = cleanText.toLowerCase();

  // Detect subject theme
  let theme: 'heart' | 'biology' | 'cs' | 'physics' | 'general' = 'general';
  if (lowerText.includes('heart') || lowerText.includes('atrium') || lowerText.includes('ventricle') || lowerText.includes('aorta') || lowerText.includes('valve')) {
    theme = 'heart';
  } else if (lowerText.includes('cell') || lowerText.includes('mitosis') || lowerText.includes('chromosome') || lowerText.includes('prophase')) {
    theme = 'biology';
  } else if (lowerText.includes('tcp') || lowerText.includes('network') || lowerText.includes('protocol') || lowerText.includes('layer') || lowerText.includes('port')) {
    theme = 'cs';
  } else if (lowerText.includes('entropy') || lowerText.includes('thermodynamics') || lowerText.includes('energy') || lowerText.includes('heat')) {
    theme = 'physics';
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

  for (let i = 0; i < targetCount; i++) {
    const qType = requestedTypes[i % requestedTypes.length];
    const sentence = sentences[i % sentences.length] || `Core concept #${i + 1} from your provided study material.`;
    
    if (qType === 'MCQ') {
      questions.push(buildMCQ(i, sentence, theme, options.difficulty));
    } else if (qType === 'Short') {
      questions.push(buildShortAnswer(i, sentence, theme, options.difficulty));
    } else if (qType === 'Essay') {
      questions.push(buildEssay(i, sentence, theme, options.difficulty));
    } else if (qType === 'Definition') {
      questions.push(buildDefinition(i, sentence, theme, options.difficulty));
    } else if (qType === 'FillBlank') {
      questions.push(buildFillBlank(i, sentence, theme, options.difficulty));
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
    summary: `Extracted ${questions.length} exam items (${questions.filter(q => q.type === 'MCQ').length} interactive MCQs), ${flashcards.length} revision flashcards, and ${diagrams.length} visual diagrams.`,
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
    case 'biology': return 'Cell Division & Mitotic Cycle Study Kit';
    case 'cs': return 'TCP/IP Network Stack & Protocol Architecture';
    case 'physics': return 'Laws of Thermodynamics & Energy Transfer';
    default: return 'Custom Study Guide & Exam Prep Kit';
  }
}

function buildMCQ(index: number, sentence: string, theme: string, difficulty: Difficulty): QuestionItem {
  if (theme === 'heart') {
    const questionsPool = [
      {
        q: "Which chamber of the human heart receives oxygenated blood directly from the lungs via the pulmonary veins?",
        ans: "Left Atrium",
        opts: [
          { id: 'a', text: "Right Atrium", isCorrect: false },
          { id: 'b', text: "Right Ventricle", isCorrect: false },
          { id: 'c', text: "Left Atrium", isCorrect: true },
          { id: 'd', text: "Left Ventricle", isCorrect: false },
        ],
        expl: "Freshly oxygenated blood returns from pulmonary capillaries into the Left Atrium. It then passes through the Bicuspid (Mitral) valve into the Left Ventricle to be pumped systemically.",
        mnemonic: "Left side = Lungs & Oxygenated blood! Right side = Returning deoxygenated blood.",
        takeaways: ["Pulmonary veins carry oxygen-rich blood.", "Left Atrium acts as the receiving chamber for oxygenated blood."]
      },
      {
        q: "Why does the Left Ventricle have a significantly thicker muscular wall (myocardium) than the Right Ventricle?",
        ans: "It must generate high pressure to pump blood throughout the entire systemic body circulation.",
        opts: [
          { id: 'a', text: "It stores deoxygenated blood under high carbon dioxide pressure.", isCorrect: false },
          { id: 'b', text: "It must generate high pressure to pump blood throughout the entire systemic body circulation.", isCorrect: true },
          { id: 'c', text: "It prevents pulmonary valve prolapse during cardiac resting phase.", isCorrect: false },
          { id: 'd', text: "It filters blood before passing it to the Sinoatrial Node.", isCorrect: false },
        ],
        expl: "The Right Ventricle only pumps blood a short distance to the lungs (pulmonary circuit), whereas the Left Ventricle must pump blood against high systemic resistance to the entire body via the Aorta.",
        mnemonic: "Left Ventricle = Heavy Lifter for systemic body pressure!",
        takeaways: ["Systemic circuit requires higher pressure than pulmonary circuit.", "Left Ventricle myocardium is 3x thicker than Right Ventricle."]
      },
      {
        q: "Which heart valve prevents backflow of blood from the Right Ventricle back into the Right Atrium?",
        ans: "Tricuspid Valve",
        opts: [
          { id: 'a', text: "Bicuspid (Mitral) Valve", isCorrect: false },
          { id: 'b', text: "Aortic Valve", isCorrect: false },
          { id: 'c', text: "Tricuspid Valve", isCorrect: true },
          { id: 'd', text: "Pulmonary Valve", isCorrect: false },
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
  } else if (theme === 'biology') {
    const questionsPool = [
      {
        q: "During which phase of Mitosis do sister chromatids align along the equator of the cell?",
        ans: "Metaphase",
        opts: [
          { id: 'a', text: "Prophase", isCorrect: false },
          { id: 'b', text: "Metaphase", isCorrect: true },
          { id: 'c', text: "Anaphase", isCorrect: false },
          { id: 'd', text: "Telophase", isCorrect: false },
        ],
        expl: "In Metaphase, chromosomes line up along the metaphase plate in the middle of the cell. Spindle fibers attach to kinetochores to prepare for division.",
        mnemonic: "M = Middle! Metaphase means Chromosomes in the Middle.",
        takeaways: ["Metaphase alignment ensures equal distribution of genetic material.", "Spindle fibers lock onto kinetochores."]
      },
      {
        q: "What structure forms in plant cells during cytokinesis to separate the daughter cells?",
        ans: "Cell Plate",
        opts: [
          { id: 'a', text: "Cleavage Furrow", isCorrect: false },
          { id: 'b', text: "Cell Plate", isCorrect: true },
          { id: 'c', text: "Nuclear Envelope", isCorrect: false },
          { id: 'd', text: "Centrosome Ring", isCorrect: false },
        ],
        expl: "Because plant cells have rigid cell walls, they cannot form a cleavage furrow. Instead, membrane-bound vesicles assemble a Cell Plate along the equator.",
        mnemonic: "Plant = Plate! Animal = Cleavage Furrow.",
        takeaways: ["Cell plate fuses with plasma membrane to construct a rigid cell wall.", "Cleavage furrow is unique to animal cells."]
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
      topicTag: 'Cell Biology'
    };
  } else if (theme === 'cs') {
    const questionsPool = [
      {
        q: "Which TCP/IP layer handles logical addressing and routing of packets across disparate networks?",
        ans: "Internet Layer (Layer 2)",
        opts: [
          { id: 'a', text: "Application Layer", isCorrect: false },
          { id: 'b', text: "Transport Layer", isCorrect: false },
          { id: 'c', text: "Internet Layer", isCorrect: true },
          { id: 'd', text: "Network Access Layer", isCorrect: false },
        ],
        expl: "The Internet Layer uses IP (IPv4/IPv6) addressing and ICMP diagnostics to route packets between source and destination IP addresses across subnets.",
        mnemonic: "Internet Layer = IP Routing & Packet Addressing!",
        takeaways: ["IP addresses operate at the Internet Layer.", "Transport Layer manages ports and connections."]
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
      topicTag: 'Networking'
    };
  }

  // Fallback MCQ
  return {
    id: genId('mcq'),
    type: 'MCQ',
    difficulty,
    question: `Based on your material: "${sentence.substring(0, 70)}...", which statement is accurate?`,
    answer: "Statement correctly highlights the core mechanism described in the text.",
    explanation: `Detailed analysis of: ${sentence}. Cross-verify with key terminology in your chapter notes.`,
    mnemonic: "Focus on subject-predicate relationships in test questions.",
    keyTakeaways: ["Key insight directly matches provided study text.", "Pay attention to context clues in test questions."],
    options: [
      { id: 'a', text: sentence.length > 50 ? sentence.substring(0, 50) + "..." : sentence, isCorrect: true },
      { id: 'b', text: "Process operates in reverse without requiring energy or regulation.", isCorrect: false },
      { id: 'c', text: "Phenomenon only applies to isolated laboratory conditions.", isCorrect: false },
      { id: 'd', text: "Component is permanently disabled during initial phase.", isCorrect: false },
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
      question: "Trace the path of oxygenated blood from the lungs back to the systemic body tissues.",
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
  if (theme === 'heart') {
    return {
      id: genId('essay'),
      type: 'Essay',
      difficulty,
      question: "Compare and contrast Systemic Circulation and Pulmonary Circulation in human cardiac physiology.",
      answer: "A complete essay should address: 1) Circuit destinations (Pulmonary = Lungs for gas exchange; Systemic = Body tissues for O2/nutrient delivery), 2) Pressure requirements (Pulmonary = Low pressure; Systemic = High pressure), 3) Ventricular myocardium thickness (Left Ventricle 3x thicker than Right), and 4) Vessel oxygenation roles.",
      explanation: "Evaluation criteria: Clear structural outline, accurate anatomical terminology (Vena Cava, Pulmonary Arteries/Veins, Aorta), and thorough explanation of pressure dynamics.",
      mnemonic: "P-S-M-V: Purpose, Pressure, Myocardium thickness, Vessels.",
      keyTakeaways: [
        "Pulmonary circuit operates at low resistance to prevent lung fluid accumulation.",
        "Systemic circuit supplies all body organs via arterial branching."
      ],
      topicTag: 'Cardiac Physiology'
    };
  }

  return {
    id: genId('essay'),
    type: 'Essay',
    difficulty,
    question: `Synthesize and critically evaluate the primary mechanisms detailed in your study notes regarding: "${sentence.substring(0, 65)}..."`,
    answer: "Structuring your response:\n1. Introduction: Define core terms and state main thesis.\n2. Body Paragraph 1: Analyze primary mechanisms and structural rules.\n3. Body Paragraph 2: Evaluate real-world applications and edge cases.\n4. Conclusion: Summarize findings and overall significance.",
    explanation: "High-scoring essay responses demonstrate clear logical flow, accurate technical vocabulary, and thorough explanation of cause-and-effect relationships.",
    keyTakeaways: ["Use thematic headings to structure your essay.", "Include specific examples from your notes to validate claims."],
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
      { id: genId('fc'), front: "Tricuspid Valve", back: "AV valve between Right Atrium and Right Ventricle preventing backflow.", category: "Valves" },
      { id: genId('fc'), front: "Bicuspid (Mitral) Valve", back: "AV valve between Left Atrium and Left Ventricle preventing backflow.", category: "Valves" },
    ];
  } else if (theme === 'biology') {
    return [
      { id: genId('fc'), front: "Prophase", back: "Chromatin condenses into distinct chromosomes; nuclear envelope breaks down.", category: "Cell Cycle" },
      { id: genId('fc'), front: "Metaphase", back: "Chromosomes align along the metaphase plate in the center of the cell.", category: "Cell Cycle" },
      { id: genId('fc'), front: "Anaphase", back: "Sister chromatids separate and move to opposite poles of the cell.", category: "Cell Cycle" },
      { id: genId('fc'), front: "Telophase", back: "Nuclear envelopes reform around two daughter nuclei; chromosomes decondense.", category: "Cell Cycle" },
    ];
  }

  return sentences.slice(0, 5).map((s, idx) => ({
    id: genId('fc'),
    front: `Key Concept #${idx + 1}`,
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
      tags: ['Diagram: Human Heart Blood Flow', 'Cardiology', 'Vena Cava', 'Pulmonary Circuit', 'Aorta'],
      keyComponents: [
        { label: "1. Vena Cava -> Right Atrium", detail: "Deoxygenated blood enters Right Atrium from systemic body." },
        { label: "2. Tricuspid Valve -> Right Ventricle", detail: "Passes through Tricuspid valve into Right Ventricle." },
        { label: "3. Pulmonary Artery -> Lungs", detail: "Pumps through Pulmonary Valve to lungs for gas exchange (O2 up, CO2 out)." },
        { label: "4. Pulmonary Veins -> Left Atrium", detail: "Oxygenated blood returns into Left Atrium." },
        { label: "5. Mitral Valve -> Left Ventricle -> Aorta", detail: "Enters Left Ventricle and pumps via Aorta to body tissues." },
      ]
    }];
  } else if (theme === 'biology') {
    return [{
      id: genId('diag'),
      title: "Mitosis & Cell Division Sequence",
      description: "Visual roadmap showing step-by-step nuclear and cytoplasmic division from Prophase through Cytokinesis.",
      type: 'cycle',
      svgType: 'mitosis',
      tags: ['Diagram: Cell Mitosis Stages', 'Prophase', 'Metaphase', 'Anaphase', 'Telophase', 'Cytokinesis'],
      keyComponents: [
        { label: "1. Prophase", detail: "Chromosomes condense & spindle forms" },
        { label: "2. Metaphase", detail: "Chromosomes align along equatorial metaphase plate" },
        { label: "3. Anaphase", detail: "Sister chromatids split to opposite poles" },
        { label: "4. Telophase & Cytokinesis", detail: "Nuclear envelopes reform; cleavage furrow pinches cytoplasm" },
      ]
    }];
  } else if (theme === 'cs') {
    return [{
      id: genId('diag'),
      title: "TCP/IP 4-Layer Protocol Architecture",
      description: "Layered diagram showing encapsulation and data flow from application protocols down to physical media.",
      type: 'hierarchy',
      svgType: 'tcpip',
      tags: ['Diagram: TCP/IP Stack', 'Application', 'Transport', 'Internet', 'Network Access'],
      keyComponents: [
        { label: "Application Layer", detail: "HTTP, HTTPS, DNS, SSH, FTP" },
        { label: "Transport Layer", detail: "TCP (Reliable) / UDP (Fast)" },
        { label: "Internet Layer", detail: "IPv4, IPv6, ICMP, ARP" },
        { label: "Network Access", detail: "Ethernet, Wi-Fi 802.11, MAC Frames" },
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
    keyComponents: [
      { label: "Foundational Principles", detail: "Core definitions and baseline rules" },
      { label: "Intermediate Dynamics", detail: "Process interactions and transformations" },
      { label: "Advanced Applications", detail: "Exam synthesis and problem solving" }
    ]
  }];
}
