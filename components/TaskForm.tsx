// Task Form Component
// Form for creating and editing tasks - Professional & Elegant Design

"use client";

import { useState, FormEvent } from "react";
import type { TaskInput, TaskPriority, Task } from "@/types";

interface TaskFormProps {
  task?: Task;
  onSubmit: (data: TaskInput) => Promise<void>;
  onCancel?: () => void;
}

export default function TaskForm({ task, onSubmit, onCancel }: TaskFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<TaskInput>({
    title: task?.title || "",
    description: task?.description || "",
    deadline: task?.deadline
      ? new Date(task.deadline).toISOString().slice(0, 16)
      : "",
    priority: task?.priority || "medium",
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Convert local datetime to ISO string
      const deadlineISO = new Date(formData.deadline).toISOString();
      await onSubmit({ ...formData, deadline: deadlineISO });
      
      // Reset form if creating new task
      if (!task) {
        setFormData({
          title: "",
          description: "",
          deadline: "",
          priority: "medium",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to submit task";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div
          className="px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2"
          style={{
            backgroundColor: "rgba(113, 90, 90, 0.1)",
            border: "1px solid rgba(113, 90, 90, 0.3)",
            color: "#715A5A",
          }}
        >
          <span style={{ fontSize: "16px" }}>⚠</span>
          <span>{error}</span>
        </div>
      )}
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-semibold mb-2 tracking-wide"
          style={{ color: "#37353E" }}
        >
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          required
          value={formData.title}
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
          className="w-full px-4 py-3 rounded-lg input-focus text-sm font-medium"
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
          placeholder="Enter task title"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-semibold mb-2 tracking-wide"
          style={{ color: "#37353E" }}
        >
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          required
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          rows={4}
          className="w-full px-4 py-3 rounded-lg input-focus resize-none text-sm font-medium"
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
          placeholder="Enter task description"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label
            htmlFor="deadline"
            className="block text-sm font-semibold mb-2 tracking-wide"
            style={{ color: "#37353E" }}
          >
            Date & Time <span className="text-red-500">*</span>
          </label>
          <input
            type="datetime-local"
            id="deadline"
            required
            value={formData.deadline}
            onChange={(e) =>
              setFormData({ ...formData, deadline: e.target.value })
            }
            className="w-full px-4 py-3 rounded-lg input-focus text-sm font-medium"
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

        <div>
          <label
            htmlFor="priority"
            className="block text-sm font-semibold mb-2 tracking-wide"
            style={{ color: "#37353E" }}
          >
            Priority <span className="text-red-500">*</span>
          </label>
          <select
            id="priority"
            required
            value={formData.priority}
            onChange={(e) =>
              setFormData({
                ...formData,
                priority: e.target.value as TaskPriority,
              })
            }
            className="w-full px-4 py-3 rounded-lg input-focus text-sm font-medium"
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
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 py-3 px-6 rounded-lg font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: isSubmitting 
              ? "linear-gradient(135deg, #44444E 0%, #37353E 100%)"
              : "linear-gradient(135deg, #715A5A 0%, #5a4a4a 100%)",
            color: "#D3DAD9",
            boxShadow: "0 4px 6px rgba(113, 90, 90, 0.2)",
          }}
          onMouseEnter={(e) => {
            if (!isSubmitting) {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 6px 12px rgba(113, 90, 90, 0.3)";
            }
          }}
          onMouseLeave={(e) => {
            if (!isSubmitting) {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 6px rgba(113, 90, 90, 0.2)";
            }
          }}
        >
          {isSubmitting
            ? "Saving..."
            : task
            ? "✓ Update Task"
            : "✓ Create Task"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200"
            style={{
              backgroundColor: "#D3DAD9",
              border: "1.5px solid rgba(68, 68, 78, 0.3)",
              color: "#37353E",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#C3CAC9";
              e.currentTarget.style.borderColor = "#715A5A";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#D3DAD9";
              e.currentTarget.style.borderColor = "rgba(68, 68, 78, 0.3)";
            }}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
