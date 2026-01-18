// Task model operations
// Database operations for tasks (CRUD)

import { getTasksCollection } from "@/lib/db/collections";
import type { Task, TaskInput, TaskPriority, TaskStatus } from "@/types";
import { ObjectId, type Filter } from "mongodb";

/**
 * Check if a task with the same deadline already exists for the user
 */
export async function taskExistsAtDeadline(
  userId: string,
  deadline: Date,
  excludeTaskId?: string
): Promise<boolean> {
  const tasksCollection = await getTasksCollection();
  
  // Normalize dates to compare only date and time (ignore milliseconds)
  const normalizedDeadline = new Date(deadline);
  normalizedDeadline.setMilliseconds(0);
  
  const startOfMinute = new Date(normalizedDeadline);
  startOfMinute.setSeconds(0);
  const endOfMinute = new Date(startOfMinute);
  endOfMinute.setSeconds(59);
  endOfMinute.setMilliseconds(999);
  
  const query: any = {
    userId,
    deadline: {
      $gte: startOfMinute,
      $lte: endOfMinute,
    },
    $or: [{ is_deleted: { $ne: true } }, { is_deleted: { $exists: false } }],
  };
  
  // Exclude current task if updating
  if (excludeTaskId) {
    query._id = { $ne: new ObjectId(excludeTaskId) };
  }
  
  const existingTask = await tasksCollection.findOne(query);
  return existingTask !== null;
}

/**
 * Create a new task
 */
export async function createTask(
  userId: string,
  taskData: TaskInput
): Promise<Task> {
  const tasksCollection = await getTasksCollection();
  
  const deadline = new Date(taskData.deadline);
  
  // Check if a task with the same deadline already exists
  const exists = await taskExistsAtDeadline(userId, deadline);
  if (exists) {
    throw new Error("A task already exists at this date and time. Please choose a different time.");
  }
  
  const newTask: Task = {
    userId,
    title: taskData.title,
    description: taskData.description,
    deadline,
    priority: taskData.priority,
    status: "pending",
    is_deleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await tasksCollection.insertOne(newTask);
  return {
    ...newTask,
    _id: result.insertedId.toString(),
  };
}

/**
 * Get all tasks for a user, sorted by priority and deadline
 * Excludes soft-deleted tasks (is_deleted !== true)
 */
export async function getUserTasks(userId: string): Promise<Task[]> {
  const tasksCollection = await getTasksCollection();
  
  // Fetch all non-deleted tasks for the user
  const tasks = await tasksCollection
    .find({ 
      userId,
      $or: [{ is_deleted: { $ne: true } }, { is_deleted: { $exists: false } }]
    })
    .toArray();

  // Convert priority to numeric for sorting
  const priorityOrder: Record<TaskPriority, number> = {
    high: 2,
    medium: 1,
    low: 0,
  };

  // Sort by priority (high to low), then by deadline (earliest first)
  return tasks
    .map((task) => ({
      ...task,
      _id: task._id?.toString(),
    }))
    .sort((a, b) => {
      // First sort by priority (high priority first)
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      // Then sort by deadline (earliest deadline first)
      const deadlineA = new Date(a.deadline).getTime();
      const deadlineB = new Date(b.deadline).getTime();
      return deadlineA - deadlineB;
    });
}

/**
 * Get a single task by ID
 * Excludes soft-deleted tasks
 */
export async function getTaskById(
  taskId: string,
  userId: string
): Promise<Task | null> {
  const tasksCollection = await getTasksCollection();
  
  const task = await tasksCollection.findOne({
    _id: new ObjectId(taskId) as any,
    userId,
    $or: [{ is_deleted: { $ne: true } }, { is_deleted: { $exists: false } }]
  } as Filter<Task>);

  if (!task) return null;

  return {
    ...task,
    _id: task._id?.toString(),
  };
}

/**
 * Update a task
 */
export async function updateTask(
  taskId: string,
  userId: string,
  updates: Partial<TaskInput>
): Promise<Task | null> {
  const tasksCollection = await getTasksCollection();
  
  // Check for duplicate deadline if deadline is being updated
  if (updates.deadline) {
    const deadline = new Date(updates.deadline);
    const exists = await taskExistsAtDeadline(userId, deadline, taskId);
    if (exists) {
      throw new Error("A task already exists at this date and time. Please choose a different time.");
    }
  }
  
  const updateData: Partial<Task> = {
    updatedAt: new Date(),
  };

  if (updates.title) updateData.title = updates.title;
  if (updates.description) updateData.description = updates.description;
  if (updates.deadline) updateData.deadline = new Date(updates.deadline);
  if (updates.priority) updateData.priority = updates.priority;

  const result = await tasksCollection.findOneAndUpdate(
    { _id: new ObjectId(taskId), userId } as any,
    { $set: updateData },
    { returnDocument: "after" }
  );

  if (!result) return null;

  return {
    ...result,
    _id: result._id?.toString(),
  };
}

/**
 * Update task status
 */
export async function updateTaskStatus(
  taskId: string,
  userId: string,
  status: TaskStatus
): Promise<Task | null> {
  const tasksCollection = await getTasksCollection();
  
  const result = await tasksCollection.findOneAndUpdate(
    { _id: new ObjectId(taskId), userId } as any,
    { 
      $set: { 
        status,
        updatedAt: new Date(),
      } 
    },
    { returnDocument: "after" }
  );

  if (!result) return null;

  return {
    ...result,
    _id: result._id?.toString(),
  };
}

/**
 * Soft delete a task
 * Marks the task as deleted (is_deleted: true) instead of removing it from the database
 */
export async function deleteTask(
  taskId: string,
  userId: string
): Promise<boolean> {
  const tasksCollection = await getTasksCollection();
  
  const result = await tasksCollection.findOneAndUpdate(
    { 
      _id: new ObjectId(taskId),
      userId,
    } as any,
    { 
      $set: { 
        is_deleted: true,
        updatedAt: new Date(),
      } 
    },
    { returnDocument: "after" }
  );

  return result !== null;
}
