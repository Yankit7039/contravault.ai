// Task Calendar Component
// Displays a calendar visualization with tasks marked by priority colors - Professional Design

"use client";

import { useMemo, useState, useRef } from "react";
import type { Task } from "@/types";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, getDay, startOfDay } from "date-fns";

interface TaskCalendarProps {
  tasks: Task[];
}

export default function TaskCalendar({ tasks }: TaskCalendarProps) {
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [hoverPosition, setHoverPosition] = useState<{ x: number; y: number } | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const currentDate = new Date();
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Priority colors matching the app palette
  const priorityColors = {
    high: "#715A5A",
    medium: "#44444E",
    low: "#D3DAD9",
  };

  // Get tasks for a specific date
  const getTasksForDate = (date: Date) => {
    const dateStart = startOfDay(date);
    
    return tasks.filter((task) => {
      if (task.status === "done" || task.status === "not_needed" || task.status === "archived") {
        return false;
      }
      
      let taskDate: Date;
      try {
        taskDate = new Date(task.deadline);
        if (isNaN(taskDate.getTime())) {
          return false;
        }
        taskDate = startOfDay(taskDate);
      } catch (error) {
        return false;
      }
      
      return isSameDay(taskDate, dateStart);
    });
  };

  // Get first day of week (0 = Sunday)
  const firstDayOfWeek = getDay(monthStart);

  const handleMouseEnter = (day: Date, event: React.MouseEvent<HTMLDivElement>) => {
    const dayTasks = getTasksForDate(day);
    if (dayTasks.length > 0 && calendarRef.current) {
      setHoveredDate(day);
      
      // Get the day cell's position relative to viewport
      const dayRect = event.currentTarget.getBoundingClientRect();
      // Get the calendar container's position relative to viewport
      const calendarRect = calendarRef.current.getBoundingClientRect();
      
      // Calculate position relative to calendar container
      // Position tooltip directly below the cell, aligned with left edge
      const x = dayRect.left - calendarRect.left;
      const y = dayRect.bottom - calendarRect.top + 4; // 4px gap below the cell
      
      setHoverPosition({ x, y });
    }
  };

  const handleMouseLeave = () => {
    setHoveredDate(null);
    setHoverPosition(null);
  };

  return (
    <div
      ref={calendarRef}
      className="rounded-xl shadow-xl p-8 border backdrop-blur-sm relative"
      style={{ 
        backgroundColor: "#D3DAD9",
        borderColor: "rgba(68, 68, 78, 0.2)",
      }}
    >
      <div className="mb-6">
        <h3 className="text-2xl font-bold mb-2 tracking-tight" style={{ color: "#37353E" }}>
          {format(currentDate, "MMMM yyyy")}
        </h3>
        <p className="text-sm font-medium" style={{ color: "#44444E" }}>
          Tasks marked by priority (hover to see details)
        </p>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Day Headers */}
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-center text-sm font-bold py-3 tracking-wide"
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
          const isTodayDate = isToday(day);
          const isHovered = hoveredDate && isSameDay(day, hoveredDate);

          return (
            <div
              key={day.toISOString()}
              className={`aspect-square rounded-lg flex flex-col items-center justify-center p-2 transition-all duration-200 relative ${
                isTodayDate ? "ring-2 ring-offset-2" : ""
              } ${dayTasks.length > 0 ? "hover:scale-105 cursor-pointer" : ""}`}
              style={{
                backgroundColor: isTodayDate ? "rgba(113, 90, 90, 0.1)" : "#D3DAD9",
                border: isHovered 
                  ? "2px solid #715A5A" 
                  : isTodayDate 
                  ? "2px solid #715A5A" 
                  : "1px solid rgba(68, 68, 78, 0.2)",
                boxShadow: dayTasks.length > 0 ? "0 2px 4px rgba(55, 53, 62, 0.1)" : "none",
              }}
              onMouseEnter={(e) => handleMouseEnter(day, e)}
              onMouseLeave={handleMouseLeave}
            >
              <span
                className={`text-sm font-semibold ${isTodayDate ? "font-bold" : ""}`}
                style={{ color: "#37353E" }}
              >
                {format(day, "d")}
              </span>
              {dayTasks.length > 0 && (
                <div className="flex gap-1 mt-1.5 flex-wrap justify-center max-w-full">
                  {dayTasks.map((task, idx) => (
                    <div
                      key={task._id || idx}
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0 shadow-sm"
                      style={{
                        backgroundColor: priorityColors[task.priority],
                        border: task.priority === "low" ? "1px solid #44444E" : "none",
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

      {/* Hover Tooltip - Positioned directly below the hovered cell */}
      {hoveredDate && hoverPosition && (
        <div
          className="absolute z-50 p-5 rounded-xl shadow-2xl w-80 pointer-events-none border backdrop-blur-sm"
          style={{
            background: "linear-gradient(135deg, #37353E 0%, #44444E 100%)",
            color: "#D3DAD9",
            borderColor: "rgba(113, 90, 90, 0.3)",
            left: `${hoverPosition.x}px`,
            top: `${hoverPosition.y}px`,
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)",
            maxHeight: "400px",
            overflowY: "auto",
          }}
        >
          <div className="mb-3 pb-3 border-b" style={{ borderColor: "rgba(211, 218, 217, 0.2)" }}>
            <h4 className="font-bold text-lg mb-1" style={{ color: "#D3DAD9" }}>
              {format(hoveredDate, "EEEE, MMMM d, yyyy")}
            </h4>
            <div className="text-xs font-medium opacity-80">
              {getTasksForDate(hoveredDate).length} task(s)
            </div>
          </div>
          <div className="space-y-2">
            {getTasksForDate(hoveredDate).map((task) => (
              <div
                key={task._id}
                className="p-3 rounded-lg border backdrop-blur-sm"
                style={{
                  background: "rgba(68, 68, 78, 0.5)",
                  borderColor: priorityColors[task.priority],
                }}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h5 className="font-semibold text-sm flex-1 leading-tight" style={{ color: "#D3DAD9" }}>
                    {task.title}
                  </h5>
                  <span
                    className="px-2 py-1 text-xs font-bold rounded-full flex-shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${priorityColors[task.priority]} 0%, ${task.priority === "high" ? "#5a4a4a" : task.priority === "medium" ? "#37353E" : "#C3CAC9"} 100%)`,
                      color: task.priority === "low" ? "#37353E" : "#D3DAD9",
                    }}
                  >
                    {task.priority.toUpperCase()}
                  </span>
                </div>
                {task.description && (
                  <p className="text-xs mb-2 opacity-90 leading-relaxed" style={{ color: "#D3DAD9" }}>
                    {task.description}
                  </p>
                )}
                <div className="flex items-center gap-1.5 text-xs opacity-75" style={{ color: "#D3DAD9" }}>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {format(new Date(task.deadline), "h:mm a")}
                </div>
                {task.tags && task.tags.length > 0 && (
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {task.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{
                          background: "rgba(113, 90, 90, 0.3)",
                          color: "#D3DAD9",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="mt-8 pt-6 border-t flex flex-wrap gap-6 justify-center" style={{ borderColor: "rgba(68, 68, 78, 0.2)" }}>
        <div className="flex items-center gap-2.5">
          <div
            className="w-5 h-5 rounded-full shadow-sm"
            style={{ backgroundColor: priorityColors.high }}
          />
          <span className="text-sm font-semibold" style={{ color: "#37353E" }}>
            High Priority
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <div
            className="w-5 h-5 rounded-full shadow-sm"
            style={{ backgroundColor: priorityColors.medium }}
          />
          <span className="text-sm font-semibold" style={{ color: "#37353E" }}>
            Medium Priority
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <div
            className="w-5 h-5 rounded-full border shadow-sm"
            style={{
              backgroundColor: priorityColors.low,
              borderColor: "#44444E",
            }}
          />
          <span className="text-sm font-semibold" style={{ color: "#37353E" }}>
            Low Priority
          </span>
        </div>
      </div>
    </div>
  );
}
