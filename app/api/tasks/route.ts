// Tasks API route
// Handles GET (list tasks) and POST (create task) requests

import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth/session";
import { createTask, getUserTasks } from "@/lib/models/task";
import type { ApiResponse, Task, TaskInput } from "@/types";

/**
 * GET /api/tasks
 * Get all tasks for the current user
 */
export async function GET(): Promise<NextResponse<ApiResponse<Task[]>>> {
  try {
    const userId = await getCurrentUserId();
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const tasks = await getUserTasks(userId);
    
    return NextResponse.json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/tasks
 * Create a new task
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<Task>>> {
  try {
    const userId = await getCurrentUserId();
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body: TaskInput = await request.json();
    
    // Validate required fields
    if (!body.title || !body.description || !body.deadline || !body.priority) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const task = await createTask(userId, body);
    
    return NextResponse.json(
      { success: true, data: task },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating task:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to create task";
    
    // Check if it's a duplicate deadline error
    if (errorMessage.includes("already exists at this date and time")) {
      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 409 } // Conflict status code
      );
    }
    
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
