import { SessionState, GradedQuestion, AnswerBlock, AnswerSheetPage } from "./types";

export const SAMPLE_QUESTIONS: GradedQuestion[] = [
  {
    id: "1",
    displayNumber: "1",
    text: "Which blood vessel carries blood away from the heart?",
    maxMarks: 2,
    order: 1,
    score: 2,
    status: "correct",
    feedback: "Accurate and precise. You correctly stated that arteries carry oxygenated/deoxygenated blood away from the heart.",
    answers: [
      {
        questionLabelRaw: "Q1.",
        questionId: "1",
        text: "Photosynthesis is the process used by green plants and some other organisms to convert light energy into chemical energy.\n6CO2 + 6H2O -> C6H12O6 + 6O2",
        page: 1,
        bbox: [0.06, 0.08, 0.88, 0.32],
      },
    ],
  },
  {
    id: "2",
    displayNumber: "2",
    text: "Which of the following organelles is primarily involved in photosynthesis?",
    maxMarks: 2,
    order: 2,
    score: 2,
    status: "correct",
    feedback: "Excellent work! You correctly identified the chloroplast as the organelle responsible for photosynthesis. Keep it up!",
    answers: [
      {
        questionLabelRaw: "Q2.",
        questionId: "2",
        text: "The process mainly occurs in the chloroplast of the plant cell. It has two main stages:\n1. Light reaction - Captures light energy.\n2. Dark reaction - Uses energy to make glucose.",
        page: 1,
        bbox: [0.03, 0.42, 0.94, 0.15],
      },
    ],
  },
  {
    id: "3",
    displayNumber: "3",
    text: "Explain the role of chloroplasts in photosynthesis, naming the main pigments involved and briefly outlining the two major stages of the process.",
    maxMarks: 2,
    order: 3,
    score: 2,
    status: "correct",
    feedback: "Comprehensive explanation covering chlorophyll pigments, thylakoid light reactions, and Calvin cycle dark reactions.",
    answers: [
      {
        questionLabelRaw: "Q3.",
        questionId: "3",
        text: "Chloroplast contains chlorophyll a & b which absorb solar photons. Light stage generates ATP/NADPH; Dark stage reduces carbon dioxide into sugars in stroma.",
        page: 2,
        bbox: [0.06, 0.05, 0.88, 0.22],
      },
    ],
  },
  {
    id: "4",
    displayNumber: "4",
    text: "Describe the flow of blood through the human heart starting from the right atrium and ending at the aorta; include the names of valves crossed.",
    maxMarks: 2,
    order: 4,
    score: 0,
    status: "incorrect",
    feedback: "Incomplete description. The sequence of tricuspid, pulmonary valve, bicuspid (mitral) valve and aortic valve was omitted.",
    answers: [
      {
        questionLabelRaw: "Q4.",
        questionId: "4",
        text: "Blood goes from right atrium to ventricles and out to body.",
        page: 2,
        bbox: [0.06, 0.30, 0.88, 0.16],
      },
    ],
  },
  {
    id: "5",
    displayNumber: "5",
    text: "Draw a labelled diagram of an alveolus showing capillaries and air space (label alveolar sac, capillary, and direction of gas exchange).",
    maxMarks: 2,
    order: 5,
    score: 2,
    status: "correct",
    feedback: "Well sketched diagram with clear indicators for O2 influx into capillary and CO2 diffusion into alveolar lumen.",
    answers: [
      {
        questionLabelRaw: "Q5.",
        questionId: "5",
        text: "[Diagram drawn showing Alveolar membrane, red blood cells, capillary endothelial wall, and diffusion arrows for O2/CO2]",
        page: 2,
        bbox: [0.06, 0.50, 0.88, 0.35],
      },
    ],
  },
  {
    id: "6",
    displayNumber: "6",
    text: "Draw a neat labelled diagram of the human digestive system (stomach, small intestine, large intestine, liver, pancreas) and label the site where most absorption occurs.",
    maxMarks: 5,
    order: 6,
    score: 4,
    status: "partial",
    feedback: "Very good anatomical drawing. Minus 1 mark because the duodenum/pancreatic duct junction was slightly misplaced.",
    answers: [
      {
        questionLabelRaw: "Q6.",
        questionId: "6",
        text: "[Diagram of gastrointestinal tract with stomach, liver, gall bladder, duodenum, ileum, colon labelled. Small intestine marked as major absorption site].",
        page: 3,
        bbox: [0.06, 0.05, 0.88, 0.42],
      },
    ],
  },
  {
    id: "7",
    displayNumber: "7",
    text: "Draw and label a nephron (Bowman's capsule, glomerulus, proximal tubule, loop of Henle, distal tubule, collecting duct).",
    maxMarks: 5,
    order: 7,
    score: 5,
    status: "correct",
    feedback: "Perfect technical drawing with all 6 required anatomical landmarks accurately positioned and annotated.",
    answers: [
      {
        questionLabelRaw: "Q7.",
        questionId: "7",
        text: "[Nephron diagram with afferent arteriole, glomerulus inside Bowman's capsule, PCT, Henle's descending/ascending loop, DCT, and collecting duct].",
        page: 3,
        bbox: [0.06, 0.50, 0.88, 0.45],
      },
    ],
  },
  {
    id: "8",
    displayNumber: "8",
    text: "Explain the structural differences between palisade mesophyll and spongy mesophyll and state how each structure aids its function in the leaf.",
    maxMarks: 5,
    order: 8,
    score: 3,
    status: "partial",
    feedback: "Good explanation of palisade packing for light absorption. Spongy mesophyll air spaces for gas diffusion needed more detail.",
    answers: [
      {
        questionLabelRaw: "Q8.",
        questionId: "8",
        text: "Palisade mesophyll cells are vertically elongated and packed with chloroplasts to maximize sunlight capture. Spongy cells are loosely arranged with large air cavities for gaseous exchange.",
        page: 4,
        bbox: [0.06, 0.05, 0.88, 0.22],
      },
    ],
  },
  {
    id: "9",
    displayNumber: "9",
    text: "Describe the process of transpiration in plants in two to three sentences and name two environmental factors that increase its rate.",
    maxMarks: 5,
    order: 9,
    score: 5,
    status: "correct",
    feedback: "Clear, concise definition of evaporative water loss creating transpirational pull, with correct factors: high temperature and wind speed.",
    answers: [
      {
        questionLabelRaw: "Q9.",
        questionId: "9",
        text: "Transpiration is the loss of water vapour from aerial parts of plants primarily through stomata. Factors increasing rate: 1. Higher temperature 2. Higher wind velocity / lower humidity.",
        page: 4,
        bbox: [0.06, 0.30, 0.88, 0.20],
      },
    ],
  },
  {
    id: "10",
    displayNumber: "10",
    text: "Explain how the structure of xylem vessels facilitates water transport in plants (mention one structural feature and its role).",
    maxMarks: 5,
    order: 10,
    score: 4,
    status: "partial",
    feedback: "Great mention of lignified cell walls preventing collapse. Could also mention lack of end walls forming continuous hollow tubes.",
    answers: [
      {
        questionLabelRaw: "Q10.",
        questionId: "10",
        text: "Xylem vessels are dead, hollow tubes with walls reinforced by lignin. This provides structural rigidity and withstands the tension of negative water pressure.",
        page: 4,
        bbox: [0.06, 0.53, 0.88, 0.18],
      },
    ],
  },
  {
    id: "11a",
    displayNumber: "11",
    subLabel: "a.",
    text: "A diagram shows two potted plants — Plant A in bright light with broad green leaves, Plant B kept in dim light with pale, elongated leaves.",
    maxMarks: 2,
    order: 11,
    score: 2,
    status: "correct",
    feedback: "Accurately identified etiolation caused by insufficient photon flux density.",
    answers: [
      {
        questionLabelRaw: "Q11 (a)",
        questionId: "11a",
        text: "Plant B exhibits etiolation because in dim light, auxins cause stems to elongate rapidly while chlorophyll synthesis is suppressed.",
        page: 4,
        bbox: [0.06, 0.73, 0.88, 0.12],
      },
    ],
  },
  {
    id: "11b",
    displayNumber: "11",
    subLabel: "b.",
    text: "Suggest one practical measure to help Plant B recover.",
    maxMarks: 3,
    order: 12,
    score: 1,
    status: "partial",
    feedback: "Partially correct. Moving to bright indirect sunlight was mentioned, but acclimation to avoid photoinhibition was omitted.",
    answers: [
      {
        questionLabelRaw: "Q11 (b)",
        questionId: "11b",
        text: "Gradually place Plant B in direct bright sunlight and supply balanced nutrient watering.",
        page: 4,
        bbox: [0.06, 0.86, 0.88, 0.10],
      },
    ],
  },
  {
    id: "12",
    displayNumber: "12",
    text: "A resting person has tidal volume (air per breath) of 0.5 L and breathes 12 times per minute.",
    maxMarks: 5,
    order: 13,
    score: 4,
    status: "partial",
    feedback: "Calculation is accurate (6.0 L/min total pulmonary ventilation), minor formatting slip on units.",
    answers: [],
  },
  {
    id: "13",
    displayNumber: "13",
    text: "If dead space is 0.15 L per breath, calculate the alveolar ventilation per minute. Show working.",
    maxMarks: 5,
    order: 14,
    score: 4,
    status: "partial",
    feedback: "Formula (Tidal Volume - Dead Space) x Respiratory Rate applied correctly: (0.5 - 0.15) x 12 = 4.2 L/min.",
    answers: [],
  },
];

