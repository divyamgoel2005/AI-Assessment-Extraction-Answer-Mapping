"use client";

import React from "react";
import {
  ArrowLeft,
  FileText,
  HelpCircle,
  Bell,
  ChevronDown,
  Menu,
} from "lucide-react";

interface TopBarProps {
  onBack?: () => void;
  title?: string;
  onOpenMobileMenu?: () => void;
  hasApiKey?: boolean;
  onOpenSettings?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onBack,
  title = "Exams",
  onOpenMobileMenu,
}) => {
  return (
    <header className="w-full bg-transparent px-4 sm:px-6 py-3 flex items-center justify-between">
      {/* Left side: Back + Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full bg-white md:bg-transparent hover:bg-white flex items-center justify-center text-gray-700 hover:text-black transition-colors shadow-xs md:shadow-none"
          title="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <div className="hidden sm:flex items-center gap-1.5 text-gray-400">
            <FileText className="w-4 h-4" />
          </div>
          <span className="text-[#344054] text-sm sm:text-base font-semibold">{title}</span>
        </div>
      </div>

      {/* Right side: Actions & Profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Help icon */}
        <button
          className="hidden md:flex w-9 h-9 rounded-full hover:bg-white text-gray-500 hover:text-gray-900 items-center justify-center transition-colors"
          title="Help & FAQ"
        >
          <HelpCircle className="w-5 h-5" />
        </button>

        {/* Notification Bell with red dot */}
        <button
          className="relative w-9 h-9 rounded-full hover:bg-white text-gray-600 hover:text-gray-900 flex items-center justify-center transition-colors"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#F05A28] ring-2 ring-white" />
        </button>

        {/* User Profile Pill */}
        <div className="flex items-center gap-2 pl-1 cursor-pointer hover:opacity-90 transition-opacity">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600 to-orange-400 p-[1.5px] flex items-center justify-center overflow-hidden shadow-xs">
            <div className="w-full h-full rounded-full bg-[#1A1A1A] flex items-center justify-center text-white text-xs font-bold">
              DG
            </div>
          </div>
          <span className="hidden md:inline-block text-xs font-semibold text-[#1A1A1A]">
            Divyam Goel
          </span>
          <ChevronDown className="hidden md:inline-block w-3.5 h-3.5 text-gray-500" />
        </div>

        {/* Mobile Menu Hamburger */}
        {onOpenMobileMenu && (
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden w-9 h-9 rounded-xl bg-white flex items-center justify-center text-gray-700 shadow-xs"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
      </div>
    </header>
  );
};
