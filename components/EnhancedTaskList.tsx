// Enhanced Task List Component
// Main component integrating all features: views, filters, search, etc.

"use client";

import { useState, useEffect, useMemo } from "react";
import type { Task, TaskInput, TaskStatus, ViewType, TaskFilter } from "@/types";
import TaskCard from "./TaskCard";
import TaskForm from "./TaskForm";
import TaskCalendar from "./TaskCalendar";
import SearchAndFilters from "./SearchAndFilters";
import ViewSwitcher from "./ViewSwitcher";
import KanbanView from "./views/KanbanView";
import MatrixView from "./views/MatrixView";
import TimelineView from "./views/TimelineView";
import PomodoroTimer from "./PomodoroTimer";
import FocusMode from "./FocusMode";
import StatsDashboard from "./StatsDashboard";

export default function EnhancedTaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType>("list");
  const [filter, setFilter] = useState<TaskFilter>({});
  const [focusTask, setFocusTask] = useState<Task | null>(null);
  const [showStats, setShowStats] = useState(false);

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

  // Filter and sort tasks
  const filteredAndSortedTasks = useMemo(() => {
    let filtered = [...tasks];

    // Apply filters
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(searchLower) ||
          t.description.toLowerCase().includes(searchLower)
      );
    }

    if (filter.priority && filter.priority.length > 0) {
      filtered = filtered.filter((t) => filter.priority!.includes(t.priority));
    }

    if (filter.status && filter.status.length > 0) {
      filtered = filtered.filter((t) => filter.status!.includes(t.status));
    }

    // Sort by priority and deadline
    const priorityOrder: Record<string, number> = {
      high: 3,
      medium: 2,
      low: 1,
    };

    return filtered.sort((a, b) => {
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      const deadlineA = new Date(a.deadline).getTime();
      const deadlineB = new Date(b.deadline).getTime();
      return deadlineA - deadlineB;
    });
  }, [tasks, filter]);

  // Create task
  const handleCreateTask = async (data: TaskInput) => {
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
      // Throw error so TaskForm can catch and display it
      throw new Error(result.error || "Failed to create task");
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

  // Update task
  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    const response = await fetch(`/api/tasks/${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });

    const result = await response.json();
    
    if (result.success) {
      await fetchTasks();
    } else {
      // Throw error so TaskForm can catch and display it
      throw new Error(result.error || "Failed to update task");
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

  // Focus mode
  const handleFocusTask = (task: Task) => {
    setFocusTask(task);
  };

  const handleFocusComplete = async (taskId: string) => {
    await handleStatusChange(taskId, "done");
    setFocusTask(null);
  };

  if (focusTask) {
    return (
      <FocusMode
        task={focusTask}
        onTaskComplete={handleFocusComplete}
        onExit={() => setFocusTask(null)}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-current border-r-transparent mb-4" style={{ color: "#715A5A" }}></div>
          <div className="text-sm font-medium" style={{ color: "#715A5A" }}>Loading tasks...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column - Controls and Calendar */}
      <div className="lg:col-span-1 space-y-6">
        {/* Search and Filters */}
        <SearchAndFilters onFilterChange={setFilter} currentFilter={filter} />

        {/* View Switcher and Controls */}
        <div className="space-y-4">
          <ViewSwitcher currentView={currentView} onViewChange={setCurrentView} />
          <div className="flex gap-3">
            <button
              onClick={() => setShowStats(!showStats)}
              className="flex-1 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200"
              style={{
                background: showStats 
                  ? "linear-gradient(135deg, #715A5A 0%, #5a4a4a 100%)"
                  : "linear-gradient(135deg, #44444E 0%, #37353E 100%)",
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
              {showStats ? "Hide Stats" : "Show Stats"}
            </button>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex-1 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200"
              style={{
                background: "linear-gradient(135deg, #715A5A 0%, #5a4a4a 100%)",
                color: "#D3DAD9",
                boxShadow: "0 4px 6px rgba(113, 90, 90, 0.2)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 6px 12px rgba(113, 90, 90, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 6px rgba(113, 90, 90, 0.2)";
              }}
            >
              {showForm ? "Cancel" : "+ New Task"}
            </button>
          </div>
        </div>

        {/* Calendar - Always visible in list/calendar view */}
        {(currentView === "calendar" || currentView === "list") && (
          <div className="animate-in fade-in duration-300">
            <TaskCalendar tasks={tasks} />
          </div>
        )}

        {/* Pomodoro Timer - Sidebar */}
        {filteredAndSortedTasks.length > 0 && filteredAndSortedTasks[0] && (
          <div className="animate-in fade-in duration-300">
            <PomodoroTimer 
              currentTask={filteredAndSortedTasks.find(t => t.status === "pending") || undefined}
              onComplete={async (minutes) => {
                // Track time spent
                console.log(`Pomodoro completed: ${minutes} minutes`);
              }}
            />
          </div>
        )}
      </div>

      {/* Right Column - Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Stats Dashboard */}
        {showStats && (
          <div className="animate-in fade-in duration-300">
            <StatsDashboard tasks={tasks} />
          </div>
        )}

        {/* Task Form */}
        {showForm && (
          <div
            className="rounded-xl p-8 shadow-xl border backdrop-blur-sm animate-in fade-in duration-300"
            style={{
              backgroundColor: "#D3DAD9",
              borderColor: "rgba(68, 68, 78, 0.2)",
            }}
          >
            <h3 className="text-2xl font-bold mb-6 tracking-tight" style={{ color: "#37353E" }}>
              Create New Task
            </h3>
            <TaskForm onSubmit={handleCreateTask} onCancel={() => setShowForm(false)} />
          </div>
        )}

        {/* View Content */}
        {filteredAndSortedTasks.length === 0 ? (
          <div className="text-center py-16 rounded-xl" style={{ backgroundColor: "#D3DAD9" }}>
            <div className="text-4xl mb-4">📋</div>
            <div className="text-lg font-semibold mb-2" style={{ color: "#37353E" }}>
              No tasks found
            </div>
            <div className="text-sm" style={{ color: "#715A5A" }}>
              Create your first task to get started!
            </div>
          </div>
        ) : (
          <>
            {currentView === "list" && (
              <div className="space-y-4">
                <div className="mb-4">
                  <h2 className="text-xl font-bold tracking-tight" style={{ color: "#37353E" }}>
                    Tasks ({filteredAndSortedTasks.length})
                  </h2>
                </div>
                <ol className="space-y-4 list-decimal list-inside">
                  {filteredAndSortedTasks.map((task, index) => (
                    <li key={task._id} className="marker:font-bold" style={{ listStyle: "none" }}>
                      <div className="flex items-start gap-4">
                        <span
                          className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-md"
                          style={{
                            background: "linear-gradient(135deg, #715A5A 0%, #5a4a4a 100%)",
                            color: "#D3DAD9",
                            boxShadow: "0 2px 4px rgba(113, 90, 90, 0.3)",
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

            {currentView === "kanban" && (
              <KanbanView
                tasks={filteredAndSortedTasks}
                onStatusChange={handleStatusChange}
                onUpdate={handleUpdateTask}
                onDelete={handleDeleteTask}
              />
            )}

            {currentView === "matrix" && (
              <MatrixView
                tasks={filteredAndSortedTasks}
                onStatusChange={handleStatusChange}
                onUpdate={handleUpdateTask}
                onDelete={handleDeleteTask}
              />
            )}

            {currentView === "timeline" && (
              <TimelineView
                tasks={filteredAndSortedTasks}
                onStatusChange={handleStatusChange}
                onUpdate={handleUpdateTask}
                onDelete={handleDeleteTask}
              />
            )}

            {currentView === "calendar" && (
              <div className="text-center py-12 rounded-xl" style={{ backgroundColor: "#D3DAD9" }}>
                <p className="text-sm font-medium" style={{ color: "#715A5A" }}>
                  Calendar view is shown in the sidebar
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
