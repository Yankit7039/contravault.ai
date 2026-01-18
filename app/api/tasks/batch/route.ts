// Batch Operations API
// Handles bulk operations on tasks

import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth/session";
import { batchOperation } from "@/lib/models/task-extended";
import type { ApiResponse, BatchOperation } from "@/types";

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<{ count: number }>>> {
  try {
    const userId = await getCurrentUserId();
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body: BatchOperation = await request.json();
    const { taskIds, operation, updates, projectId, workspaceId } = body;
    
    if (!taskIds || !Array.isArray(taskIds) || taskIds.length === 0) {
      return NextResponse.json(
        { success: false, error: "Task IDs are required" },
        { status: 400 }
      );
    }

    if (!operation) {
      return NextResponse.json(
        { success: false, error: "Operation is required" },
        { status: 400 }
      );
    }

    const count = await batchOperation(
      userId,
      taskIds,
      operation,
      updates,
      projectId,
      workspaceId
    );
    
    return NextResponse.json({
      success: true,
      data: { count },
    });
  } catch (error) {
    console.error("Error performing batch operation:", error);
    return NextResponse.json(
      { success: false, error: "Failed to perform batch operation" },
      { status: 500 }
    );
  }
}
