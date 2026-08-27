"use client";

import React from "react";
import {
  LayoutGrid,
  Users,
  FileText,
  ClipboardList,
  Clock,
  Settings,
  Sparkles,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { VedaLogo } from "./VedaLogo";

interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  onOpenSettings?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed = false,
  onToggleCollapse,
  onOpenSettings,
}) => {
  const navItems = [
    { label: "Home", icon: LayoutGrid, active: false },
    { label: "My Classroom", icon: Users, active: false },
    { label: "Assignments", icon: FileText, active: false },
    { label: "Exams", icon: ClipboardList, active: true },
    { label: "My Library", icon: Clock, active: false },
  ];

  if (collapsed) {
    return (
      <aside className="hidden md:flex flex-col items-center justify-between w-[72px] bg-white rounded-3xl p-4 my-3 ml-3 shadow-subtle border border-gray-100 flex-shrink-0 transition-all duration-300">
        {/* Top brand */}
        <div className="flex flex-col items-center gap-6 w-full">
          <VedaLogo size={40} />

          {/* Active toolkit sparkle pill */}
          <div className="relative group cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-[#222224] border-2 border-[#F05A28] flex items-center justify-center text-[#F05A28] shadow-[0_2px_10px_rgba(240,90,40,0.2)]">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>

          {/* Nav icons */}
          <div className="flex flex-col items-center gap-4 mt-2">
            {navItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  title={item.label}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                    item.active
                      ? "text-[#1A1A1A] bg-gray-100 font-semibold"
                      : "text-gray-400 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom actions */}
        <div className="flex flex-col items-center gap-4 w-full">
          {/* School Badge Icon */}
          <div
            title="Delhi Public School, Bokaro Steel City"
            className="w-10 h-10 rounded-xl bg-[#F4F9F4] border border-[#DCFCE7] flex items-center justify-center text-[#16A34A] cursor-pointer"
          >
            <span className="text-xs font-bold font-serif">DPS</span>
          </div>

          {/* Expand toggle */}
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              title="Expand Sidebar"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </aside>
    );
  }

  return (
    <aside className="hidden md:flex flex-col justify-between w-[260px] bg-white rounded-3xl p-5 my-3 ml-3 shadow-subtle border border-gray-100 flex-shrink-0 transition-all duration-300">
      <div>
        {/* Top Header & Logo */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <VedaLogo size={36} />
            <span className="text-xl font-bold tracking-tight text-[#1A1A1A]">VedaAI</span>
          </div>

          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              title="Collapse Sidebar"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* AI Teacher's Toolkit Pill Button */}
        <div className="mb-6">
          <button className="w-full bg-[#222224] hover:bg-[#1A1A1A] text-white text-xs font-bold py-2.5 px-3 rounded-full flex items-center justify-center gap-2 border-2 border-[#F05A28] shadow-[0_2px_10px_rgba(240,90,40,0.2)] transition-all hover:scale-[1.02] cursor-pointer">
            {/* Sparkle with accent dot icon */}
            <div className="relative flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-[#F05A28]" />
            </div>
            <span className="tracking-tight text-[12px]">AI Teacher&apos;s Toolkit</span>
          </button>
        </div>

        {/* Nav list */}
        <nav className="space-y-1">
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-medium transition-colors ${
                  item.active
                    ? "bg-[#F1F3F5] text-[#1A1A1A] font-semibold"
                    : "text-[#6C737F] hover:bg-gray-50 hover:text-[#1A1A1A]"
                }`}
              >
                <Icon className="w-4 h-4 text-inherit" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom section */}
      <div className="space-y-3 pt-4 border-t border-gray-100">
        <button
          onClick={onOpenSettings}
          className="w-full flex items-center gap-3 px-3.5 py-2 text-sm text-[#6C737F] hover:text-[#1A1A1A] hover:bg-gray-50 rounded-2xl transition-colors"
        >
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </button>

        {/* School Badge Card */}
        <div className="bg-[#F8F9FA] rounded-2xl p-3 flex items-center gap-3 border border-gray-200/60">
          <div className="w-9 h-9 rounded-xl bg-white border border-green-200 flex items-center justify-center text-[#16A34A] shadow-xs flex-shrink-0">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z" />
            </svg>
          </div>
          <div className="overflow-hidden text-left">
            <p className="text-xs font-bold text-[#1A1A1A] truncate leading-tight">
              Delhi Public School
            </p>
            <p className="text-[10px] text-[#717680] truncate mt-0.5">
              Bokaro Steel City
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
