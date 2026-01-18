// Task Calendar Component
// Displays a calendar visualization with tasks marked by priority colors

"use client";

import { useMemo } from "react";
import type { Task } from "@/types";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, getDay } from "date-fns";

interface TaskCalendarProps {
  tasks: Task[];
}

export default function TaskCalendar({ tasks }: TaskCalendarProps) {
  const currentDate = new Date();
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Priority colors matching the app palette
  const priorityColors = {
    high: "#715A5A",    // Accent color for high priority
    medium: "#44444E",  // Medium color for medium priority
    low: "#D3DAD9",     // Light color for low priority (with dark border)
  };

  // Get tasks for a specific date
  const getTasksForDate = (date: Date) => {
    return tasks.filter((task) => {
      if (task.status === "done" || task.status === "not_needed") return false;
      const taskDate = new Date(task.deadline);
      return isSameDay(taskDate, date);
    });
  };

  // Get the highest priority for a date (for the dot color)
  const getHighestPriorityForDate = (date: Date): "high" | "medium" | "low" | null => {
    const dateTasks = getTasksForDate(date);
    if (dateTasks.length === 0) return null;

    const priorities = dateTasks.map((t) => t.priority);
    if (priorities.includes("high")) return "high";
    if (priorities.includes("medium")) return "medium";
    return "low";
  };

  // Get first day of week (0 = Sunday)
  const firstDayOfWeek = getDay(monthStart);

  return (
    <div
      className="rounded-lg shadow-lg p-6"
      style={{ backgroundColor: "#D3DAD9" }}
    >
      <div className="mb-4">
        <h3 className="text-xl font-bold mb-2" style={{ color: "#37353E" }}>
          {format(currentDate, "MMMM yyyy")}
        </h3>
        <p className="text-sm" style={{ color: "#44444E" }}>
          Tasks marked by priority
        </p>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Day Headers */}
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-center text-sm font-semibold py-2"
            style={{ color: "#37353E" }}
          >
            {day}
          </div>
        ))}

        {/* Empty cells for days before month starts */}
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}

        {/* Calendar Days */}
        {daysInMonth.map((day) => {
          const dayTasks = getTasksForDate(day);
          const highestPriority = getHighestPriorityForDate(day);
          const isTodayDate = isToday(day);

          return (
            <div
              key={day.toISOString()}
              className={`aspect-square rounded-lg flex flex-col items-center justify-center p-1 transition-all hover:scale-105 ${
                isTodayDate ? "ring-2 ring-offset-2" : ""
              }`}
              style={{
                backgroundColor: isTodayDate ? "#D3DAD9" : "#D3DAD9",
                border: isTodayDate ? "2px solid #715A5A" : "1px solid #44444E",
                cursor: dayTasks.length > 0 ? "pointer" : "default",
              }}
            >
              <span
                className={`text-sm font-medium ${isTodayDate ? "font-bold" : ""}`}
                style={{ color: "#37353E" }}
              >
                {format(day, "d")}
              </span>
              {highestPriority && (
                <div className="flex gap-0.5 mt-1">
                  {dayTasks.map((task, idx) => (
                    <div
                      key={task._id || idx}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        backgroundColor: priorityColors[task.priority],
                      }}
                      title={`${task.title} (${task.priority})`}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: priorityColors.high }}
          />
          <span className="text-sm" style={{ color: "#37353E" }}>
            High Priority
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: priorityColors.medium }}
          />
          <span className="text-sm" style={{ color: "#37353E" }}>
            Medium Priority
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-full border"
            style={{
              backgroundColor: priorityColors.low,
              borderColor: "#44444E",
            }}
          />
          <span className="text-sm" style={{ color: "#37353E" }}>
            Low Priority
          </span>
        </div>
      </div>
    </div>
  );
}
