// Timeline View Component
// Chronological view of tasks by deadline

"use client";

import { useMemo } from "react";
import type { Task, TaskStatus } from "@/types";
import TaskCard from "../TaskCard";
import { format, isToday, isTomorrow, isPast } from "date-fns";

interface TimelineViewProps {
  tasks: Task[];
  onStatusChange: (taskId: string, status: TaskStatus) => Promise<void>;
  onUpdate: (taskId: string, updates: Partial<Task>) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
}

export default function TimelineView({
  tasks,
  onStatusChange,
  onUpdate,
  onDelete,
}: TimelineViewProps) {
  const groupedTasks = useMemo(() => {
    const groups: Record<string, Task[]> = {
      overdue: [],
      today: [],
      tomorrow: [],
      thisWeek: [],
      later: [],
    };

    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);

    tasks.forEach((task) => {
      if (task.status !== "pending") return;
      
      const deadline = new Date(task.deadline);
      
      if (isPast(deadline) && !isToday(deadline)) {
        groups.overdue.push(task);
      } else if (isToday(deadline)) {
        groups.today.push(task);
      } else if (isTomorrow(deadline)) {
        groups.tomorrow.push(task);
      } else if (deadline <= nextWeek) {
        groups.thisWeek.push(task);
      } else {
        groups.later.push(task);
      }
    });

    return groups;
  }, [tasks]);

  const sections = [
    { key: "overdue", label: "Overdue", color: "#715A5A" },
    { key: "today", label: "Today", color: "#44444E" },
    { key: "tomorrow", label: "Tomorrow", color: "#44444E" },
    { key: "thisWeek", label: "This Week", color: "#44444E" },
    { key: "later", label: "Later", color: "#44444E" },
  ];

  return (
    <div className="space-y-6">
      {sections.map((section) => {
        const sectionTasks = groupedTasks[section.key as keyof typeof groupedTasks];
        if (sectionTasks.length === 0) return null;

        return (
          <div key={section.key}>
            <h3
              className="text-xl font-bold mb-4 p-3 rounded-lg"
              style={{
                backgroundColor: section.color,
                color: "#D3DAD9",
              }}
            >
              {section.label} ({sectionTasks.length})
            </h3>
            <div className="space-y-3">
              {sectionTasks.map((task) => (
                <div key={task._id} className="flex items-start gap-4">
                  <div
                    className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                    style={{ backgroundColor: section.color }}
                  />
                  <div className="flex-1">
                    <TaskCard
                      task={task}
                      onUpdate={onUpdate}
                      onStatusChange={onStatusChange}
                      onDelete={onDelete}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
