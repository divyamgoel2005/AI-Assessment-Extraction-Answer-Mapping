"use client";

import React from "react";
import { AnswerBlock } from "@/lib/types";

interface BBoxOverlayProps {
  answer: AnswerBlock;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}

export const BBoxOverlay: React.FC<BBoxOverlayProps> = ({
  answer,
  label,
  isActive,
  onClick,
}) => {
  if (!isActive) return null;

  const [x, y, w, h] = answer.bbox;

  const leftPercent = `${Math.max(0, Math.min(100, x * 100))}%`;
  const topPercent = `${Math.max(0, Math.min(100, y * 100))}%`;
  const widthPercent = `${Math.max(2, Math.min(100, w * 100))}%`;
  const heightPercent = `${Math.max(2, Math.min(100, h * 100))}%`;

  return (
    <div
      onClick={onClick}
      style={{
        left: leftPercent,
        top: topPercent,
        width: widthPercent,
        height: heightPercent,
        backgroundColor: "rgba(34, 197, 94, 0.22)", // Visible light green tint
        borderColor: "#16A34A",
        borderWidth: "2px",
        borderStyle: "solid",
        borderRadius: "16px",
        boxShadow: "0 0 12px rgba(34, 197, 94, 0.25)",
      }}
      className="absolute transition-all duration-200 pointer-events-auto cursor-pointer z-30"
    >
      {/* Question Badge attached at top-left corner */}
      <div
        style={{
          backgroundColor: "#16A34A",
          color: "#ffffff",
        }}
        className="absolute -top-3.5 left-2 text-[12px] font-bold px-2.5 py-0.5 rounded-lg shadow-sm flex items-center gap-1 z-40 select-none"
      >
        <span>{label}</span>
      </div>
    </div>
  );
};
