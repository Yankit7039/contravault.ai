// Extended task model operations
// Handles new features: tags, projects, subtasks, dependencies, etc.

import { getTasksCollection } from "@/lib/db/collections";
import { getDatabase } from "@/lib/db/connection";
import type { Task, TaskInput, TaskPriority, TaskStatus, Project, Workspace, Template } from "@/types";
import { ObjectId } from "mongodb";
import { COLLECTIONS } from "@/lib/db/collections";

/**
 * Create a task with extended features
 */
export async function createTaskExtended(
  userId: string,
  taskData: TaskInput & {
    tags?: string[];
    projectId?: string;
    workspaceId?: string;
    parentTaskId?: string;
    estimatedTime?: number;
    context?: string;
    location?: string;
    recurrence?: Task["recurrence"];
  }
): Promise<Task> {
  const tasksCollection = await getTasksCollection();
  
  const newTask: Task = {
    userId,
    title: taskData.title,
    description: taskData.description,
    deadline: new Date(taskData.deadline),
    priority: taskData.priority,
    status: "pending",
    is_deleted: false,
    tags: taskData.tags || [],
    projectId: taskData.projectId,
    workspaceId: taskData.workspaceId,
    parentTaskId: taskData.parentTaskId,
    estimatedTime: taskData.estimatedTime,
    context: taskData.context,
    location: taskData.location,
    recurrence: taskData.recurrence,
    timeSpent: 0,
    comments: [],
    attachments: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await tasksCollection.insertOne(newTask);
  
  // If this is a subtask, add it to parent's subtasks array
  if (taskData.parentTaskId) {
    await tasksCollection.updateOne(
      { _id: new ObjectId(taskData.parentTaskId) } as any,
      { $push: { subtasks: result.insertedId.toString() } }
    );
  }

  return {
    ...newTask,
    _id: result.insertedId.toString(),
  };
}

/**
 * Get tasks with filters
 */
export async function getFilteredTasks(
  userId: string,
  filters: {
    tags?: string[];
    priority?: TaskPriority[];
    status?: TaskStatus[];
    projectId?: string;
    workspaceId?: string;
    context?: string;
    search?: string;
    dateRange?: { start: Date; end: Date };
  }
): Promise<Task[]> {
  const tasksCollection = await getTasksCollection();
  
  const query: any = {
    userId,
    $or: [{ is_deleted: { $ne: true } }, { is_deleted: { $exists: false } }],
  };

  if (filters.tags && filters.tags.length > 0) {
    query.tags = { $in: filters.tags };
  }

  if (filters.priority && filters.priority.length > 0) {
    query.priority = { $in: filters.priority };
  }

  if (filters.status && filters.status.length > 0) {
    query.status = { $in: filters.status };
  }

  if (filters.projectId) {
    query.projectId = filters.projectId;
  }

  if (filters.workspaceId) {
    query.workspaceId = filters.workspaceId;
  }

  if (filters.context) {
    query.context = filters.context;
  }

  if (filters.dateRange) {
    query.deadline = {
      $gte: filters.dateRange.start,
      $lte: filters.dateRange.end,
    };
  }

  if (filters.search) {
    query.$or = [
      ...(query.$or || []),
      { title: { $regex: filters.search, $options: "i" } },
      { description: { $regex: filters.search, $options: "i" } },
    ];
  }

  const tasks = await tasksCollection.find(query).toArray();

  return tasks.map((task) => ({
    ...task,
    _id: task._id?.toString(),
  }));
}

/**
 * Get subtasks for a task
 */
export async function getSubtasks(taskId: string, userId: string): Promise<Task[]> {
  const tasksCollection = await getTasksCollection();
  
  const task = await tasksCollection.findOne({
    _id: new ObjectId(taskId) as any,
    userId,
  });

  if (!task || !task.subtasks || task.subtasks.length === 0) {
    return [];
  }

  const subtaskIds = task.subtasks.map((id: string) => new ObjectId(id));
  const subtasks = await tasksCollection
    .find({
      _id: { $in: subtaskIds },
      userId,
      $or: [{ is_deleted: { $ne: true } }, { is_deleted: { $exists: false } }],
    } as any)
    .toArray();

  return subtasks.map((t) => ({
    ...t,
    _id: t._id?.toString(),
  }));
}

/**
 * Archive a task (soft delete for completed tasks)
 */
export async function archiveTask(taskId: string, userId: string): Promise<boolean> {
  const tasksCollection = await getTasksCollection();
  
  const result = await tasksCollection.findOneAndUpdate(
    { _id: new ObjectId(taskId), userId } as any,
    {
      $set: {
        status: "archived",
        archivedAt: new Date(),
        updatedAt: new Date(),
      },
    },
    { returnDocument: "after" }
  );

  return result !== null;
}

/**
 * Snooze a task
 */
export async function snoozeTask(
  taskId: string,
  userId: string,
  until: Date
): Promise<boolean> {
  const tasksCollection = await getTasksCollection();
  
  const result = await tasksCollection.findOneAndUpdate(
    { _id: new ObjectId(taskId), userId } as any,
    {
      $set: {
        snoozedUntil: until,
        updatedAt: new Date(),
      },
    },
    { returnDocument: "after" }
  );

  return result !== null;
}

/**
 * Batch operations
 */
export async function batchOperation(
  userId: string,
  taskIds: string[],
  operation: "delete" | "archive" | "update" | "move",
  updates?: Partial<Task>,
  projectId?: string,
  workspaceId?: string
): Promise<number> {
  const tasksCollection = await getTasksCollection();
  
  const objectIds = taskIds.map((id) => new ObjectId(id));
  const filter = {
    _id: { $in: objectIds },
    userId,
  } as any;

  let result;
  
  switch (operation) {
    case "delete":
      result = await tasksCollection.updateMany(filter, {
        $set: { is_deleted: true, updatedAt: new Date() },
      });
      break;
    case "archive":
      result = await tasksCollection.updateMany(filter, {
        $set: { status: "archived", archivedAt: new Date(), updatedAt: new Date() },
      });
      break;
    case "update":
      if (updates) {
        result = await tasksCollection.updateMany(filter, {
          $set: { ...updates, updatedAt: new Date() },
        });
      } else {
        return 0;
      }
      break;
    case "move":
      const moveUpdates: any = { updatedAt: new Date() };
      if (projectId) moveUpdates.projectId = projectId;
      if (workspaceId) moveUpdates.workspaceId = workspaceId;
      result = await tasksCollection.updateMany(filter, { $set: moveUpdates });
      break;
    default:
      return 0;
  }

  return result.modifiedCount;
}
