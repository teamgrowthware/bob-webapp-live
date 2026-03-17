import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getSession } from "@/lib/session";

const prisma = new PrismaClient();

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { isCompleted } = await req.json();

    const task = await prisma.task.findUnique({
      where: { id, userId: session.userId },
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Update task and award rewards if newly completed
    const updatedTask = await prisma.task.update({
      where: { id },
      data: { isCompleted },
    });

    if (isCompleted && !task.isCompleted) {
      await prisma.user.update({
        where: { id: session.userId },
        data: {
          xp: { increment: 50 },
          coins: { increment: 10 },
        },
      });
    }

    return NextResponse.json({ success: true, task: updatedTask });
  } catch (error) {
    console.error("Task PATCH Error:", error);
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}