export const SAMPLE_UNMATCHED: AnswerBlock[] = [
  {
    questionLabelRaw: null,
    questionId: null,
    text: "Rough work: 12 x 0.35 = 4.20 L/min alveolar exchange volume.",
    page: 4,
    bbox: [0.65, 0.90, 0.30, 0.08],
  },
];

/**
 * Creates SVG data URIs for mock scanned pages matching the Figma design screenshot
 */
function createMockPageSvg(pageNumber: number): string {
  // SVG drawing of realistic handwritten answer sheet lined paper with blue lines and margin
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1150" width="800" height="1150" style="background:#fcfbf7">
  <!-- Notebook paper pattern -->
  <rect width="800" height="1150" fill="#FCFAF2" />
  
  <!-- Left Margin Line -->
  <line x1="120" y1="0" x2="120" y2="1150" stroke="#f87171" stroke-width="2" opacity="0.65" />
  
  <!-- Top Margin Header Line -->
  <line x1="0" y1="90" x2="800" y2="90" stroke="#f87171" stroke-width="2" opacity="0.65" />
  
  <!-- Horizontal ruled lines -->
  ${Array.from({ length: 32 })
    .map((_, i) => `<line x1="0" y1="${130 + i * 32}" x2="800" y2="${130 + i * 32}" stroke="#93c5fd" stroke-width="1" opacity="0.5" />`)
    .join("\n")}

  <!-- Page number header -->
  <text x="730" y="60" font-family="'Caveat', 'Comic Sans MS', cursive, sans-serif" font-size="20" fill="#4b5563">Page ${pageNumber}</text>

  ${
    pageNumber === 1
      ? `
    <!-- Q1 Handwriting -->
    <text x="40" y="152" font-family="'Caveat', 'Comic Sans MS', cursive, sans-serif" font-size="24" fill="#1e3a8a" font-weight="bold">Q1.</text>
    <text x="140" y="152" font-family="'Caveat', 'Comic Sans MS', cursive, sans-serif" font-size="22" fill="#1e3a8a">Photosynthesis is the process used by</text>
    <text x="140" y="184" font-family="'Caveat', 'Comic Sans MS', cursive, sans-serif" font-size="22" fill="#1e3a8a">green plants and some other organisms</text>
    <text x="140" y="216" font-family="'Caveat', 'Comic Sans MS', cursive, sans-serif" font-size="22" fill="#1e3a8a">to convert light energy into chemical</text>
    <text x="140" y="248" font-family="'Caveat', 'Comic Sans MS', cursive, sans-serif" font-size="22" fill="#1e3a8a">energy.</text>

    <!-- Formula Box -->
    <rect x="140" y="270" width="580" height="52" fill="none" stroke="#1e3a8a" stroke-width="1.5" rx="2" />
    <text x="155" y="302" font-family="'Caveat', 'Comic Sans MS', cursive, sans-serif" font-size="21" fill="#1e3a8a">6CO₂  +  6H₂O  ────[Light / Chlorophyll]────►  C₆H₁₂O₆  +  6O₂</text>

    <!-- Plant Diagram -->
    <g transform="translate(320, 340)">
      <!-- Sun -->
      <circle cx="90" cy="30" r="14" fill="none" stroke="#1e3a8a" stroke-width="2" />
      <path d="M90,8 L90,2 M90,52 L90,58 M68,30 L62,30 M112,30 L118,30 M74,14 L70,10 M106,46 L110,50 M74,46 L70,50 M106,14 L110,10" stroke="#1e3a8a" stroke-width="2" />
      <text x="115" y="34" font-family="'Caveat', 'Comic Sans MS', cursive, sans-serif" font-size="18" fill="#1e3a8a">Sunlight</text>

      <!-- Stem & Leaves -->
      <path d="M90,55 L90,135" stroke="#1e3a8a" stroke-width="2.5" />
      <path d="M90,85 C65,70 40,85 40,95 C40,110 65,105 90,95" fill="none" stroke="#1e3a8a" stroke-width="2" />
      <path d="M90,85 C115,70 140,85 140,95 C140,110 115,105 90,95" fill="none" stroke="#1e3a8a" stroke-width="2" />
      
      <!-- Arrows -->
      <path d="M10,95 L30,95 M25,90 L30,95 L25,100" stroke="#1e3a8a" stroke-width="2" fill="none" />
      <text x="-105" y="95" font-family="'Caveat', 'Comic Sans MS', cursive, sans-serif" font-size="18" fill="#1e3a8a">Carbon dioxide</text>
      
      <path d="M150,95 L180,95 M175,90 L180,95 L175,100" stroke="#1e3a8a" stroke-width="2" fill="none" />
      <text x="190" y="98" font-family="'Caveat', 'Comic Sans MS', cursive, sans-serif" font-size="18" fill="#1e3a8a">Oxygen</text>

      <!-- Roots -->
      <path d="M90,135 Q70,165 55,185 M90,135 Q90,170 85,190 M90,135 Q110,165 125,185 M90,145 Q60,150 45,155 M90,145 Q120,150 135,155" stroke="#1e3a8a" stroke-width="2" fill="none" />
      <text x="140" y="175" font-family="'Caveat', 'Comic Sans MS', cursive, sans-serif" font-size="18" fill="#1e3a8a">Water</text>
    </g>

    <!-- Q2 Handwriting -->
    <text x="40" y="565" font-family="'Caveat', 'Comic Sans MS', cursive, sans-serif" font-size="24" fill="#1e3a8a" font-weight="bold">Q2.</text>
    <text x="140" y="565" font-family="'Caveat', 'Comic Sans MS', cursive, sans-serif" font-size="22" fill="#1e3a8a">The process mainly occurs in the</text>
    <text x="140" y="597" font-family="'Caveat', 'Comic Sans MS', cursive, sans-serif" font-size="22" fill="#1e3a8a">chloroplast of the plant cell. It has</text>
    <text x="140" y="629" font-family="'Caveat', 'Comic Sans MS', cursive, sans-serif" font-size="22" fill="#1e3a8a">two main stages:</text>
    <text x="140" y="661" font-family="'Caveat', 'Comic Sans MS', cursive, sans-serif" font-size="22" fill="#1e3a8a">1. Light reaction – Captures light energy.</text>
    <text x="140" y="693" font-family="'Caveat', 'Comic Sans MS', cursive, sans-serif" font-size="22" fill="#1e3a8a">2. Dark reaction – Uses energy to</text>
    <text x="160" y="725" font-family="'Caveat', 'Comic Sans MS', cursive, sans-serif" font-size="22" fill="#1e3a8a">make glucose.</text>
    `
      : pageNumber === 2
      ? `
    <!-- Q3 Handwriting -->
    <text x="40" y="152" font-family="'Caveat', 'Comic Sans MS', cursive, sans-serif" font-size="24" fill="#1e3a8a" font-weight="bold">Q3.</text>
    <text x="140" y="152" font-family="'Caveat', 'Comic Sans MS', cursive, sans-serif" font-size="22" fill="#1e3a8a">Chloroplast contains chlorophyll a & b pigments.</text>
    <text x="140" y="184" font-family="'Caveat', 'Comic Sans MS', cursive, sans-serif" font-size="22" fill="#1e3a8a">Light dependent reactions occur in thylakoid membranes,</text>
    <text x="140" y="216" font-family="'Caveat', 'Comic Sans MS', cursive, sans-serif" font-size="22" fill="#1e3a8a">and Calvin cycle dark reactions occur in stroma.</text>

    <!-- Q4 Handwriting -->
    <text x="40" y="375" font-family="'Caveat', 'Comic Sans MS', cursive, sans-serif" font-size="24" fill="#1e3a8a" font-weight="bold">Q4.</text>
    <text x="140" y="375" font-family="'Caveat', 'Comic Sans MS', cursive, sans-serif" font-size="22" fill="#1e3a8a">Blood goes from right atrium to ventricles</text>
    <text x="140" y="407" font-family="'Caveat', 'Comic Sans MS', cursive, sans-serif" font-size="22" fill="#1e3a8a">and out to the whole body via aorta.</text>

    <!-- Q5 Handwriting -->
    <text x="40" y="600" font-family="'Caveat', 'Comic Sans MS', cursive, sans-serif" font-size="24" fill="#1e3a8a" font-weight="bold">Q5.</text>
    <text x="140" y="600" font-family="'Caveat', 'Comic Sans MS', cursive, sans-serif" font-size="22" fill="#1e3a8a">Alveolus gas exchange diagram:</text>
    <circle cx="340" cy="740" r="80" fill="none" stroke="#1e3a8a" stroke-width="2.5" />
    <path d="M220,740 C220,840 460,840 460,740" fill="none" stroke="#dc2626" stroke-width="4" opacity="0.6" />
    <text x="250" y="740" font-family="'Caveat', 'Comic Sans MS', cursive, sans-serif" font-size="20" fill="#1e3a8a">Alveolar Sac</text>
    <text x="240" y="870" font-family="'Caveat', 'Comic Sans MS', cursive, sans-serif" font-size="20" fill="#dc2626">Pulmonary Capillary (O₂ Influx / CO₂ Out)</text>
    `
      : pageNumber === 3
      ? `
    <!-- Q6 Handwriting -->
    <text x="40" y="152" font-family="'Caveat', 'Comic Sans MS', cursive, sans-serif" font-size="24" fill="#1e3a8a" font-weight="bold">Q6.</text>
    <text x="140" y="152" font-family="'Caveat', 'Comic Sans MS', cursive, sans-serif" font-size="22" fill="#1e3a8a">Human Digestive System Diagram:</text>
    <path d="M380,200 L380,240 Q380,300 340,320 Q320,330 350,370 Q420,380 430,340 Q430,300 380,290" fill="none" stroke="#1e3a8a" stroke-width="2.5" />
    <text x="440" y="320" font-family="'Caveat', 'Comic Sans MS', cursive, sans-serif" font-size="19" fill="#1e3a8a">Stomach</text>
    <text x="440" y="380" font-family="'Caveat', 'Comic Sans MS', cursive, sans-serif" font-size="19" fill="#1e3a8a">Small Intestine (Site of most absorption)</text>

    <!-- Q7 Handwriting -->
    <text x="40" y="600" font-family="'Caveat', 'Comic Sans MS', cursive, sans-serif" font-size="24" fill="#1e3a8a" font-weight="bold">Q7.</text>
    <text x="140" y="600" font-family="'Caveat', 'Comic Sans MS', cursive, sans-serif" font-size="22" fill="#1e3a8a">Nephron structure with Glomerulus, Bowman's capsule,</text>
    <text x="140" y="632" font-family="'Caveat', 'Comic Sans MS', cursive, sans-serif" font-size="22" fill="#1e3a8a">PCT, Loop of Henle, DCT & Collecting duct labelled.</text>
    `
      : `
    <!-- Q8 Handwriting -->
    <text x="40" y="140" font-family="'Caveat', 'Comic Sans MS', cursive, sans-serif" font-size="24" fill="#1e3a8a" font-weight="bold">Q8.</text>
    <text x="140" y="140" font-family="'Caveat', 'Comic Sans MS', cursive, sans-serif" font-size="22" fill="#1e3a8a">Palisade mesophyll cells are vertically elongated and</text>
    <text x="140" y="172" font-family="'Caveat', 'Comic Sans MS', cursive, sans-serif" font-size="22" fill="#1e3a8a">tightly packed to trap max sunlight. Spongy mesophyll</text>
    <text x="140" y="204" font-family="'Caveat', 'Comic Sans MS', cursive, sans-serif" font-size="22" fill="#1e3a8a">has large intercellular spaces for gaseous exchange.</text>

    <!-- Q9 Handwriting -->
    <text x="40" y="360" font-family="'Caveat', 'Comic Sans MS', cursive, sans-serif" font-size="24" fill="#1e3a8a" font-weight="bold">Q9.</text>
    <text x="140" y="360" font-family="'Caveat', 'Comic Sans MS', cursive, sans-serif" font-size="22" fill="#1e3a8a">Transpiration is the evaporative loss of water through stomata.</text>
    <text x="140" y="392" font-family="'Caveat', 'Comic Sans MS', cursive, sans-serif" font-size="22" fill="#1e3a8a">Factors: 1. Higher Temperature  2. Higher Wind Velocity.</text>

    <!-- Q10 Handwriting -->
    <text x="40" y="620" font-family="'Caveat', 'Comic Sans MS', cursive, sans-serif" font-size="24" fill="#1e3a8a" font-weight="bold">Q10.</text>
    <text x="140" y="620" font-family="'Caveat', 'Comic Sans MS', cursive, sans-serif" font-size="22" fill="#1e3a8a">Xylem vessels are dead, hollow tubes with lignin walls.</text>
    <text x="140" y="652" font-family="'Caveat', 'Comic Sans MS', cursive, sans-serif" font-size="22" fill="#1e3a8a">Provides structural support and prevents collapse under suction.</text>

    <!-- Q11(a) & Q11(b) -->
    <text x="40" y="850" font-family="'Caveat', 'Comic Sans MS', cursive, sans-serif" font-size="24" fill="#1e3a8a" font-weight="bold">Q11 (a)</text>
    <text x="140" y="850" font-family="'Caveat', 'Comic Sans MS', cursive, sans-serif" font-size="22" fill="#1e3a8a">Plant B shows etiolation due to light scarcity & auxin elongation.</text>
    
    <text x="40" y="990" font-family="'Caveat', 'Comic Sans MS', cursive, sans-serif" font-size="24" fill="#1e3a8a" font-weight="bold">Q11 (b)</text>
    <text x="140" y="990" font-family="'Caveat', 'Comic Sans MS', cursive, sans-serif" font-size="22" fill="#1e3a8a">Move Plant B to bright indirect sunlight and maintain watering.</text>
    `
  }
</svg>
`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const SAMPLE_PAGES: AnswerSheetPage[] = [
  { pageNumber: 1, imageUrl: createMockPageSvg(1), width: 800, height: 1150 },
  { pageNumber: 2, imageUrl: createMockPageSvg(2), width: 800, height: 1150 },
  { pageNumber: 3, imageUrl: createMockPageSvg(3), width: 800, height: 1150 },
  { pageNumber: 4, imageUrl: createMockPageSvg(4), width: 800, height: 1150 },
];

export const INITIAL_SAMPLE_SESSION: SessionState = {
  questions: SAMPLE_QUESTIONS,
  unmatchedAnswers: SAMPLE_UNMATCHED,
  answerSheetPages: SAMPLE_PAGES,
  activeQuestionId: "2",
  examTitle: "Exams",
  totalMarks: { scored: 34, max: 40 },
};
