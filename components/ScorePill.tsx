"use client";

import React from "react";

interface ScorePillProps {
  score: number | null;
  maxMarks: number;
  status: "correct" | "partial" | "incorrect" | "unanswered";
}

export const ScorePill: React.FC<ScorePillProps> = ({ score, maxMarks, status }) => {
  if (status === "unanswered" || score === null) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500 border border-gray-200">
        Unanswered
      </span>
    );
  }

  if (score === maxMarks) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#DCFCE7] text-[#16A34A]">
        {score}/{maxMarks}
      </span>
    );
  }

  if (score === 0) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FEE2E2] text-[#DC2626]">
        0/{maxMarks}
      </span>
    );
  }

  // Partial credit
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FEF3C7] text-[#D97706]">
      {score}/{maxMarks}
    </span>
  );
};
