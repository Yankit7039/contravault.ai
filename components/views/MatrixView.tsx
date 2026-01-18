// Matrix View Component (Eisenhower Matrix)
// 2x2 grid: Urgent/Important, Urgent/Not Important, Not Urgent/Important, Not Urgent/Not Important

"use client";

import type { Task, TaskStatus } from "@/types";
import TaskCard from "../TaskCard";

interface MatrixViewProps {
  tasks: Task[];
  onStatusChange: (taskId: string, status: TaskStatus) => Promise<void>;
  onUpdate: (taskId: string, updates: Partial<Task>) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
}

interface Quadrant {
  label: string;
  description: string;
  color: string;
  getTasks: (tasks: Task[]) => Task[];
}

export default function MatrixView({
  tasks,
  onStatusChange,
  onUpdate,
  onDelete,
}: MatrixViewProps) {
  const now = new Date();
  const urgentThreshold = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours

  const quadrants: Quadrant[] = [
    {
      label: "Urgent & Important",
      description: "Do First",
      color: "#715A5A",
      getTasks: (tasks) =>
        tasks.filter(
          (t) =>
            t.priority === "high" &&
            new Date(t.deadline) <= urgentThreshold &&
            t.status === "pending"
        ),
    },
    {
      label: "Not Urgent & Important",
      description: "Schedule",
      color: "#44444E",
      getTasks: (tasks) =>
        tasks.filter(
          (t) =>
            t.priority === "high" &&
            new Date(t.deadline) > urgentThreshold &&
            t.status === "pending"
        ),
    },
    {
      label: "Urgent & Not Important",
      description: "Delegate",
      color: "#D3DAD9",
      getTasks: (tasks) =>
        tasks.filter(
          (t) =>
            (t.priority === "medium" || t.priority === "low") &&
            new Date(t.deadline) <= urgentThreshold &&
            t.status === "pending"
        ),
    },
    {
      label: "Not Urgent & Not Important",
      description: "Eliminate",
      color: "#37353E",
      getTasks: (tasks) =>
        tasks.filter(
          (t) =>
            (t.priority === "medium" || t.priority === "low") &&
            new Date(t.deadline) > urgentThreshold &&
            t.status === "pending"
        ),
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {quadrants.map((quadrant, index) => {
        const quadrantTasks = quadrant.getTasks(tasks);
        return (
          <div
            key={index}
            className="rounded-lg shadow-lg overflow-hidden"
            style={{ backgroundColor: "#D3DAD9" }}
          >
            <div
              className="p-4"
              style={{
                backgroundColor: quadrant.color,
                color: "#D3DAD9",
              }}
            >
              <h3 className="font-bold text-lg">{quadrant.label}</h3>
              <p className="text-sm opacity-90">{quadrant.description}</p>
              <span className="text-xs opacity-70">
                {quadrantTasks.length} tasks
              </span>
            </div>
            <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto">
              {quadrantTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onUpdate={onUpdate}
                  onStatusChange={onStatusChange}
                  onDelete={onDelete}
                />
              ))}
              {quadrantTasks.length === 0 && (
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
