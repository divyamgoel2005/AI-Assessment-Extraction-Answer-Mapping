"use client";

import React from "react";

interface TabSwitcherProps {
  activeTab: "questions" | "answersheet";
  onTabChange: (tab: "questions" | "answersheet") => void;
}

export const TabSwitcher: React.FC<TabSwitcherProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="w-full p-1.5 bg-[#F1F3F5] rounded-full flex items-center shadow-inner max-w-sm mx-auto mb-4 md:hidden">
      <button
        onClick={() => onTabChange("questions")}
        className={`flex-1 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all text-center ${
          activeTab === "questions"
            ? "bg-[#202124] text-white shadow-sm"
            : "text-[#4B5563] hover:text-[#1A1A1A]"
        }`}
      >
        Questions
      </button>

      <button
        onClick={() => onTabChange("answersheet")}
        className={`flex-1 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all text-center ${
          activeTab === "answersheet"
            ? "bg-[#202124] text-white shadow-sm"
            : "text-[#4B5563] hover:text-[#1A1A1A]"
        }`}
      >
        Answer Sheet
      </button>
    </div>
  );
};
