"use client";

import React from "react";

interface VedaLogoProps {
  className?: string;
  size?: number;
}

export const VedaLogo: React.FC<VedaLogoProps> = ({ className = "", size = 38 }) => {
  return (
    <div
      className={`rounded-2xl overflow-hidden shadow-sm flex-shrink-0 flex items-center justify-center transition-transform hover:scale-105 ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src="/veda-logo.png"
        alt="VedaAI Logo"
        className="w-full h-full object-contain"
      />
    </div>
  );
};
