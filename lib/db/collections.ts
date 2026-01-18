// MongoDB collection names and helpers
// Centralized collection name constants

export const COLLECTIONS = {
  USERS: "users",
  TASKS: "tasks",
} as const;

/**
 * Get a collection by name
 */
import { Collection } from "mongodb";
import { getDatabase } from "./connection";
import type { User, Task } from "@/types";

export async function getUsersCollection(): Promise<Collection<User>> {
  const db = await getDatabase();
  return db.collection<User>(COLLECTIONS.USERS);
}

export async function getTasksCollection(): Promise<Collection<Task>> {
  const db = await getDatabase();
  return db.collection<Task>(COLLECTIONS.TASKS);
}
