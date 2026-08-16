import { GeneratedStudyKit, GeneratorOptions, QuestionItem, Flashcard, VisualAidDiagram, Difficulty } from './types';

// Helper to generate dynamic ID
const genId = (prefix: string) => `${prefix}_${Math.random().toString(36).substring(2, 9)}`;

export function generateStudyKit(text: string, options: GeneratorOptions): GeneratedStudyKit {
  const cleanText = text.trim();
  const lowerText = cleanText.toLowerCase();

  // Detect subject theme
  let theme: 'biology' | 'cs' | 'physics' | 'history' | 'general' = 'general';
  if (lowerText.includes('cell') || lowerText.includes('mitosis') || lowerText.includes('dna') || lowerText.includes('chromosome')) {
    theme = 'biology';
  } else if (lowerText.includes('tcp') || lowerText.includes('network') || lowerText.includes('protocol') || lowerText.includes('code') || lowerText.includes('data structure')) {
    theme = 'cs';
  } else if (lowerText.includes('energy') || lowerText.includes('thermodynamics') || lowerText.includes('heat') || lowerText.includes('entropy')) {
    theme = 'physics';
  } else if (lowerText.includes('empire') || lowerText.includes('roman') || lowerText.includes('war') || lowerText.includes('century') || lowerText.includes('king')) {
    theme = 'history';
  }

  // Extract key sentences and terms
  const sentences = cleanText
    .split(/(?<=[.?!])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 15);

  const title = extractTitle(cleanText, theme);
  const questions: QuestionItem[] = [];
  const flashcards: Flashcard[] = [];
  const diagrams: VisualAidDiagram[] = [];

  // Generate Questions based on options
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

  // Generate Flashcards
  if (options.includeFlashcards) {
    flashcards.push(...buildFlashcards(cleanText, theme, sentences));
  }

  // Generate Visual Aid Diagrams
  if (options.includeDiagrams) {
    diagrams.push(...buildDiagrams(theme, title));
  }

  return {
    id: genId('kit'),
    title: title,
    summary: `Extracted ${questions.length} exam questions, ${flashcards.length} flashcards, and ${diagrams.length} visual diagrams from your input notes.`,
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
  if (firstLine && firstLine.length < 60) {
    return firstLine;
  }
  switch (theme) {
    case 'biology': return 'Cell Biology & Mitosis Comprehensive Guide';
    case 'cs': return 'TCP/IP Networking & Data Transmission Master Guide';
    case 'physics': return 'Laws of Thermodynamics & Energy Transfer';
    case 'history': return 'Historical Analysis & Political Transformation';
    default: return 'Custom Study Notes & Exam Kit';
  }
}

function buildMCQ(index: number, sentence: string, theme: string, difficulty: Difficulty): QuestionItem {
  if (theme === 'biology') {
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
      },
      {
        q: "Which phase of the cell cycle involves DNA replication?",
        ans: "S Phase (Synthesis)",
        opts: [
          { id: 'a', text: "G1 Phase", isCorrect: false },
          { id: 'b', text: "S Phase", isCorrect: true },
          { id: 'c', text: "M Phase", isCorrect: false },
          { id: 'd', text: "G2 Phase", isCorrect: false },
        ],
        expl: "During the Synthesis (S) phase of interphase, the cell synthesizes a complete copy of the nuclear DNA.",
        mnemonic: "S = Synthesis of new DNA!",
        takeaways: ["S Phase duplicates chromosomes into sister chromatids.", "Occurs before M phase begins."]
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
        q: "Which TCP/IP layer is responsible for end-to-end reliability, flow control, and port addressing?",
        ans: "Transport Layer (Layer 3)",
        opts: [
          { id: 'a', text: "Application Layer", isCorrect: false },
          { id: 'b', text: "Internet Layer", isCorrect: false },
          { id: 'c', text: "Transport Layer", isCorrect: true },
          { id: 'd', text: "Network Access Layer", isCorrect: false },
        ],
        expl: "The Transport Layer uses TCP and UDP protocols to manage end-to-end data transfer between applications running on separate hosts.",
        mnemonic: "Transport = Port delivery & Traffic Control!",
        takeaways: ["TCP provides reliable 3-way handshake SYN-ACK.", "UDP provides fast connectionless transmission."]
      },
      {
        q: "What process is used by TCP to establish a reliable connection before data transfer?",
        ans: "Three-way Handshake (SYN, SYN-ACK, ACK)",
        opts: [
          { id: 'a', text: "Four-way Termination", isCorrect: false },
          { id: 'b', text: "Three-way Handshake", isCorrect: true },
          { id: 'c', text: "DNS Resolution", isCorrect: false },
          { id: 'd', text: "CIDR Subnetting", isCorrect: false },
        ],
        expl: "TCP establishes connections via SYN (synchronize), SYN-ACK (synchronize-acknowledge), and ACK (acknowledge) sequence numbers.",
        mnemonic: "SYN -> SYN-ACK -> ACK = Connection Sealed!",
        takeaways: ["Ensures both sender and receiver are ready.", "Synchronizes initial sequence numbers (ISN)."]
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

  // General fallback MCQ
  return {
    id: genId('mcq'),
    type: 'MCQ',
    difficulty,
    question: `Based on your material: "${sentence.substring(0, 70)}...", which statement is accurate?`,
    answer: "Statement correctly highlights the core mechanism described in the text.",
    explanation: `Detailed analysis of: ${sentence}. Cross-verify with key terminology in your chapter notes.`,
    mnemonic: "Recall: Focus on main subject noun and predicate relationships.",
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
  if (theme === 'biology') {
    return {
      id: genId('short'),
      type: 'Short',
      difficulty,
      question: "Explain the difference between Prophase and Anaphase in Mitosis.",
      answer: "In Prophase, chromatin condenses into chromosomes and the nuclear envelope breaks down. In Anaphase, sister chromatids are pulled apart to opposite poles by shortening spindle fibers.",
      explanation: "Prophase is the setup phase where chromosomes prepare for division. Anaphase is the separation phase where sister chromatids actually divide into individual chromosomes.",
      mnemonic: "P = Prepare (Prophase), A = Away (Anaphase split)!",
      keyTakeaways: [
        "Prophase: Chromatin condenses, spindle forms.",
        "Anaphase: Chromatids split and migrate to opposite poles."
      ],
      topicTag: 'Cell Biology'
    };
  } else if (theme === 'cs') {
    return {
      id: genId('short'),
      type: 'Short',
      difficulty,
      question: "Compare TCP and UDP protocols at the Transport Layer.",
      answer: "TCP is connection-oriented, guarantees packet delivery and order via acknowledgements, but has higher overhead. UDP is connectionless, fast, and lightweight with no delivery guarantees, ideal for streaming.",
      explanation: "TCP uses error checking and retransmission (e.g. web browsing, email). UDP streams data continuously without waiting for ACKs (e.g. video conferencing, gaming).",
      mnemonic: "TCP = Thorough & Reliable. UDP = Urgent & Fast!",
      keyTakeaways: [
        "TCP = 3-way handshake, ordered packets, flow control.",
        "UDP = Connectionless, low latency, no packet reordering."
      ],
      topicTag: 'Networking'
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
  if (theme === 'history') {
    return {
      id: genId('essay'),
      type: 'Essay',
      difficulty,
      question: "Analyze the multi-faceted causes that contributed to the fall of the Western Roman Empire in 476 AD.",
      answer: "A complete response should address: 1) Internal political decay & civil wars, 2) Economic hyperinflation and tax burdens, 3) Military reliance on barbarian mercenaries (foederati), and 4) External incursions by Germanic tribes and Huns.",
      explanation: "Essay scoring focuses on structured argument, historical evidence (e.g., Crisis of 3rd Century, sacking of Rome in 410 & 455 AD, deposition of Romulus Augustulus), and evaluation of long-term vs immediate triggers.",
      mnemonic: "P-E-M-B: Political decay, Economic crisis, Military mercenaries, Barbarian invasions.",
      keyTakeaways: [
        "Fall was a centuries-long transformation, not a single event.",
        "Eastern Roman (Byzantine) Empire survived until 1453."
      ],
      topicTag: 'World History'
    };
  }

  return {
    id: genId('essay'),
    type: 'Essay',
    difficulty,
    question: `Synthesize and critically evaluate the primary mechanisms detailed in your study notes regarding: "${sentence.substring(0, 65)}..."`,
    answer: "Structuring your essay response:\n1. Introduction: Define core terms and state your main thesis.\n2. Body Paragraph 1: Discuss primary mechanisms and structural rules.\n3. Body Paragraph 2: Analyze key implications, edge cases, and real-world applications.\n4. Conclusion: Summarize findings and overall significance.",
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
    question: theme === 'physics' 
      ? "Define Entropy according to the Second Law of Thermodynamics." 
      : `Define the key technical term emphasized in: "${sentence.substring(0, 50)}..."`,
    answer: theme === 'physics' 
      ? "Entropy (S) is a measure of thermal energy per unit temperature that is unavailable for doing useful work, representing the degree of disorder or randomness in a physical system."
      : sentence,
    explanation: "Precise definitions require stating both the mathematical or conceptual term and its functional physical or practical role.",
    keyTakeaways: ["Entropy in natural isolated systems always increases (ΔS > 0).", "Absolute zero (0 K) represents zero entropy state."],
    topicTag: 'Definitions'
  };
}

function buildFillBlank(index: number, sentence: string, theme: string, difficulty: Difficulty): QuestionItem {
  return {
    id: genId('blank'),
    type: 'FillBlank',
    difficulty,
    question: theme === 'biology'
      ? "In animal cell cytokinesis, a ________ furrow formed by actin microfilaments pinches the cytoplasm into two cells."
      : "The principle of conservation of ________ states that energy cannot be created or destroyed, only transformed.",
    blankAnswer: theme === 'biology' ? "cleavage" : "energy",
    answer: theme === 'biology' ? "cleavage" : "energy",
    explanation: theme === 'biology'
      ? "Cleavage furrow pinches the plasma membrane inward, while in plants a cell plate forms."
      : "First Law of Thermodynamics: ΔU = Q - W.",
    keyTakeaways: ["Fill-in-the-blank questions test exact terminology recall."],
    topicTag: 'Active Recall'
  };
}

function buildFlashcards(text: string, theme: string, sentences: string[]): Flashcard[] {
  if (theme === 'biology') {
    return [
      { id: genId('fc'), front: "Prophase", back: "Chromatin condenses into distinct chromosomes; nuclear envelope breaks down.", category: "Cell Cycle" },
      { id: genId('fc'), front: "Metaphase", back: "Chromosomes align along the metaphase plate in the center of the cell.", category: "Cell Cycle" },
      { id: genId('fc'), front: "Anaphase", back: "Sister chromatids separate and move to opposite poles of the cell.", category: "Cell Cycle" },
      { id: genId('fc'), front: "Telophase", back: "Nuclear envelopes reform around two daughter nuclei; chromosomes decondense.", category: "Cell Cycle" },
      { id: genId('fc'), front: "Cytokinesis", back: "Physical division of the cytoplasm into two separate daughter cells.", category: "Cell Cycle" },
      { id: genId('fc'), front: "S Phase", back: "Synthesis phase of Interphase where cellular DNA is replicated.", category: "Interphase" },
    ];
  } else if (theme === 'cs') {
    return [
      { id: genId('fc'), front: "Layer 4: Application", back: "High-level protocols (HTTP, HTTPS, FTP, DNS, SSH) for client applications.", category: "TCP/IP" },
      { id: genId('fc'), front: "Layer 3: Transport", back: "End-to-end communication, flow control, error checking (TCP & UDP).", category: "TCP/IP" },
      { id: genId('fc'), front: "Layer 2: Internet", back: "Logical addressing and packet routing across networks (IP, ICMP, ARP).", category: "TCP/IP" },
      { id: genId('fc'), front: "Layer 1: Network Access", back: "Physical hardware framing, MAC addresses, Ethernet, and Wi-Fi.", category: "TCP/IP" },
      { id: genId('fc'), front: "TCP 3-Way Handshake", back: "SYN -> SYN-ACK -> ACK connection setup sequence.", category: "Protocols" },
    ];
  }

  // General flashcards created from text
  return sentences.slice(0, 5).map((s, idx) => ({
    id: genId('fc'),
    front: `Key Concept #${idx + 1}`,
    back: s,
    category: 'Study Notes'
  }));
}

function buildDiagrams(theme: string, title: string): VisualAidDiagram[] {
  if (theme === 'biology') {
    return [{
      id: genId('diag'),
      title: "Mitosis & Cell Division Sequence",
      description: "Visual roadmap showing step-by-step nuclear and cytoplasmic division from Prophase through Cytokinesis.",
      type: 'cycle',
      svgType: 'mitosis',
      tags: ['Mitosis', 'Prophase', 'Metaphase', 'Anaphase', 'Telophase', 'Cytokinesis'],
      keyComponents: [
        { label: "1. Prophase", detail: "Chromosomes condense & spindle forms" },
        { label: "2. Metaphase", detail: "Chromosomes align along equatorial plate" },
        { label: "3. Anaphase", detail: "Sister chromatids split to opposite poles" },
        { label: "4. Telophase", detail: "Nuclear envelopes reform around daughter nuclei" },
        { label: "5. Cytokinesis", detail: "Cleavage furrow/Cell plate pinches cytoplasm" },
      ]
    }];
  } else if (theme === 'cs') {
    return [{
      id: genId('diag'),
      title: "TCP/IP 4-Layer Protocol Architecture",
      description: "Layered diagram showing encapsulation and data flow from application protocols down to physical media.",
      type: 'hierarchy',
      svgType: 'tcpip',
      tags: ['Application', 'Transport', 'Internet', 'Network Access', 'Protocols'],
      keyComponents: [
        { label: "Application Layer", detail: "HTTP, HTTPS, DNS, SSH, FTP" },
        { label: "Transport Layer", detail: "TCP (Reliable) / UDP (Fast)" },
        { label: "Internet Layer", detail: "IPv4, IPv6, ICMP, ARP" },
        { label: "Network Access", detail: "Ethernet, Wi-Fi 802.11, MAC Frames" },
      ]
    }];
  } else if (theme === 'physics') {
    return [{
      id: genId('diag'),
      title: "Laws of Thermodynamics & Energy Flow",
      description: "Conceptual diagram illustrating heat transfer, work output, and entropy increase.",
      type: 'flowchart',
      svgType: 'thermodynamics',
      tags: ['Thermodynamics', 'First Law', 'Second Law', 'Entropy', 'Energy'],
      keyComponents: [
        { label: "Hot Reservoir (Th)", detail: "Supplies heat energy (Qh)" },
        { label: "Engine / System", detail: "Converts heat to Work (W = Qh - Qc)" },
        { label: "Cold Sink (Tc)", detail: "Discharges waste heat (Qc) increasing Entropy" },
      ]
    }];
  }

  return [{
    id: genId('diag'),
    title: "Concept Relationships & System Flow",
    description: "Visual summary map of key topic dependencies extracted from your study notes.",
    type: 'flowchart',
    svgType: 'generic',
    tags: ['Overview', 'Key Concepts', 'Study Flow'],
    keyComponents: [
      { label: "Foundational Principles", detail: "Core definitions and baseline rules" },
      { label: "Intermediate Dynamics", detail: "Process interactions and transformations" },
      { label: "Advanced Applications", detail: "Exam synthesis and problem solving" }
    ]
  }];
}
