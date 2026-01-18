// Search and Filters Component
// Quick search with saved filter presets - Professional Design

"use client";

import { useState } from "react";
import type { TaskFilter, TaskPriority, TaskStatus } from "@/types";

interface SearchAndFiltersProps {
  onFilterChange: (filter: TaskFilter) => void;
  currentFilter: TaskFilter;
}

export default function SearchAndFilters({
  onFilterChange,
  currentFilter,
}: SearchAndFiltersProps) {
  const [searchText, setSearchText] = useState(currentFilter.search || "");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSearch = (text: string) => {
    setSearchText(text);
    onFilterChange({ ...currentFilter, search: text });
  };

  const togglePriority = (priority: TaskPriority) => {
    const priorities = currentFilter.priority || [];
    const newPriorities = priorities.includes(priority)
      ? priorities.filter((p) => p !== priority)
      : [...priorities, priority];
    onFilterChange({ ...currentFilter, priority: newPriorities });
  };

  const toggleStatus = (status: TaskStatus) => {
    const statuses = currentFilter.status || [];
    const newStatuses = statuses.includes(status)
      ? statuses.filter((s) => s !== status)
      : [...statuses, status];
    onFilterChange({ ...currentFilter, status: newStatuses });
  };

  return (
    <div
      className="rounded-xl p-5 shadow-lg border backdrop-blur-sm"
      style={{ 
        backgroundColor: "#D3DAD9",
        borderColor: "rgba(68, 68, 78, 0.2)",
      }}
    >
      <div className="flex gap-3 mb-4">
        <div className="flex-1 relative">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
            style={{ color: "#715A5A" }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search tasks..."
            className="w-full pl-12 pr-4 py-3 rounded-lg text-sm font-medium input-focus"
            style={{
              backgroundColor: "#D3DAD9",
              border: "1.5px solid rgba(68, 68, 78, 0.3)",
              color: "#37353E",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#715A5A";
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(113, 90, 90, 0.1)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "rgba(68, 68, 78, 0.3)";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
        </div>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="px-5 py-3 rounded-lg font-semibold text-sm transition-all duration-200"
          style={{
            background: showAdvanced
              ? "linear-gradient(135deg, #715A5A 0%, #5a4a4a 100%)"
              : "linear-gradient(135deg, #44444E 0%, #37353E 100%)",
            color: "#D3DAD9",
            boxShadow: "0 2px 4px rgba(68, 68, 78, 0.2)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow = "0 4px 8px rgba(68, 68, 78, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 2px 4px rgba(68, 68, 78, 0.2)";
          }}
        >
          {showAdvanced ? "Hide Filters" : "Filters"}
        </button>
      </div>

      {showAdvanced && (
        <div className="space-y-4 pt-4 border-t animate-in fade-in duration-200" style={{ borderColor: "rgba(68, 68, 78, 0.2)" }}>
          <div>
            <label className="block text-sm font-semibold mb-3 tracking-wide" style={{ color: "#37353E" }}>
              Priority
            </label>
            <div className="flex gap-2">
              {(["high", "medium", "low"] as TaskPriority[]).map((priority) => (
                <button
                  key={priority}
                  onClick={() => togglePriority(priority)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    currentFilter.priority?.includes(priority)
                      ? "shadow-md"
                      : "opacity-60"
                  }`}
                  style={{
                    background: currentFilter.priority?.includes(priority)
                      ? "linear-gradient(135deg, #715A5A 0%, #5a4a4a 100%)"
                      : "linear-gradient(135deg, #44444E 0%, #37353E 100%)",
                    color: "#D3DAD9",
                    boxShadow: currentFilter.priority?.includes(priority)
                      ? "0 2px 4px rgba(113, 90, 90, 0.3)"
                      : "0 1px 2px rgba(68, 68, 78, 0.2)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  {priority.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-3 tracking-wide" style={{ color: "#37353E" }}>
              Status
            </label>
            <div className="flex gap-2 flex-wrap">
              {(["pending", "done", "not_needed"] as TaskStatus[]).map((status) => (
                <button
                  key={status}
                  onClick={() => toggleStatus(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    currentFilter.status?.includes(status)
                      ? "shadow-md"
                      : "opacity-60"
                  }`}
                  style={{
                    background: currentFilter.status?.includes(status)
                      ? "linear-gradient(135deg, #715A5A 0%, #5a4a4a 100%)"
                      : "linear-gradient(135deg, #44444E 0%, #37353E 100%)",
                    color: "#D3DAD9",
                    boxShadow: currentFilter.status?.includes(status)
                      ? "0 2px 4px rgba(113, 90, 90, 0.3)"
                      : "0 1px 2px rgba(68, 68, 78, 0.2)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  {status.replace("_", " ").toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => onFilterChange({})}
            className="text-sm font-medium underline transition-opacity hover:opacity-70"
            style={{ color: "#715A5A" }}
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
