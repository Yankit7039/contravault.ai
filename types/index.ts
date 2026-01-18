// Central type definitions for the application
// Keep types organized by domain/feature

/**
 * Task priority levels
 */
export type TaskPriority = "low" | "medium" | "high";

/**
 * Task status options
 */
export type TaskStatus = "pending" | "done" | "not_needed" | "archived";

/**
 * Task recurrence patterns
 */
export type RecurrencePattern = "none" | "daily" | "weekly" | "monthly" | "yearly" | "custom";

/**
 * View types for task display
 */
export type ViewType = "list" | "kanban" | "calendar" | "timeline" | "matrix";

/**
 * Task model interface
 */
export interface Task {
  _id?: string;
  userId: string;
  title: string;
  description: string;
  deadline: Date | string;
  priority: TaskPriority;
  status: TaskStatus;
  is_deleted?: boolean;
  
  // New fields
  tags?: string[];
  projectId?: string;
  workspaceId?: string;
  parentTaskId?: string; // For subtasks
  subtasks?: string[]; // Array of subtask IDs
  dependencies?: string[]; // Array of task IDs this task depends on
  estimatedTime?: number; // Minutes
  timeSpent?: number; // Minutes
  context?: string; // e.g., "Work", "Home", "Calls"
  location?: string; // For location-based reminders
  recurrence?: {
    pattern: RecurrencePattern;
    interval?: number; // For custom patterns
    endDate?: Date | string;
    count?: number; // Number of occurrences
  };
  templateId?: string; // If created from template
  comments?: Comment[];
  attachments?: Attachment[];
  snoozedUntil?: Date | string;
  archivedAt?: Date | string;
  aiSuggestedPriority?: TaskPriority;
  
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

/**
 * Comment interface
 */
export interface Comment {
  _id?: string;
  userId: string;
  content: string;
  createdAt: Date | string;
}

/**
 * Attachment interface
 */
export interface Attachment {
  _id?: string;
  filename: string;
  url: string;
  size: number;
  mimeType: string;
  uploadedAt: Date | string;
}

/**
 * Project interface
 */
export interface Project {
  _id?: string;
  userId: string;
  name: string;
  description?: string;
  color?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

/**
 * Workspace interface
 */
export interface Workspace {
  _id?: string;
  name: string;
  description?: string;
  members: string[]; // User IDs
  ownerId: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

/**
 * Template interface
 */
export interface Template {
  _id?: string;
  userId: string;
  name: string;
  description?: string;
  tasks: Partial<Task>[]; // Task templates
  createdAt?: Date | string;
}

/**
 * Achievement interface
 */
export interface Achievement {
  _id?: string;
  userId: string;
  type: string; // e.g., "streak", "milestone", "completion"
  value: number;
  unlockedAt: Date | string;
}

/**
 * User stats interface
 */
export interface UserStats {
  userId: string;
  currentStreak: number;
  longestStreak: number;
  totalTasksCompleted: number;
  totalTasksCreated: number;
  achievements: Achievement[];
  lastActivityDate?: Date | string;
}

/**
 * User model interface
 */
export interface User {
  _id?: string;
  email: string;
  name: string;
  image?: string;
  theme?: "light" | "dark" | "auto";
  stats?: UserStats;
  createdAt?: Date | string;
}

/**
 * Task creation/update payload
 */
export interface TaskInput {
  title: string;
  description: string;
  deadline: string; // ISO string
  priority: TaskPriority;
  tags?: string[];
  projectId?: string;
  workspaceId?: string;
  parentTaskId?: string;
  estimatedTime?: number;
  context?: string;
  location?: string;
  recurrence?: {
    pattern: RecurrencePattern;
    interval?: number;
    endDate?: string;
    count?: number;
  };
}

/**
 * Natural language input payload
 */
export interface NaturalLanguageInput {
  text: string;
}

/**
 * Batch operation payload
 */
export interface BatchOperation {
  taskIds: string[];
  operation: "delete" | "archive" | "update" | "move";
  updates?: Partial<Task>;
  projectId?: string;
  workspaceId?: string;
}

/**
 * Filter options
 */
export interface TaskFilter {
  tags?: string[];
  priority?: TaskPriority[];
  status?: TaskStatus[];
  projectId?: string;
  workspaceId?: string;
  context?: string;
  dateRange?: {
    start: Date | string;
    end: Date | string;
  };
  search?: string;
}

/**
 * API response wrapper
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
