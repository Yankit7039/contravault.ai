// Gamification features
// Streaks, achievements, and stats

import { getDatabase } from "@/lib/db/connection";
import { COLLECTIONS } from "@/lib/db/collections";
import type { UserStats, Achievement, Task } from "@/types";
import { ObjectId } from "mongodb";

/**
 * Get or create user stats
 */
export async function getUserStats(userId: string): Promise<UserStats> {
  const db = await getDatabase();
  const statsCollection = db.collection(COLLECTIONS.USERS);
  
  const stats = await statsCollection.findOne({ userId } as any) as any;
  
  if (!stats) {
    const newStats = {
      userId,
      currentStreak: 0,
      longestStreak: 0,
      totalTasksCompleted: 0,
      totalTasksCreated: 0,
      achievements: [],
    };
    const result = await statsCollection.insertOne(newStats);
    return {
      ...newStats,
      _id: result.insertedId.toString(),
    } as UserStats;
  }
  
  // Convert MongoDB _id to string
  return {
    ...stats,
    _id: stats._id?.toString() || undefined,
  } as UserStats;
}

/**
 * Update stats when task is completed
 */
export async function updateStatsOnTaskComplete(
  userId: string,
  task: Task
): Promise<UserStats> {
  const stats = await getUserStats(userId);
  const db = await getDatabase();
  const statsCollection = db.collection(COLLECTIONS.USERS);
  const tasksCollection = db.collection(COLLECTIONS.TASKS);
  
  // Get all completed tasks for today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const tasksCompletedToday = await tasksCollection.countDocuments({
    userId,
    status: "done",
    updatedAt: {
      $gte: today,
      $lt: tomorrow,
    },
  } as any);
  
  // Update streak
  const lastActivity = stats.lastActivityDate
    ? new Date(stats.lastActivityDate)
    : null;
  const lastActivityDate = lastActivity
    ? new Date(lastActivity.getFullYear(), lastActivity.getMonth(), lastActivity.getDate())
    : null;
  const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  
  let newStreak = stats.currentStreak;
  if (lastActivityDate) {
    const daysDiff = Math.floor(
      (todayDate.getTime() - lastActivityDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysDiff === 1) {
      // Consecutive day
      newStreak = stats.currentStreak + 1;
    } else if (daysDiff > 1) {
      // Streak broken
      newStreak = 1;
    }
    // If daysDiff === 0, same day, keep streak
  } else {
    // First activity
    newStreak = 1;
  }
  
  const updatedStats: UserStats = {
    ...stats,
    currentStreak: newStreak,
    longestStreak: Math.max(stats.longestStreak, newStreak),
    totalTasksCompleted: stats.totalTasksCompleted + 1,
    lastActivityDate: today,
  };
  
  // Check for achievements
  const newAchievements: Achievement[] = [];
  
  if (newStreak === 7 && !stats.achievements.some((a) => a.type === "streak" && a.value === 7)) {
    newAchievements.push({
      userId,
      type: "streak",
      value: 7,
      unlockedAt: new Date(),
    });
  }
  
  if (newStreak === 30 && !stats.achievements.some((a) => a.type === "streak" && a.value === 30)) {
    newAchievements.push({
      userId,
      type: "streak",
      value: 30,
      unlockedAt: new Date(),
    });
  }
  
  if (updatedStats.totalTasksCompleted === 100 && !stats.achievements.some((a) => a.type === "milestone" && a.value === 100)) {
    newAchievements.push({
      userId,
      type: "milestone",
      value: 100,
      unlockedAt: new Date(),
    });
  }
  
  updatedStats.achievements = [...stats.achievements, ...newAchievements];
  
  await statsCollection.updateOne(
    { userId } as any,
    { $set: updatedStats as any }
  );
  
  return updatedStats;
}

/**
 * Update stats when task is created
 */
export async function updateStatsOnTaskCreate(userId: string): Promise<void> {
  const stats = await getUserStats(userId);
  const db = await getDatabase();
  const statsCollection = db.collection(COLLECTIONS.USERS);
  
  await statsCollection.updateOne(
    { userId } as any,
    {
      $set: {
        totalTasksCreated: stats.totalTasksCreated + 1,
      },
    }
  );
}
