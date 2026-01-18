// Task Form Component
// Form for creating and editing tasks

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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium mb-1"
          style={{ color: "#37353E" }}
        >
          Title *
        </label>
        <input
          type="text"
          id="title"
          required
          value={formData.title}
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
          className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 transition-all"
          style={{
            backgroundColor: "#D3DAD9",
            border: "2px solid #44444E",
            color: "#37353E",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "#715A5A";
            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(113, 90, 90, 0.1)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "#44444E";
            e.currentTarget.style.boxShadow = "none";
          }}
          placeholder="Enter task title"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium mb-1"
          style={{ color: "#37353E" }}
        >
          Description *
        </label>
        <textarea
          id="description"
          required
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          rows={4}
          className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 transition-all resize-none"
          style={{
            backgroundColor: "#D3DAD9",
            border: "2px solid #44444E",
            color: "#37353E",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "#715A5A";
            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(113, 90, 90, 0.1)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "#44444E";
            e.currentTarget.style.boxShadow = "none";
          }}
          placeholder="Enter task description"
        />
      </div>

      <div>
        <label
          htmlFor="deadline"
          className="block text-sm font-medium mb-1"
          style={{ color: "#37353E" }}
        >
          Date & Time *
        </label>
        <input
          type="datetime-local"
          id="deadline"
          required
          value={formData.deadline}
          onChange={(e) =>
            setFormData({ ...formData, deadline: e.target.value })
          }
          className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 transition-all"
          style={{
            backgroundColor: "#D3DAD9",
            border: "2px solid #44444E",
            color: "#37353E",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "#715A5A";
            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(113, 90, 90, 0.1)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "#44444E";
            e.currentTarget.style.boxShadow = "none";
          }}
        />
      </div>

      <div>
        <label
          htmlFor="priority"
          className="block text-sm font-medium mb-1"
          style={{ color: "#37353E" }}
        >
          Priority *
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
          className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 transition-all"
          style={{
            backgroundColor: "#D3DAD9",
            border: "2px solid #44444E",
            color: "#37353E",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "#715A5A";
            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(113, 90, 90, 0.1)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "#44444E";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: isSubmitting ? "#44444E" : "#715A5A",
            color: "#D3DAD9",
          }}
          onMouseEnter={(e) => {
            if (!isSubmitting) {
              e.currentTarget.style.backgroundColor = "#5a4a4a";
            }
          }}
          onMouseLeave={(e) => {
            if (!isSubmitting) {
              e.currentTarget.style.backgroundColor = "#715A5A";
            }
          }}
        >
          {isSubmitting
            ? "Saving..."
            : task
            ? "Update Task"
            : "Create Task"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-md font-medium transition-all duration-200 hover:shadow-md"
            style={{
              backgroundColor: "#D3DAD9",
              border: "2px solid #44444E",
              color: "#37353E",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#C3CAC9";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#D3DAD9";
            }}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
