import { NextRequest, NextResponse } from "next/server";
import { extractAssessmentWithGroqVision, gradeAssessmentWithGroq } from "@/lib/groq";
import { parseQuestionPaperText } from "@/lib/documentParser";
import { normalizeLabel } from "@/lib/matching";
import { Question, AnswerBlock, GradedQuestion, SessionState } from "@/lib/types";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      questionPaperImages = [],
      answerSheetImages = [],
      questionPaperText = "",
      apiKey = "",
      fileName = "",
    } = body;

    const qpImage = questionPaperImages[0] || "";
    const akImage = answerSheetImages[0] || "";

    const answerSheetPages = answerSheetImages.map(
      (imgUrl: string, idx: number) => ({
        pageNumber: idx + 1,
        imageUrl: imgUrl,
      })
    );

    let extractedQuestions: Question[] = [];
    let allAnswerBlocks: AnswerBlock[] = [];

    // =========================================================================
    // STEP 1: 100% GROQ MULTIMODAL VISION EXTRACTION (qwen/qwen3.8-27b)
    // =========================================================================
    if (qpImage || akImage) {
      console.log("[100% Groq Vision] Calling Groq Multimodal Vision on uploaded documents...");
      const result = await extractAssessmentWithGroqVision(
        qpImage,
        akImage,
        questionPaperText,
        apiKey
      );
      extractedQuestions = result.questions;
      allAnswerBlocks = result.answerBlocks;
      console.log(`[100% Groq Vision] Extracted ${extractedQuestions.length} questions and ${allAnswerBlocks.length} answer blocks.`);
    }

    // =========================================================================
    // STEP 2: PARSE DIGITAL TEXT IF PDF WAS UPLOADED
    // =========================================================================
    if (extractedQuestions.length === 0 && questionPaperText && questionPaperText.trim().length > 20) {
      console.log("[Groq Engine] Extracting questions from PDF text layer...");
      extractedQuestions = parseQuestionPaperText(questionPaperText);
    }

    // =========================================================================
    // STEP 3: DYNAMIC SYNCHRONIZATION FROM DETECTED ANSWER LABELS
    // =========================================================================
    if (extractedQuestions.length === 0 && allAnswerBlocks.length > 0) {
      allAnswerBlocks.forEach((b, idx) => {
        const num = normalizeLabel(b.questionLabelRaw) || String(idx + 1);
        extractedQuestions.push({
          id: num,
          displayNumber: num.replace(/[^0-9]/g, "") || num,
          subLabel: num.replace(/[0-9]/g, "") ? `${num.replace(/[0-9]/g, "")}.` : undefined,
          text: `Question ${num}`,
          maxMarks: 2,
          order: idx + 1,
        });
      });
    }

    // Fallback only if no questions detected
    if (extractedQuestions.length === 0) {
      extractedQuestions = [
        { id: "1", displayNumber: "1", text: "Question 1", maxMarks: 2, order: 1 },
      ];
    }

    // =========================================================================
    // STEP 4: 100% GROQ REASONING, MATCHING & PEDAGOGICAL GRADING (openai/gpt-oss-120b)
    // =========================================================================
    const { questions: gradedQuestions, unmatchedAnswers } = await gradeAssessmentWithGroq(
      extractedQuestions,
      allAnswerBlocks,
      apiKey
    );

    const session: SessionState = {
      questions: gradedQuestions,
      unmatchedAnswers,
      answerSheetPages: answerSheetPages.length > 0 ? answerSheetPages : [
        {
          pageNumber: 1,
          imageUrl: "/api/sample-files?type=answerkey",
        },
      ],
      activeQuestionId: gradedQuestions[0]?.id || "1",
      examTitle: "Exams",
    };

    return NextResponse.json({ success: true, session });
  } catch (error) {
    console.error("100% Groq Extract API handled error:", error);
    return NextResponse.json(
      { error: "Failed to extract assessment with Groq" },
      { status: 500 }
    );
  }
}
