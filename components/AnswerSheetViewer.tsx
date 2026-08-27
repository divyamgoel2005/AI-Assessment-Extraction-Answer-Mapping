"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Minus,
  Plus,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  RotateCcw,
  AlertCircle,
} from "lucide-react";
import { AnswerSheetPage, GradedQuestion, AnswerBlock } from "@/lib/types";
import { BBoxOverlay } from "./BBoxOverlay";

interface AnswerSheetViewerProps {
  pages: AnswerSheetPage[];
  activeQuestion: GradedQuestion | null;
  allQuestions: GradedQuestion[];
  unmatchedAnswers: AnswerBlock[];
  onSelectQuestion: (questionId: string) => void;
}

export const AnswerSheetViewer: React.FC<AnswerSheetViewerProps> = ({
  pages,
  activeQuestion,
  allQuestions,
  unmatchedAnswers,
  onSelectQuestion,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);

  // Auto-switch to active question's answer page if available
  useEffect(() => {
    if (activeQuestion && activeQuestion.answers && activeQuestion.answers.length > 0) {
      const targetPage = activeQuestion.answers[0].page;
      if (targetPage && targetPage !== currentPage && targetPage <= pages.length) {
        setCurrentPage(targetPage);
      }
    }
  }, [activeQuestion, pages.length]);

  const totalPages = Math.max(1, pages.length);
  const activePageData = pages.find((p) => p.pageNumber === currentPage) || pages[0];

  // Zoom handlers
  const handleZoomIn = () => setZoomLevel((prev) => Math.min(250, prev + 15));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(50, prev - 15));
  const handleResetZoom = () => setZoomLevel(100);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  // Find answer boxes for ONLY the active selected question on the current page
  const pageBoxes: Array<{
    answer: AnswerBlock;
    label: string;
    isActive: boolean;
    questionId: string | null;
  }> = [];

  if (activeQuestion && activeQuestion.answers && activeQuestion.answers.length > 0) {
    activeQuestion.answers.forEach((ans) => {
      if (ans.page === currentPage) {
        pageBoxes.push({
          answer: ans,
          label: `Q${activeQuestion.displayNumber}${activeQuestion.subLabel ? ` (${activeQuestion.subLabel.replace(/[\(\)\.]/g, '')})` : ''}`,
          isActive: true,
          questionId: activeQuestion.id,
        });
      }
    });
  }

  return (
    <div className="flex flex-col h-full bg-[#202124] rounded-3xl overflow-hidden shadow-card border border-gray-800 text-white">
      {/* Top Controls Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-[#18191B] border-b border-gray-800 flex-wrap gap-3">
        {/* Left Title */}
        <div className="flex items-center gap-2">
          <h3 className="text-sm sm:text-base font-bold text-gray-100">Answer Sheet</h3>
          <span className="hidden sm:inline-block text-xs text-gray-400">
            • {totalPages} {totalPages === 1 ? "page" : "pages"}
          </span>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Zoom Controls Pill */}
          <div className="flex items-center bg-[#2A2B2E] rounded-full p-1 border border-gray-700/60 shadow-xs">
            <button
              onClick={handleZoomOut}
              className="w-7 h-7 rounded-full hover:bg-gray-700 flex items-center justify-center text-gray-300 hover:text-white transition-colors"
              title="Zoom out"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetZoom}
              className="px-2 text-xs font-semibold text-gray-200 hover:text-white"
              title="Reset zoom"
            >
              {zoomLevel}%
            </button>
            <button
              onClick={handleZoomIn}
              className="w-7 h-7 rounded-full hover:bg-gray-700 flex items-center justify-center text-gray-300 hover:text-white transition-colors"
              title="Zoom in"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Page Navigator Pill */}
          <div className="flex items-center bg-[#2A2B2E] rounded-full p-1 border border-gray-700/60 shadow-xs">
            <button
              onClick={handlePrevPage}
              disabled={currentPage <= 1}
              className="w-7 h-7 rounded-full hover:bg-gray-700 disabled:opacity-40 disabled:hover:bg-transparent flex items-center justify-center text-gray-300 hover:text-white transition-colors"
              title="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 text-xs font-semibold text-gray-200">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage >= totalPages}
              className="w-7 h-7 rounded-full hover:bg-gray-700 disabled:opacity-40 disabled:hover:bg-transparent flex items-center justify-center text-gray-300 hover:text-white transition-colors"
              title="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Canvas / Image Area */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto p-4 sm:p-6 flex items-center justify-center bg-[#1A1A1C] relative select-none"
      >
        {activePageData ? (
          <div
            ref={imageWrapperRef}
            style={{
              transform: `scale(${zoomLevel / 100})`,
              transformOrigin: "center top",
              transition: "transform 0.15s ease-out",
            }}
            className="relative shadow-2xl rounded-xl overflow-hidden bg-white max-w-full my-auto"
          >
            {/* Scanned Answer Sheet Image */}
            <img
              src={activePageData.imageUrl}
              alt={`Answer Sheet Page ${currentPage}`}
              className="w-full max-w-[760px] h-auto object-contain block pointer-events-none"
            />

            {/* Bounding Box Overlays */}
            <div className="absolute inset-0 pointer-events-none">
              {pageBoxes.map((box, index) => (
                <BBoxOverlay
                  key={index}
                  answer={box.answer}
                  label={box.label}
                  isActive={box.isActive}
                  onClick={() => {
                    if (box.questionId) {
                      onSelectQuestion(box.questionId);
                    }
                  }}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center p-8 text-gray-400">
            <AlertCircle className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p>No page image loaded.</p>
          </div>
        )}
      </div>
    </div>
  );
};
