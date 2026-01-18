// Kanban View Component
// Board view with columns for different statuses

"use client";

import type { Task, TaskStatus } from "@/types";
import TaskCard from "../TaskCard";

interface KanbanViewProps {
  tasks: Task[];
  onStatusChange: (taskId: string, status: TaskStatus) => Promise<void>;
  onUpdate: (taskId: string, updates: Partial<Task>) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
}

const columns: { status: TaskStatus; label: string }[] = [
  { status: "pending", label: "To Do" },
  { status: "done", label: "Done" },
  { status: "not_needed", label: "Not Needed" },
];

export default function KanbanView({
  tasks,
  onStatusChange,
  onUpdate,
  onDelete,
}: KanbanViewProps) {
  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter((task) => task.status === status);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 overflow-x-auto">
      {columns.map((column) => {
        const columnTasks = getTasksByStatus(column.status);
        return (
          <div
            key={column.status}
            className="flex flex-col min-w-[300px]"
          >
            <div
              className="p-4 rounded-t-lg font-semibold"
              style={{
                backgroundColor: "#44444E",
                color: "#D3DAD9",
              }}
            >
              <h3 className="text-lg">{column.label}</h3>
              <span className="text-sm opacity-70">
                {columnTasks.length} tasks
              </span>
            </div>
            <div
              className="flex-1 p-4 rounded-b-lg space-y-3 min-h-[400px]"
              style={{ backgroundColor: "#D3DAD9" }}
            >
              {columnTasks.map((task) => (
                <div key={task._id} className="mb-3">
                  <TaskCard
                    task={task}
                    onUpdate={onUpdate}
                    onStatusChange={onStatusChange}
                    onDelete={onDelete}
                  />
                </div>
              ))}
              {columnTasks.length === 0 && (
                <div className="text-center py-8 text-sm" style={{ color: "#715A5A" }}>
                  No tasks
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
