// Task Card Component
// Displays individual task with actions - Professional & Elegant Design

"use client";

import { useState } from "react";
import type { Task, TaskStatus } from "@/types";
import { format } from "date-fns";

interface TaskCardProps {
  task: Task;
  onUpdate: (taskId: string, updates: Partial<Task>) => Promise<void>;
  onStatusChange: (taskId: string, status: TaskStatus) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
}

export default function TaskCard({
  task,
  onUpdate,
  onStatusChange,
  onDelete,
}: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const priorityStyles = {
    high: { 
      bg: "linear-gradient(135deg, #715A5A 0%, #5a4a4a 100%)", 
      text: "#D3DAD9", 
      border: "#715A5A",
      shadow: "0 2px 4px rgba(113, 90, 90, 0.2)"
    },
    medium: { 
      bg: "linear-gradient(135deg, #44444E 0%, #37353E 100%)", 
      text: "#D3DAD9", 
      border: "#44444E",
      shadow: "0 2px 4px rgba(68, 68, 78, 0.2)"
    },
    low: { 
      bg: "#D3DAD9", 
      text: "#37353E", 
      border: "#715A5A",
      shadow: "0 1px 2px rgba(113, 90, 90, 0.1)"
    },
  };

  const statusStyles = {
    pending: { bg: "rgba(211, 218, 217, 0.5)", text: "#37353E", border: "#44444E" },
    done: { bg: "linear-gradient(135deg, #715A5A 0%, #5a4a4a 100%)", text: "#D3DAD9", border: "#715A5A" },
    not_needed: { bg: "linear-gradient(135deg, #44444E 0%, #37353E 100%)", text: "#D3DAD9", border: "#44444E" },
    archived: { bg: "linear-gradient(135deg, #44444E 0%, #37353E 100%)", text: "#D3DAD9", border: "#37353E" },
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this task?")) {
      setIsDeleting(true);
      try {
        await onDelete(task._id!);
      } catch (error) {
        console.error("Error deleting task:", error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const deadline = new Date(task.deadline);
  const isOverdue = deadline < new Date() && task.status === "pending";
  const priorityStyle = priorityStyles[task.priority];
  const statusStyle = statusStyles[task.status];

  return (
    <div
      className="card rounded-xl p-5 border backdrop-blur-sm"
      style={{
        backgroundColor: isOverdue ? "rgba(211, 218, 217, 0.95)" : "#D3DAD9",
        borderColor: isOverdue ? "#715A5A" : "rgba(68, 68, 78, 0.2)",
        borderWidth: isOverdue ? "2px" : "1px",
      }}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold leading-tight pr-2" style={{ color: "#37353E" }}>
          {task.title}
        </h3>
        <div className="flex gap-2 flex-shrink-0">
          <span
            className="px-2.5 py-1 text-xs font-semibold rounded-full border backdrop-blur-sm"
            style={{
              background: priorityStyle.bg,
              color: priorityStyle.text,
              borderColor: priorityStyle.border,
              boxShadow: priorityStyle.shadow,
            }}
          >
            {task.priority.toUpperCase()}
          </span>
          <span
            className="px-2.5 py-1 text-xs font-semibold rounded-full backdrop-blur-sm"
            style={{
              background: statusStyle.bg,
              color: statusStyle.text,
              border: `1px solid ${statusStyle.border}`,
            }}
          >
            {task.status.replace("_", " ").toUpperCase()}
          </span>
        </div>
      </div>

      {task.description && (
        <p className="mb-4 text-sm leading-relaxed" style={{ color: "#44444E" }}>
          {task.description}
        </p>
      )}

      <div className="flex justify-between items-center mb-4 pb-4 border-b" style={{ borderColor: "rgba(68, 68, 78, 0.2)" }}>
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4" style={{ color: "#715A5A" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-xs font-medium" style={{ color: "#715A5A" }}>
            Deadline
          </span>
          <span
            className={`text-sm font-semibold ${isOverdue ? "font-bold" : ""}`}
            style={{ color: isOverdue ? "#715A5A" : "#37353E" }}
          >
            {format(deadline, "MMM dd, yyyy 'at' h:mm a")}
          </span>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {task.status === "pending" && (
          <>
            <button
              onClick={() => onStatusChange(task._id!, "done")}
              className="px-4 py-2 text-sm rounded-lg font-semibold transition-all duration-200 hover:shadow-md"
              style={{
                background: "linear-gradient(135deg, #715A5A 0%, #5a4a4a 100%)",
                color: "#D3DAD9",
                boxShadow: "0 2px 4px rgba(113, 90, 90, 0.2)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 4px 8px rgba(113, 90, 90, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 4px rgba(113, 90, 90, 0.2)";
              }}
            >
              ✓ Mark Done
            </button>
            <button
              onClick={() => onStatusChange(task._id!, "not_needed")}
              className="px-4 py-2 text-sm rounded-lg font-semibold transition-all duration-200 hover:shadow-md"
              style={{
                background: "linear-gradient(135deg, #44444E 0%, #37353E 100%)",
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
              ⊘ Not Needed
            </button>
          </>
        )}
        {task.status === "done" && (
          <button
            onClick={() => onStatusChange(task._id!, "pending")}
            className="px-4 py-2 text-sm rounded-lg font-semibold transition-all duration-200 hover:shadow-md"
            style={{
              background: "linear-gradient(135deg, #44444E 0%, #37353E 100%)",
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
            ↻ Reopen
          </button>
        )}
        {task.status === "not_needed" && (
          <button
            onClick={() => onStatusChange(task._id!, "pending")}
            className="px-4 py-2 text-sm rounded-lg font-semibold transition-all duration-200 hover:shadow-md"
            style={{
              background: "linear-gradient(135deg, #715A5A 0%, #5a4a4a 100%)",
              color: "#D3DAD9",
              boxShadow: "0 2px 4px rgba(113, 90, 90, 0.2)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 4px 8px rgba(113, 90, 90, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 2px 4px rgba(113, 90, 90, 0.2)";
            }}
          >
            ↻ Restore
          </button>
        )}
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="px-4 py-2 text-sm rounded-lg font-semibold transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: isDeleting 
              ? "linear-gradient(135deg, #44444E 0%, #37353E 100%)"
              : "linear-gradient(135deg, #715A5A 0%, #5a4a4a 100%)",
            color: "#D3DAD9",
            boxShadow: "0 2px 4px rgba(113, 90, 90, 0.2)",
          }}
          onMouseEnter={(e) => {
            if (!isDeleting) {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 4px 8px rgba(113, 90, 90, 0.3)";
            }
          }}
          onMouseLeave={(e) => {
            if (!isDeleting) {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 2px 4px rgba(113, 90, 90, 0.2)";
            }
          }}
        >
          {isDeleting ? "Deleting..." : "🗑️ Delete"}
        </button>
      </div>
    </div>
  );
}
