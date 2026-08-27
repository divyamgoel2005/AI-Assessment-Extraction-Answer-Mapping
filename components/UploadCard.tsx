"use client";

import React, { useRef, useState } from "react";
import { Upload, FileText, X } from "lucide-react";
import { UploadedFileInfo } from "@/lib/types";

interface UploadCardProps {
  labelPrefix: string;
  labelHighlight: string;
  fileInfo: UploadedFileInfo | null;
  onFileSelect: (file: File) => void;
  onRemove: () => void;
  accept?: string;
}

export const UploadCard: React.FC<UploadCardProps> = ({
  labelPrefix,
  labelHighlight,
  fileInfo,
  onFileSelect,
  onRemove,
  accept = ".pdf,image/png,image/jpeg,image/webp",
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleChange}
      />

      {!fileInfo ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`h-40 sm:h-44 w-full rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center p-6 text-center ${
            isDragOver
              ? "border-[#F05A28] bg-orange-50/50 scale-[1.01]"
              : "border-gray-300 bg-white/70 hover:bg-white hover:border-gray-400"
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-gray-100/90 flex items-center justify-center text-gray-700 mb-3 shadow-xs">
            <Upload className="w-5 h-5" />
          </div>
          <div className="text-sm sm:text-base font-medium text-[#1A1A1A]">
            {labelPrefix}{" "}
            <span className="font-bold text-[#F05A28]">{labelHighlight}</span>
          </div>
          <div className="text-xs text-gray-400 mt-1">Max 10MB</div>
        </div>
      ) : (
        <div className="h-40 sm:h-44 w-full rounded-2xl border border-gray-200 bg-white shadow-card p-5 relative flex flex-col justify-center transition-all animate-fadeIn">
          {/* Remove Button Top Right */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="absolute top-3.5 right-3.5 w-7 h-7 rounded-full bg-gray-700/80 hover:bg-gray-900 text-white flex items-center justify-center transition-all hover:scale-110 shadow-sm"
            title="Remove file"
          >
            <X className="w-4 h-4" />
          </button>

          {/* File Card Content */}
          <div className="flex items-center gap-3.5 pr-8">
            <div className="w-12 h-12 rounded-xl bg-[#FEE2E2] flex items-center justify-center text-[#DC2626] flex-shrink-0 shadow-xs">
              <span className="text-xs font-black tracking-tighter uppercase font-mono">PDF</span>
            </div>

            <div className="overflow-hidden">
              <h4 className="text-sm sm:text-base font-bold text-[#1A1A1A] truncate">
                {fileInfo.name}
              </h4>
              <p className="text-xs text-[#717680] mt-0.5">
                {fileInfo.sizeFormatted} • {fileInfo.pageCount}{" "}
                {fileInfo.pageCount === 1 ? "Page" : "Pages"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
