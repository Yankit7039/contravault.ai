// View Switcher Component
// Switch between different task views - Professional Design

"use client";

import type { ViewType } from "@/types";

interface ViewSwitcherProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const views: { type: ViewType; label: string; icon: string }[] = [
  { type: "list", label: "List", icon: "📋" },
  { type: "kanban", label: "Kanban", icon: "📊" },
  { type: "calendar", label: "Calendar", icon: "📅" },
  { type: "timeline", label: "Timeline", icon: "⏰" },
  // { type: "matrix", label: "Matrix", icon: "⚡" },
];

export default function ViewSwitcher({ currentView, onViewChange }: ViewSwitcherProps) {
  return (
    <div className="flex gap-2 flex-wrap p-1 rounded-xl" style={{ backgroundColor: "rgba(68, 68, 78, 0.1)" }}>
      {views.map((view) => (
        <button
          key={view.type}
          onClick={() => onViewChange(view.type)}
          className={`px-4 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 ${
            currentView === view.type ? "shadow-md" : "opacity-70"
          }`}
          style={{
            background: currentView === view.type
              ? "linear-gradient(135deg, #715A5A 0%, #5a4a4a 100%)"
              : "transparent",
            color: currentView === view.type ? "#D3DAD9" : "#37353E",
            boxShadow: currentView === view.type
              ? "0 2px 4px rgba(113, 90, 90, 0.3)"
              : "none",
          }}
          onMouseEnter={(e) => {
            if (currentView !== view.type) {
              e.currentTarget.style.backgroundColor = "rgba(68, 68, 78, 0.2)";
            } else {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 4px 8px rgba(113, 90, 90, 0.3)";
            }
          }}
          onMouseLeave={(e) => {
            if (currentView !== view.type) {
              e.currentTarget.style.backgroundColor = "transparent";
            } else {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 2px 4px rgba(113, 90, 90, 0.3)";
            }
          }}
        >
          {/* <span className="mr-2">{view.icon}</span> */}
          {view.label}
        </button>
      ))}
    </div>
  );
}
