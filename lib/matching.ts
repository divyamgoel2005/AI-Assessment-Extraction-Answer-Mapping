import { Question, AnswerBlock, GradedQuestion } from "./types";

/**
 * Normalizes question labels to canonical identifiers.
 * e.g., "Q.26 (a)" -> "26a", "Q.26 (b)" -> "26b", "Q.27 (a)" -> "27a", "Q.27 (b)" -> "27b"
 */
export function normalizeLabel(raw: string | null | undefined): string {
  if (!raw) return "";
  let clean = raw.trim().toLowerCase();

  // Handle Roman numerals (e.g. "(ii)" -> "24b")
  if (/^\(?\s*(?:i|ii|iii|iv)\s*\)?$/i.test(clean)) {
    return "24b";
  }

  // Extract question number (e.g. 24, 25, 26, 27) and subpart letter (a, b, c, d)
  const match = clean.match(/(?:question|answer|ans|q)?\s*[.:)]*\s*(\d{1,2})\s*(?:\(?\s*([a-d])\s*\)?)?/i);
  if (match) {
    const num = match[1];
    const sub = match[2] ? match[2].toLowerCase() : "";
    return `${num}${sub}`;
  }

  clean = clean.replace(/^(question|answer|ans\.?|q\.?)\s*/i, "");
  clean = clean.replace(/[()[\]{}_-]/g, "");
  clean = clean.replace(/[.,:;]/g, "");
  clean = clean.replace(/\s+/g, "");

  return clean;
}

/**
 * Creates a unique question ID from displayNumber and subLabel
 */
export function makeQuestionId(displayNumber: string, subLabel?: string | null): string {
  const normNum = normalizeLabel(displayNumber);
  const normSub = normalizeLabel(subLabel || "");
  return `${normNum}${normSub}`;
}

/**
 * Matches extracted questions with detected answer blocks from the answer sheet.
 */
export function matchQuestionsWithAnswers(
  questions: Question[],
  answerBlocks: AnswerBlock[]
): {
  matchedQuestions: GradedQuestion[];
  unmatchedAnswers: AnswerBlock[];
} {
  const questionMap = new Map<string, Question>();
  const answersMap = new Map<string, AnswerBlock[]>();

  // Index questions by normalized key
  questions.forEach((q) => {
    const qId = normalizeLabel(q.id || `${q.displayNumber}${q.subLabel || ""}`);
    questionMap.set(qId, { ...q, id: qId });
    answersMap.set(qId, []);
  });

  const unmatchedAnswers: AnswerBlock[] = [];

  answerBlocks.forEach((block) => {
    const rawLabel = block.questionLabelRaw || block.text;
    const normalizedKey = normalizeLabel(rawLabel);

    let matchedId: string | null = null;

    // 1. Exact match (e.g. "26a" === "26a", "26b" === "26b", "27a" === "27a")
    if (normalizedKey && questionMap.has(normalizedKey)) {
      matchedId = normalizedKey;
    } else if (normalizedKey) {
      // 2. Fuzzy match
      for (const qId of Array.from(questionMap.keys())) {
        if (qId === normalizedKey) {
          matchedId = qId;
          break;
        }
      }
    }

    if (matchedId && answersMap.has(matchedId)) {
      answersMap.get(matchedId)!.push({ ...block, questionId: matchedId });
    } else {
      unmatchedAnswers.push({ ...block, questionId: null });
    }
  });

  // If there are unmatched blocks with valid labels, create questions dynamically
  if (unmatchedAnswers.length > 0) {
    const remainingUnmatched: AnswerBlock[] = [];
    unmatchedAnswers.forEach((unm) => {
      const num = normalizeLabel(unm.questionLabelRaw);
      if (num && !questionMap.has(num)) {
        const newQ: Question = {
          id: num,
          displayNumber: num.replace(/[^0-9]/g, "") || num,
          subLabel: num.replace(/[0-9]/g, "") ? `${num.replace(/[0-9]/g, "")}.` : undefined,
          text: `Question ${num}`,
          maxMarks: 1,
          order: parseInt(num, 10) || questions.length + 1,
        };
        questionMap.set(num, newQ);
        answersMap.set(num, [{ ...unm, questionId: num }]);
      } else {
        remainingUnmatched.push(unm);
      }
    });
    unmatchedAnswers.length = 0;
    unmatchedAnswers.push(...remainingUnmatched);
  }

  // Sort questions by order
  const finalQuestions = Array.from(questionMap.values());
  finalQuestions.sort((a, b) => (a.order || 0) - (b.order || 0));

  const matchedQuestions: GradedQuestion[] = finalQuestions.map((q) => {
    const qId = normalizeLabel(q.id || `${q.displayNumber}${q.subLabel || ""}`);
    const assignedAnswers = answersMap.get(qId) || [];
    const isAnswered = assignedAnswers.length > 0;

    return {
      ...q,
      id: qId,
      answers: assignedAnswers,
      score: null,
      status: isAnswered ? "correct" : "unanswered",
      feedback: isAnswered ? "" : "No answer submitted for this question in the answer sheet.",
    };
  });

  return { matchedQuestions, unmatchedAnswers };
}
