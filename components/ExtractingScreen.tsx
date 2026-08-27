"use client";

import React from "react";
import { Sparkles, Loader2 } from "lucide-react";

interface ExtractingScreenProps {
  currentStage?: string;
}

export const ExtractingScreen: React.FC<ExtractingScreenProps> = ({
  currentStage = "Analyzing question paper & answer sheets...",
}) => {
  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center min-h-[600px] p-6 text-center animate-fadeIn">
      {/* Animated Star Cluster */}
      <div className="relative mb-8 w-44 h-44 flex items-center justify-center">
        {/* Pulsing ambient glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#F05A28]/20 via-[#FF7A00]/15 to-transparent blur-2xl animate-pulseRing" />

        {/* Main Central Star */}
        <svg
          viewBox="0 0 100 100"
          className="w-28 h-28 fill-[#F05A28] filter drop-shadow-md animate-pulseGlow"
        >
          {/* 4-point Diamond Star */}
          <path d="M50 0 C50 35 65 50 100 50 C65 50 50 65 50 100 C50 65 35 50 0 50 C35 50 50 35 50 0 Z" />
        </svg>

        {/* Top-Right Accent Star */}
        <svg
          viewBox="0 0 100 100"
          className="absolute top-4 right-5 w-8 h-8 fill-[#FF7A00] animate-twinkle"
        >
          <path d="M50 0 C50 35 65 50 100 50 C65 50 50 65 50 100 C50 65 35 50 0 50 C35 50 50 35 50 0 Z" />
        </svg>

        {/* Bottom-Left Small Star */}
        <svg
          viewBox="0 0 100 100"
          className="absolute bottom-6 left-5 w-6 h-6 fill-[#F05A28] opacity-80 animate-star-float"
        >
          <path d="M50 0 C50 35 65 50 100 50 C65 50 50 65 50 100 C50 65 35 50 0 50 C35 50 50 35 50 0 Z" />
        </svg>

        {/* Little Accent Dot */}
        <div className="absolute top-12 left-4 w-3 h-3 rounded-full bg-[#F05A28] opacity-75 animate-ping" />
      </div>

      {/* Main Text */}
      <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A1A] tracking-tight mb-2">
        Extracting…
      </h2>
      <p className="text-sm sm:text-base text-[#717680] font-normal max-w-sm mb-4">
        This may take a while
      </p>

      {/* Progress pill indicator */}
      <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white border border-gray-200/80 shadow-xs text-xs font-medium text-gray-700">
        <Loader2 className="w-3.5 h-3.5 animate-spin text-[#F05A28]" />
        <span>{currentStage}</span>
      </div>
    </div>
  );
};
