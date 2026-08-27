"use client";

import React from "react";
import { ChevronDown, ChevronUp, Sparkles, MapPin } from "lucide-react";
import { GradedQuestion } from "@/lib/types";
import { ScorePill } from "./ScorePill";

interface QuestionListItemProps {
  question: GradedQuestion;
  isActive: boolean;
  isExpanded: boolean;
  onSelect: () => void;
  onToggleExpand: () => void;
  onJumpToPage?: (page: number) => void;
}

export const QuestionListItem: React.FC<QuestionListItemProps> = ({
  question,
  isActive,
  isExpanded,
  onSelect,
  onToggleExpand,
  onJumpToPage,
}) => {
  const hasAnswers = question.answers && question.answers.length > 0;

  return (
    <div
      onClick={onSelect}
      className={`group relative rounded-2xl p-4 sm:p-5 transition-all duration-200 cursor-pointer border ${
        isActive
          ? "bg-[#FFF8F5] border-[#F05A28]/40 shadow-sm border-l-4 border-l-[#F05A28]"
          : "bg-white border-gray-100 hover:border-gray-300 hover:shadow-xs"
      }`}
    >
      <div className="flex items-start justify-between gap-3 sm:gap-4">
        {/* Left: Number Badge & Text */}
        <div className="flex items-start gap-3 flex-1">
          {/* Question Number Badge */}
          <div
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0 transition-colors ${
              isActive
                ? "bg-[#F05A28] text-white shadow-xs"
                : "bg-[#4B5563] text-white group-hover:bg-[#374151]"
            }`}
          >
            {question.displayNumber}
          </div>

          {/* Sub-label + Question text */}
          <div className="flex-1 pt-0.5">
            <p className="text-xs sm:text-sm text-[#1A1A1A] leading-snug font-medium">
              {question.subLabel && (
                <span className="font-bold text-[#1A1A1A] mr-1.5">{question.subLabel}</span>
              )}
              {question.text}
            </p>

            {/* Answer Page indicators (if multi-page or answered) */}
            {hasAnswers && (
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                {question.answers.map((ans, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect();
                      onJumpToPage?.(ans.page);
                    }}
                    className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md transition-colors ${
                      isActive
                        ? "bg-orange-100/80 text-[#C2410C] hover:bg-orange-200"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <MapPin className="w-3 h-3" />
                    <span>Page {ans.page}</span>
                    {ans.questionLabelRaw && (
                      <span className="opacity-70">({ans.questionLabelRaw})</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Score Pill & Chevron */}
        <div className="flex items-center gap-2 flex-shrink-0 pt-0.5">
          <ScorePill
            score={question.score}
            maxMarks={question.maxMarks}
            status={question.status}
          />

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand();
            }}
            className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors"
            title={isExpanded ? "Collapse feedback" : "Expand feedback"}
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Expanded AI Feedback Section */}
      {isExpanded && question.feedback && (
        <div className="mt-3.5 pt-3 border-t border-gray-100/80 animate-fadeIn">
          <div className="bg-[#F8F9FA] rounded-xl p-3.5 border border-gray-100">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#1A1A1A] mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#F05A28]" />
              <span>AI Feedback</span>
            </div>
            <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
              {question.feedback}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
