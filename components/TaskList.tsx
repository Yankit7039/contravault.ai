// Task List Component
// Displays all tasks in an ordered list, sorted by priority and deadline

"use client";

import { useState, useEffect, useMemo } from "react";
import type { Task, TaskInput, TaskStatus } from "@/types";
import TaskCard from "./TaskCard";
import TaskForm from "./TaskForm";
import TaskCalendar from "./TaskCalendar";

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/tasks");
      const result = await response.json();
      
      if (result.success) {
        setTasks(result.data || []);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Sort tasks by priority and deadline
  const sortedTasks = useMemo(() => {
    const priorityOrder: Record<string, number> = {
      high: 3,
      medium: 2,
      low: 1,
    };

    return [...tasks].sort((a, b) => {
      // First sort by priority (high priority first)
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      // Then sort by deadline (earliest deadline first)
      const deadlineA = new Date(a.deadline).getTime();
      const deadlineB = new Date(b.deadline).getTime();
      return deadlineA - deadlineB;
    });
  }, [tasks]);

  // Create task
  const handleCreateTask = async (data: TaskInput) => {
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (result.success) {
        await fetchTasks();
        setShowForm(false);
      } else {
        alert(result.error || "Failed to create task");
      }
    } catch (error) {
      console.error("Error creating task:", error);
      alert("Failed to create task");
    }
  };

  // Update task
  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      const result = await response.json();
      
      if (result.success) {
        await fetchTasks();
        setEditingTask(null);
      } else {
        alert(result.error || "Failed to update task");
      }
    } catch (error) {
      console.error("Error updating task:", error);
      alert("Failed to update task");
    }
  };

  // Update task status
  const handleStatusChange = async (taskId: string, status: TaskStatus) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const result = await response.json();
      
      if (result.success) {
        await fetchTasks();
      } else {
        alert(result.error || "Failed to update task status");
      }
    } catch (error) {
      console.error("Error updating task status:", error);
      alert("Failed to update task status");
    }
  };

  // Delete task
  const handleDeleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      const result = await response.json();
      
      if (result.success) {
        await fetchTasks();
      } else {
        alert(result.error || "Failed to delete task");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Failed to delete task");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div style={{ color: "#715A5A" }}>Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Calendar Section */}
      {tasks.length > 0 && (
        <TaskCalendar tasks={tasks} />
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold" style={{ color: "#37353E" }}>
          My Tasks
        </h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingTask(null);
          }}
          className="px-4 py-2 rounded-md font-medium transition-all duration-200 hover:shadow-lg"
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
          {showForm ? "Cancel" : "+ New Task"}
        </button>
      </div>

      {showForm && (
        <div
          className="p-6 rounded-lg shadow-lg"
          style={{ backgroundColor: "#D3DAD9" }}
        >
          <h3 className="text-xl font-semibold mb-4" style={{ color: "#37353E" }}>
            Create New Task
          </h3>
          <TaskForm onSubmit={handleCreateTask} onCancel={() => setShowForm(false)} />
        </div>
      )}

      {sortedTasks.length === 0 ? (
        <div className="text-center py-12" style={{ color: "#715A5A" }}>
          No tasks yet. Create your first task!
        </div>
      ) : (
        <div className="space-y-4">
          <ol className="space-y-4 list-decimal list-inside">
            {sortedTasks.map((task, index) => (
              <li key={task._id} className="marker:font-bold marker:text-lg" style={{ listStyle: "none" }}>
                <div className="flex items-start gap-3">
                  <span
                    className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mt-1"
                    style={{
                      backgroundColor: "#715A5A",
                      color: "#D3DAD9",
                    }}
                  >
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <TaskCard
                      task={task}
                      onUpdate={handleUpdateTask}
                      onStatusChange={handleStatusChange}
                      onDelete={handleDeleteTask}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
