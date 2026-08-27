"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  Sparkles,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  FileCheck,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { UploadCard } from "@/components/UploadCard";
import { ExtractingScreen } from "@/components/ExtractingScreen";
import { QuestionListItem } from "@/components/QuestionListItem";
import { AnswerSheetViewer } from "@/components/AnswerSheetViewer";
import { TabSwitcher } from "@/components/TabSwitcher";
import { SettingsModal } from "@/components/SettingsModal";
import { renderPdfToImages, optimizeImageFile } from "@/lib/clientPdfRenderer";
import { UploadedFileInfo, SessionState } from "@/lib/types";
import {
  SAMPLE_QUESTIONS,
  SAMPLE_PAGES,
  SAMPLE_UNMATCHED,
  INITIAL_SAMPLE_SESSION,
} from "@/lib/sampleData";

export default function Home() {
  // Navigation & Screen State: 'upload' (Screen A) | 'extracting' (Screen B) | 'workspace' (Screen C)
  const [currentScreen, setCurrentScreen] = useState<"upload" | "extracting" | "workspace">("upload");
  const [extractProgress, setExtractProgress] = useState<string>("Analyzing documents...");

  // Upload States
  const [questionPaperFile, setQuestionPaperFile] = useState<UploadedFileInfo | null>(null);
  const [answerSheetFile, setAnswerSheetFile] = useState<UploadedFileInfo | null>(null);
  const [questionPaperText, setQuestionPaperText] = useState<string>("");
  const [isProcessingPdf, setIsProcessingPdf] = useState(false);

  // Workspace Session State
  const [session, setSession] = useState<SessionState>(INITIAL_SAMPLE_SESSION);
  const [expandedQuestionIds, setExpandedQuestionIds] = useState<Set<string>>(new Set(["2"]));
  const [isExpandAll, setIsExpandAll] = useState(false);
  const [showUnmatched, setShowUnmatched] = useState(false);

  // UI States
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileTab, setMobileTab] = useState<"questions" | "answersheet">("questions");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [serverHasKey, setServerHasKey] = useState(false);

  // Check server API status on load
  useEffect(() => {
    fetch("/api/status")
      .then((r) => r.json())
      .then((d) => {
        if (d.hasApiKey) setServerHasKey(true);
      })
      .catch(() => {});

    const savedKey = localStorage.getItem("vedaai_gemini_key");
    if (savedKey) setApiKey(savedKey);
  }, []);

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem("vedaai_gemini_key", key);
    if (key.trim()) setServerHasKey(true);
  };

  // Upload file handlers with client-side PDF page rasterization & image optimization
  const handleSelectQuestionPaper = async (file: File) => {
    setIsProcessingPdf(true);
    try {
      const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
      let pageImages: string[] = [];
      let text = "";

      if (isPdf) {
        const res = await renderPdfToImages(file, 15, 1.0);
        pageImages = res.images;
        text = res.extractedText;
        setQuestionPaperText(text);
      } else {
        const dataUrl = await optimizeImageFile(file, 1600, 0.85);
        pageImages = [dataUrl];
      }

      const sizeFormatted = `${(file.size / (1024 * 1024)).toFixed(1)}MB`;

      setQuestionPaperFile({
        name: file.name,
        sizeFormatted: sizeFormatted === "0.0MB" ? `${Math.round(file.size / 1024)}KB` : sizeFormatted,
        pageCount: Math.max(1, pageImages.length),
        pages: pageImages,
        fileType: isPdf ? "pdf" : "image",
      });
    } catch (err) {
      console.error("Error processing question paper:", err);
    } finally {
      setIsProcessingPdf(false);
    }
  };

  const handleSelectAnswerSheet = async (file: File) => {
    setIsProcessingPdf(true);
    try {
      const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
      let pageImages: string[] = [];

      if (isPdf) {
        const res = await renderPdfToImages(file, 32, 1.0);
        pageImages = res.images;
      } else {
        const dataUrl = await optimizeImageFile(file, 1600, 0.85);
        pageImages = [dataUrl];
      }

      const sizeFormatted = `${(file.size / (1024 * 1024)).toFixed(1)}MB`;

      setAnswerSheetFile({
        name: file.name,
        sizeFormatted: sizeFormatted === "0.0MB" ? `${Math.round(file.size / 1024)}KB` : sizeFormatted,
        pageCount: Math.max(1, pageImages.length),
        pages: pageImages,
        fileType: isPdf ? "pdf" : "image",
      });
    } catch (err) {
      console.error("Error processing answer sheet:", err);
    } finally {
      setIsProcessingPdf(false);
    }
  };

  // Load CBSE Science Exam Preset
  const handleLoadCbsePreset = async () => {
    setIsProcessingPdf(true);
    try {
      const [qpRes, ansRes] = await Promise.all([
        fetch("/api/sample-files?type=questionpaper"),
        fetch("/api/sample-files?type=answerkey"),
      ]);

      if (qpRes.ok && ansRes.ok) {
        const qpBlob = await qpRes.blob();
        const ansBlob = await ansRes.blob();

        const qpFile = new File([qpBlob], "samplequestionpaper.pdf", { type: "application/pdf" });
        const ansType = ansRes.headers.get("Content-Type") || "image/png";
        const ansFileName = ansType.includes("png") ? "sampleanswerkey.png" : "sampleanswerkey.pdf";
        const ansFile = new File([ansBlob], ansFileName, { type: ansType });

        await Promise.all([
          handleSelectQuestionPaper(qpFile),
          handleSelectAnswerSheet(ansFile),
        ]);
      }
    } catch (e) {
      console.error("Preset load error:", e);
    } finally {
      setIsProcessingPdf(false);
    }
  };

  // Load Biology Mockup Preset
  const handleLoadBiologyDemo = () => {
    setQuestionPaperFile({
      name: "Class_10_maths_unit_test.pdf",
      sizeFormatted: "2MB",
      pageCount: 2,
      pages: [],
      fileType: "pdf",
    });
    setAnswerSheetFile({
      name: "student_1_answer_sheet.pdf",
      sizeFormatted: "8MB",
      pageCount: 4,
      pages: [],
      fileType: "pdf",
    });
    setQuestionPaperText("");
  };

  // Start Extraction Pipeline (Screen A -> B -> C)
  const handleStartMapping = async () => {
    setCurrentScreen("extracting");
    setSidebarCollapsed(true);

    const stages = [
      "Analyzing question paper & answer sheets...",
      "Extracting questions & sub-parts (11a, 11b, 22a, 37a)...",
      "Segmenting answer sheet pages & calculating bounding coordinates...",
      "Matching student answers to questions & grading with AI feedback...",
    ];

    let stageIdx = 0;
    const progressTimer = setInterval(() => {
      stageIdx = (stageIdx + 1) % stages.length;
      setExtractProgress(stages[stageIdx]);
    }, 1200);

    const safetyTimeout = setTimeout(() => {
      clearInterval(progressTimer);
      setCurrentScreen("workspace");
    }, 45000);

    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionPaperImages: questionPaperFile?.pages || [],
          answerSheetImages: answerSheetFile?.pages || [],
          questionPaperText,
          apiKey: apiKey || undefined,
          fileName: answerSheetFile?.name || "",
          isDemoMode: !apiKey && !serverHasKey && (!questionPaperFile?.pages?.length || !answerSheetFile?.pages?.length),
        }),
      });

      clearTimeout(safetyTimeout);
      clearInterval(progressTimer);

      const data = await res.json();
      if (data.success && data.session) {
        setSession(data.session);
      }
      setCurrentScreen("workspace");
    } catch (err) {
      console.error("Extraction error:", err);
      clearTimeout(safetyTimeout);
      clearInterval(progressTimer);
      setCurrentScreen("workspace");
    }
  };

  // Workspace Actions
  const handleSelectQuestion = (qId: string) => {
    setSession((prev) => ({ ...prev, activeQuestionId: qId }));
    setExpandedQuestionIds((prev) => {
      const next = new Set(prev);
      next.add(qId);
      return next;
    });
    if (window.innerWidth < 768) {
      setMobileTab("answersheet");
    }
  };

  const handleToggleExpand = (qId: string) => {
    setExpandedQuestionIds((prev) => {
      const next = new Set(prev);
      if (next.has(qId)) next.delete(qId);
      else next.add(qId);
      return next;
    });
  };

  const handleToggleExpandAll = () => {
    if (isExpandAll) {
      setExpandedQuestionIds(new Set());
      setIsExpandAll(false);
    } else {
      setExpandedQuestionIds(new Set(session.questions.map((q) => q.id)));
      setIsExpandAll(true);
    }
  };

  const handleResetToUpload = () => {
    setCurrentScreen("upload");
    setSidebarCollapsed(false);
  };

  const activeQuestion =
    session.questions.find((q) => q.id === session.activeQuestionId) ||
    session.questions[0] ||
    null;

  const isMappingReady = Boolean(questionPaperFile && answerSheetFile && !isProcessingPdf);
  const isAiActive = serverHasKey || Boolean(apiKey);

  return (
    <main className="flex h-screen w-screen overflow-hidden bg-[#ECEEF0] text-[#1A1A1A] font-sans antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        collapsed={currentScreen !== "upload" || sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header Bar */}
        <TopBar
          title="Exams"
          hasApiKey={isAiActive}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onBack={currentScreen !== "upload" ? handleResetToUpload : undefined}
          onOpenMobileMenu={() => setIsSettingsOpen(true)}
        />

        {/* Dynamic Screen Renderer */}
        <div className="flex-1 overflow-y-auto px-3 sm:px-6 pb-6 pt-1 flex flex-col">
          {/* ======================================================== */}
          {/* SCREEN A: UPLOAD SCREEN                                 */}
          {/* ======================================================== */}
          {currentScreen === "upload" && (
            <div className="flex-1 flex flex-col items-center justify-center max-w-4xl w-full mx-auto py-4 sm:py-8 animate-fadeIn">
              {/* Header Title with peach highlighted pill */}
              <div className="text-center mb-6 sm:mb-8">
                <h1
                  className="text-3xl sm:text-[38px] font-bold leading-tight flex flex-wrap items-center justify-center gap-2.5"
                  style={{
                    fontFamily: '"Helvetica Neue", Helvetica, Arial, "Liberation Sans", sans-serif',
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                  }}
                >
                  <span className="text-[#1A1A1A]">Upload</span>
                  <span
                    className="bg-[#FFEEE5] text-[#FF5520] px-4 py-1 rounded-2xl inline-block"
                    style={{
                      fontFamily: '"Helvetica Neue", Helvetica, Arial, "Liberation Sans", sans-serif',
                      fontWeight: 700,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    Question Paper &amp; Answer Sheets
                  </span>
                </h1>
                <p className="text-sm sm:text-base text-[#717680] mt-2.5 font-medium">
                  Upload both files to get started
                </p>
              </div>

              {/* Teacher Avatar Illustration */}
              <div className="relative mb-6 sm:mb-8 flex items-center justify-center">
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full flex items-center justify-center overflow-hidden transition-transform duration-300 hover:scale-105">
                  <img
                    src="/teacher-avatar.png"
                    alt="Teacher Illustration"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* PDF Processing Indicator */}
              {isProcessingPdf && (
                <div className="mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-200 text-xs font-semibold text-[#F05A28] animate-pulse">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing pages into high-resolution images...</span>
                </div>
              )}

              {/* Upload Cards Grid */}
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8 max-w-3xl">
                <UploadCard
                  labelPrefix="Upload"
                  labelHighlight="Question Paper"
                  fileInfo={questionPaperFile}
                  onFileSelect={handleSelectQuestionPaper}
                  onRemove={() => setQuestionPaperFile(null)}
                />

                <UploadCard
                  labelPrefix="Upload"
                  labelHighlight="Answer Sheet"
                  fileInfo={answerSheetFile}
                  onFileSelect={handleSelectAnswerSheet}
                  onRemove={() => setAnswerSheetFile(null)}
                />
              </div>

              {/* Action Button */}
              <div className="flex flex-col items-center gap-3">
                <button
                  onClick={handleStartMapping}
                  disabled={!isMappingReady}
                  className={`px-8 py-3.5 rounded-full text-sm sm:text-base font-bold flex items-center gap-2.5 transition-all shadow-md ${
                    isMappingReady
                      ? "bg-[#202124] hover:bg-black text-white hover:scale-[1.02] cursor-pointer"
                      : "bg-[#B0B4BA] text-white/90 cursor-not-allowed"
                  }`}
                >
                  <span>Start Mapping</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-xs text-[#717680] text-center max-w-xs sm:max-w-md">
                  Once both files are uploaded, you&apos;ll be able to map answers with questions.
                </p>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* SCREEN B: EXTRACTING SCREEN                             */}
          {/* ======================================================== */}
          {currentScreen === "extracting" && (
            <ExtractingScreen currentStage={extractProgress} />
          )}

          {/* ======================================================== */}
          {/* SCREEN C: WORKSPACE (SPLIT PANE / MOBILE TABS)          */}
          {/* ======================================================== */}
          {currentScreen === "workspace" && (
            <div className="flex-1 flex flex-col h-full overflow-hidden animate-fadeIn">
              {/* Mobile Tab Switcher */}
              <TabSwitcher activeTab={mobileTab} onTabChange={setMobileTab} />

              {/* Main Split Grid */}
              <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 h-full overflow-hidden">
                {/* ---------------------------------------------------- */}
                {/* LEFT PANE: Extracted Questions List                 */}
                {/* ---------------------------------------------------- */}
                <div
                  className={`lg:col-span-6 xl:col-span-5 flex flex-col bg-white rounded-3xl p-4 sm:p-6 shadow-subtle border border-gray-100 h-full overflow-hidden ${
                    mobileTab === "answersheet" ? "hidden lg:flex" : "flex"
                  }`}
                >
                  {/* Pane Header */}
                  <div className="flex items-center justify-between pb-4 mb-3 border-b border-gray-100 flex-shrink-0">
                    <div>
                      <h2 className="text-sm sm:text-base font-extrabold text-[#1A1A1A] tracking-tight">
                        Extracted Questions (from question paper)
                      </h2>
                      <p className="text-xs text-[#717680] mt-0.5">
                        {session.questions.length} questions detected
                      </p>
                    </div>

                    <button
                      onClick={handleToggleExpandAll}
                      className="text-xs font-bold text-[#F05A28] hover:text-[#DE4B1B] transition-colors px-2.5 py-1 rounded-lg hover:bg-orange-50"
                    >
                      {isExpandAll ? "Collapse All" : "Expand All"}
                    </button>
                  </div>

                  {/* Scrollable Questions List */}
                  <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                    {session.questions.map((q) => (
                      <QuestionListItem
                        key={q.id}
                        question={q}
                        isActive={session.activeQuestionId === q.id}
                        isExpanded={expandedQuestionIds.has(q.id)}
                        onSelect={() => handleSelectQuestion(q.id)}
                        onToggleExpand={() => handleToggleExpand(q.id)}
                        onJumpToPage={() => {
                          handleSelectQuestion(q.id);
                        }}
                      />
                    ))}

                    {/* Collapsible Unmatched Answers Section */}
                    {session.unmatchedAnswers && session.unmatchedAnswers.length > 0 && (
                      <div className="pt-2">
                        <button
                          onClick={() => setShowUnmatched(!showUnmatched)}
                          className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#F8F9FA] border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-amber-500" />
                            <span>Unmatched handwriting blocks ({session.unmatchedAnswers.length})</span>
                          </div>
                          {showUnmatched ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>

                        {showUnmatched && (
                          <div className="mt-2 space-y-2 p-3 bg-amber-50/50 rounded-2xl border border-amber-100 text-xs">
                            {session.unmatchedAnswers.map((unm, idx) => (
                              <div key={idx} className="p-2.5 bg-white rounded-xl border border-amber-200/60 shadow-xs">
                                <p className="font-semibold text-gray-800">
                                  Page {unm.page} {unm.questionLabelRaw ? `• Tag: ${unm.questionLabelRaw}` : "• (No label marker detected)"}
                                </p>
                                <p className="text-gray-600 mt-1 font-mono text-[11px] bg-gray-50 p-1.5 rounded">
                                  {unm.text}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* ---------------------------------------------------- */}
                {/* RIGHT PANE: Answer Sheet Viewer with Bounding Box   */}
                {/* ---------------------------------------------------- */}
                <div
                  className={`lg:col-span-6 xl:col-span-7 h-full overflow-hidden ${
                    mobileTab === "questions" ? "hidden lg:block" : "block"
                  }`}
                >
                  <AnswerSheetViewer
                    pages={session.answerSheetPages}
                    activeQuestion={activeQuestion}
                    allQuestions={session.questions}
                    unmatchedAnswers={session.unmatchedAnswers}
                    onSelectQuestion={handleSelectQuestion}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKey={apiKey}
        onSaveApiKey={handleSaveApiKey}
      />
    </main>
  );
}
