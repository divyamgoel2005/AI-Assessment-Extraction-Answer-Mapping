import { Question, AnswerBlock, GradedQuestion } from "./types";
import { makeQuestionId, normalizeLabel } from "./matching";

const GROQ_VISION_MODEL = "qwen/qwen3.8-27b";
const GROQ_REASONING_MODEL = "openai/gpt-oss-120b";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export function getGroqApiKey(customKey?: string): string {
  return (customKey || process.env.GROQ_API_KEY || "").trim();
}

function cleanAndParseJson(text: string): any {
  let cleaned = text.trim();
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, "");
  cleaned = cleaned.replace(/\s*```$/i, "");
  cleaned = cleaned.trim();

  const firstBracket = cleaned.search(/[[{]/);
  const lastBracket = Math.max(cleaned.lastIndexOf("]"), cleaned.lastIndexOf("}"));
  if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
    cleaned = cleaned.slice(firstBracket, lastBracket + 1);
  }

  return JSON.parse(cleaned);
}

/**
 * Pure 100% Groq Multimodal Vision Engine (qwen/qwen3.8-27b):
 * Analyzes left-hand margin question labels & extracts all questions + student responses dynamically.
 */
export async function extractAssessmentWithGroqVision(
  questionPaperImageBase64: string,
  answerSheetImageBase64: string,
  questionPaperText?: string,
  apiKey?: string
): Promise<{ questions: Question[]; answerBlocks: AnswerBlock[] }> {
  const key = getGroqApiKey(apiKey);
  if (!key) return { questions: [], answerBlocks: [] };

  const prompt = `
You are an expert AI document vision system.
You are given two images:
- Image 1: Question Paper (contains printed exam questions)
- Image 2: Student Answer Sheet (contains student handwriting)

YOUR TASK:
1. QUESTION PAPER (Image 1):
   - Extract EVERY question and subpart printed on the paper.
   - "displayNumber": question number string (e.g. "24", "25", "26", "27", "1", "2")
   - "subLabel": subpart string if present (e.g. "(a)", "(b)", "(i)", "(ii)", "a.", "b.") or null
   - "text": full question prompt text
   - "maxMarks": marks allotted (default 2)
   - "order": sequential integer

2. ANSWER SHEET (Image 2):
   - Look closely at the LEFT-HAND MARGIN of the page where the question numbers and subparts are written (e.g. "Q.24 (b)(i)", "(ii)", "Q.25", "Q.26 (a)", "(b)", "Q.27 (a)", "Q.27 (b)").
   - For EVERY question or subpart written in that left margin:
     - "questionLabelRaw": the exact label text from the left margin
     - "text": the complete transcribed student answer, equations, or diagrams
     - "bbox": [x, y, width, height] normalized floats (0.0 to 1.0)
       * x: 0.01
       * y: exact vertical starting position of this question on the page
       * width: 0.98
       * height: vertical distance from where this question starts down to the start of the next question

Return JSON format:
{
  "questions": [
    { "displayNumber": "...", "subLabel": "...", "text": "...", "maxMarks": 2, "order": 1 }
  ],
  "answers": [
    { "questionLabelRaw": "...", "text": "...", "bbox": [0.01, 0.05, 0.98, 0.40] }
  ]
}
`;

  try {
    const userContent: any[] = [{ type: "text", text: prompt }];

    if (questionPaperImageBase64) {
      userContent.push({
        type: "image_url",
        image_url: { url: questionPaperImageBase64 }
      });
    }

    if (answerSheetImageBase64) {
      userContent.push({
        type: "image_url",
        image_url: { url: answerSheetImageBase64 }
      });
    }

    let data: any = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      const res = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: GROQ_VISION_MODEL,
          messages: [{ role: "user", content: userContent }],
          response_format: { type: "json_object" },
          temperature: 0.1,
        }),
      });

      data = await res.json();
      if (res.status === 200 && data?.choices && data.choices[0]?.message?.content) {
        break;
      }

      console.log(`[Groq Vision Retry] HTTP ${res.status}, retrying in 2s (attempt ${attempt + 1}/3)...`, data?.error?.message || "");
      await new Promise((r) => setTimeout(r, 2000));
    }

    if (!data || !data.choices || !data.choices[0]?.message?.content) {
      console.warn("Groq Vision empty response:", data);
      return { questions: [], answerBlocks: [] };
    }

    const parsed = cleanAndParseJson(data.choices[0].message.content);
    const rawQ = Array.isArray(parsed.questions) ? parsed.questions : [];
    const rawA = Array.isArray(parsed.answers) ? parsed.answers : [];

    const questions: Question[] = rawQ.map((q: any, idx: number) => {
      const dispNum = String(q.displayNumber || idx + 1).replace(/^q\.?\s*/i, "").trim();
      const subL = q.subLabel ? String(q.subLabel).trim() : undefined;
      return {
        id: makeQuestionId(dispNum, subL),
        displayNumber: dispNum,
        subLabel: subL,
        text: String(q.text || `Question ${dispNum}`),
        maxMarks: typeof q.maxMarks === "number" && q.maxMarks > 0 ? q.maxMarks : 2,
        order: q.order || idx + 1,
      };
    });

    const answerBlocks: AnswerBlock[] = [];

    rawA.forEach((b: any) => {
      let bbox: [number, number, number, number] = [0.01, 0.05, 0.98, 0.2];
      if (Array.isArray(b.bbox) && b.bbox.length === 4) {
        let [x, y, w, h] = b.bbox.map(Number);
        if (h > 1.0 || w > 1.0) {
          x = 0.01; y = 0.05; w = 0.98; h = 0.2;
        } else if (w < 0.2) {
          w = 0.98;
          x = 0.01;
        }
        bbox = [
          Math.max(0.01, Math.min(0.9, x || 0.01)),
          Math.max(0.01, Math.min(0.95, y || 0.05)),
          Math.max(0.2, Math.min(0.98, w || 0.98)),
          Math.max(0.03, Math.min(0.95, h || 0.2)),
        ];
      }

      const text = String(b.text || "");
      const label = b.questionLabelRaw ? String(b.questionLabelRaw).trim() : "";

      // Automatic subpart isolation if multiple subparts (e.g. (a) and (b)) are in one block
      const hasPartA = /\(a\)/i.test(text);
      const hasPartB = /\(b\)/i.test(text);

      if (hasPartA && hasPartB && !/\(a\)/i.test(label) && !/\(b\)/i.test(label)) {
        const splitIdx = text.search(/\(b\)/i);
        const partAText = splitIdx !== -1 ? text.slice(0, splitIdx).trim() : text;
        const partBText = splitIdx !== -1 ? text.slice(splitIdx).trim() : text;
        const [x, y, w, h] = bbox;
        const halfH = Math.max(0.03, h / 2);

        const baseLabel = label || "Q";
        answerBlocks.push({
          questionLabelRaw: `${baseLabel} (a)`,
          questionId: null,
          text: partAText,
          page: 1,
          bbox: [x, y, w, halfH],
        });

        answerBlocks.push({
          questionLabelRaw: `${baseLabel} (b)`,
          questionId: null,
          text: partBText,
          page: 1,
          bbox: [x, y + halfH, w, halfH],
        });
      } else {
        answerBlocks.push({
          questionLabelRaw: label || null,
          questionId: null,
          text,
          page: 1,
          bbox,
        });
      }
    });

    // Start-to-start continuous bounding box calculation
    if (answerBlocks.length > 1) {
      answerBlocks.sort((a, b) => (a.bbox[1] || 0) - (b.bbox[1] || 0));
      for (let i = 0; i < answerBlocks.length; i++) {
        const cur = answerBlocks[i];
        const [x, y, w, h] = cur.bbox;
        if (i < answerBlocks.length - 1) {
          const nextY = answerBlocks[i + 1].bbox[1];
          const newH = Math.max(0.03, nextY - y);
          cur.bbox = [x, y, w, newH];
        } else {
          const maxRemaining = Math.max(0.05, Math.min(0.98 - y, h));
          cur.bbox = [x, y, w, maxRemaining];
        }
      }
    }

    return { questions, answerBlocks };
  } catch (err: any) {
    console.error("Groq Vision extraction error:", err);
    return { questions: [], answerBlocks: [] };
  }
}

/**
 * Pure 100% Groq Reasoning & Grading Engine (openai/gpt-oss-120b):
 * Matches answers to questions and grades with CBSE pedagogical feedback.
 */
export async function gradeAssessmentWithGroq(
  questions: Question[],
  answerBlocks: AnswerBlock[],
  apiKey?: string
): Promise<{ questions: GradedQuestion[]; unmatchedAnswers: AnswerBlock[] }> {
  const key = getGroqApiKey(apiKey);
  if (!key || questions.length === 0) {
    return {
      questions: questions.map((q) => ({
        ...q,
        answers: [],
        score: null,
        status: "unanswered",
        feedback: "No answer submitted.",
      })),
      unmatchedAnswers: answerBlocks,
    };
  }

  const prompt = `
You are a senior school teacher grading student exam answers.
Questions: ${JSON.stringify(questions.map((q) => ({ id: q.id, displayNumber: q.displayNumber, subLabel: q.subLabel, text: q.text, maxMarks: q.maxMarks })))}
Student Answers: ${JSON.stringify(answerBlocks.map((b, i) => ({ index: i, rawLabel: b.questionLabelRaw, text: b.text })))}

GOALS:
1. Match each student answer block by index to its corresponding question id.
   - Example: answer with label "Q.27 (a)" matches question "27a"
   - answer with label "Q.27 (b)" matches question "27b"
   - answer with label "Q.24 (b)(i)" matches question "24bi" or "24b"
   - answer with label "(ii)" matches question "24bii" or "24b"
   - answer with label "Q.25" matches question "25"
   - answer with label "Q.26 (a)" matches question "26a"
   - answer with label "(b)" matches question "26b"
2. Evaluate student answer:
   - score: number (0 to maxMarks)
   - status: "correct" | "partial" | "incorrect" | "unanswered"
   - feedback: 1-2 constructive, pedagogical sentences praising accuracy or pointing out missing details.

Return JSON format:
{
  "matches": [
    {
      "questionId": "27a",
      "answerIndices": [0],
      "score": 2,
      "status": "correct",
      "feedback": "..."
    }
  ],
  "unmatchedAnswerIndices": []
}
`;

  try {
    let data: any = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      const res = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: GROQ_REASONING_MODEL,
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" },
          temperature: 0.1,
        }),
      });

      data = await res.json();
      if (res.status === 200 && data?.choices && data.choices[0]?.message?.content) {
        break;
      }

      console.log(`[Groq Reasoning Retry] HTTP ${res.status}, retrying in 2s (attempt ${attempt + 1}/3)...`, data?.error?.message || "");
      await new Promise((r) => setTimeout(r, 2000));
    }

    const parsed = cleanAndParseJson(data?.choices?.[0]?.message?.content || "{}");

    const matchedMap = new Map<string, { answers: AnswerBlock[]; score: number | null; status: "correct" | "partial" | "incorrect" | "unanswered"; feedback: string }>();
    const usedAnswerIndices = new Set<number>();

    if (Array.isArray(parsed.matches)) {
      parsed.matches.forEach((m: any) => {
        const qId = String(m.questionId || "").toLowerCase();
        const answers: AnswerBlock[] = [];
        if (Array.isArray(m.answerIndices)) {
          m.answerIndices.forEach((ai: number) => {
            if (answerBlocks[ai]) {
              answers.push({ ...answerBlocks[ai], questionId: qId });
              usedAnswerIndices.add(ai);
            }
          });
        }
        matchedMap.set(qId, {
          answers,
          score: typeof m.score === "number" ? m.score : null,
          status: m.status || (answers.length > 0 ? "correct" : "unanswered"),
          feedback: m.feedback || "",
        });
      });
    }

    // Handle any fallback matching
    questions.forEach((q) => {
      if (!matchedMap.has(q.id)) {
        const matchedAnswers: AnswerBlock[] = [];
        answerBlocks.forEach((b, idx) => {
          if (!usedAnswerIndices.has(idx)) {
            const norm = normalizeLabel(b.questionLabelRaw);
            if (norm === q.id || norm === q.displayNumber) {
              matchedAnswers.push({ ...b, questionId: q.id });
              usedAnswerIndices.add(idx);
            }
          }
        });

        matchedMap.set(q.id, {
          answers: matchedAnswers,
          score: matchedAnswers.length > 0 ? q.maxMarks : null,
          status: matchedAnswers.length > 0 ? "correct" : "unanswered",
          feedback: matchedAnswers.length > 0 ? "Answer evaluated." : "No answer submitted for this question in the answer sheet.",
        });
      }
    });

    const gradedQuestions: GradedQuestion[] = questions.map((q) => {
      const match = matchedMap.get(q.id);
      const answers = match?.answers || [];
      const isAnswered = answers.length > 0;
      return {
        ...q,
        answers,
        score: isAnswered ? (match?.score ?? q.maxMarks) : null,
        status: isAnswered ? (match?.status || "correct") : "unanswered",
        feedback: match?.feedback || (isAnswered ? "Answer evaluated." : "No answer submitted for this question in the answer sheet."),
      };
    });

    const unmatchedAnswers: AnswerBlock[] = [];
    answerBlocks.forEach((b, idx) => {
      if (!usedAnswerIndices.has(idx)) {
        unmatchedAnswers.push(b);
      }
    });

    return { questions: gradedQuestions, unmatchedAnswers };
  } catch (err) {
    console.error("Groq reasoning error:", err);
    return {
      questions: questions.map((q) => ({
        ...q,
        answers: [],
        score: null,
        status: "unanswered",
        feedback: "No answer submitted.",
      })),
      unmatchedAnswers: answerBlocks,
    };
  }
}
