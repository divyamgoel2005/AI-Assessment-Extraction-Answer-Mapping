export type Question = {
  id: string;              // "11a" - unique, normalized
  displayNumber: string;   // "11" - what shows in the round badge
  subLabel?: string;       // "a." | "b." | undefined for non-split questions
  text: string;
  maxMarks: number;
  order: number;           // printed order in the paper, used for list sort
};

export type AnswerBlock = {
  questionLabelRaw: string | null; // raw label as detected, e.g. "Q11 (a)" or null if no label found
  questionId: string | null;       // normalized match, null if unmatched
  text: string;                    // transcribed handwriting
  page: number;                    // 1-indexed
  bbox: [number, number, number, number]; // [x, y, w, h] normalized 0-1 relative to page image
};

export type GradedQuestion = Question & {
  answers: AnswerBlock[];   // empty array = unanswered; can be >1 for multi-page/split answers
  score: number | null;    // null = unanswered, not graded
  status: "correct" | "partial" | "incorrect" | "unanswered";
  feedback: string;
};

export type AnswerSheetPage = {
  pageNumber: number;
  imageUrl: string;
  width?: number;
  height?: number;
};

export type SessionState = {
  questions: GradedQuestion[];
  unmatchedAnswers: AnswerBlock[]; // answers with questionId === null
  answerSheetPages: AnswerSheetPage[];
  activeQuestionId: string | null;
  examTitle?: string;
  totalMarks?: { scored: number; max: number };
};

export type UploadedFileInfo = {
  name: string;
  sizeFormatted: string;
  pageCount: number;
  pages: string[]; // base64 / data URLs or preview images
  fileType: string;
};
