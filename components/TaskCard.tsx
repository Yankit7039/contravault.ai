// Task Card Component
// Displays individual task with actions

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
    high: { bg: "#715A5A", text: "#D3DAD9", border: "#44444E" },
    medium: { bg: "#44444E", text: "#D3DAD9", border: "#37353E" },
    low: { bg: "#D3DAD9", text: "#37353E", border: "#715A5A" },
  };

  const statusStyles = {
    pending: { bg: "#D3DAD9", text: "#37353E" },
    done: { bg: "#715A5A", text: "#D3DAD9" },
    not_needed: { bg: "#44444E", text: "#D3DAD9" },
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
      className="border rounded-lg p-4 shadow-md transition-all duration-200 hover:shadow-lg"
      style={{
        backgroundColor: isOverdue ? "#D3DAD9" : "#D3DAD9",
        borderColor: isOverdue ? "#715A5A" : "#44444E",
        borderWidth: "2px",
      }}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold" style={{ color: "#37353E" }}>
          {task.title}
        </h3>
        <div className="flex gap-2">
          <span
            className="px-2 py-1 text-xs font-medium rounded border"
            style={{
              backgroundColor: priorityStyle.bg,
              color: priorityStyle.text,
              borderColor: priorityStyle.border,
            }}
          >
            {task.priority.toUpperCase()}
          </span>
          <span
            className="px-2 py-1 text-xs font-medium rounded"
            style={{
              backgroundColor: statusStyle.bg,
              color: statusStyle.text,
            }}
          >
            {task.status.replace("_", " ").toUpperCase()}
          </span>
        </div>
      </div>

      <p className="mb-3" style={{ color: "#44444E" }}>
        {task.description}
      </p>

      <div className="flex justify-between items-center mb-3">
        <div>
          <span className="text-sm" style={{ color: "#715A5A" }}>
            Deadline:{" "}
          </span>
          <span
            className={`text-sm font-medium ${isOverdue ? "font-bold" : ""}`}
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
              className="px-3 py-1 text-sm rounded font-medium transition-all duration-200 hover:shadow-md"
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
              Mark Done
            </button>
            <button
              onClick={() => onStatusChange(task._id!, "not_needed")}
              className="px-3 py-1 text-sm rounded font-medium transition-all duration-200 hover:shadow-md"
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
              Not Needed
            </button>
          </>
        )}
        {task.status === "done" && (
          <button
            onClick={() => onStatusChange(task._id!, "pending")}
            className="px-3 py-1 text-sm rounded font-medium transition-all duration-200 hover:shadow-md"
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
            Reopen
          </button>
        )}
        {task.status === "not_needed" && (
          <button
            onClick={() => onStatusChange(task._id!, "pending")}
            className="px-3 py-1 text-sm rounded font-medium transition-all duration-200 hover:shadow-md"
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
            Restore
          </button>
        )}
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="px-3 py-1 text-sm rounded font-medium transition-all duration-200 hover:shadow-md disabled:opacity-50"
          style={{
            backgroundColor: "#715A5A",
            color: "#D3DAD9",
          }}
          onMouseEnter={(e) => {
            if (!isDeleting) {
              e.currentTarget.style.backgroundColor = "#5a4a4a";
            }
          }}
          onMouseLeave={(e) => {
            if (!isDeleting) {
              e.currentTarget.style.backgroundColor = "#715A5A";
            }
          }}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
}
