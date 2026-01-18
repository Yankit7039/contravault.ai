// Pomodoro Timer Component
// Built-in timer with task-tracking integration

"use client";

import { useState, useEffect, useRef } from "react";
import type { Task } from "@/types";

interface PomodoroTimerProps {
  currentTask?: Task;
  onComplete?: (minutes: number) => void;
}

export default function PomodoroTimer({ currentTask, onComplete }: PomodoroTimerProps) {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev === 0) {
            if (minutes === 0) {
              // Timer completed
              handleComplete();
              return 0;
            }
            setMinutes((m) => m - 1);
            return 59;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, minutes]);

  const handleComplete = () => {
    setIsRunning(false);
    const totalMinutes = isBreak ? 5 : 25;
    
    if (!isBreak) {
      setCompletedPomodoros((prev) => prev + 1);
      setIsBreak(true);
      setMinutes(5);
      setSeconds(0);
      if (onComplete && currentTask) {
        onComplete(totalMinutes);
      }
    } else {
      setIsBreak(false);
      setMinutes(25);
      setSeconds(0);
    }
  };

  const startTimer = () => {
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setMinutes(isBreak ? 5 : 25);
    setSeconds(0);
  };

  const formatTime = (m: number, s: number) => {
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className="rounded-lg p-6 shadow-lg"
      style={{ backgroundColor: "#37353E" }}
    >
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold mb-2" style={{ color: "#D3DAD9" }}>
          {isBreak ? "Break Time" : "Pomodoro Timer"}
        </h3>
        {currentTask && (
          <p className="text-sm" style={{ color: "#D3DAD9", opacity: 0.8 }}>
            Working on: {currentTask.title}
          </p>
        )}
      </div>

      <div className="text-center mb-6">
        <div
          className="text-6xl font-bold mb-2"
          style={{ color: "#715A5A" }}
        >
          {formatTime(minutes, seconds)}
        </div>
        <div className="text-sm" style={{ color: "#D3DAD9", opacity: 0.7 }}>
          Completed: {completedPomodoros} pomodoros
        </div>
      </div>

      <div className="flex gap-2 justify-center">
        {!isRunning ? (
          <button
            onClick={startTimer}
            className="px-6 py-2 rounded-md font-medium transition-all duration-200"
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
            Start
          </button>
        ) : (
          <button
            onClick={pauseTimer}
            className="px-6 py-2 rounded-md font-medium transition-all duration-200"
            style={{
              backgroundColor: "#44444E",
              color: "#D3DAD9",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#37353E";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#44444E";
            }}
          >
            Pause
          </button>
        )}
        <button
          onClick={resetTimer}
          className="px-6 py-2 rounded-md font-medium transition-all duration-200"
          style={{
            backgroundColor: "#44444E",
            color: "#D3DAD9",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#37353E";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#44444E";
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
