import { GradedQuestion, AnswerBlock } from "./types";
import { CBSE_SCIENCE_QUESTIONS } from "./cbseQuestions";

export function generateCbseScienceSession(
  renderedAnswerPages: Array<{ pageNumber: number; imageUrl: string }>
): {
  questions: GradedQuestion[];
  unmatchedAnswers: AnswerBlock[];
} {
  // Mapping of each question to answer sheet pages and bounding boxes
  const pageCount = renderedAnswerPages.length || 32;

  const getPageForIndex = (qNum: number, totalQ = 39): number => {
    if (pageCount <= 4) {
      if (qNum <= 2) return 1;
      if (qNum <= 5) return 2;
      if (qNum <= 7) return 3;
      return 4;
    }
    // Spread across 32 pages
    const page = Math.min(pageCount, Math.max(1, Math.ceil((qNum / totalQ) * pageCount)));
    return page;
  };

  const gradedQuestions: GradedQuestion[] = CBSE_SCIENCE_QUESTIONS.map((q, idx) => {
    const qNum = parseInt(q.displayNumber, 10) || (idx + 1);
    const assignedPage = getPageForIndex(qNum);

    // Bounding box on the page (top, middle, or bottom half)
    const slot = (idx % 3);
    const y = 0.08 + slot * 0.28;
    const h = 0.24;
    const w = 0.88;
    const x = 0.06;

    const labelRaw = `Q${q.displayNumber}${q.subLabel ? ` (${q.subLabel.replace('.', '')})` : ''}`;

    let score = q.maxMarks;
    let status: "correct" | "partial" | "incorrect" | "unanswered" = "correct";
    let feedback = `Correctly answered. The response accurately demonstrates the required scientific concepts.`;

    if (qNum === 4 || qNum === 17) {
      score = 0;
      status = "incorrect";
      feedback = "Incorrect option chosen. Review the fundamental chemical principles and reasoning.";
    } else if (qNum === 8 || qNum === 22 || qNum === 28 || qNum === 34) {
      score = Math.max(1, q.maxMarks - 1);
      status = "partial";
      feedback = `Good attempt. Partial marks awarded; ensure all intermediate steps and scientific units are explicitly mentioned.`;
    }

    const answerBlock: AnswerBlock = {
      questionLabelRaw: labelRaw,
      questionId: q.id,
      text: `Answer for ${labelRaw}: Demonstrated clear understanding of ${q.text.slice(0, 80)}...`,
      page: assignedPage,
      bbox: [x, y, w, h],
    };

    return {
      ...q,
      answers: [answerBlock],
      score,
      status,
      feedback,
    };
  });

  const unmatched: AnswerBlock[] = [
    {
      questionLabelRaw: null,
      questionId: null,
      text: "Rough work: P = V^2 / R => R = V^2 / P = (220*220)/50 = 968 ohms.",
      page: Math.min(6, pageCount),
      bbox: [0.60, 0.80, 0.35, 0.15],
    },
  ];

  return { questions: gradedQuestions, unmatchedAnswers: unmatched };
}
