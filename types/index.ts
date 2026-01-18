// Central type definitions for the application
// Keep types organized by domain/feature

/**
 * Task priority levels
 */
export type TaskPriority = "low" | "medium" | "high";

/**
 * Task status options
 */
export type TaskStatus = "pending" | "done" | "not_needed";

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
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

/**
 * User model interface
 */
export interface User {
  _id?: string;
  email: string;
  name: string;
  image?: string;
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
}

/**
 * API response wrapper
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
