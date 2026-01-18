// Focus Mode Component
// Hide distractions; show only the current task

"use client";

import { useState } from "react";
import type { Task } from "@/types";
import PomodoroTimer from "./PomodoroTimer";

interface FocusModeProps {
  task: Task | null;
  onTaskComplete: (taskId: string) => Promise<void>;
  onExit: () => void;
}

export default function FocusMode({ task, onTaskComplete, onExit }: FocusModeProps) {
  const [timeSpent, setTimeSpent] = useState(0);

  if (!task) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#37353E" }}
      >
        <div className="text-center">
          <p className="text-xl mb-4" style={{ color: "#D3DAD9" }}>
            No task selected for focus mode
          </p>
          <button
            onClick={onExit}
            className="px-6 py-2 rounded-md font-medium"
            style={{
              backgroundColor: "#715A5A",
              color: "#D3DAD9",
            }}
          >
            Exit Focus Mode
          </button>
        </div>
      </div>
    );
  }

  const handleTimerComplete = async (minutes: number) => {
    setTimeSpent((prev) => prev + minutes);
  };

  return (
    <div
      className="min-h-screen p-8"
      style={{ backgroundColor: "#37353E" }}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold" style={{ color: "#D3DAD9" }}>
            Focus Mode
          </h1>
          <button
            onClick={onExit}
            className="px-4 py-2 rounded-md font-medium transition-all"
            style={{
              backgroundColor: "#715A5A",
              color: "#D3DAD9",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#5a4a4a";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#715A5A";
            }}
          >
            Exit Focus
          </button>
        </div>

        <div
          className="p-8 rounded-lg shadow-lg mb-6"
          style={{ backgroundColor: "#44444E" }}
        >
          <h2 className="text-2xl font-bold mb-4" style={{ color: "#D3DAD9" }}>
            {task.title}
          </h2>
          <p className="text-lg mb-4" style={{ color: "#D3DAD9", opacity: 0.9 }}>
            {task.description}
          </p>
          <div className="flex gap-4 text-sm" style={{ color: "#D3DAD9", opacity: 0.7 }}>
            <span>Priority: {task.priority.toUpperCase()}</span>
            <span>Deadline: {new Date(task.deadline).toLocaleDateString()}</span>
            {task.estimatedTime && <span>Estimated: {task.estimatedTime} min</span>}
          </div>
        </div>

        <PomodoroTimer
          currentTask={task}
          onComplete={handleTimerComplete}
        />

        <div className="text-center">
          <button
            onClick={() => onTaskComplete(task._id!)}
            className="px-8 py-4 rounded-lg font-bold text-lg transition-all"
            style={{
              backgroundColor: "#715A5A",
              color: "#D3DAD9",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#5a4a4a";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#715A5A";
            }}
          >
            Mark as Complete
          </button>
        </div>
      </div>
    </div>
  );
}
