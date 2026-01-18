// Stats Dashboard Component
// Progress charts and statistics (without external chart library) - Professional Design

"use client";

import { useMemo } from "react";
import type { Task } from "@/types";

interface StatsDashboardProps {
  tasks: Task[];
  stats?: {
    currentStreak: number;
    longestStreak: number;
    totalTasksCompleted: number;
    totalTasksCreated: number;
  };
}

export default function StatsDashboard({ tasks, stats }: StatsDashboardProps) {
  const priorityData = useMemo(() => {
    const counts = { high: 0, medium: 0, low: 0 };
    tasks.forEach((task) => {
      if (task.status === "pending") {
        counts[task.priority]++;
      }
    });
    return [
      { name: "High", value: counts.high, color: "#715A5A" },
      { name: "Medium", value: counts.medium, color: "#44444E" },
      { name: "Low", value: counts.low, color: "#D3DAD9" },
    ];
  }, [tasks]);

  const statusData = useMemo(() => {
    const counts = { pending: 0, done: 0, not_needed: 0, archived: 0 };
    tasks.forEach((task) => {
      counts[task.status]++;
    });
    return [
      { name: "Pending", value: counts.pending, color: "#715A5A" },
      { name: "Done", value: counts.done, color: "#44444E" },
      { name: "Not Needed", value: counts.not_needed, color: "#D3DAD9" },
      { name: "Archived", value: counts.archived, color: "#37353E" },
    ];
  }, [tasks]);

  const totalTasks = statusData.reduce((sum, item) => sum + item.value, 0);
  const maxPriority = Math.max(...priorityData.map((d) => d.value), 1);

  return (
    <div className="space-y-6">
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            className="p-6 rounded-xl border backdrop-blur-sm"
            style={{ 
              backgroundColor: "#D3DAD9",
              borderColor: "rgba(68, 68, 78, 0.2)",
              boxShadow: "0 4px 6px rgba(55, 53, 62, 0.1)",
            }}
          >
            <div className="text-xs font-semibold uppercase tracking-wide mb-2 opacity-70" style={{ color: "#37353E" }}>
              Current Streak
            </div>
            <div className="text-3xl font-bold" style={{ color: "#715A5A" }}>
              {stats.currentStreak}
            </div>
            <div className="text-xs font-medium mt-1" style={{ color: "#44444E" }}>
              days
            </div>
          </div>
          <div
            className="p-6 rounded-xl border backdrop-blur-sm"
            style={{ 
              backgroundColor: "#D3DAD9",
              borderColor: "rgba(68, 68, 78, 0.2)",
              boxShadow: "0 4px 6px rgba(55, 53, 62, 0.1)",
            }}
          >
            <div className="text-xs font-semibold uppercase tracking-wide mb-2 opacity-70" style={{ color: "#37353E" }}>
              Longest Streak
            </div>
            <div className="text-3xl font-bold" style={{ color: "#715A5A" }}>
              {stats.longestStreak}
            </div>
            <div className="text-xs font-medium mt-1" style={{ color: "#44444E" }}>
              days
            </div>
          </div>
          <div
            className="p-6 rounded-xl border backdrop-blur-sm"
            style={{ 
              backgroundColor: "#D3DAD9",
              borderColor: "rgba(68, 68, 78, 0.2)",
              boxShadow: "0 4px 6px rgba(55, 53, 62, 0.1)",
            }}
          >
            <div className="text-xs font-semibold uppercase tracking-wide mb-2 opacity-70" style={{ color: "#37353E" }}>
              Completed
            </div>
            <div className="text-3xl font-bold" style={{ color: "#715A5A" }}>
              {stats.totalTasksCompleted}
            </div>
            <div className="text-xs font-medium mt-1" style={{ color: "#44444E" }}>
              tasks
            </div>
          </div>
          <div
            className="p-6 rounded-xl border backdrop-blur-sm"
            style={{ 
              backgroundColor: "#D3DAD9",
              borderColor: "rgba(68, 68, 78, 0.2)",
              boxShadow: "0 4px 6px rgba(55, 53, 62, 0.1)",
            }}
          >
            <div className="text-xs font-semibold uppercase tracking-wide mb-2 opacity-70" style={{ color: "#37353E" }}>
              Created
            </div>
            <div className="text-3xl font-bold" style={{ color: "#715A5A" }}>
              {stats.totalTasksCreated}
            </div>
            <div className="text-xs font-medium mt-1" style={{ color: "#44444E" }}>
              tasks
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tasks by Priority - Bar Chart */}
        <div
          className="p-6 rounded-xl border backdrop-blur-sm"
          style={{ 
            backgroundColor: "#D3DAD9",
            borderColor: "rgba(68, 68, 78, 0.2)",
            boxShadow: "0 4px 6px rgba(55, 53, 62, 0.1)",
          }}
        >
          <h3 className="text-lg font-bold mb-6 tracking-tight" style={{ color: "#37353E" }}>
            Tasks by Priority
          </h3>
          <div className="space-y-4">
            {priorityData.map((item) => (
              <div key={item.name}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold" style={{ color: "#37353E" }}>
                    {item.name}
                  </span>
                  <span className="text-sm font-bold" style={{ color: "#715A5A" }}>
                    {item.value}
                  </span>
                </div>
                <div
                  className="h-3 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: "rgba(68, 68, 78, 0.2)",
                    width: "100%",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      background: `linear-gradient(90deg, ${item.color} 0%, ${item.color}dd 100%)`,
                      width: `${(item.value / maxPriority) * 100}%`,
                      minWidth: item.value > 0 ? "8px" : "0",
                      boxShadow: item.value > 0 ? `0 2px 4px rgba(113, 90, 90, 0.2)` : "none",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tasks by Status - Pie Chart Alternative */}
        <div
          className="p-6 rounded-xl border backdrop-blur-sm"
          style={{ 
            backgroundColor: "#D3DAD9",
            borderColor: "rgba(68, 68, 78, 0.2)",
            boxShadow: "0 4px 6px rgba(55, 53, 62, 0.1)",
          }}
        >
          <h3 className="text-lg font-bold mb-6 tracking-tight" style={{ color: "#37353E" }}>
            Tasks by Status
          </h3>
          <div className="space-y-4">
            {statusData.map((item) => {
              const percentage = totalTasks > 0 ? (item.value / totalTasks) * 100 : 0;
              return (
                <div key={item.name}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full shadow-sm"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm font-semibold" style={{ color: "#37353E" }}>
                        {item.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold" style={{ color: "#715A5A" }}>
                        {item.value}
                      </span>
                      <span className="text-xs font-medium opacity-70" style={{ color: "#44444E" }}>
                        ({percentage.toFixed(0)}%)
                      </span>
                    </div>
                  </div>
                  <div
                    className="h-3 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor: "rgba(68, 68, 78, 0.2)",
                      width: "100%",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        background: `linear-gradient(90deg, ${item.color} 0%, ${item.color}dd 100%)`,
                        width: `${percentage}%`,
                        minWidth: item.value > 0 ? "8px" : "0",
                        boxShadow: item.value > 0 ? `0 2px 4px rgba(113, 90, 90, 0.2)` : "none",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
